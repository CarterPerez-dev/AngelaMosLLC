"""
ⒸAngelaMos | 2026
admin_routes.py
"""

from typing import Annotated
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status,
)

from config import (
    settings,
    UserRole,
)
from core.dependencies import RequireRole
from core.responses import (
    AUTH_401,
    CONFLICT_409,
    FORBIDDEN_403,
    NOT_FOUND_404,
)
from user.User import User
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
    ProductUpdate,
)
from .dependencies import ProductServiceDep


router = APIRouter(prefix = "/admin/products", tags = ["admin"])

AdminOnly = Annotated[User, Depends(RequireRole(UserRole.ADMIN))]


@router.get(
    "",
    response_model = ProductListResponse,
    responses = {**AUTH_401, **FORBIDDEN_403},
)
async def list_products(
    product_service: ProductServiceDep,
    _: AdminOnly,
    page: int = Query(default = 1, ge = 1),
    size: int = Query(
        default = settings.PAGINATION_DEFAULT_SIZE,
        ge = 1,
        le = settings.PAGINATION_MAX_SIZE,
    ),
) -> ProductListResponse:
    """
    List all products (admin only)
    """
    return await product_service.list_all_products(page, size)


@router.post(
    "",
    response_model = ProductDetailResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {**AUTH_401, **FORBIDDEN_403, **CONFLICT_409},
)
async def create_product(
    product_service: ProductServiceDep,
    _: AdminOnly,
    data: ProductCreate,
) -> ProductDetailResponse:
    """
    Create a new product (admin only)
    """
    return await product_service.create_product(data)


@router.get(
    "/{product_id}",
    response_model = ProductDetailResponse,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def get_product(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
) -> ProductDetailResponse:
    """
    Get product by ID (admin only)
    """
    return await product_service.get_product_by_id(product_id)


@router.patch(
    "/{product_id}",
    response_model = ProductDetailResponse,
    responses = {
        **AUTH_401,
        **FORBIDDEN_403,
        **NOT_FOUND_404,
        **CONFLICT_409,
    },
)
async def update_product(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    data: ProductUpdate,
) -> ProductDetailResponse:
    """
    Update product (admin only)
    """
    return await product_service.update_product(product_id, data)


@router.delete(
    "/{product_id}",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def delete_product(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
) -> None:
    """
    Delete product (admin only, hard delete)
    """
    await product_service.delete_product(product_id)


@router.post(
    "/{product_id}/features",
    response_model = ProductFeatureResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def add_feature(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    data: ProductFeatureCreate,
) -> ProductFeatureResponse:
    """
    Add feature to product (admin only)
    """
    return await product_service.add_feature(product_id, data)


@router.patch(
    "/{product_id}/features/{feature_id}",
    response_model = ProductFeatureResponse,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def update_feature(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    feature_id: UUID,
    data: ProductFeatureUpdate,
) -> ProductFeatureResponse:
    """
    Update product feature (admin only)
    """
    return await product_service.update_feature(
        product_id, feature_id, data
    )


@router.delete(
    "/{product_id}/features/{feature_id}",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def delete_feature(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    feature_id: UUID,
) -> None:
    """
    Delete product feature (admin only)
    """
    await product_service.delete_feature(product_id, feature_id)


@router.post(
    "/{product_id}/media",
    response_model = ProductMediaResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def add_media(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    data: ProductMediaCreate,
) -> ProductMediaResponse:
    """
    Add media to product (admin only)
    """
    return await product_service.add_media(product_id, data)


@router.patch(
    "/{product_id}/media/{media_id}",
    response_model = ProductMediaResponse,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def update_media(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    media_id: UUID,
    data: ProductMediaUpdate,
) -> ProductMediaResponse:
    """
    Update product media (admin only)
    """
    return await product_service.update_media(
        product_id, media_id, data
    )


@router.delete(
    "/{product_id}/media/{media_id}",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {**AUTH_401, **FORBIDDEN_403, **NOT_FOUND_404},
)
async def delete_media(
    product_service: ProductServiceDep,
    _: AdminOnly,
    product_id: UUID,
    media_id: UUID,
) -> None:
    """
    Delete product media (admin only)
    """
    await product_service.delete_media(product_id, media_id)
