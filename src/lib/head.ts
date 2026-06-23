import { iconSrc } from './iconSrc'

export function setDocumentTitle(title: string) {
  if (title) document.title = title
}

export function setFaviconHref(href: string) {
  const resolved = iconSrc(href)
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  if (link.href !== resolved) link.href = resolved
}
