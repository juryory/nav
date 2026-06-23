import type { PingStatus } from '../types'

const cache = new Map<string, { status: PingStatus; ts: number }>()
const TTL = 60_000
const TIMEOUT = 5_000

export function defaultProbeUrl(siteUrl: string): string {
  try {
    const u = new URL(siteUrl)
    return `${u.origin}/favicon.ico`
  } catch {
    return siteUrl
  }
}

export function probe(probeUrl: string): Promise<PingStatus> {
  return new Promise((resolve) => {
    const cached = cache.get(probeUrl)
    if (cached && Date.now() - cached.ts < TTL) {
      resolve(cached.status)
      return
    }
    const img = new Image()
    let done = false
    const finish = (status: PingStatus) => {
      if (done) return
      done = true
      img.onload = img.onerror = null
      cache.set(probeUrl, { status, ts: Date.now() })
      resolve(status)
    }
    const timer = setTimeout(() => finish('offline'), TIMEOUT)
    img.onload = () => { clearTimeout(timer); finish('online') }
    img.onerror = () => { clearTimeout(timer); finish('offline') }
    const sep = probeUrl.includes('?') ? '&' : '?'
    img.src = `${probeUrl}${sep}_=${Date.now()}`
  })
}

export function clearPingCache() {
  cache.clear()
}
