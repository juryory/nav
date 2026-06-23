import { useEffect, useState } from 'react'
import type { PingStatus, Site } from '../types'
import { defaultProbeUrl, probe } from '../lib/ping'
import { IconCopy, IconDown, IconEdit, IconTrash, IconUp } from '../lib/icons'
import { IconBox } from './IconBox'

export function SiteCard({
  site,
  editMode,
  pingEnabled,
  onEdit,
  onDelete,
  onMove,
  onCopy,
}: {
  site: Site
  editMode: boolean
  pingEnabled: boolean
  onEdit: () => void
  onDelete: () => void
  onMove: (dir: -1 | 1) => void
  onCopy: () => void
}) {
  const [status, setStatus] = useState<PingStatus>('unknown')

  useEffect(() => {
    if (!pingEnabled) return
    let cancelled = false
    setStatus('unknown')
    probe(site.probeUrl ?? defaultProbeUrl(site.url)).then((s) => {
      if (!cancelled) setStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [site.url, site.probeUrl, pingEnabled])

  const iconValue = site.icon ?? defaultProbeUrl(site.url)
  const dotColor =
    status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-zinc-400'
  const dotTitle =
    status === 'online' ? '可访问' : status === 'offline' ? '不可访问' : '检测中'

  const inner = (
    <div className="group relative h-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all">
      {pingEnabled && (
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${dotColor}`}
          title={dotTitle}
        />
      )}
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
          <IconBox src={iconValue} fallback={site.name.slice(0, 1)} />
        </div>
        <div className={`min-w-0 flex-1 ${pingEnabled ? 'mr-4' : ''}`}>
          <div className="font-medium text-sm truncate">{site.name}</div>
          {site.description && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {site.description}
            </div>
          )}
        </div>
      </div>
      {editMode && (
        <div className="absolute -top-2 -right-2 flex gap-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onMove(-1)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="上移"
          >
            <IconUp />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="下移"
          >
            <IconDown />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="编辑"
          >
            <IconEdit />
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="复制"
          >
            <IconCopy />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600"
            title="删除"
          >
            <IconTrash />
          </button>
        </div>
      )}
    </div>
  )

  if (editMode) return inner
  const newTab = site.openInNewTab !== false
  return (
    <a
      href={site.url}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className="block h-full"
    >
      {inner}
    </a>
  )
}
