"use client";

import { useState, useCallback, useRef } from "react";

function useAutoFocusAndSelect(inputRef: React.RefObject<HTMLInputElement | null>, active: boolean) {
  const input = inputRef.current;
  if (active && input) {
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }
}

interface UseTreeItemRenameOptions {
  nodeId: string;
  nodeName: string;
  isCreating: boolean;
  validateCreateName: (nodeId: string, name: string) => string | null;
  commitRename: (nodeId: string, newName: string) => Promise<void> | void;
  cancelCreate: (nodeId: string) => void;
}

interface UseTreeItemRenameReturn {
  renaming: boolean;
  renameValue: string;
  errorMsg: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  startRename: () => void;
  commit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRenaming: (v: boolean) => void;
  setRenameValue: (v: string) => void;
}

export function useTreeItemRename(options: UseTreeItemRenameOptions): UseTreeItemRenameReturn {
  const { nodeId, nodeName, isCreating, validateCreateName, commitRename, cancelCreate } = options;

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(nodeName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocusAndSelect(inputRef, renaming || isCreating);

  const commit = useCallback(() => {
    const trimmed = renameValue.trim();
    if (!trimmed) { setErrorMsg("名称不能为空"); return; }
    const error = validateCreateName(nodeId, renameValue);
    if (error) { setErrorMsg(error); return; }
    commitRename(nodeId, trimmed);
    if (!isCreating) {
      setRenaming(false);
    }
    setErrorMsg(null);
  }, [renameValue, nodeId, isCreating, validateCreateName, commitRename]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") {
      if (isCreating) cancelCreate(nodeId);
      else { setRenaming(false); setRenameValue(nodeName); setErrorMsg(null); }
    }
  }, [commit, isCreating, cancelCreate, nodeId, nodeName]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value);
    if (errorMsg) setErrorMsg(null);
  }, [errorMsg]);

  const startRename = useCallback(() => {
    setRenaming(true);
    setRenameValue(nodeName);
    setErrorMsg(null);
  }, [nodeName]);

  return {
    renaming,
    renameValue,
    errorMsg,
    inputRef,
    startRename,
    commit,
    handleKeyDown,
    handleChange,
    setRenaming,
    setRenameValue,
  };
}
