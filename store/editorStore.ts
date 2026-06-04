import { create } from "zustand"
import type { DocNode, TreeNode } from "@/types/fileTree"
import { countWords } from "@/utils/editor"
import { findNode } from "@/lib/services/fileTreeService"
import { saveDocument } from "@/lib/services/editorService"

const EMPTY_DOC: DocNode = { type: "doc", content: [] }

interface EditorState {
  content: DocNode
  title: string
  wordCount: number
  isDirty: boolean
  isSaved: boolean
  loadedNodeId: string | null
  error: string | null

  loadFromNode: (nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => void
  loadEditorFromTree: (nodeId: string, tree: TreeNode[]) => void
  setContent: (doc: DocNode) => void
  setTitle: (newTitle: string) => void
  performSave: (nodeId: string) => Promise<void>
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  content: EMPTY_DOC,
  title: "",
  wordCount: 0,
  isDirty: false,
  isSaved: true,
  loadedNodeId: null,
  error: null,

  loadFromNode: (_nodeId: string, nodeContent?: DocNode, nodeTitle?: string) => {
    const doc = nodeContent ?? EMPTY_DOC
    set({ content: doc, title: nodeTitle ?? "", wordCount: countWords(doc), isDirty: false, isSaved: true, loadedNodeId: _nodeId })
  },

  loadEditorFromTree: (_nodeId: string, tree: TreeNode[]) => {
    const node = findNode(tree, _nodeId)
    const doc = node?.content ?? EMPTY_DOC

    set({
      content: doc,
      title: node?.name ?? "",
      wordCount: countWords(doc),
      isDirty: false,
      isSaved: true,
      loadedNodeId: _nodeId,
      error: null,
    })
  },

  setContent: (doc: DocNode) => {
    set({ content: doc, wordCount: countWords(doc), isDirty: true, isSaved: false })
  },

  setTitle: (newTitle: string) => {
    set({ title: newTitle, isDirty: true, isSaved: false })
  },

  performSave: async (nodeId: string) => {
    const { content, title, isDirty } = get()
    if (!isDirty || !nodeId) return

    try {
      await saveDocument({ nodeId, title, content, wordCount: countWords(content) })
      set({ isDirty: false, isSaved: true, error: null })
    } catch (err) {
      console.error('[performSave]', err, { nodeId })
    }
  },
}))
