// ===================
// © AngelaMos | 2026
// product-node.tsx
// ===================

import { useCallback } from 'react'
import { useCanvasStore } from '@/core/lib'
import { ZOOM_LIMITS } from '../canvas.config'
import type { CanvasProduct, ZoomLevel } from '../canvas.types'
import styles from './product-node.module.scss'

interface ProductNodeProps {
  product: CanvasProduct
  zoomLevel: ZoomLevel
  index: number
}

export function ProductNode({ product, zoomLevel, index }: ProductNodeProps): React.ReactElement {
  const focusedIndex = useCanvasStore((s) => s.focusedNodeIndex)
  const isFocused = focusedIndex === index

  const handleClick = useCallback(() => {
    const state = useCanvasStore.getState()
    const container = document.querySelector('[role="application"]')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const targetScale = ZOOM_LIMITS.MAX * 0.6
    const centerX = rect.width / 2 - product.x * targetScale
    const centerY = rect.height / 2 - product.y * targetScale

    state.setTransform(targetScale, centerX, centerY)
    state.setActiveProduct(product.slug)
    state.setFocusedNodeIndex(index)
  }, [product.x, product.y, product.slug, index])

  return (
    <div
      className={`${styles.node} ${styles[zoomLevel]} ${isFocused ? styles.focused : ''}`}
      style={{ left: product.x, top: product.y }}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
      role="button"
      tabIndex={0}
      aria-label={`${product.name} — ${product.tagline}`}
      data-slug={product.slug}
      data-category={product.category}
    >
      <div className={styles.dot}>
        {product.icon_url ? (
          <img
            src={product.icon_url}
            alt=""
            className={styles.icon}
            width={20}
            height={20}
          />
        ) : (
          <span className={styles.initial}>{product.name[0]}</span>
        )}
      </div>

      {zoomLevel !== 'ecosystem' && (
        <div className={styles.info}>
          <span className={styles.name}>{product.name}</span>
          {zoomLevel === 'category' && (
            <span className={styles.tagline}>{product.tagline}</span>
          )}
        </div>
      )}
    </div>
  )
}
