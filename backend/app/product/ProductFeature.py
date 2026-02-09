"""
ⒸAngelaMos | 2026
ProductFeature.py
"""

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from config import (
    FEATURE_DESCRIPTION_MAX_LENGTH,
    FEATURE_ICON_MAX_LENGTH,
    FEATURE_TITLE_MAX_LENGTH,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

if TYPE_CHECKING:
    from .Product import Product


class ProductFeature(Base, UUIDMixin, TimestampMixin):
    """
    Product feature breakdown item
    """
    __tablename__ = "product_features"

    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete = "CASCADE"),
        index = True,
    )

    title: Mapped[str] = mapped_column(
        String(FEATURE_TITLE_MAX_LENGTH),
    )
    description: Mapped[str | None] = mapped_column(
        String(FEATURE_DESCRIPTION_MAX_LENGTH),
        default = None,
    )
    icon: Mapped[str | None] = mapped_column(
        String(FEATURE_ICON_MAX_LENGTH),
        default = None,
    )
    display_order: Mapped[int] = mapped_column(default = 0)

    product: Mapped[Product] = relationship(
        back_populates = "features",
    )
