"""
ⒸAngelaMos | 2026
repository.py
"""

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.base_repository import BaseRepository
from .Product import Product
from .ProductFeature import ProductFeature
from .ProductMedia import ProductMedia


class ProductRepository(BaseRepository[Product]):
    """
    Repository for Product model database operations
    """
    model = Product

    @classmethod
    async def get_by_slug(
        cls,
        session: AsyncSession,
        slug: str,
    ) -> Product | None:
        """
        Get product by slug
        """
        result = await session.execute(
            select(Product).where(Product.slug == slug)
        )
        return result.scalars().first()

    @classmethod
    async def get_by_slug_with_relations(
        cls,
        session: AsyncSession,
        slug: str,
    ) -> Product | None:
        """
        Get product by slug with features and media loaded
        """
        result = await session.execute(
            select(Product)
            .where(Product.slug == slug)
            .options(
                selectinload(Product.features),
                selectinload(Product.media),
            )
        )
        return result.scalars().first()

    @classmethod
    async def get_by_id_with_relations(
        cls,
        session: AsyncSession,
        id: UUID,
    ) -> Product | None:
        """
        Get product by ID with features and media loaded
        """
        result = await session.execute(
            select(Product)
            .where(Product.id == id)
            .options(
                selectinload(Product.features),
                selectinload(Product.media),
            )
        )
        return result.scalars().first()

    @classmethod
    async def slug_exists(
        cls,
        session: AsyncSession,
        slug: str,
    ) -> bool:
        """
        Check if a product slug already exists
        """
        result = await session.execute(
            select(Product.id).where(Product.slug == slug)
        )
        return result.scalars().first() is not None

    @classmethod
    async def get_active(
        cls,
        session: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Product]:
        """
        Get active products ordered by display_order
        """
        result = await session.execute(
            select(Product)
            .where(Product.status == "active")
            .order_by(Product.display_order)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def count_active(
        cls,
        session: AsyncSession,
    ) -> int:
        """
        Count active products
        """
        result = await session.execute(
            select(func.count())
            .select_from(Product)
            .where(Product.status == "active")
        )
        return result.scalar_one()

    @classmethod
    async def get_multi_ordered(
        cls,
        session: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Product]:
        """
        Get all products ordered by display_order
        """
        result = await session.execute(
            select(Product)
            .order_by(Product.display_order)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_featured(
        cls,
        session: AsyncSession,
    ) -> Sequence[Product]:
        """
        Get featured active products
        """
        result = await session.execute(
            select(Product)
            .where(
                Product.is_featured.is_(True),
                Product.status == "active",
            )
            .order_by(Product.display_order)
        )
        return result.scalars().all()


class ProductFeatureRepository(BaseRepository[ProductFeature]):
    """
    Repository for ProductFeature model database operations
    """
    model = ProductFeature

    @classmethod
    async def get_by_product(
        cls,
        session: AsyncSession,
        product_id: UUID,
    ) -> Sequence[ProductFeature]:
        """
        Get all features for a product ordered by display_order
        """
        result = await session.execute(
            select(ProductFeature)
            .where(ProductFeature.product_id == product_id)
            .order_by(ProductFeature.display_order)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_product_and_id(
        cls,
        session: AsyncSession,
        product_id: UUID,
        feature_id: UUID,
    ) -> ProductFeature | None:
        """
        Get a specific feature for a product
        """
        result = await session.execute(
            select(ProductFeature).where(
                ProductFeature.product_id == product_id,
                ProductFeature.id == feature_id,
            )
        )
        return result.scalars().first()


class ProductMediaRepository(BaseRepository[ProductMedia]):
    """
    Repository for ProductMedia model database operations
    """
    model = ProductMedia

    @classmethod
    async def get_by_product(
        cls,
        session: AsyncSession,
        product_id: UUID,
    ) -> Sequence[ProductMedia]:
        """
        Get all media for a product ordered by display_order
        """
        result = await session.execute(
            select(ProductMedia)
            .where(ProductMedia.product_id == product_id)
            .order_by(ProductMedia.display_order)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_product_and_id(
        cls,
        session: AsyncSession,
        product_id: UUID,
        media_id: UUID,
    ) -> ProductMedia | None:
        """
        Get a specific media item for a product
        """
        result = await session.execute(
            select(ProductMedia).where(
                ProductMedia.product_id == product_id,
                ProductMedia.id == media_id,
            )
        )
        return result.scalars().first()
