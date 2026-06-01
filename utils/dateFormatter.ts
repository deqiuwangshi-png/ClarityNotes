export function formatTimestamp(date?: Date): string {
  const d = date ?? new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
