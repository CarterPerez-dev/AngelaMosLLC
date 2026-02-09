// ===================
// © AngelaMos | 2026
// useAdminProducts.ts
// ===================

import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type ProductCreateRequest,
  type ProductDetailResponse,
  type ProductFeatureCreateRequest,
  type ProductFeatureResponse,
  type ProductFeatureUpdateRequest,
  type ProductListResponse,
  type ProductMediaCreateRequest,
  type ProductMediaResponse,
  type ProductMediaUpdateRequest,
  type ProductUpdateRequest,
  isValidProductDetailResponse,
  isValidProductFeatureResponse,
  isValidProductListResponse,
  isValidProductMediaResponse,
  PRODUCT_ERROR_MESSAGES,
  PRODUCT_SUCCESS_MESSAGES,
  ProductResponseError,
} from '@/api/types'
import { API_ENDPOINTS, PAGINATION, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { productQueries } from './useProducts'

export const adminProductQueries = {
  all: () => QUERY_KEYS.ADMIN.PRODUCTS.ALL(),
  list: (page: number, size: number) =>
    QUERY_KEYS.ADMIN.PRODUCTS.LIST(page, size),
  byId: (id: string) => QUERY_KEYS.ADMIN.PRODUCTS.BY_ID(id),
} as const

interface UseAdminProductsParams {
  page?: number
  size?: number
}

const fetchAdminProducts = async (
  page: number,
  size: number
): Promise<ProductListResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.LIST,
    { params: { page, size } }
  )
  const data: unknown = response.data

  if (!isValidProductListResponse(data)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_LIST_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.LIST
    )
  }

  return data
}

export const useAdminProducts = (
  params: UseAdminProductsParams = {}
): UseQueryResult<ProductListResponse, Error> => {
  const page = params.page ?? PAGINATION.DEFAULT_PAGE
  const size = params.size ?? PAGINATION.DEFAULT_SIZE

  return useQuery({
    queryKey: adminProductQueries.list(page, size),
    queryFn: () => fetchAdminProducts(page, size),
    ...QUERY_STRATEGIES.standard,
  })
}

const fetchAdminProductById = async (
  id: string
): Promise<ProductDetailResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id)
  )
  const data: unknown = response.data

  if (!isValidProductDetailResponse(data)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.BY_ID(id)
    )
  }

  return data
}

export const useAdminProduct = (
  id: string
): UseQueryResult<ProductDetailResponse, Error> => {
  return useQuery({
    queryKey: adminProductQueries.byId(id),
    queryFn: () => fetchAdminProductById(id),
    enabled: id.length > 0,
    ...QUERY_STRATEGIES.standard,
  })
}

const performCreateProduct = async (
  data: ProductCreateRequest
): Promise<ProductDetailResponse> => {
  const response = await apiClient.post<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.CREATE,
    data
  )
  const responseData: unknown = response.data

  if (!isValidProductDetailResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.CREATE
    )
  }

  return responseData
}

export const useAdminCreateProduct = (): UseMutationResult<
  ProductDetailResponse,
  Error,
  ProductCreateRequest
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performCreateProduct,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.CREATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_CREATE
      toast.error(message)
    },
  })
}

interface AdminUpdateProductParams {
  id: string
  data: ProductUpdateRequest
}

const performUpdateProduct = async (
  params: AdminUpdateProductParams
): Promise<ProductDetailResponse> => {
  const response = await apiClient.patch<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(params.id),
    params.data
  )
  const responseData: unknown = response.data

  if (!isValidProductDetailResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_PRODUCT_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(params.id)
    )
  }

  return responseData
}

export const useAdminUpdateProduct = (): UseMutationResult<
  ProductDetailResponse,
  Error,
  AdminUpdateProductParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performUpdateProduct,
    onSuccess: async (
      data: ProductDetailResponse,
      variables: AdminUpdateProductParams
    ): Promise<void> => {
      queryClient.setQueryData(adminProductQueries.byId(variables.id), data)

      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.UPDATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_UPDATE
      toast.error(message)
    },
  })
}

const performDeleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(id))
}

export const useAdminDeleteProduct = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performDeleteProduct,
    onSuccess: async (_, id: string): Promise<void> => {
      queryClient.removeQueries({ queryKey: adminProductQueries.byId(id) })

      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.DELETED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_DELETE
      toast.error(message)
    },
  })
}

interface AdminAddFeatureParams {
  productId: string
  data: ProductFeatureCreateRequest
}

const performAddFeature = async (
  params: AdminAddFeatureParams
): Promise<ProductFeatureResponse> => {
  const response = await apiClient.post<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.FEATURES.CREATE(params.productId),
    params.data
  )
  const responseData: unknown = response.data

  if (!isValidProductFeatureResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_FEATURE_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.FEATURES.CREATE(params.productId)
    )
  }

  return responseData
}

export const useAdminAddFeature = (): UseMutationResult<
  ProductFeatureResponse,
  Error,
  AdminAddFeatureParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performAddFeature,
    onSuccess: async (
      _: ProductFeatureResponse,
      variables: AdminAddFeatureParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.FEATURE_CREATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_CREATE_FEATURE
      toast.error(message)
    },
  })
}

interface AdminUpdateFeatureParams {
  productId: string
  featureId: string
  data: ProductFeatureUpdateRequest
}

const performUpdateFeature = async (
  params: AdminUpdateFeatureParams
): Promise<ProductFeatureResponse> => {
  const response = await apiClient.patch<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.FEATURES.UPDATE(
      params.productId,
      params.featureId
    ),
    params.data
  )
  const responseData: unknown = response.data

  if (!isValidProductFeatureResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_FEATURE_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.FEATURES.UPDATE(
        params.productId,
        params.featureId
      )
    )
  }

  return responseData
}

export const useAdminUpdateFeature = (): UseMutationResult<
  ProductFeatureResponse,
  Error,
  AdminUpdateFeatureParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performUpdateFeature,
    onSuccess: async (
      _: ProductFeatureResponse,
      variables: AdminUpdateFeatureParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.FEATURE_UPDATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_UPDATE_FEATURE
      toast.error(message)
    },
  })
}

interface AdminDeleteFeatureParams {
  productId: string
  featureId: string
}

const performDeleteFeature = async (
  params: AdminDeleteFeatureParams
): Promise<void> => {
  await apiClient.delete(
    API_ENDPOINTS.ADMIN.PRODUCTS.FEATURES.DELETE(
      params.productId,
      params.featureId
    )
  )
}

export const useAdminDeleteFeature = (): UseMutationResult<
  void,
  Error,
  AdminDeleteFeatureParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performDeleteFeature,
    onSuccess: async (
      _: void,
      variables: AdminDeleteFeatureParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.FEATURE_DELETED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_DELETE_FEATURE
      toast.error(message)
    },
  })
}

interface AdminAddMediaParams {
  productId: string
  data: ProductMediaCreateRequest
}

const performAddMedia = async (
  params: AdminAddMediaParams
): Promise<ProductMediaResponse> => {
  const response = await apiClient.post<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.MEDIA.CREATE(params.productId),
    params.data
  )
  const responseData: unknown = response.data

  if (!isValidProductMediaResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_MEDIA_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.MEDIA.CREATE(params.productId)
    )
  }

  return responseData
}

export const useAdminAddMedia = (): UseMutationResult<
  ProductMediaResponse,
  Error,
  AdminAddMediaParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performAddMedia,
    onSuccess: async (
      _: ProductMediaResponse,
      variables: AdminAddMediaParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.MEDIA_CREATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_CREATE_MEDIA
      toast.error(message)
    },
  })
}

interface AdminUpdateMediaParams {
  productId: string
  mediaId: string
  data: ProductMediaUpdateRequest
}

const performUpdateMedia = async (
  params: AdminUpdateMediaParams
): Promise<ProductMediaResponse> => {
  const response = await apiClient.patch<unknown>(
    API_ENDPOINTS.ADMIN.PRODUCTS.MEDIA.UPDATE(
      params.productId,
      params.mediaId
    ),
    params.data
  )
  const responseData: unknown = response.data

  if (!isValidProductMediaResponse(responseData)) {
    throw new ProductResponseError(
      PRODUCT_ERROR_MESSAGES.INVALID_MEDIA_RESPONSE,
      API_ENDPOINTS.ADMIN.PRODUCTS.MEDIA.UPDATE(
        params.productId,
        params.mediaId
      )
    )
  }

  return responseData
}

export const useAdminUpdateMedia = (): UseMutationResult<
  ProductMediaResponse,
  Error,
  AdminUpdateMediaParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performUpdateMedia,
    onSuccess: async (
      _: ProductMediaResponse,
      variables: AdminUpdateMediaParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.MEDIA_UPDATED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_UPDATE_MEDIA
      toast.error(message)
    },
  })
}

interface AdminDeleteMediaParams {
  productId: string
  mediaId: string
}

const performDeleteMedia = async (
  params: AdminDeleteMediaParams
): Promise<void> => {
  await apiClient.delete(
    API_ENDPOINTS.ADMIN.PRODUCTS.MEDIA.DELETE(
      params.productId,
      params.mediaId
    )
  )
}

export const useAdminDeleteMedia = (): UseMutationResult<
  void,
  Error,
  AdminDeleteMediaParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: performDeleteMedia,
    onSuccess: async (
      _: void,
      variables: AdminDeleteMediaParams
    ): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: adminProductQueries.byId(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productQueries.all(),
      })

      toast.success(PRODUCT_SUCCESS_MESSAGES.MEDIA_DELETED)
    },
    onError: (error: Error): void => {
      const message =
        error instanceof ProductResponseError
          ? error.message
          : PRODUCT_ERROR_MESSAGES.FAILED_TO_DELETE_MEDIA
      toast.error(message)
    },
  })
}
