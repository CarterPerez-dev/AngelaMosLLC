// ===================
// © AngelaMos | 2026
// use-zoom-level.ts
// ===================

import { useMemo } from 'react'
import { useCanvasScale } from '@/core/lib'
import { ZOOM_THRESHOLDS } from '../canvas.config'
import type { ZoomLevel } from '../canvas.types'

export function getZoomLevel(scale: number): ZoomLevel {
  if (scale < ZOOM_THRESHOLDS.ECOSYSTEM_MAX) return 'ecosystem'
  if (scale < ZOOM_THRESHOLDS.CATEGORY_MAX) return 'category'
  return 'product'
}

export function useZoomLevel(): ZoomLevel {
  const scale = useCanvasScale()
  return useMemo(() => getZoomLevel(scale), [scale])
}
