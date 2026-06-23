import type { Config } from '../types'

const DRAFT_KEY = 'nav:draft-config'

export async function loadBaseConfig(): Promise<Config> {
  const res = await fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`config.json HTTP ${res.status}`)
  return res.json()
}

export function loadDraft(): Config | null {
  const raw = localStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Config
  } catch {
    return null
  }
}

export function saveDraft(config: Config) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(config))
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

export function downloadConfig(config: Config) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'config.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function isValidConfig(value: unknown): value is Config {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  if (typeof v.title !== 'string') return false
  if (!Array.isArray(v.groups)) return false
  return v.groups.every((g) => {
    if (!g || typeof g !== 'object') return false
    const gg = g as Record<string, unknown>
    return (
      typeof gg.id === 'string' &&
      typeof gg.name === 'string' &&
      Array.isArray(gg.sites) &&
      gg.sites.every((s) => {
        if (!s || typeof s !== 'object') return false
        const ss = s as Record<string, unknown>
        return typeof ss.id === 'string' && typeof ss.name === 'string' && typeof ss.url === 'string'
      })
    )
  })
}
