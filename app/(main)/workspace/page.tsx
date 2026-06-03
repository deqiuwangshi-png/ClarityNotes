"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarLayout } from "@/components/workspace/layout/SidebarLayout";
import { DocumentEditor } from "@/components/workspace/content/DocumentEditor";
import { FolderView } from "@/components/workspace/content/FolderView";
import { TrashContent } from "@/components/workspace/trash/TrashContent";
import {
  useFileTreeStore,
} from "@/store/fileTreeStore";
import {
  useFolderItems,
  useBreadcrumb,
  useFolderName,
  useDocumentInfo,
} from "@/hooks/use-file-tree";
import { useEditorStore } from "@/store/editorStore";
import { EDITOR_MENU_ACTIONS } from "@/constants/workspace";

type WorkspaceView = "workspace" | "trash";

function WorkspaceSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[280px] space-y-3 p-5 animate-pulse">
        <div className="h-8 bg-mint-border/20 rounded" />
        <div className="h-8 bg-mint-border/20 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 bg-mint-border/10 rounded ml-4" />
        ))}
      </div>
      <div className="flex-1 p-6 space-y-3 animate-pulse">
        <div className="h-4 w-48 bg-mint-border/20 rounded" />
        <div className="h-8 w-64 bg-mint-border/20 rounded" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-mint-border/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  const currentView = useFileTreeStore((s) => s.currentView)
  const selectNode = useFileTreeStore((s) => s.selectNode)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  const loading = useFileTreeStore((s) => s.loading)
  const error = useFileTreeStore((s) => s.error)
  const loadTree = useFileTreeStore((s) => s.loadTree)

  const folderItems = useFolderItems()
  const breadcrumb = useBreadcrumb()
  const folderName = useFolderName()
  const documentInfo = useDocumentInfo()

  const loadEditorFromTree = useEditorStore((s) => s.loadEditorFromTree)

  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("workspace")
  const selectedBeforeTrash = useRef<string | null>(null)

  useEffect(() => {
    loadTree()
  }, [loadTree])

  useEffect(() => {
    if (selectedNodeId && documentInfo) {
      loadEditorFromTree(selectedNodeId)
    }
  }, [selectedNodeId, loadEditorFromTree, documentInfo])

  useEffect(() => {
    if (workspaceView !== "trash") return
    if (selectedNodeId && selectedNodeId !== selectedBeforeTrash.current) {
      setWorkspaceView("workspace")
    }
  }, [selectedNodeId, workspaceView])

  const handleBreadcrumbClick = useCallback(
    (id: string) => selectNode(id),
    [selectNode],
  )

  const handleFolderItemClick = useCallback(
    (itemId: string) => selectNode(itemId),
    [selectNode],
  )

  const handleMenuAction = useCallback((action: string) => {
    console.log("Menu action:", action)
  }, [])

  const handleCloseTrash = useCallback(() => {
    setWorkspaceView("workspace")
  }, [])

  const handleTrashClick = useCallback(() => {
    if (workspaceView === "trash") return
    selectedBeforeTrash.current = selectedNodeId
    setWorkspaceView("trash")
  }, [workspaceView, selectedNodeId])

  if (loading) {
    return <WorkspaceSkeleton />
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-4xl text-red-400">error</span>
        <p className="text-sm text-mint-muted">{error}</p>
        <button
          onClick={loadTree}
          className="rounded-lg bg-mint-primary px-4 py-2 text-sm text-white btn-transition hover:bg-mint-primary/90"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <SidebarLayout
      isTrashActive={workspaceView === "trash"}
      onTrashClick={handleTrashClick}
    >
      {workspaceView === "trash" ? (
        <TrashContent onClose={handleCloseTrash} />
      ) : currentView === "editor" && documentInfo ? (
        <DocumentEditor
          breadcrumbPaths={breadcrumb}
          onBreadcrumbClick={handleBreadcrumbClick}
          onMenuAction={handleMenuAction}
          menuActions={EDITOR_MENU_ACTIONS}
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
