export type SearchRecord = {
  id: string
  term: string
  kind?: 'name' | 'url' | 'category' | 'all'
  count: number
  favorite: boolean
  lastAt: number
}

const STORAGE_KEY = 'searchHistory'

function load(): SearchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function save(list: SearchRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function addSearch(term: string, kind?: SearchRecord['kind']): SearchRecord[] {
  const t = term.trim()
  if (!t) return load()
  const list = load()
  const now = Date.now()
  const existing = list.find((r) => r.term.toLowerCase() === t.toLowerCase())
  if (existing) {
    existing.count += 1
    existing.lastAt = now
    save(list)
    return list
  }
  const record: SearchRecord = {
    id: makeId(),
    term: t,
    kind: kind ?? (t.startsWith('http') ? 'url' : 'all'),
    count: 1,
    favorite: false,
    lastAt: now,
  }
  const next = [record, ...list].slice(0, 100) 
  save(next)
  return next
}

export function getHistory(): SearchRecord[] {
  return load().sort((a, b) => b.lastAt - a.lastAt)
}

export function toggleFavorite(id: string): SearchRecord[] {
  const list = load()
  const rec = list.find((r) => r.id === id)
  if (rec) {
    rec.favorite = !rec.favorite
    save(list)
  }
  return getHistory()
}

export function removeSearch(id: string): SearchRecord[] {
  const list = load().filter((r) => r.id !== id)
  save(list)
  return getHistory()
}

export function clearHistory(): void {
  save([])
}
