const KEY = 'nav:theme'

export type Theme = 'light' | 'dark'

export function getStoredTheme(): Theme {
  const v = localStorage.getItem(KEY)
  if (v === 'light' || v === 'dark') return v
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyStoredTheme() {
  const t = getStoredTheme()
  document.documentElement.classList.toggle('dark', t === 'dark')
}

export function setTheme(t: Theme) {
  localStorage.setItem(KEY, t)
  document.documentElement.classList.toggle('dark', t === 'dark')
}
