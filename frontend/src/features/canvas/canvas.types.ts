// ===================
// © AngelaMos | 2026
// canvas.types.ts
// ===================

import type { ProductSummaryResponse } from '@/api/types'

export type ZoomLevel = 'ecosystem' | 'category' | 'product'

export interface CanvasNodePosition {
  slug: string
  x: number
  y: number
  category: string
}

export interface CategoryCluster {
  id: string
  label: string
  centerX: number
  centerY: number
}

export interface ConnectionLine {
  from: string
  to: string
}

export type CanvasProduct = ProductSummaryResponse & CanvasNodePosition
