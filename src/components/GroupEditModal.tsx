import { useState, type FormEvent } from 'react'
import type { Group, Subgroup } from '../types'
import { newId } from '../lib/config'
import { Modal } from './Modal'
import { IconDown, IconPlus, IconTrash, IconUp } from '../lib/icons'

const PRESETS = [
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#71717a',
]

export function GroupEditModal({
  group,
  onClose,
  onSave,
  onDelete,
}: {
  group: Group | null
  onClose: () => void
  onSave: (g: Group) => void
  onDelete?: () => void
}) {
  const [name, setName] = useState(group?.name ?? '')
  const [color, setColor] = useState(group?.color ?? PRESETS[5])
  const [subgroups, setSubgroups] = useState<Subgroup[]>(group?.subgroups ?? [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const cleaned = subgroups
      .map((s) => ({ ...s, name: s.name.trim() }))
      .filter((s) => s.name)
    onSave({
      id: group?.id ?? newId(),
      name: name.trim(),
      color,
      sites: group?.sites ?? [],
      subgroups: cleaned.length > 0 ? cleaned : undefined,
    })
  }

  const addSubgroup = () =>
    setSubgroups((prev) => [...prev, { id: newId(), name: '' }])
  const updateSubgroup = (i: number, value: string) =>
    setSubgroups((prev) => prev.map((s, j) => (j === i ? { ...s, name: value } : s)))
  const deleteSubgroup = (i: number) =>
    setSubgroups((prev) => prev.filter((_, j) => j !== i))
  const moveSubgroup = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= subgroups.length) return
    const next = [...subgroups]
    ;[next[i], next[j]] = [next[j], next[i]]
    setSubgroups(next)
  }

  return (
    <Modal title={group ? '编辑分组' : '新建分组'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">名称 *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">颜色</span>
          <div className="mt-1 flex gap-2 flex-wrap">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-zinc-900 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            子菜单（可选）
          </span>
          <div className="mt-1 space-y-1.5">
            {subgroups.map((sg, i) => (
              <div key={sg.id} className="flex gap-1">
                <input
                  value={sg.name}
                  onChange={(e) => updateSubgroup(i, e.target.value)}
                  placeholder="子菜单名称"
                  className="flex-1 px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => moveSubgroup(i, -1)}
                  className="rounded-md p-1 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  title="上移"
                >
                  <IconUp />
                </button>
                <button
                  type="button"
                  onClick={() => moveSubgroup(i, 1)}
                  className="rounded-md p-1 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  title="下移"
                >
                  <IconDown />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSubgroup(i)}
                  className="rounded-md p-1 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600"
                  title="删除"
                >
                  <IconTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSubgroup}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <IconPlus /> 添加子菜单
            </button>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            站点的子菜单归属在「编辑链接」时勾选。未归属任何子菜单的站点会出现在该分组的「全部」子菜单下。
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm border border-red-300 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 mr-auto"
            >
              <IconTrash /> 删除分组
            </button>
          )}
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
