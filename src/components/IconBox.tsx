import { useEffect, useMemo, useState } from 'react'
import {
  adaptSvgToCurrentColor,
  iconSrc,
  isMonochromeSvg,
  isSvgMarkup,
  sanitizeSvg,
} from '../lib/iconSrc'

export function IconBox({
  src,
  fallback,
  className = 'w-5 h-5',
}: {
  src: string
  fallback: string
  className?: string
}) {
  const [error, setError] = useState(false)
  useEffect(() => setError(false), [src])

  // Compute inline-SVG markup for monochrome SVGs so they inherit theme color.
  const inlineSvg = useMemo(() => {
    const trimmed = src.trim()
    if (!trimmed || !isSvgMarkup(trimmed)) return null
    if (!isMonochromeSvg(trimmed)) return null
    return sanitizeSvg(adaptSvgToCurrentColor(trimmed))
  }, [src])

  if (inlineSvg) {
    return (
      <div
        className={`${className} text-zinc-800 dark:text-zinc-200 [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: inlineSvg }}
      />
    )
  }

  if (!src || error) {
    return (
      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{fallback}</span>
    )
  }

  return (
    <img
      src={iconSrc(src)}
      alt=""
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
