"""
ⒸAngelaMos | 2026
schemas.py
"""

from typing import Any
from uuid import UUID

from pydantic import Field

from config import (
    FEATURE_DESCRIPTION_MAX_LENGTH,
    FEATURE_ICON_MAX_LENGTH,
    FEATURE_TITLE_MAX_LENGTH,
    MEDIA_ALT_TEXT_MAX_LENGTH,
    MEDIA_CAPTION_MAX_LENGTH,
    MEDIA_TYPE_MAX_LENGTH,
    MEDIA_URL_MAX_LENGTH,
    PRODUCT_CATEGORY_MAX_LENGTH,
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_INSTALL_COMMAND_MAX_LENGTH,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_SLUG_MAX_LENGTH,
    PRODUCT_STATUS_MAX_LENGTH,
    PRODUCT_TAGLINE_MAX_LENGTH,
    PRODUCT_URL_MAX_LENGTH,
)
from core.base_schema import (
    BaseSchema,
    BaseResponseSchema,
)


class ProductFeatureCreate(BaseSchema):
    """
    Schema for creating a product feature
    """
    title: str = Field(
        min_length = 1,
        max_length = FEATURE_TITLE_MAX_LENGTH,
    )
    description: str | None = Field(
        default = None,
        max_length = FEATURE_DESCRIPTION_MAX_LENGTH,
    )
    icon: str | None = Field(
        default = None,
        max_length = FEATURE_ICON_MAX_LENGTH,
    )
    display_order: int = Field(default = 0, ge = 0)


class ProductFeatureUpdate(BaseSchema):
    """
    Schema for updating a product feature
    """
    title: str | None = Field(
        default = None,
        min_length = 1,
        max_length = FEATURE_TITLE_MAX_LENGTH,
    )
    description: str | None = Field(
        default = None,
        max_length = FEATURE_DESCRIPTION_MAX_LENGTH,
    )
    icon: str | None = Field(
        default = None,
        max_length = FEATURE_ICON_MAX_LENGTH,
    )
    display_order: int | None = Field(default = None, ge = 0)


class ProductFeatureResponse(BaseResponseSchema):
    """
    Schema for product feature API responses
    """
    product_id: UUID
    title: str
    description: str | None
    icon: str | None
    display_order: int


class ProductMediaCreate(BaseSchema):
    """
    Schema for creating product media
    """
    url: str = Field(
        min_length = 1,
        max_length = MEDIA_URL_MAX_LENGTH,
    )
    media_type: str = Field(
        min_length = 1,
        max_length = MEDIA_TYPE_MAX_LENGTH,
    )
    alt_text: str | None = Field(
        default = None,
        max_length = MEDIA_ALT_TEXT_MAX_LENGTH,
    )
    caption: str | None = Field(
        default = None,
        max_length = MEDIA_CAPTION_MAX_LENGTH,
    )
    display_order: int = Field(default = 0, ge = 0)


class ProductMediaUpdate(BaseSchema):
    """
    Schema for updating product media
    """
    url: str | None = Field(
        default = None,
        min_length = 1,
        max_length = MEDIA_URL_MAX_LENGTH,
    )
    media_type: str | None = Field(
        default = None,
        min_length = 1,
        max_length = MEDIA_TYPE_MAX_LENGTH,
    )
    alt_text: str | None = Field(
        default = None,
        max_length = MEDIA_ALT_TEXT_MAX_LENGTH,
    )
    caption: str | None = Field(
        default = None,
        max_length = MEDIA_CAPTION_MAX_LENGTH,
    )
    display_order: int | None = Field(default = None, ge = 0)


class ProductMediaResponse(BaseResponseSchema):
    """
    Schema for product media API responses
    """
    product_id: UUID
    url: str
    media_type: str
    alt_text: str | None
    caption: str | None
    display_order: int


class ProductCreate(BaseSchema):
    """
    Schema for creating a product
    """
    name: str = Field(
        min_length = 1,
        max_length = PRODUCT_NAME_MAX_LENGTH,
    )
    slug: str = Field(
        min_length = 1,
        max_length = PRODUCT_SLUG_MAX_LENGTH,
    )
    tagline: str = Field(
        min_length = 1,
        max_length = PRODUCT_TAGLINE_MAX_LENGTH,
    )
    description: str = Field(
        min_length = 1,
        max_length = PRODUCT_DESCRIPTION_MAX_LENGTH,
    )
    category: str = Field(
        min_length = 1,
        max_length = PRODUCT_CATEGORY_MAX_LENGTH,
    )
    status: str = Field(
        default = "active",
        max_length = PRODUCT_STATUS_MAX_LENGTH,
    )
    icon_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    github_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    install_command: str | None = Field(
        default = None,
        max_length = PRODUCT_INSTALL_COMMAND_MAX_LENGTH,
    )
    demo_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    is_featured: bool = False
    is_open_source: bool = True
    display_order: int = Field(default = 0, ge = 0)
    stats: dict[str, Any] | None = None
    links: list[dict[str, Any]] | None = None
    extra: dict[str, Any] | None = None


class ProductUpdate(BaseSchema):
    """
    Schema for updating a product
    """
    name: str | None = Field(
        default = None,
        min_length = 1,
        max_length = PRODUCT_NAME_MAX_LENGTH,
    )
    slug: str | None = Field(
        default = None,
        min_length = 1,
        max_length = PRODUCT_SLUG_MAX_LENGTH,
    )
    tagline: str | None = Field(
        default = None,
        min_length = 1,
        max_length = PRODUCT_TAGLINE_MAX_LENGTH,
    )
    description: str | None = Field(
        default = None,
        min_length = 1,
        max_length = PRODUCT_DESCRIPTION_MAX_LENGTH,
    )
    category: str | None = Field(
        default = None,
        min_length = 1,
        max_length = PRODUCT_CATEGORY_MAX_LENGTH,
    )
    status: str | None = Field(
        default = None,
        max_length = PRODUCT_STATUS_MAX_LENGTH,
    )
    icon_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    github_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    install_command: str | None = Field(
        default = None,
        max_length = PRODUCT_INSTALL_COMMAND_MAX_LENGTH,
    )
    demo_url: str | None = Field(
        default = None,
        max_length = PRODUCT_URL_MAX_LENGTH,
    )
    is_featured: bool | None = None
    is_open_source: bool | None = None
    display_order: int | None = Field(default = None, ge = 0)
    stats: dict[str, Any] | None = None
    links: list[dict[str, Any]] | None = None
    extra: dict[str, Any] | None = None


class ProductSummaryResponse(BaseResponseSchema):
    """
    Schema for product list items (lightweight, no features/media)
    """
    name: str
    slug: str
    tagline: str
    category: str
    status: str
    icon_url: str | None
    github_url: str | None
    is_featured: bool
    is_open_source: bool
    display_order: int
    stats: dict[str, Any] | None


class ProductDetailResponse(ProductSummaryResponse):
    """
    Schema for full product detail with features and media
    """
    description: str
    install_command: str | None
    demo_url: str | None
    links: list[dict[str, Any]] | None
    extra: dict[str, Any] | None
    features: list[ProductFeatureResponse]
    media: list[ProductMediaResponse]


class ProductListResponse(BaseSchema):
    """
    Schema for paginated product list
    """
    items: list[ProductSummaryResponse]
    total: int
    page: int
    size: int
