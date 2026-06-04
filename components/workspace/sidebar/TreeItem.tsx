"use client";

import { useCallback, memo } from "react";
import type { TreeNode } from "@/types/fileTree";
import { useFileTreeStore } from "@/store/fileTreeStore";
import { useUiStore } from "@/store/uiStore";
import { useTreeItemRename } from "@/hooks/use-tree-item-rename";
import { FolderIcon, FileIcon } from "@/components/workspace/sidebar/TreeItemIcons";
import { TreeItemMenu } from "@/components/workspace/sidebar/TreeItemMenu";

interface TreeItemProps {
  node: TreeNode;
  selectedId: string | null;
  maxLevel: number;
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

  const rename = useTreeItemRename({
    nodeId: node.id,
    nodeName: node.name,
    isCreating,
    validateCreateName,
    commitRename,
    cancelCreate,
  });

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

  const inputBorder = rename.errorMsg ? "border-red-400" : "border-mint-accent";

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
        onClick={() => { if (!rename.renaming) selectNode(node.id); }}
      >
        {isFolder ? (
          <span className="flex size-4 shrink-0 items-center justify-center" role="button" tabIndex={0} aria-label={isExpanded ? "折叠" : "展开"} onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}>
            <span className="material-symbols-outlined text-[14px] text-[#6B7280]">
              {isExpanded ? "expand_more" : "chevron_right"}
            </span>
          </span>
        ) : <span className="w-4 shrink-0" />}

        {isFolder ? <FolderIcon selected={isSelected} /> : <FileIcon selected={isSelected} />}

        {(rename.renaming || isCreating) ? (
          <div className="flex-1 relative">
            <input
              ref={rename.inputRef}
              className={`w-full truncate rounded border bg-white px-1 box-border text-[13px] text-mint-text outline-none font-inherit m-0 py-0 appearance-none min-w-0 leading-normal ${inputBorder}`}
              value={rename.renameValue}
              onClick={(e) => e.stopPropagation()}
              onChange={rename.handleChange}
              onBlur={rename.commit}
              onKeyDown={rename.handleKeyDown}
            />
            {rename.errorMsg && (
              <div className="absolute left-0 top-full mt-0.5 z-50 whitespace-nowrap rounded bg-red-600 px-2 py-0.5 text-[11px] text-white shadow">
                {rename.errorMsg}
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
          onRenameStart={rename.startRename}
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
