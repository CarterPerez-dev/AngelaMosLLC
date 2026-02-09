// ===================
// © AngelaMos | 2026
// canvas-layout.config.ts
// ===================

import type { CanvasNodePosition, CategoryCluster, ConnectionLine } from './canvas.types'

export const PRODUCT_POSITIONS: CanvasNodePosition[] = [
  { slug: 'angela', x: 1200, y: 800, category: 'cli' },
  { slug: 'ai-assistant', x: 1600, y: 640, category: 'cli' },
  { slug: 'trash-gui', x: 1040, y: 1120, category: 'cli' },
  { slug: 'docker-management', x: 1520, y: 1040, category: 'cli' },
  { slug: 'code-documentation-agent', x: 1840, y: 880, category: 'cli' },

  { slug: 'cert-games', x: 3200, y: 720, category: 'web' },
  { slug: 'viewmanics', x: 3600, y: 960, category: 'web' },

  { slug: 'fastapi-cache', x: 2400, y: 2000, category: 'library' },
  { slug: 'stripe-referral', x: 2880, y: 1840, category: 'library' },

  { slug: 'fullstack-go-template', x: 4400, y: 1760, category: 'template' },
  { slug: 'fullstack-fastapi-template', x: 4800, y: 2000, category: 'template' },
] as const

export const CATEGORY_CLUSTERS: CategoryCluster[] = [
  { id: 'cli', label: 'CLI Tools', centerX: 1440, centerY: 896 },
  { id: 'web', label: 'Web Applications', centerX: 3400, centerY: 840 },
  { id: 'library', label: 'Libraries', centerX: 2640, centerY: 1920 },
  { id: 'template', label: 'Templates', centerX: 4600, centerY: 1880 },
] as const

export const CONNECTION_LINES: ConnectionLine[] = [
  { from: 'stripe-referral', to: 'cert-games' },
  { from: 'fastapi-cache', to: 'fullstack-fastapi-template' },
  { from: 'angela', to: 'code-documentation-agent' },
  { from: 'fullstack-fastapi-template', to: 'cert-games' },
  { from: 'fullstack-fastapi-template', to: 'viewmanics' },
] as const
