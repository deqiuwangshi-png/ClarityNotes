"use client";

import { useState, useRef, useCallback, memo } from "react";
import type { TreeNode } from "@/types/fileTree";
import { useFileTreeStore } from "@/store/fileTreeStore";
import { useUiStore } from "@/store/uiStore";
import { TreeItemMenu } from "@/components/workspace/sidebar/TreeItemMenu";

interface TreeItemProps {
  node: TreeNode;
  selectedId: string | null;
  maxLevel: number;
}

function FolderIcon({ selected }: { selected: boolean }) {
  const fill = selected ? "#007A66" : "#6B7280";
  const innerFill = selected ? "#E4F5EF" : "#F6FAF8";
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M2.75 5.75c0-.83.67-1.5 1.5-1.5h3.1c.43 0 .84.18 1.12.5l.92 1h6.36c.83 0 1.5.67 1.5 1.5v1.1H2.75v-2.6Z" fill={fill} opacity="0.18" />
      <path d="M2.75 7.25h14.5v6.5c0 .83-.67 1.5-1.5 1.5H4.25c-.83 0-1.5-.67-1.5-1.5v-6.5Z" fill={innerFill} />
      <path d="M2.75 7.25v-1.5c0-.83.67-1.5 1.5-1.5h3.1c.43 0 .84.18 1.12.5l.92 1h6.36c.83 0 1.5.67 1.5 1.5v6.5c0 .83-.67 1.5-1.5 1.5H4.25c-.83 0-1.5-.67-1.5-1.5v-6.5Z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function FileIcon({ selected }: { selected: boolean }) {
  const fill = selected ? "#007A66" : "#6B7280";
  const innerFill = selected ? "#E4F5EF" : "#FFFFFF";
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M5 2.75h6.5L15 6.25v11H5v-14Z" fill={innerFill} />
      <path d="M11.5 2.75v3.5H15M5 2.75h6.5L15 6.25v11H5v-14Z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      <path d="M7.5 9.25h5M7.5 12h5" stroke={fill} strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  );
}

function useAutoFocusAndSelect(inputRef: React.RefObject<HTMLInputElement | null>, active: boolean) {
  const input = inputRef.current;
  if (active && input) {
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }
}

const TreeItem = memo(function TreeItem({
  node,
  selectedId,
  maxLevel,
}: TreeItemProps) {
  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;
  const paddingLeft = node.level * 16 + 8;
  const isRoot = node.level === 1;
  const showPlus = isFolder && node.level < maxLevel;
  const canCreateFolder = isFolder && node.level < maxLevel - 1;

  const creatingNodeId = useFileTreeStore((s) => s.creatingNodeId);
  const expandedIds = useFileTreeStore((s) => s.expandedIds);
  const isExpanded = expandedIds.has(node.id);
  const selectNode = useFileTreeStore((s) => s.selectNode);
  const toggleExpand = useFileTreeStore((s) => s.toggleExpand);
  const createFile = useFileTreeStore((s) => s.createFile);
  const createFolder = useFileTreeStore((s) => s.createFolder);
  const commitRename = useFileTreeStore((s) => s.commitRename);
  const deleteNode = useFileTreeStore((s) => s.deleteNode);
  const cancelCreate = useFileTreeStore((s) => s.cancelCreate);
  const validateCreateName = useFileTreeStore((s) => s.validateCreateName);
  const openConfirm = useUiStore((s) => s.openConfirm);

  const isCreating = creatingNodeId === node.id;

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocusAndSelect(inputRef, renaming || isCreating);

  const commit = useCallback(() => {
    const trimmed = renameValue.trim();
    if (!trimmed) { setErrorMsg("名称不能为空"); return; }
    if (isCreating) {
      const error = validateCreateName(node.id, renameValue);
      if (error) { setErrorMsg(error); return; }
      commitRename(node.id, trimmed);
    } else {
      const error = validateCreateName(node.id, renameValue);
      if (error) { setErrorMsg(error); return; }
      commitRename(node.id, trimmed);
      setRenaming(false);
    }
    setErrorMsg(null);
  }, [renameValue, node.id, isCreating, validateCreateName, commitRename]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") {
      if (isCreating) cancelCreate(node.id);
      else { setRenaming(false); setRenameValue(node.name); setErrorMsg(null); }
    }
  }, [commit, isCreating, cancelCreate, node.id, node.name]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value);
    if (errorMsg) setErrorMsg(null);
  }, [errorMsg]);

  const inputBorder = errorMsg ? "border-red-400" : "border-mint-accent";

  const handleDelete = useCallback(async () => {
    const confirmed = await openConfirm({
      title: "删除确认",
      message: `确定要删除"${node.name}"吗？删除后将移入回收站。`,
      confirmLabel: "删除",
      variant: "danger",
    });
    if (confirmed) {
      deleteNode(node.id);
    }
  }, [node, openConfirm, deleteNode]);

  return (
    <>
      <div
        className={`group/tree-row relative flex h-8 w-full cursor-pointer items-center gap-1.5 rounded-md pr-2 text-left text-[13px] transition-colors hover:bg-mint-hover/70 ${
          isSelected ? "bg-mint-hover font-medium text-mint-accent-light" : "text-[#374151]"
        }`}
        style={{ paddingLeft }}
        role="treeitem"
        aria-level={node.level}
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-label={node.name}
        onClick={() => { if (!renaming) selectNode(node.id); }}
      >
        {isFolder ? (
          <span className="flex size-4 shrink-0 items-center justify-center" role="button" tabIndex={0} aria-label={isExpanded ? "折叠" : "展开"} onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}>
            <span className="material-symbols-outlined text-[14px] text-[#6B7280]">
              {isExpanded ? "expand_more" : "chevron_right"}
            </span>
          </span>
        ) : <span className="w-4 shrink-0" />}

        {isFolder ? <FolderIcon selected={isSelected} /> : <FileIcon selected={isSelected} />}

        {(renaming || isCreating) ? (
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className={`w-full truncate rounded border bg-white px-1 box-border text-[13px] text-mint-text outline-none font-inherit m-0 py-0 appearance-none min-w-0 leading-normal ${inputBorder}`}
              value={renameValue}
              onClick={(e) => e.stopPropagation()}
              onChange={handleChange}
              onBlur={commit}
              onKeyDown={handleKeyDown}
            />
            {errorMsg && (
              <div className="absolute left-0 top-full mt-0.5 z-50 whitespace-nowrap rounded bg-red-600 px-2 py-0.5 text-[11px] text-white shadow">
                {errorMsg}
              </div>
            )}
          </div>
        ) : (
          <span className="flex-1 truncate rounded border border-transparent px-1 box-border leading-normal">{node.type === "file" ? node.name.replace(/\.md$/, "") : node.name}</span>
        )}

        <TreeItemMenu
          showPlus={showPlus}
          canCreateFolder={canCreateFolder}
          isRoot={isRoot}
          onCreateFolder={() => createFolder(node.id)}
          onCreateFile={() => createFile(node.id)}
          onRenameStart={() => { setRenaming(true); setRenameValue(node.name); setErrorMsg(null); }}
          onDelete={handleDelete}
        />
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </>
  );
});

export { TreeItem };
