"""
ⒸAngelaMos | 2026
Product.py
"""

from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from config import (
    PRODUCT_CATEGORY_MAX_LENGTH,
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_INSTALL_COMMAND_MAX_LENGTH,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_SLUG_MAX_LENGTH,
    PRODUCT_STATUS_MAX_LENGTH,
    PRODUCT_TAGLINE_MAX_LENGTH,
    PRODUCT_URL_MAX_LENGTH,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

if TYPE_CHECKING:
    from .ProductFeature import ProductFeature
    from .ProductMedia import ProductMedia


class Product(Base, UUIDMixin, TimestampMixin):
    """
    Product showcase model
    """
    __tablename__ = "products"

    name: Mapped[str] = mapped_column(
        String(PRODUCT_NAME_MAX_LENGTH),
    )
    slug: Mapped[str] = mapped_column(
        String(PRODUCT_SLUG_MAX_LENGTH),
        unique = True,
        index = True,
    )
    tagline: Mapped[str] = mapped_column(
        String(PRODUCT_TAGLINE_MAX_LENGTH),
    )
    description: Mapped[str] = mapped_column(
        String(PRODUCT_DESCRIPTION_MAX_LENGTH),
    )
    category: Mapped[str] = mapped_column(
        String(PRODUCT_CATEGORY_MAX_LENGTH),
    )
    status: Mapped[str] = mapped_column(
        String(PRODUCT_STATUS_MAX_LENGTH),
        default = "active",
    )

    icon_url: Mapped[str | None] = mapped_column(
        String(PRODUCT_URL_MAX_LENGTH),
        default = None,
    )
    github_url: Mapped[str | None] = mapped_column(
        String(PRODUCT_URL_MAX_LENGTH),
        default = None,
    )
    install_command: Mapped[str | None] = mapped_column(
        String(PRODUCT_INSTALL_COMMAND_MAX_LENGTH),
        default = None,
    )
    demo_url: Mapped[str | None] = mapped_column(
        String(PRODUCT_URL_MAX_LENGTH),
        default = None,
    )

    is_featured: Mapped[bool] = mapped_column(default = False)
    is_open_source: Mapped[bool] = mapped_column(default = True)
    display_order: Mapped[int] = mapped_column(default = 0)

    stats: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        default = None,
    )
    links: Mapped[list[dict[str, Any]] | None] = mapped_column(
        JSON,
        default = None,
    )
    extra: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        default = None,
    )

    features: Mapped[list[ProductFeature]] = relationship(
        back_populates = "product",
        cascade = "all, delete-orphan",
        lazy = "raise",
    )
    media: Mapped[list[ProductMedia]] = relationship(
        back_populates = "product",
        cascade = "all, delete-orphan",
        lazy = "raise",
    )
