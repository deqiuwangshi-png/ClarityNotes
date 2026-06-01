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
import { findNode } from "@/lib/services/fileTreeService";
import { mockUser, mockMenuActions } from "@/data/workspace-mock";

export default function WorkspacePage() {
  const currentView = useFileTreeStore((s) => s.currentView);
  const selectNode = useFileTreeStore((s) => s.selectNode);
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId);

  const folderItems = useFolderItems();
  const breadcrumb = useBreadcrumb();
  const folderName = useFolderName();
  const documentInfo = useDocumentInfo();

  const loadFromNode = useEditorStore((s) => s.loadFromNode);

  useEffect(() => {
    if (selectedNodeId && documentInfo) {
      const tree = useFileTreeStore.getState().tree;
      const node = findNode(tree, selectedNodeId);
      loadFromNode(selectedNodeId, node?.content, node?.name);
    }
  }, [selectedNodeId, loadFromNode, documentInfo]);

  const handleBreadcrumbClick = useCallback(
    (id: string) => selectNode(id),
    [selectNode],
  );

  const handleFolderItemClick = useCallback(
    (itemId: string) => selectNode(itemId),
    [selectNode],
  );

  const handleFolderItemMore = useCallback((itemId: string) => {
    console.log("More:", itemId);
  }, []);

  const handleMenuAction = useCallback((action: string) => {
    console.log("Menu action:", action);
  }, []);

  return (
    <SidebarLayout userInfo={mockUser}>
      {currentView === "editor" && documentInfo ? (
        <DocumentEditor
          document={documentInfo}
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
          onItemMore={handleFolderItemMore}
        />
      )}
    </SidebarLayout>
  );
}
