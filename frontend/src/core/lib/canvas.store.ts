// ===================
// © AngelaMos | 2026
// canvas.store.ts
// ===================

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CANVAS_DEFAULTS } from '@/features/canvas/canvas.config'

interface CanvasState {
  scale: number
  positionX: number
  positionY: number
  activeProductSlug: string | null
  focusedNodeIndex: number
  isNavigatingByKeyboard: boolean
}

interface CanvasActions {
  setTransform: (scale: number, x: number, y: number) => void
  setScale: (scale: number) => void
  setPosition: (x: number, y: number) => void
  setActiveProduct: (slug: string | null) => void
  setFocusedNodeIndex: (index: number) => void
  setIsNavigatingByKeyboard: (value: boolean) => void
  resetCanvas: () => void
}

type CanvasStore = CanvasState & CanvasActions

const initialState: CanvasState = {
  scale: CANVAS_DEFAULTS.INITIAL_SCALE,
  positionX: CANVAS_DEFAULTS.INITIAL_X,
  positionY: CANVAS_DEFAULTS.INITIAL_Y,
  activeProductSlug: null,
  focusedNodeIndex: -1,
  isNavigatingByKeyboard: false,
}

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setTransform: (scale, x, y) =>
        set({ scale, positionX: x, positionY: y }, false, 'canvas/setTransform'),

      setScale: (scale) =>
        set({ scale }, false, 'canvas/setScale'),

      setPosition: (x, y) =>
        set({ positionX: x, positionY: y }, false, 'canvas/setPosition'),

      setActiveProduct: (slug) =>
        set({ activeProductSlug: slug }, false, 'canvas/setActiveProduct'),

      setFocusedNodeIndex: (index) =>
        set({ focusedNodeIndex: index }, false, 'canvas/setFocusedNodeIndex'),

      setIsNavigatingByKeyboard: (value) =>
        set({ isNavigatingByKeyboard: value }, false, 'canvas/setKeyboardNav'),

      resetCanvas: () =>
        set(initialState, false, 'canvas/reset'),
    }),
    { name: 'CanvasStore' }
  )
)

export const useCanvasScale = (): number =>
  useCanvasStore((s) => s.scale)

export const useCanvasPosition = (): { x: number; y: number } =>
  useCanvasStore((s) => ({ x: s.positionX, y: s.positionY }))

export const useActiveProductSlug = (): string | null =>
  useCanvasStore((s) => s.activeProductSlug)

export const useFocusedNodeIndex = (): number =>
  useCanvasStore((s) => s.focusedNodeIndex)

export const useIsNavigatingByKeyboard = (): boolean =>
  useCanvasStore((s) => s.isNavigatingByKeyboard)
