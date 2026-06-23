import type { Group } from '../types'

export const ALL_TAB = 'all' as const
export type TabId = string | typeof ALL_TAB

export type TabState = { tab: TabId; subgroup: string | null }

export const ALL_STATE: TabState = { tab: ALL_TAB, subgroup: null }

export function tabStateFromHash(hash: string, groups: Group[]): TabState {
  const raw = decodeURIComponent(hash.replace(/^#/, '')).trim()
  if (!raw || raw === 'all' || raw === '全部') return ALL_STATE
  const [groupPart, subPart] = raw.split('/')
  const group = groups.find((g) => g.name === groupPart || g.id === groupPart)
  if (!group) return ALL_STATE
  if (!subPart) return { tab: group.id, subgroup: null }
  const sub = group.subgroups?.find((s) => s.name === subPart || s.id === subPart)
  return { tab: group.id, subgroup: sub?.id ?? null }
}

export function hashFromTabState(state: TabState, groups: Group[]): string {
  if (state.tab === ALL_TAB) return ''
  const group = groups.find((g) => g.id === state.tab)
  if (!group) return ''
  let h = `#${encodeURIComponent(group.name)}`
  if (state.subgroup) {
    const sub = group.subgroups?.find((s) => s.id === state.subgroup)
    if (sub) h += `/${encodeURIComponent(sub.name)}`
  }
  return h
}

export function syncHash(state: TabState, groups: Group[]) {
  const next = hashFromTabState(state, groups)
  const current = window.location.hash
  if (next === current) return
  if (next) {
    history.replaceState(null, '', next)
  } else if (current) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}
