import { create } from "zustand"
import type { DocNode, TreeNode } from "@/types/fileTree"
import { countWords } from "@/utils/editor"
import { findNode } from "@/lib/services/fileTreeService"
import { saveDocument } from "@/lib/services/editorService"
import { useFileTreeDataStore } from "@/store/fileTreeDataStore"

const EMPTY_DOC: DocNode = { type: "doc", content: [] }
const DRAFT_PREFIX = "claritynotes_editor_draft:"

interface EditorState {
  content: DocNode
  title: string
  wordCount: number
  isDirty: boolean
  isSaved: boolean
  loadedNodeId: string | null
  dirtyNodeId: string | null
  saveVersion: number
  error: string | null

  loadFromNode: (nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => void
  loadEditorFromTree: (nodeId: string, tree: TreeNode[]) => void
  setContent: (doc: DocNode) => void
  setTitle: (newTitle: string) => void
  syncTitleFromTreeRename: (nodeId: string, newTitle: string) => void
  performSave: (nodeId: string) => Promise<void>
}

interface EditorSaveSnapshot {
  nodeId: string
  title: string
  content: DocNode
  wordCount: number
  saveVersion: number
}

interface EditorDraft {
  nodeId: string
  title: string
  content: DocNode
  updatedAt: string
}

function getDraftKey(nodeId: string): string {
  return `${DRAFT_PREFIX}${nodeId}`
}

function readDraft(nodeId: string): EditorDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(getDraftKey(nodeId))
    return raw ? (JSON.parse(raw) as EditorDraft) : null
  } catch {
    return null
  }
}

function writeDraft(nodeId: string | null, title: string, content: DocNode): void {
  if (!nodeId || typeof window === "undefined") return
  try {
    const draft: EditorDraft = {
      nodeId,
      title,
      content,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(getDraftKey(nodeId), JSON.stringify(draft))
  } catch {
    return
  }
}

function clearDraft(nodeId: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(getDraftKey(nodeId))
  } catch {
    return
  }
}

function getLoadState(nodeId: string, content?: DocNode, title?: string) {
  const draft = readDraft(nodeId)
  const doc = draft?.content ?? content ?? EMPTY_DOC

  return {
    content: doc,
    title: draft?.title ?? title ?? "",
    wordCount: countWords(doc),
    isDirty: Boolean(draft),
    isSaved: !draft,
    loadedNodeId: nodeId,
    dirtyNodeId: draft ? nodeId : null,
    error: null,
  }
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  content: EMPTY_DOC,
  title: "",
  wordCount: 0,
  isDirty: false,
  isSaved: true,
  loadedNodeId: null,
  dirtyNodeId: null,
  saveVersion: 0,
  error: null,

  loadFromNode: (_nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => {
    const next = getLoadState(_nodeId, nodeContent, nodeTitle)
    set((state) => ({ ...next, saveVersion: state.saveVersion + 1 }))
  },

  loadEditorFromTree: (_nodeId: string, tree: TreeNode[]) => {
    const node = findNode(tree, _nodeId)
    const next = getLoadState(_nodeId, node?.content, node?.name)
    set((state) => ({ ...next, saveVersion: state.saveVersion + 1 }))
  },

  setContent: (doc: DocNode) => {
    set((state) => {
      writeDraft(state.loadedNodeId, state.title, doc)
      return {
        content: doc,
        wordCount: countWords(doc),
        isDirty: true,
        isSaved: false,
        dirtyNodeId: state.loadedNodeId,
        saveVersion: state.saveVersion + 1,
      }
    })
  },

  setTitle: (newTitle: string) => {
    set((state) => {
      writeDraft(state.loadedNodeId, newTitle, state.content)
      return {
        title: newTitle,
        isDirty: true,
        isSaved: false,
        dirtyNodeId: state.loadedNodeId,
        saveVersion: state.saveVersion + 1,
      }
    })
  },

  syncTitleFromTreeRename: (nodeId: string, newTitle: string) => {
    const state = get()
    if (state.loadedNodeId !== nodeId) return

    const isCurrentDocumentDirty = state.isDirty && state.dirtyNodeId === nodeId
    if (isCurrentDocumentDirty) writeDraft(nodeId, newTitle, state.content)

    set({
      title: newTitle,
      isDirty: isCurrentDocumentDirty,
      isSaved: !isCurrentDocumentDirty,
      dirtyNodeId: isCurrentDocumentDirty ? nodeId : null,
      saveVersion: state.saveVersion + 1,
    })
  },

  performSave: async (nodeId: string) => {
    const state = get()
    if (!state.isDirty || state.loadedNodeId !== nodeId || state.dirtyNodeId !== nodeId) return

    const snapshot: EditorSaveSnapshot = {
      nodeId,
      title: state.title,
      content: state.content,
      wordCount: countWords(state.content),
      saveVersion: state.saveVersion,
    }

    try {
      await saveDocument(snapshot)

      const latest = get()
      if (
        latest.loadedNodeId !== snapshot.nodeId ||
        latest.dirtyNodeId !== snapshot.nodeId ||
        latest.saveVersion !== snapshot.saveVersion
      ) return

      clearDraft(snapshot.nodeId)
      useFileTreeDataStore.getState().updateNodeLocal(snapshot.nodeId, {
        name: snapshot.title,
        content: snapshot.content,
        wordCount: snapshot.wordCount,
        updatedAt: new Date().toISOString(),
      })
      set({ isDirty: false, isSaved: true, dirtyNodeId: null, error: null })
    } catch (err) {
      const latest = get()
      if (
        latest.loadedNodeId === snapshot.nodeId &&
        latest.dirtyNodeId === snapshot.nodeId &&
        latest.saveVersion === snapshot.saveVersion
      ) {
        set({ error: "保存失败，请检查网络后重试", isSaved: false })
      }
      console.error('[performSave]', err, { nodeId })
    }
  },
}))
