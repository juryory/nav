// Accepts either a URL (http(s)://, data:, /path, ./path) or raw SVG markup.
//
// For SVG markup we:
//  - Detect if it's monochrome (all fill/stroke are grayscale or "none")
//  - If so, rewrite grayscale colors to `currentColor` so callers can drive
//    the icon color via CSS — that's how dark-mode adaptation works.
//  - Always strip <script> and on*= event handlers as a basic XSS defense
//    (we render monochrome SVGs inline via dangerouslySetInnerHTML, so we
//    can't rely on the <img> sandbox).
//
// For URLs (or non-monochrome SVGs converted to data: URLs) we just hand the
// string back; callers render it via <img>.

export function isSvgMarkup(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.startsWith('<') && trimmed.includes('<svg')
}

function isGrayscale(color: string): boolean {
  const c = color.trim().toLowerCase()
  if (c === 'none' || c === 'currentcolor' || c === 'transparent' || c === 'inherit') return true
  if (['black', 'white', 'gray', 'grey', 'silver', 'dimgray', 'dimgrey'].includes(c)) return true
  const hex = c.startsWith('#') ? c.slice(1) : null
  if (!hex) return false
  let r: number, g: number, b: number
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  } else {
    return false
  }
  if ([r, g, b].some(Number.isNaN)) return false
  return Math.max(r, g, b) - Math.min(r, g, b) < 16
}

const COLOR_ATTR_RE = /\b(fill|stroke|color|stop-color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\2/gi

export function isMonochromeSvg(svg: string): boolean {
  const matches = [...svg.matchAll(COLOR_ATTR_RE)]
  if (matches.length === 0) return false
  for (const m of matches) {
    if (!isGrayscale(m[3])) return false
  }
  return true
}

export function adaptSvgToCurrentColor(svg: string): string {
  return svg.replace(COLOR_ATTR_RE, (full, attr: string, q: string, color: string) => {
    const lower = color.trim().toLowerCase()
    if (lower === 'none' || lower === 'currentcolor' || lower === 'transparent' || lower === 'inherit') {
      return full
    }
    if (isGrayscale(color)) return `${attr}=${q}currentColor${q}`
    return full
  })
}

export function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
}

export function iconSrc(value: string): string {
  const trimmed = value.trim()
  if (isSvgMarkup(trimmed)) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`
  }
  return value
}
