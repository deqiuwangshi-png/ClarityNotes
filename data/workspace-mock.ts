import type { UserInfo, DropdownMenuItem } from "@/types/fileTree"

export { initialTree } from "@/data/mockFileTree"

export const mockUser: UserInfo = {
  displayName: "临时账号",
  email: "user@example.com",
  avatarInitial: "用",
}

export const mockMenuActions: DropdownMenuItem[] = [
  { key: "share", label: "分享", icon: "share" },
  { key: "export", label: "导出", icon: "download" },
  { key: "print", label: "打印", icon: "print" },
]
