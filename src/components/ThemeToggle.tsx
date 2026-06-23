import { useState } from 'react'
import { getStoredTheme, setTheme } from '../lib/theme'
import { IconMoon, IconSun } from '../lib/icons'

export function ThemeToggle() {
  const [theme, setT] = useState(getStoredTheme())
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setT(next)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === 'dark' ? '切换到亮色' : '切换到暗色'}
      className="rounded-md p-1.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  )
}
