"""
ⒸAngelaMos | 2026
routes.py
"""

from fastapi import (
    APIRouter,
    Query,
)

from config import settings
from core.responses import NOT_FOUND_404
from .schemas import (
    ProductDetailResponse,
    ProductListResponse,
    ProductSummaryResponse,
)
from .dependencies import ProductServiceDep


router = APIRouter(prefix = "/products", tags = ["products"])


@router.get(
    "",
    response_model = ProductListResponse,
)
async def list_products(
    product_service: ProductServiceDep,
    page: int = Query(default = 1, ge = 1),
    size: int = Query(
        default = settings.PAGINATION_DEFAULT_SIZE,
        ge = 1,
        le = settings.PAGINATION_MAX_SIZE,
    ),
) -> ProductListResponse:
    """
    List active products
    """
    return await product_service.get_active_products(page, size)


@router.get(
    "/featured",
    response_model = list[ProductSummaryResponse],
)
async def get_featured_products(
    product_service: ProductServiceDep,
) -> list[ProductSummaryResponse]:
    """
    Get featured products for homepage
    """
    return await product_service.get_featured_products()


@router.get(
    "/{slug}",
    response_model = ProductDetailResponse,
    responses = {**NOT_FOUND_404},
)
async def get_product(
    product_service: ProductServiceDep,
    slug: str,
) -> ProductDetailResponse:
    """
    Get product detail by slug
    """
    return await product_service.get_product_by_slug(slug)
