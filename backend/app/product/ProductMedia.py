"""
ⒸAngelaMos | 2026
ProductMedia.py
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
    MEDIA_ALT_TEXT_MAX_LENGTH,
    MEDIA_CAPTION_MAX_LENGTH,
    MEDIA_TYPE_MAX_LENGTH,
    MEDIA_URL_MAX_LENGTH,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

if TYPE_CHECKING:
    from .Product import Product


class ProductMedia(Base, UUIDMixin, TimestampMixin):
    """
    Product media item (screenshot, video, gif)
    """
    __tablename__ = "product_media"

    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete = "CASCADE"),
        index = True,
    )

    url: Mapped[str] = mapped_column(
        String(MEDIA_URL_MAX_LENGTH),
    )
    media_type: Mapped[str] = mapped_column(
        String(MEDIA_TYPE_MAX_LENGTH),
    )
    alt_text: Mapped[str | None] = mapped_column(
        String(MEDIA_ALT_TEXT_MAX_LENGTH),
        default = None,
    )
    caption: Mapped[str | None] = mapped_column(
        String(MEDIA_CAPTION_MAX_LENGTH),
        default = None,
    )
    display_order: Mapped[int] = mapped_column(default = 0)

    product: Mapped[Product] = relationship(
        back_populates = "media",
    )
