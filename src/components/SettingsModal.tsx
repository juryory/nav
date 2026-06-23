import { useState, type FormEvent } from 'react'
import type { Config } from '../types'
import { Modal } from './Modal'
import { IconBox } from './IconBox'

export function SettingsModal({
  config,
  onClose,
  onSave,
}: {
  config: Config
  onClose: () => void
  onSave: (next: Config) => void
}) {
  const [title, setTitle] = useState(config.title)
  const [favicon, setFavicon] = useState(config.settings?.favicon ?? '')
  const [defaultTab, setDefaultTab] = useState(config.settings?.defaultTab ?? 'all')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      ...config,
      title: title.trim(),
      settings: {
        ...config.settings,
        favicon: favicon.trim() || undefined,
        defaultTab: defaultTab === 'all' ? undefined : defaultTab,
      },
    })
  }

  return (
    <Modal title="站点设置" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            导航名称 *（同步到浏览器标签页标题）
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Favicon（可选，URL 或 &lt;svg&gt; 代码，留空使用默认图标）
          </span>
          <div className="mt-1 flex gap-2 items-start">
            <textarea
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              rows={2}
              placeholder="https://…/favicon.ico  或  <svg viewBox='0 0 24 24'>…</svg>"
              className="flex-1 px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <div className="w-9 h-9 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              <IconBox src={favicon} fallback="?" />
            </div>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            URL 支持 .ico / .png / .svg；也可以直接粘贴 SVG 源码。改完保存即同步到浏览器标签页图标。
          </p>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            默认打开的标签页
          </span>
          <select
            value={defaultTab}
            onChange={(e) => setDefaultTab(e.target.value)}
            className="mt-1 w-full px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            {config.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500">
            访客打开页面时默认显示的标签页。URL 带有 hash（如
            <code className="mx-1 px-1 rounded bg-zinc-200 dark:bg-zinc-800">#节目</code>
            ）时优先使用 hash。
          </p>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            取消
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-500"
          >
            保存
          </button>
        </div>
      </form>
    </Modal>
  )
}
