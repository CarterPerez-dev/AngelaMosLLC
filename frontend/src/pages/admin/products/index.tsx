// ===================
// © AngelaMos | 2026
// index.tsx
// ===================

import { useState } from 'react'
import { LuPencil, LuPlus, LuTrash2, LuX } from 'react-icons/lu'
import {
  useAdminCreateProduct,
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminUpdateProduct,
} from '@/api/hooks'
import type { ProductDetailResponse } from '@/api/types'
import { PAGINATION } from '@/config'
import { ProductFormModal } from './product-form-modal'
import styles from './admin-products.module.scss'

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; product: ProductDetailResponse }
  | { type: 'delete'; product: ProductDetailResponse }

function parseFormData(formData: FormData): Record<string, unknown> {
  const get = (key: string): string => (formData.get(key) as string) ?? ''
  const result: Record<string, unknown> = {
    name: get('name'),
    slug: get('slug'),
    tagline: get('tagline'),
    description: get('description'),
    category: get('category'),
    status: get('status') || 'active',
    is_featured: formData.get('is_featured') === 'on',
    is_open_source: formData.get('is_open_source') === 'on',
    display_order: Number.parseInt(get('display_order') || '0', 10),
  }

  const optionalFields = ['icon_url', 'github_url', 'demo_url', 'install_command']
  for (const field of optionalFields) {
    const value = get(field)
    result[field] = value.length > 0 ? value : null
  }

  return result
}

export function Component(): React.ReactElement {
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })

  const { data, isLoading } = useAdminProducts({
    page,
    size: PAGINATION.DEFAULT_SIZE,
  })
  const createProduct = useAdminCreateProduct()
  const updateProduct = useAdminUpdateProduct()
  const deleteProduct = useAdminDeleteProduct()

  const handleCreate = (formData: FormData): void => {
    createProduct.mutate(parseFormData(formData) as never, {
      onSuccess: () => setModal({ type: 'closed' }),
    })
  }

  const handleUpdate = (productId: string, formData: FormData): void => {
    updateProduct.mutate(
      { id: productId, data: parseFormData(formData) as never },
      { onSuccess: () => setModal({ type: 'closed' }) }
    )
  }

  const handleDelete = (productId: string): void => {
    deleteProduct.mutate(productId, {
      onSuccess: () => setModal({ type: 'closed' }),
    })
  }

  const totalPages = data ? Math.ceil(data.total / PAGINATION.DEFAULT_SIZE) : 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setModal({ type: 'create' })}
        >
          <LuPlus />
          Create Product
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Name</div>
          <div className={styles.tableHeaderCell}>Slug</div>
          <div className={styles.tableHeaderCell}>Category</div>
          <div className={styles.tableHeaderCell}>Status</div>
          <div className={styles.tableHeaderCell}>Featured</div>
          <div className={styles.tableHeaderCell}>Actions</div>
        </div>

        <div className={styles.tableBody}>
          {isLoading && <div className={styles.loading}>Loading...</div>}

          {!isLoading && data?.items.length === 0 && (
            <div className={styles.empty}>No products found</div>
          )}

          {data?.items.map((product) => (
            <div key={product.id} className={styles.tableRow}>
              <div className={styles.tableCell} data-label="Name">
                <span className={styles.productName}>{product.name}</span>
              </div>
              <div className={styles.tableCell} data-label="Slug">
                <span className={styles.slug}>{product.slug}</span>
              </div>
              <div className={styles.tableCell} data-label="Category">
                <span className={styles.badge}>{product.category}</span>
              </div>
              <div className={styles.tableCell} data-label="Status">
                <span
                  className={`${styles.badge} ${product.status === 'active' ? styles.active : styles.inactive}`}
                >
                  {product.status}
                </span>
              </div>
              <div className={styles.tableCell} data-label="Featured">
                <span
                  className={`${styles.badge} ${product.is_featured ? styles.featured : ''}`}
                >
                  {product.is_featured ? 'Yes' : 'No'}
                </span>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() =>
                    setModal({ type: 'edit', product: product as ProductDetailResponse })
                  }
                  aria-label="Edit product"
                >
                  <LuPencil />
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.delete}`}
                  onClick={() =>
                    setModal({ type: 'delete', product: product as ProductDetailResponse })
                  }
                  aria-label="Delete product"
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {data && data.total > PAGINATION.DEFAULT_SIZE && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Page {page} of {totalPages} ({data.total} products)
            </span>
            <div className={styles.paginationBtns}>
              <button
                type="button"
                className={styles.paginationBtn}
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className={styles.paginationBtn}
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modal.type === 'create' && (
        <ProductFormModal
          title="Create Product"
          isPending={createProduct.isPending}
          pendingLabel="Creating..."
          submitLabel="Create"
          onSubmit={handleCreate}
          onClose={() => setModal({ type: 'closed' })}
        />
      )}

      {modal.type === 'edit' && (
        <ProductFormModal
          title="Edit Product"
          product={modal.product}
          isPending={updateProduct.isPending}
          pendingLabel="Saving..."
          submitLabel="Save"
          onSubmit={(formData) => handleUpdate(modal.product.id, formData)}
          onClose={() => setModal({ type: 'closed' })}
        />
      )}

      {modal.type === 'delete' && (
        <div className={styles.modal}>
          <button
            type="button"
            className={styles.modalOverlay}
            onClick={() => setModal({ type: 'closed' })}
            onKeyDown={(e) => e.key === 'Escape' && setModal({ type: 'closed' })}
            aria-label="Close modal"
          />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Product</h2>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setModal({ type: 'closed' })}
              >
                <LuX />
              </button>
            </div>
            <div className={styles.deleteConfirm}>
              <p className={styles.deleteText}>
                Are you sure you want to delete{' '}
                <span className={styles.deleteName}>{modal.product.name}</span>?
                This will also delete all features and media. This action cannot be undone.
              </p>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setModal({ type: 'closed' })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(modal.product.id)}
                  disabled={deleteProduct.isPending}
                >
                  {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

Component.displayName = 'AdminProducts'
