// ===================
// © AngelaMos | 2026
// use-canvas-gestures.ts
// ===================

import { useCallback, useEffect, useRef } from 'react'
import { useCanvasStore } from '@/core/lib'
import { ZOOM_LIMITS, ZOOM_STEP, PAN_STEP } from '../canvas.config'

interface GestureState {
  isPanning: boolean
  startX: number
  startY: number
  lastPanX: number
  lastPanY: number
}

function clampScale(scale: number): number {
  return Math.min(ZOOM_LIMITS.MAX, Math.max(ZOOM_LIMITS.MIN, scale))
}

export function useCanvasGestures(
  containerRef: React.RefObject<HTMLDivElement | null>
): void {
  const gestureRef = useRef<GestureState>({
    isPanning: false,
    startX: 0,
    startY: 0,
    lastPanX: 0,
    lastPanY: 0,
  })

  const store = useCanvasStore

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const state = store.getState()
    const delta = e.deltaY > 0 ? -ZOOM_STEP.WHEEL : ZOOM_STEP.WHEEL
    const newScale = clampScale(state.scale + delta)

    if (newScale === state.scale) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    const scaleRatio = newScale / state.scale
    const newX = cursorX - (cursorX - state.positionX) * scaleRatio
    const newY = cursorY - (cursorY - state.positionY) * scaleRatio

    state.setTransform(newScale, newX, newY)
  }, [containerRef, store])

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== 0) return
    const state = store.getState()
    const gesture = gestureRef.current
    gesture.isPanning = true
    gesture.startX = e.clientX
    gesture.startY = e.clientY
    gesture.lastPanX = state.positionX
    gesture.lastPanY = state.positionY

    const container = containerRef.current
    if (container) {
      container.setPointerCapture(e.pointerId)
      container.style.cursor = 'grabbing'
    }
  }, [containerRef, store])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const gesture = gestureRef.current
    if (!gesture.isPanning) return

    const dx = e.clientX - gesture.startX
    const dy = e.clientY - gesture.startY
    const state = store.getState()

    state.setPosition(gesture.lastPanX + dx, gesture.lastPanY + dy)
  }, [store])

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const gesture = gestureRef.current
    gesture.isPanning = false

    const container = containerRef.current
    if (container) {
      container.releasePointerCapture(e.pointerId)
      container.style.cursor = 'grab'
    }
  }, [containerRef])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const state = store.getState()
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        state.setPosition(state.positionX, state.positionY + PAN_STEP.KEYBOARD)
        break
      case 'ArrowDown':
        e.preventDefault()
        state.setPosition(state.positionX, state.positionY - PAN_STEP.KEYBOARD)
        break
      case 'ArrowLeft':
        e.preventDefault()
        state.setPosition(state.positionX + PAN_STEP.KEYBOARD, state.positionY)
        break
      case 'ArrowRight':
        e.preventDefault()
        state.setPosition(state.positionX - PAN_STEP.KEYBOARD, state.positionY)
        break
      case '+':
      case '=': {
        e.preventDefault()
        const upScale = clampScale(state.scale + ZOOM_STEP.KEYBOARD)
        state.setScale(upScale)
        break
      }
      case '-': {
        e.preventDefault()
        const downScale = clampScale(state.scale - ZOOM_STEP.KEYBOARD)
        state.setScale(downScale)
        break
      }
      case '0': {
        e.preventDefault()
        state.resetCanvas()
        break
      }
    }
  }, [store])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.style.cursor = 'grab'

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown])
}
