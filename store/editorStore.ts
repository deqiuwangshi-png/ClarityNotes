import { create } from "zustand"
import { countWords } from "@/utils/editor"
import { saveContent, updateTitle } from "@/lib/services/editorService"
import { findNode } from "@/lib/services/fileTreeService"
import { useFileTreeStore } from "@/store/fileTreeStore"

const AUTO_SAVE_DELAY = 2000

interface EditorState {
  content: string
  title: string
  wordCount: number
  isSaved: boolean
  isDirty: boolean

  loadFromNode: (nodeId: string, nodeContent?: string, nodeTitle?: string) => void
  loadEditorFromTree: (nodeId: string) => void
  setContent: (html: string) => void
  setTitle: (newTitle: string) => void
  saveNow: () => void
  cancelAutoSave: () => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useEditorStore = create<EditorState>()((set, get) => {
  function performSave() {
    const { content, isDirty } = get()
    if (!isDirty) return

    set({ isSaved: false })
    const fileTreeState = useFileTreeStore.getState()
    const nodeId = fileTreeState.selectedNodeId
    if (!nodeId) {
      set({ isSaved: true, isDirty: false })
      return
    }

    const words = countWords(content)
    const result = saveContent(fileTreeState.tree, nodeId, content, words)
    if (!("error" in result)) {
      useFileTreeStore.getState().setTree(result.tree)
      set({ isSaved: true, isDirty: false, wordCount: words })
    }
  }

  function scheduleSave() {
    if (saveTimer !== null) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveTimer = null
      performSave()
    }, AUTO_SAVE_DELAY)
  }

  return {
    content: "",
    title: "",
    wordCount: 0,
    isSaved: true,
    isDirty: false,

    loadFromNode: (nodeId: string, nodeContent?: string, nodeTitle?: string) => {
      if (saveTimer !== null) clearTimeout(saveTimer)
      const content = nodeContent ?? ""
      set({
        content,
        title: nodeTitle ?? "",
        wordCount: countWords(content),
        isSaved: true,
        isDirty: false,
      })
    },

    loadEditorFromTree: (nodeId: string) => {
      const tree = useFileTreeStore.getState().tree
      const node = findNode(tree, nodeId)
      if (saveTimer !== null) clearTimeout(saveTimer)
      const content = node?.content ?? ""
      set({
        content,
        title: node?.name ?? "",
        wordCount: countWords(content),
        isSaved: true,
        isDirty: false,
      })
    },

    setContent: (html: string) => {
      set({ content: html, wordCount: countWords(html), isDirty: true, isSaved: false })
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
      const { title } = get()
      const fileTreeState = useFileTreeStore.getState()
      const nodeId = fileTreeState.selectedNodeId
      if (!nodeId) return

      const titleResult = updateTitle(fileTreeState.tree, nodeId, title)
      if (!("error" in titleResult)) {
        useFileTreeStore.getState().setTree(titleResult.tree)
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
