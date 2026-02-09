// ===================
// © AngelaMos | 2026
// index.tsx
// ===================

import { useMemo } from 'react'
import { useProducts } from '@/api/hooks'
import {
  CanvasContainer,
  ProductNode,
  PRODUCT_POSITIONS,
  useZoomLevel,
  type CanvasProduct,
} from '@/features/canvas'
import styles from './canvas-page.module.scss'

function CanvasContent({ products }: { products: CanvasProduct[] }): React.ReactElement {
  const zoomLevel = useZoomLevel()

  return (
    <CanvasContainer>
      {products.map((product, index) => (
        <ProductNode
          key={product.slug}
          product={product}
          zoomLevel={zoomLevel}
          index={index}
        />
      ))}
    </CanvasContainer>
  )
}

export function Component(): React.ReactElement {
  const { data, isLoading, error } = useProducts({ page: 1, size: 100 })

  const canvasProducts = useMemo<CanvasProduct[]>(() => {
    if (!data?.items) return []
    return data.items
      .map((item) => {
        const position = PRODUCT_POSITIONS.find((p) => p.slug === item.slug)
        if (!position) return null
        return { ...item, ...position }
      })
      .filter((p): p is CanvasProduct => p !== null)
  }, [data?.items])

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>Failed to load products</div>
  }

  return (
    <div className={styles.page}>
      <CanvasContent products={canvasProducts} />
    </div>
  )
}

Component.displayName = 'Canvas'
