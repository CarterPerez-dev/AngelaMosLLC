"""
ⒸAngelaMos | 2026
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import ProductService


def get_product_service(db: DBSession) -> ProductService:
    """
    Dependency to inject ProductService instance
    """
    return ProductService(db)


ProductServiceDep = Annotated[ProductService, Depends(get_product_service)]
