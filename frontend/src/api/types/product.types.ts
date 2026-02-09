// ===================
// © AngelaMos | 2026
// product.types.ts
// ===================

import { z } from 'zod'

export const productFeatureResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  product_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  display_order: z.number(),
})

export const productMediaResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  product_id: z.string().uuid(),
  url: z.string(),
  media_type: z.string(),
  alt_text: z.string().nullable(),
  caption: z.string().nullable(),
  display_order: z.number(),
})

export const productSummaryResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  name: z.string(),
  slug: z.string(),
  tagline: z.string(),
  category: z.string(),
  status: z.string(),
  icon_url: z.string().nullable(),
  github_url: z.string().nullable(),
  is_featured: z.boolean(),
  is_open_source: z.boolean(),
  display_order: z.number(),
  stats: z.record(z.string(), z.unknown()).nullable(),
})

export const productDetailResponseSchema = productSummaryResponseSchema.extend({
  description: z.string(),
  install_command: z.string().nullable(),
  demo_url: z.string().nullable(),
  links: z.array(z.record(z.string(), z.unknown())).nullable(),
  extra: z.record(z.string(), z.unknown()).nullable(),
  features: z.array(productFeatureResponseSchema),
  media: z.array(productMediaResponseSchema),
})

export const productListResponseSchema = z.object({
  items: z.array(productSummaryResponseSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
})

export const productCreateRequestSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  tagline: z.string().min(1).max(500),
  description: z.string().min(1).max(10000),
  category: z.string().min(1).max(50),
  status: z.string().max(50).optional(),
  icon_url: z.string().max(2048).nullable().optional(),
  github_url: z.string().max(2048).nullable().optional(),
  install_command: z.string().max(1000).nullable().optional(),
  demo_url: z.string().max(2048).nullable().optional(),
  is_featured: z.boolean().optional(),
  is_open_source: z.boolean().optional(),
  display_order: z.number().min(0).optional(),
  stats: z.record(z.string(), z.unknown()).nullable().optional(),
  links: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
  extra: z.record(z.string(), z.unknown()).nullable().optional(),
})

export const productUpdateRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  tagline: z.string().min(1).max(500).optional(),
  description: z.string().min(1).max(10000).optional(),
  category: z.string().min(1).max(50).optional(),
  status: z.string().max(50).optional(),
  icon_url: z.string().max(2048).nullable().optional(),
  github_url: z.string().max(2048).nullable().optional(),
  install_command: z.string().max(1000).nullable().optional(),
  demo_url: z.string().max(2048).nullable().optional(),
  is_featured: z.boolean().optional(),
  is_open_source: z.boolean().optional(),
  display_order: z.number().min(0).optional(),
  stats: z.record(z.string(), z.unknown()).nullable().optional(),
  links: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
  extra: z.record(z.string(), z.unknown()).nullable().optional(),
})

export const productFeatureCreateRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  display_order: z.number().min(0).optional(),
})

export const productFeatureUpdateRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  display_order: z.number().min(0).optional(),
})

export const productMediaCreateRequestSchema = z.object({
  url: z.string().min(1).max(2048),
  media_type: z.string().min(1).max(50),
  alt_text: z.string().max(500).nullable().optional(),
  caption: z.string().max(1000).nullable().optional(),
  display_order: z.number().min(0).optional(),
})

export const productMediaUpdateRequestSchema = z.object({
  url: z.string().min(1).max(2048).optional(),
  media_type: z.string().min(1).max(50).optional(),
  alt_text: z.string().max(500).nullable().optional(),
  caption: z.string().max(1000).nullable().optional(),
  display_order: z.number().min(0).optional(),
})

export type ProductFeatureResponse = z.infer<typeof productFeatureResponseSchema>
export type ProductMediaResponse = z.infer<typeof productMediaResponseSchema>
export type ProductSummaryResponse = z.infer<typeof productSummaryResponseSchema>
export type ProductDetailResponse = z.infer<typeof productDetailResponseSchema>
export type ProductListResponse = z.infer<typeof productListResponseSchema>
export type ProductCreateRequest = z.infer<typeof productCreateRequestSchema>
export type ProductUpdateRequest = z.infer<typeof productUpdateRequestSchema>
export type ProductFeatureCreateRequest = z.infer<typeof productFeatureCreateRequestSchema>
export type ProductFeatureUpdateRequest = z.infer<typeof productFeatureUpdateRequestSchema>
export type ProductMediaCreateRequest = z.infer<typeof productMediaCreateRequestSchema>
export type ProductMediaUpdateRequest = z.infer<typeof productMediaUpdateRequestSchema>

export const isValidProductListResponse = (
  data: unknown
): data is ProductListResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = productListResponseSchema.safeParse(data)
  return result.success
}

export const isValidProductDetailResponse = (
  data: unknown
): data is ProductDetailResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = productDetailResponseSchema.safeParse(data)
  return result.success
}

export const isValidProductSummaryResponse = (
  data: unknown
): data is ProductSummaryResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = productSummaryResponseSchema.safeParse(data)
  return result.success
}

export const isValidProductFeatureResponse = (
  data: unknown
): data is ProductFeatureResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = productFeatureResponseSchema.safeParse(data)
  return result.success
}

export const isValidProductMediaResponse = (
  data: unknown
): data is ProductMediaResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = productMediaResponseSchema.safeParse(data)
  return result.success
}

export class ProductResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'ProductResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, ProductResponseError.prototype)
  }
}

export const PRODUCT_ERROR_MESSAGES = {
  INVALID_PRODUCT_RESPONSE: 'Invalid product data from server',
  INVALID_PRODUCT_LIST_RESPONSE: 'Invalid product list from server',
  INVALID_FEATURE_RESPONSE: 'Invalid feature data from server',
  INVALID_MEDIA_RESPONSE: 'Invalid media data from server',
  PRODUCT_NOT_FOUND: 'Product not found',
  SLUG_ALREADY_EXISTS: 'A product with this slug already exists',
  FAILED_TO_CREATE: 'Failed to create product',
  FAILED_TO_UPDATE: 'Failed to update product',
  FAILED_TO_DELETE: 'Failed to delete product',
  FAILED_TO_CREATE_FEATURE: 'Failed to add feature',
  FAILED_TO_UPDATE_FEATURE: 'Failed to update feature',
  FAILED_TO_DELETE_FEATURE: 'Failed to delete feature',
  FAILED_TO_CREATE_MEDIA: 'Failed to add media',
  FAILED_TO_UPDATE_MEDIA: 'Failed to update media',
  FAILED_TO_DELETE_MEDIA: 'Failed to delete media',
} as const

export const PRODUCT_SUCCESS_MESSAGES = {
  CREATED: 'Product created successfully',
  UPDATED: 'Product updated successfully',
  DELETED: 'Product deleted successfully',
  FEATURE_CREATED: 'Feature added successfully',
  FEATURE_UPDATED: 'Feature updated successfully',
  FEATURE_DELETED: 'Feature deleted successfully',
  MEDIA_CREATED: 'Media added successfully',
  MEDIA_UPDATED: 'Media updated successfully',
  MEDIA_DELETED: 'Media deleted successfully',
} as const

export type ProductErrorMessage =
  (typeof PRODUCT_ERROR_MESSAGES)[keyof typeof PRODUCT_ERROR_MESSAGES]
export type ProductSuccessMessage =
  (typeof PRODUCT_SUCCESS_MESSAGES)[keyof typeof PRODUCT_SUCCESS_MESSAGES]
