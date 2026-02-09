// ===================
// © AngelaMos | 2026
// config.ts
// ===================
const API_VERSION = 'v1'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/${API_VERSION}/auth/login`,
    REFRESH: `/${API_VERSION}/auth/refresh`,
    LOGOUT: `/${API_VERSION}/auth/logout`,
    LOGOUT_ALL: `/${API_VERSION}/auth/logout-all`,
    ME: `/${API_VERSION}/auth/me`,
    CHANGE_PASSWORD: `/${API_VERSION}/auth/change-password`,
  },
  USERS: {
    BASE: `/${API_VERSION}/users`,
    BY_ID: (id: string) => `/${API_VERSION}/users/${id}`,
    ME: `/${API_VERSION}/users/me`,
    REGISTER: `/${API_VERSION}/users`,
  },
  PRODUCTS: {
    LIST: `/${API_VERSION}/products`,
    FEATURED: `/${API_VERSION}/products/featured`,
    BY_SLUG: (slug: string) => `/${API_VERSION}/products/${slug}`,
  },
  ADMIN: {
    USERS: {
      LIST: `/${API_VERSION}/admin/users`,
      CREATE: `/${API_VERSION}/admin/users`,
      BY_ID: (id: string) => `/${API_VERSION}/admin/users/${id}`,
      UPDATE: (id: string) => `/${API_VERSION}/admin/users/${id}`,
      DELETE: (id: string) => `/${API_VERSION}/admin/users/${id}`,
    },
    PRODUCTS: {
      LIST: `/${API_VERSION}/admin/products`,
      CREATE: `/${API_VERSION}/admin/products`,
      BY_ID: (id: string) => `/${API_VERSION}/admin/products/${id}`,
      UPDATE: (id: string) => `/${API_VERSION}/admin/products/${id}`,
      DELETE: (id: string) => `/${API_VERSION}/admin/products/${id}`,
      FEATURES: {
        CREATE: (productId: string) =>
          `/${API_VERSION}/admin/products/${productId}/features`,
        UPDATE: (productId: string, featureId: string) =>
          `/${API_VERSION}/admin/products/${productId}/features/${featureId}`,
        DELETE: (productId: string, featureId: string) =>
          `/${API_VERSION}/admin/products/${productId}/features/${featureId}`,
      },
      MEDIA: {
        CREATE: (productId: string) =>
          `/${API_VERSION}/admin/products/${productId}/media`,
        UPDATE: (productId: string, mediaId: string) =>
          `/${API_VERSION}/admin/products/${productId}/media/${mediaId}`,
        DELETE: (productId: string, mediaId: string) =>
          `/${API_VERSION}/admin/products/${productId}/media/${mediaId}`,
      },
    },
  },
} as const

export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    ME: () => [...QUERY_KEYS.AUTH.ALL, 'me'] as const,
  },
  USERS: {
    ALL: ['users'] as const,
    BY_ID: (id: string) => [...QUERY_KEYS.USERS.ALL, 'detail', id] as const,
    ME: () => [...QUERY_KEYS.USERS.ALL, 'me'] as const,
  },
  PRODUCTS: {
    ALL: ['products'] as const,
    LIST: (page: number, size: number) =>
      [...QUERY_KEYS.PRODUCTS.ALL, 'list', { page, size }] as const,
    FEATURED: () => [...QUERY_KEYS.PRODUCTS.ALL, 'featured'] as const,
    BY_SLUG: (slug: string) =>
      [...QUERY_KEYS.PRODUCTS.ALL, 'detail', slug] as const,
  },
  ADMIN: {
    ALL: ['admin'] as const,
    USERS: {
      ALL: () => [...QUERY_KEYS.ADMIN.ALL, 'users'] as const,
      LIST: (page: number, size: number) =>
        [...QUERY_KEYS.ADMIN.USERS.ALL(), 'list', { page, size }] as const,
      BY_ID: (id: string) =>
        [...QUERY_KEYS.ADMIN.USERS.ALL(), 'detail', id] as const,
    },
    PRODUCTS: {
      ALL: () => [...QUERY_KEYS.ADMIN.ALL, 'products'] as const,
      LIST: (page: number, size: number) =>
        [...QUERY_KEYS.ADMIN.PRODUCTS.ALL(), 'list', { page, size }] as const,
      BY_ID: (id: string) =>
        [...QUERY_KEYS.ADMIN.PRODUCTS.ALL(), 'detail', id] as const,
    },
  },
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    PRODUCTS: '/admin/products',
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
  },
} as const

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  UI: 'ui-storage',
} as const

export const QUERY_CONFIG = {
  STALE_TIME: {
    USER: 1000 * 60 * 5,
    STATIC: Infinity,
    FREQUENT: 1000 * 30,
  },
  GC_TIME: {
    DEFAULT: 1000 * 60 * 30,
    LONG: 1000 * 60 * 60,
  },
  RETRY: {
    DEFAULT: 3,
    NONE: 0,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
} as const

export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
export type QueryKey = typeof QUERY_KEYS
export type Route = typeof ROUTES
