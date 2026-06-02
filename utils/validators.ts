export function validateFullName(name: string): string | null {
  if (!name.trim()) return "请输入您的姓名"
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 20) return "用户名需 2-20 个字符"
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "请输入手机号"
  if (!/^1[3-9]\d{9}$/.test(phone)) return "请输入有效的中国大陆手机号"
  return null
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "请输入邮箱地址"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "请输入有效的邮箱地址"
  return null
}

export function validatePasswordStrength(password: string): string | null {
  if (!password) return "请输入密码"
  if (password.length < 8) return "密码至少需要 8 位"
  return null
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "请确认密码"
  if (password !== confirm) return "两次输入的密码不一致"
  return null
}
