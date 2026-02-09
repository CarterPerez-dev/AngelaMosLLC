"""
ⒸAngelaMos | 2026
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from core.exceptions import (
    ProductFeatureNotFound,
    ProductMediaNotFound,
    ProductNotFound,
    SlugAlreadyExists,
)
from .schemas import (
    ProductCreate,
    ProductDetailResponse,
    ProductFeatureCreate,
    ProductFeatureResponse,
    ProductFeatureUpdate,
    ProductListResponse,
    ProductMediaCreate,
    ProductMediaResponse,
    ProductMediaUpdate,
    ProductSummaryResponse,
    ProductUpdate,
)
from .repository import (
    ProductFeatureRepository,
    ProductMediaRepository,
    ProductRepository,
)


class ProductService:
    """
    Business logic for product operations
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_active_products(
        self,
        page: int,
        size: int,
    ) -> ProductListResponse:
        """
        Get paginated list of active products
        """
        skip = (page - 1) * size
        products = await ProductRepository.get_active(
            self.session,
            skip = skip,
            limit = size,
        )
        total = await ProductRepository.count_active(self.session)
        return ProductListResponse(
            items = [
                ProductSummaryResponse.model_validate(p)
                for p in products
            ],
            total = total,
            page = page,
            size = size,
        )

    async def get_product_by_slug(
        self,
        slug: str,
    ) -> ProductDetailResponse:
        """
        Get full product detail by slug
        """
        product = await ProductRepository.get_by_slug_with_relations(
            self.session, slug
        )
        if not product:
            raise ProductNotFound(slug)
        return ProductDetailResponse.model_validate(product)

    async def get_featured_products(
        self,
    ) -> list[ProductSummaryResponse]:
        """
        Get featured products for homepage
        """
        products = await ProductRepository.get_featured(self.session)
        return [
            ProductSummaryResponse.model_validate(p)
            for p in products
        ]

    async def list_all_products(
        self,
        page: int,
        size: int,
    ) -> ProductListResponse:
        """
        List all products including inactive (admin)
        """
        skip = (page - 1) * size
        products = await ProductRepository.get_multi_ordered(
            self.session,
            skip = skip,
            limit = size,
        )
        total = await ProductRepository.count(self.session)
        return ProductListResponse(
            items = [
                ProductSummaryResponse.model_validate(p)
                for p in products
            ],
            total = total,
            page = page,
            size = size,
        )

    async def get_product_by_id(
        self,
        product_id: UUID,
    ) -> ProductDetailResponse:
        """
        Get product by ID with relations (admin)
        """
        product = await ProductRepository.get_by_id_with_relations(
            self.session, product_id
        )
        if not product:
            raise ProductNotFound(str(product_id))
        return ProductDetailResponse.model_validate(product)

    async def create_product(
        self,
        data: ProductCreate,
    ) -> ProductDetailResponse:
        """
        Create a new product
        """
        if await ProductRepository.slug_exists(self.session, data.slug):
            raise SlugAlreadyExists(data.slug)

        product = await ProductRepository.create(
            self.session,
            **data.model_dump(),
        )
        product = await ProductRepository.get_by_id_with_relations(
            self.session, product.id
        )
        return ProductDetailResponse.model_validate(product)

    async def update_product(
        self,
        product_id: UUID,
        data: ProductUpdate,
    ) -> ProductDetailResponse:
        """
        Update an existing product
        """
        product = await ProductRepository.get_by_id(
            self.session, product_id
        )
        if not product:
            raise ProductNotFound(str(product_id))

        update_dict = data.model_dump(exclude_unset = True)

        if "slug" in update_dict:
            existing = await ProductRepository.get_by_slug(
                self.session, update_dict["slug"]
            )
            if existing and existing.id != product_id:
                raise SlugAlreadyExists(update_dict["slug"])

        await ProductRepository.update(
            self.session, product, **update_dict
        )
        product = await ProductRepository.get_by_id_with_relations(
            self.session, product.id
        )
        return ProductDetailResponse.model_validate(product)

    async def delete_product(
        self,
        product_id: UUID,
    ) -> None:
        """
        Delete a product (hard delete, cascades to features and media)
        """
        product = await ProductRepository.get_by_id(
            self.session, product_id
        )
        if not product:
            raise ProductNotFound(str(product_id))
        await ProductRepository.delete(self.session, product)

    async def add_feature(
        self,
        product_id: UUID,
        data: ProductFeatureCreate,
    ) -> ProductFeatureResponse:
        """
        Add a feature to a product
        """
        product = await ProductRepository.get_by_id(
            self.session, product_id
        )
        if not product:
            raise ProductNotFound(str(product_id))

        feature = await ProductFeatureRepository.create(
            self.session,
            product_id = product_id,
            **data.model_dump(),
        )
        return ProductFeatureResponse.model_validate(feature)

    async def update_feature(
        self,
        product_id: UUID,
        feature_id: UUID,
        data: ProductFeatureUpdate,
    ) -> ProductFeatureResponse:
        """
        Update a product feature
        """
        feature = await ProductFeatureRepository.get_by_product_and_id(
            self.session, product_id, feature_id
        )
        if not feature:
            raise ProductFeatureNotFound(str(feature_id))

        update_dict = data.model_dump(exclude_unset = True)
        updated = await ProductFeatureRepository.update(
            self.session, feature, **update_dict
        )
        return ProductFeatureResponse.model_validate(updated)

    async def delete_feature(
        self,
        product_id: UUID,
        feature_id: UUID,
    ) -> None:
        """
        Delete a product feature
        """
        feature = await ProductFeatureRepository.get_by_product_and_id(
            self.session, product_id, feature_id
        )
        if not feature:
            raise ProductFeatureNotFound(str(feature_id))
        await ProductFeatureRepository.delete(self.session, feature)

    async def add_media(
        self,
        product_id: UUID,
        data: ProductMediaCreate,
    ) -> ProductMediaResponse:
        """
        Add media to a product
        """
        product = await ProductRepository.get_by_id(
            self.session, product_id
        )
        if not product:
            raise ProductNotFound(str(product_id))

        media = await ProductMediaRepository.create(
            self.session,
            product_id = product_id,
            **data.model_dump(),
        )
        return ProductMediaResponse.model_validate(media)

    async def update_media(
        self,
        product_id: UUID,
        media_id: UUID,
        data: ProductMediaUpdate,
    ) -> ProductMediaResponse:
        """
        Update a product media item
        """
        media = await ProductMediaRepository.get_by_product_and_id(
            self.session, product_id, media_id
        )
        if not media:
            raise ProductMediaNotFound(str(media_id))

        update_dict = data.model_dump(exclude_unset = True)
        updated = await ProductMediaRepository.update(
            self.session, media, **update_dict
        )
        return ProductMediaResponse.model_validate(updated)

    async def delete_media(
        self,
        product_id: UUID,
        media_id: UUID,
    ) -> None:
        """
        Delete a product media item
        """
        media = await ProductMediaRepository.get_by_product_and_id(
            self.session, product_id, media_id
        )
        if not media:
            raise ProductMediaNotFound(str(media_id))
        await ProductMediaRepository.delete(self.session, media)
