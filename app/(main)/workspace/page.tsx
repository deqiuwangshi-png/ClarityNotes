"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarLayout } from "@/components/workspace/layout/SidebarLayout";
import { WorkspaceSkeleton } from "@/components/workspace/layout/WorkspaceSkeleton";
import { DocumentEditor } from "@/components/workspace/content/DocumentEditor";
import { FolderView } from "@/components/workspace/content/FolderView";
import { TrashContent } from "@/components/workspace/trash/TrashContent";
import { useFileTreeStore } from "@/store/fileTreeStore";
import {
  useFolderItems,
  useBreadcrumb,
  useFolderName,
  useDocumentInfo,
} from "@/hooks/use-file-tree";
import { useEditorStore } from "@/store/editorStore";
import { EDITOR_MENU_ACTIONS } from "@/constants/workspace";

type WorkspaceView = "workspace" | "trash";

export default function WorkspacePage() {
  const currentView = useFileTreeStore((s) => s.currentView)
  const selectNode = useFileTreeStore((s) => s.selectNode)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  const lastClickTimestamp = useFileTreeStore((s) => s.lastClickTimestamp)
  const loading = useFileTreeStore((s) => s.loading)
  const error = useFileTreeStore((s) => s.error)
  const loadTree = useFileTreeStore((s) => s.loadTree)

  const folderItems = useFolderItems()
  const breadcrumb = useBreadcrumb()
  const folderName = useFolderName()
  const documentInfo = useDocumentInfo()

  const loadEditorFromTree = useEditorStore((s) => s.loadEditorFromTree)
  const performSave = useEditorStore((s) => s.performSave)
  const isDirty = useEditorStore((s) => s.isDirty)
  const tree = useFileTreeStore((s) => s.getTree())

  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("workspace")
  const prevNodeIdRef = useRef<string | null>(null)

  useEffect(() => {
    loadTree()
  }, [loadTree])

  // 切换节点前 flush 未保存的内容
  useEffect(() => {
    const prevId = prevNodeIdRef.current
    if (prevId && prevId !== selectedNodeId && isDirty) {
      performSave(prevId)
    }
    prevNodeIdRef.current = selectedNodeId
  }, [selectedNodeId, performSave, isDirty])

  useEffect(() => {
    if (selectedNodeId && documentInfo) {
      loadEditorFromTree(selectedNodeId, tree)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId, loadEditorFromTree, documentInfo])

  // 在回收站视图中点击任意文件树节点 → 自动切换回工作区
  useEffect(() => {
    if (workspaceView === "trash") {
      const timer = setTimeout(() => setWorkspaceView("workspace"), 0)
      return () => clearTimeout(timer)
    }
  }, [lastClickTimestamp, workspaceView])

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
    setWorkspaceView("trash")
  }, [workspaceView])

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
