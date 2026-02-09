// ===================
// © AngelaMos | 2026
// product-form-modal.tsx
// ===================

import { LuX } from 'react-icons/lu'
import type { ProductDetailResponse } from '@/api/types'
import styles from './admin-products.module.scss'

interface ProductFormModalProps {
  title: string
  product?: ProductDetailResponse
  isPending: boolean
  pendingLabel: string
  submitLabel: string
  onSubmit: (data: FormData) => void
  onClose: () => void
}

export function ProductFormModal({
  title,
  product,
  isPending,
  pendingLabel,
  submitLabel,
  onSubmit,
  onClose,
}: ProductFormModalProps): React.ReactElement {
  return (
    <div className={styles.modal}>
      <button
        type="button"
        className={styles.modalOverlay}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />
      <div className={`${styles.modalContent} ${styles.wideModal}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
          >
            <LuX />
          </button>
        </div>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(new FormData(e.currentTarget))
          }}
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pName">
                Name
              </label>
              <input
                id="pName"
                name="name"
                type="text"
                className={styles.input}
                defaultValue={product?.name ?? ''}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pSlug">
                Slug
              </label>
              <input
                id="pSlug"
                name="slug"
                type="text"
                className={styles.input}
                defaultValue={product?.slug ?? ''}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pCategory">
                Category
              </label>
              <input
                id="pCategory"
                name="category"
                type="text"
                className={styles.input}
                defaultValue={product?.category ?? ''}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pStatus">
                Status
              </label>
              <input
                id="pStatus"
                name="status"
                type="text"
                className={styles.input}
                defaultValue={product?.status ?? 'active'}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pDisplayOrder">
                Display Order
              </label>
              <input
                id="pDisplayOrder"
                name="display_order"
                type="number"
                className={styles.input}
                defaultValue={product?.display_order ?? 0}
                min={0}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pTagline">
              Tagline
            </label>
            <input
              id="pTagline"
              name="tagline"
              type="text"
              className={styles.input}
              defaultValue={product?.tagline ?? ''}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pDescription">
              Description
            </label>
            <textarea
              id="pDescription"
              name="description"
              className={styles.textarea}
              defaultValue={product?.description ?? ''}
              required
              rows={4}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pIconUrl">
                Icon URL
              </label>
              <input
                id="pIconUrl"
                name="icon_url"
                type="text"
                className={styles.input}
                defaultValue={product?.icon_url ?? ''}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pGithubUrl">
                GitHub URL
              </label>
              <input
                id="pGithubUrl"
                name="github_url"
                type="text"
                className={styles.input}
                defaultValue={product?.github_url ?? ''}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pDemoUrl">
                Demo URL
              </label>
              <input
                id="pDemoUrl"
                name="demo_url"
                type="text"
                className={styles.input}
                defaultValue={product?.demo_url ?? ''}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pInstallCmd">
                Install Command
              </label>
              <input
                id="pInstallCmd"
                name="install_command"
                type="text"
                className={styles.input}
                defaultValue={product?.install_command ?? ''}
              />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product?.is_featured ?? false}
              />
              <span>Featured</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="is_open_source"
                defaultChecked={product?.is_open_source ?? true}
              />
              <span>Open Source</span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending}
            >
              {isPending ? pendingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
