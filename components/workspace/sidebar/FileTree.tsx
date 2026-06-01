"use client";

import { useFileTreeStore } from "@/store/fileTreeStore";
import { TreeItem } from "@/components/workspace/sidebar/TreeItem";
import { MAX_DEPTH } from "@/constants/fileTree";

export function FileTree() {
  const tree = useFileTreeStore((s) => s.tree);
  const selectedId = useFileTreeStore((s) => s.selectedNodeId);

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto pr-1 sidebar-scroll" role="tree" aria-label="文件树">
      {tree.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          selectedId={selectedId}
          maxLevel={MAX_DEPTH}
        />
      ))}
    </nav>
  );
}
