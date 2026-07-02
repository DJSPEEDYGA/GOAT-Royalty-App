"""
Custom product search tools for the Ms Money Penny Store.
These tools integrate with the store's product catalog.
"""

import json
from typing import Optional

# Product catalog — in production, this would connect to a database or API
PRODUCT_CATALOG = [
    {
        "id": "prod-001",
        "name": "Premium Headphones",
        "category": "electronics",
        "price": 299,
        "description": "High-fidelity wireless headphones with active noise cancellation",
        "emoji": "🎧",
        "in_stock": True,
        "stock_count": 45,
    },
    {
        "id": "prod-002",
        "name": "Smart Watch",
        "category": "electronics",
        "price": 399,
        "description": "Advanced smartwatch with health monitoring and GPS",
        "emoji": "⌚",
        "in_stock": True,
        "stock_count": 32,
    },
    {
        "id": "prod-003",
        "name": "Laptop Pro",
        "category": "computing",
        "price": 1299,
        "description": "Professional-grade laptop with 16GB RAM and 512GB SSD",
        "emoji": "💻",
        "in_stock": True,
        "stock_count": 18,
    },
    {
        "id": "prod-004",
        "name": "Wireless Mouse",
        "category": "accessories",
        "price": 79,
        "description": "Ergonomic wireless mouse with precision tracking",
        "emoji": "🖱️",
        "in_stock": True,
        "stock_count": 120,
    },
    {
        "id": "prod-005",
        "name": "USB-C Hub",
        "category": "accessories",
        "price": 49,
        "description": "7-in-1 USB-C hub with HDMI, USB-A, and SD card reader",
        "emoji": "🔌",
        "in_stock": True,
        "stock_count": 85,
    },
    {
        "id": "prod-006",
        "name": "Webcam HD",
        "category": "electronics",
        "price": 129,
        "description": "1080p HD webcam with auto-focus and built-in microphone",
        "emoji": "📹",
        "in_stock": True,
        "stock_count": 67,
    },
]


def search_products(
    query: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> str:
    """Search the product catalog with optional filters.

    Args:
        query: Text search query to match against product names and descriptions.
        category: Filter by category (electronics, accessories, computing).
        min_price: Minimum price filter.
        max_price: Maximum price filter.

    Returns:
        JSON string of matching products.
    """
    results = PRODUCT_CATALOG.copy()

    if query:
        query_lower = query.lower()
        results = [
            p for p in results
            if query_lower in p["name"].lower()
            or query_lower in p["description"].lower()
            or query_lower in p["category"].lower()
        ]

    if category:
        results = [p for p in results if p["category"].lower() == category.lower()]

    if min_price is not None:
        results = [p for p in results if p["price"] >= min_price]

    if max_price is not None:
        results = [p for p in results if p["price"] <= max_price]

    return json.dumps(
        {
            "count": len(results),
            "products": results,
        },
        indent=2,
    )


def get_product_by_id(product_id: str) -> str:
    """Get detailed product information by ID.

    Args:
        product_id: The unique product identifier.

    Returns:
        JSON string of the product details or error message.
    """
    for product in PRODUCT_CATALOG:
        if product["id"] == product_id:
            return json.dumps(product, indent=2)

    return json.dumps({"error": f"Product '{product_id}' not found"})


def get_recommendations(product_id: str, limit: int = 3) -> str:
    """Get product recommendations based on a product.

    Args:
        product_id: The product ID to base recommendations on.
        limit: Maximum number of recommendations.

    Returns:
        JSON string of recommended products.
    """
    source = None
    for product in PRODUCT_CATALOG:
        if product["id"] == product_id:
            source = product
            break

    if not source:
        return json.dumps({"error": f"Product '{product_id}' not found"})

    # Simple recommendation: same category, different product, sorted by price proximity
    recs = [
        p for p in PRODUCT_CATALOG
        if p["id"] != product_id
    ]
    # Sort by price proximity to the source product
    recs.sort(key=lambda p: abs(p["price"] - source["price"]))

    return json.dumps(
        {
            "based_on": source["name"],
            "recommendations": recs[:limit],
        },
        indent=2,
    )