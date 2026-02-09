// ===================
// © AngelaMos | 2026
// canvas.config.ts
// ===================

export const ZOOM_THRESHOLDS = {
  ECOSYSTEM_MAX: 0.4,
  CATEGORY_MAX: 0.8,
} as const

export const ZOOM_LIMITS = {
  MIN: 0.15,
  MAX: 2.0,
} as const

export const ZOOM_STEP = {
  WHEEL: 0.08,
  BUTTON: 0.2,
  KEYBOARD: 0.2,
} as const

export const PAN_STEP = {
  KEYBOARD: 80,
} as const

export const CANVAS_DEFAULTS = {
  INITIAL_SCALE: 0.35,
  INITIAL_X: 0,
  INITIAL_Y: 0,
  WORLD_SIZE: 8000,
} as const

export const CANVAS_TIMING = {
  TRANSFORM_DURATION: 200,
  FLY_TO_DURATION: 300,
} as const
