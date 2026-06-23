export type Site = {
  id: string
  name: string
  url: string
  description?: string
  icon?: string
  probeUrl?: string
  openInNewTab?: boolean
  subgroupIds?: string[]
}

export type Subgroup = {
  id: string
  name: string
}

export type Group = {
  id: string
  name: string
  color?: string
  sites: Site[]
  subgroups?: Subgroup[]
}

export type Settings = {
  enablePing?: boolean
  favicon?: string
  defaultTab?: string
}

export type Config = {
  title: string
  settings?: Settings
  groups: Group[]
}

export type PingStatus = 'unknown' | 'online' | 'offline'
