let counter = 0

export function generateId(): string {
  counter++
  return `node-${Date.now()}-${counter}`
}

export function resetIdCounter(): void {
  counter = 0
}
