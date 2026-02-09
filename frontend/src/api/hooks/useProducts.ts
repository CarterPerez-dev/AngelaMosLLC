// ===================
// © AngelaMos | 2026
// useProducts.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  type ProductDetailResponse,
  type ProductListResponse,
  type ProductSummaryResponse,
  isValidProductDetailResponse,
  isValidProductListResponse,
  PRODUCT_ERROR_MESSAGES,
  ProductResponseError,
} from '@/api/types'
import { API_ENDPOINTS, PAGINATION, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'

export const productQueries = {
  all: () => QUERY_KEYS.PRODUCTS.ALL,
  list: (page: number, size: number) => QUERY_KEYS.PRODUCTS.LIST(page, size),
  featured: () => QUERY_KEYS.PRODUCTS.FEATURED(),
  bySlug: (slug: string) => QUERY_KEYS.PRODUCTS.BY_SLUG(slug),
} as const

interface UseProductsParams {
  page?: number
  size?: number
}

const fetchProducts = async (
  page: number,
  size: number
): Promise<ProductListResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PRODUCTS.LIST, {
    params: { page, size },
  })
  const data: unknown = response.data

  if (!isValidProductListResponse(data)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_LIST_RESPONSE,
      API_ENDPOINTS.PRODUCTS.LIST
    )
  }

  return data
}

export const useProducts = (
  params: UseProductsParams = {}
): UseQueryResult<ProductListResponse, Error> => {
  const page = params.page ?? PAGINATION.DEFAULT_PAGE
  const size = params.size ?? PAGINATION.DEFAULT_SIZE

  return useQuery({
    queryKey: productQueries.list(page, size),
    queryFn: () => fetchProducts(page, size),
    ...QUERY_STRATEGIES.standard,
  })
}

const fetchFeaturedProducts = async (): Promise<ProductSummaryResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PRODUCTS.FEATURED)
  const data: unknown = response.data

  if (!Array.isArray(data)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_LIST_RESPONSE,
      API_ENDPOINTS.PRODUCTS.FEATURED
    )
  }

  return data as ProductSummaryResponse[]
}

export const useFeaturedProducts = (): UseQueryResult<
  ProductSummaryResponse[],
  Error
> => {
  return useQuery({
    queryKey: productQueries.featured(),
    queryFn: fetchFeaturedProducts,
    ...QUERY_STRATEGIES.static,
  })
}

const fetchProductBySlug = async (
  slug: string
): Promise<ProductDetailResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)
  )
  const data: unknown = response.data

  if (!isValidProductDetailResponse(data)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_RESPONSE,
      API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)
    )
  }

  return data
}

export const useProduct = (
  slug: string
): UseQueryResult<ProductDetailResponse, Error> => {
  return useQuery({
    queryKey: productQueries.bySlug(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: slug.length > 0,
    ...QUERY_STRATEGIES.standard,
  })
}
