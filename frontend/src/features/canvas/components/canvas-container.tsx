// ===================
// © AngelaMos | 2026
// canvas-container.tsx
// ===================

import { type ReactNode, useRef } from 'react'
import { useCanvasGestures } from '../hooks'
import { CanvasWorld } from './canvas-world'
import styles from './canvas-container.module.scss'

interface CanvasContainerProps {
  children: ReactNode
}

export function CanvasContainer({ children }: CanvasContainerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  useCanvasGestures(containerRef)

  return (
    <div
      ref={containerRef}
      className={styles.container}
      role="application"
      aria-label="Interactive product canvas. Use arrow keys to pan, plus and minus to zoom."
      aria-roledescription="canvas"
      tabIndex={0}
    >
      <CanvasWorld>{children}</CanvasWorld>
    </div>
  )
}
