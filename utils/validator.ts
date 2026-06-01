import { ILLEGAL_CHARS_REGEX, MAX_NAME_LENGTH } from "@/constants/fileTree"

export function validateName(name: string, existingNames: string[]): string | null {
  const trimmed = name.trim()
  if (!trimmed) return "名称不能为空"
  if (ILLEGAL_CHARS_REGEX.test(trimmed)) return '名称不能包含 \\ / : * ? " < > | 等字符'
  if (trimmed.length > MAX_NAME_LENGTH) return "名称不能超过 100 个字符"
  if (existingNames.includes(trimmed)) return "同级已存在同名项目"
  return null
}

export function generateUniqueName(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) return baseName
  let i = 2
  while (existingNames.includes(`${baseName} (${i})`)) i++
  return `${baseName} (${i})`
}
