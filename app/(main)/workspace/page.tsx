"use client";

import { useCallback, useEffect } from "react";
import { SidebarLayout } from "@/components/workspace/layout/SidebarLayout";
import { DocumentEditor } from "@/components/workspace/content/DocumentEditor";
import { FolderView } from "@/components/workspace/content/FolderView";
import {
  useFileTreeStore,
  useFolderItems,
  useBreadcrumb,
  useFolderName,
  useDocumentInfo,
} from "@/store/fileTreeStore";
import { useEditorStore } from "@/store/editorStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function WorkspacePage() {
  const currentView = useFileTreeStore((s) => s.currentView);
  const selectNode = useFileTreeStore((s) => s.selectNode);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);

  const folderItems = useFolderItems();
  const breadcrumb = useBreadcrumb();
  const folderName = useFolderName();
  const documentInfo = useDocumentInfo();

  const loadEditorFromTree = useEditorStore((s) => s.loadEditorFromTree);
  const { mockUser, mockMenuActions } = useWorkspaceStore();

  useEffect(() => {
    if (selectedNodeId && documentInfo) {
      loadEditorFromTree(selectedNodeId);
    }
  }, [selectedNodeId, loadEditorFromTree, documentInfo]);

  const handleBreadcrumbClick = useCallback(
    (id: string) => selectNode(id),
    [selectNode],
  );

  const handleFolderItemClick = useCallback(
    (itemId: string) => selectNode(itemId),
    [selectNode],
  );

  const handleMenuAction = useCallback((action: string) => {
    console.log("Menu action:", action);
  }, []);

  return (
    <SidebarLayout userInfo={mockUser}>
      {currentView === "editor" && documentInfo ? (
        <DocumentEditor
          breadcrumbPaths={breadcrumb}
          onBreadcrumbClick={handleBreadcrumbClick}
          onMenuAction={handleMenuAction}
          menuActions={mockMenuActions}
        />
      ) : (
        <FolderView
          folderName={folderName}
          breadcrumbPaths={breadcrumb}
          items={folderItems}
          onBreadcrumbClick={handleBreadcrumbClick}
          onItemClick={handleFolderItemClick}
        />
      )}
    </SidebarLayout>
  );
}
