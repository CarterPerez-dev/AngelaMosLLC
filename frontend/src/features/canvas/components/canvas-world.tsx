// ===================
// © AngelaMos | 2026
// canvas-world.tsx
// ===================

import type { ReactNode } from 'react'
import { useCanvasStore } from '@/core/lib'
import styles from './canvas-world.module.scss'

interface CanvasWorldProps {
  children: ReactNode
}

export function CanvasWorld({ children }: CanvasWorldProps): React.ReactElement {
  const scale = useCanvasStore((s) => s.scale)
  const positionX = useCanvasStore((s) => s.positionX)
  const positionY = useCanvasStore((s) => s.positionY)

  const transform = `translate(${positionX}px, ${positionY}px) scale(${scale})`

  return (
    <div
      className={styles.world}
      style={{ transform }}
      role="group"
      aria-label="Product ecosystem canvas"
    >
      {children}
    </div>
  )
}
