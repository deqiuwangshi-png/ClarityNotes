export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return '请输入邮箱地址'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '请输入有效的邮箱地址'
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return '请输入密码'
  if (password.length < 8) return '密码至少需要 8 位字符'
  return undefined
}

export function validateFullName(name: string): string | undefined {
  if (!name.trim()) return '请输入您的姓名'
  return undefined
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) return '请确认密码'
  if (password !== confirm) return '两次输入的密码不一致'
  return undefined
}
