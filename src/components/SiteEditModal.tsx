import { useState, type FormEvent, type ReactNode } from 'react'
import type { Group, Site } from '../types'
import { newId } from '../lib/config'
import { Modal } from './Modal'
import { IconBox } from './IconBox'

const inputCls =
  'w-full px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

export function SiteEditModal({
  site,
  group,
  onClose,
  onSave,
}: {
  site: Site | null
  group: Group
  onClose: () => void
  onSave: (s: Site) => void
}) {
  const [name, setName] = useState(site?.name ?? '')
  const [url, setUrl] = useState(site?.url ?? '')
  const [description, setDescription] = useState(site?.description ?? '')
  const [icon, setIcon] = useState(site?.icon ?? '')
  const [probeUrl, setProbeUrl] = useState(site?.probeUrl ?? '')
  const [openInNewTab, setOpenInNewTab] = useState(site?.openInNewTab !== false)
  const [subgroupIds, setSubgroupIds] = useState<Set<string>>(
    new Set(site?.subgroupIds ?? []),
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return
    const validIds = (group.subgroups ?? [])
      .map((s) => s.id)
      .filter((id) => subgroupIds.has(id))
    onSave({
      id: site?.id ?? newId(),
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      icon: icon.trim() || undefined,
      probeUrl: probeUrl.trim() || undefined,
      openInNewTab: openInNewTab ? undefined : false,
      subgroupIds: validIds.length > 0 ? validIds : undefined,
    })
  }

  const toggleSubgroup = (id: string) =>
    setSubgroupIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <Modal onClose={onClose} title={site ? '编辑链接' : '新建链接'}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="名称 *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className={inputCls}
          />
        </Field>
        <Field label="URL *">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="url"
            className={inputCls}
            placeholder="https://"
          />
        </Field>
        <Field label="描述">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="图标（可选，URL 或 <svg> 代码，留空使用目标站的 favicon）">
          <div className="flex gap-2 items-start">
            <textarea
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              rows={2}
              className="flex-1 px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="https://…/icon.png  或  <svg viewBox='0 0 24 24'>…</svg>"
            />
            <div className="w-9 h-9 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              <IconBox src={icon} fallback={name.slice(0, 1) || '?'} />
            </div>
          </div>
        </Field>
        <Field label="探测 URL（可选，留空使用目标站的 favicon.ico）">
          <input
            value={probeUrl}
            onChange={(e) => setProbeUrl(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="打开方式">
          <div className="flex gap-4 text-sm">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={openInNewTab}
                onChange={() => setOpenInNewTab(true)}
                className="accent-blue-600"
              />
              新页面打开
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={!openInNewTab}
                onChange={() => setOpenInNewTab(false)}
                className="accent-blue-600"
              />
              本页面打开
            </label>
          </div>
        </Field>
        {(group.subgroups?.length ?? 0) > 0 && (
          <Field label="所属子菜单（多选，可不选）">
            <div className="flex flex-wrap gap-2">
              {group.subgroups!.map((sg) => (
                <label
                  key={sg.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <input
                    type="checkbox"
                    checked={subgroupIds.has(sg.id)}
                    onChange={() => toggleSubgroup(sg.id)}
                    className="accent-blue-600"
                  />
                  {sg.name}
                </label>
              ))}
            </div>
          </Field>
        )}
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
