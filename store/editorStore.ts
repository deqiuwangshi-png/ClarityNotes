import { create } from "zustand"
import type { DocNode } from "@/types/fileTree"
import { countWords } from "@/utils/editor"
import { findNode } from "@/lib/services/fileTreeService"
import { saveDocument } from "@/lib/services/editorService"
import { useFileTreeStore } from "@/store/fileTreeStore"

const AUTO_SAVE_DELAY = 2000
const EMPTY_DOC: DocNode = { type: "doc", content: [] }

interface EditorState {
  content: DocNode
  title: string
  wordCount: number
  isSaved: boolean
  isDirty: boolean
  loadedUpdatedAt: string | null
  error: string | null

  loadFromNode: (nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => void
  loadEditorFromTree: (nodeId: string) => void
  setContent: (doc: DocNode) => void
  setTitle: (newTitle: string) => void
  saveNow: () => void
  cancelAutoSave: () => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useEditorStore = create<EditorState>()((set, get) => {
  async function performSave() {
    const { content, title, isDirty, loadedUpdatedAt } = get()
    if (!isDirty) return

    set({ isSaved: false })
    const nodeId = useFileTreeStore.getState().selectedNodeId
    if (!nodeId) {
      set({ isSaved: true, isDirty: false })
      return
    }

    const words = countWords(content)
    try {
      await saveDocument({ nodeId, title, content, wordCount: words, expectedUpdatedAt: loadedUpdatedAt ?? undefined })
      // 保存成功后更新本地版本号
      const now = new Date().toISOString()
      set({ isSaved: true, isDirty: false, wordCount: words, loadedUpdatedAt: now })
    } catch (err) {
      if ((err as Error).message.startsWith('CONFLICT')) {
        set({ isSaved: false, isDirty: true, error: '文档已被其他会话修改，请刷新后重试' })
      } else {
        set({ isSaved: false })
      }
    }
  }

  function scheduleSave() {
    if (saveTimer !== null) clearTimeout(saveTimer)
    const snapshotNodeId = useFileTreeStore.getState().selectedNodeId
    saveTimer = setTimeout(() => {
      saveTimer = null
      if (snapshotNodeId !== useFileTreeStore.getState().selectedNodeId) return
      performSave()
    }, AUTO_SAVE_DELAY)
  }

  return {
    content: EMPTY_DOC,
    title: "",
    wordCount: 0,
    isSaved: true,
    isDirty: false,
    loadedUpdatedAt: null,
    error: null,

    loadFromNode: (nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => {
      if (saveTimer !== null) clearTimeout(saveTimer)
      const content = nodeContent ?? EMPTY_DOC
      set({
        content,
        title: nodeTitle ?? "",
        wordCount: countWords(content),
        isSaved: true,
        isDirty: false,
      })
    },

    loadEditorFromTree: (nodeId: string) => {
      const tree = useFileTreeStore.getState().getTree()
      const node = findNode(tree, nodeId)
      if (saveTimer !== null) clearTimeout(saveTimer)
      const content = node?.content ?? EMPTY_DOC
      set({
        content,
        title: node?.name ?? "",
        wordCount: countWords(content),
        isSaved: true,
        isDirty: false,
        loadedUpdatedAt: node?.updatedAt ?? null,
        error: null,
      })
    },

    setContent: (doc: DocNode) => {
      set({ content: doc, wordCount: countWords(doc), isDirty: true, isSaved: false })
      scheduleSave()
    },

    setTitle: (newTitle: string) => {
      set({ title: newTitle, isDirty: true, isSaved: false })
      scheduleSave()
    },

    saveNow: () => {
      if (saveTimer !== null) {
        clearTimeout(saveTimer)
        saveTimer = null
      }
      performSave()
    },

    cancelAutoSave: () => {
      if (saveTimer !== null) {
        clearTimeout(saveTimer)
        saveTimer = null
      }
    },
  }
})
