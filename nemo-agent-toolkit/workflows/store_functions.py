"""
Store-specific function definitions for NeMo Agent Toolkit.
These functions can be registered as tools for any NAT workflow.
"""

import json
from datetime import datetime, timedelta
from typing import Optional
import random


def get_store_info() -> str:
    """Get general store information.

    Returns:
        JSON string with store details.
    """
    return json.dumps({
        "name": "Ms Money Penny Store",
        "organization": "Life Imitates Art Inc. Nonprofit",
        "website": "https://msmoneypenny.store",
        "support_email": "support@lifeimitatesart.org",
        "hours": "Monday-Friday 9AM-6PM PST",
        "phone": "1-800-MP-STORE",
        "shipping": {
            "standard": {"days": "5-7 business days", "cost": "Free over $100, otherwise $7.99"},
            "express": {"days": "2-3 business days", "cost": "$12.99"},
            "overnight": {"days": "1 business day", "cost": "$24.99"},
        },
        "return_policy": "30-day returns with receipt. Free return shipping.",
        "warranty": "1-year manufacturer warranty on all products",
    }, indent=2)


def check_order_status(order_id: str) -> str:
    """Check the status of an order.

    Args:
        order_id: The order ID to look up.

    Returns:
        JSON string with order status details.
    """
    # Simulated order data — in production, this queries a database
    statuses = ["processing", "shipped", "out_for_delivery", "delivered"]
    today = datetime.now()

    # Generate deterministic but realistic order data from order_id
    seed = sum(ord(c) for c in order_id)
    random.seed(seed)

    status_idx = random.randint(0, len(statuses) - 1)
    status = statuses[status_idx]
    order_date = today - timedelta(days=random.randint(1, 14))
    estimated_delivery = order_date + timedelta(days=random.randint(3, 7))

    return json.dumps({
        "order_id": order_id,
        "status": status,
        "order_date": order_date.strftime("%Y-%m-%d"),
        "estimated_delivery": estimated_delivery.strftime("%Y-%m-%d"),
        "tracking_number": f"MP{seed:08d}",
        "items_count": random.randint(1, 5),
    }, indent=2)


def get_promotions(category: Optional[str] = None) -> str:
    """Get current store promotions and deals.

    Args:
        category: Optional category filter.

    Returns:
        JSON string with active promotions.
    """
    promotions = [
        {
            "id": "promo-001",
            "title": "Tech Tuesday",
            "description": "15% off all electronics every Tuesday",
            "category": "electronics",
            "discount": "15%",
            "code": "TECHTUESDAY",
            "active": True,
        },
        {
            "id": "promo-002",
            "title": "Bundle & Save",
            "description": "Buy any 3 accessories, get 20% off the bundle",
            "category": "accessories",
            "discount": "20%",
            "code": "BUNDLE20",
            "active": True,
        },
        {
            "id": "promo-003",
            "title": "New Customer Welcome",
            "description": "10% off your first order",
            "category": "all",
            "discount": "10%",
            "code": "WELCOME10",
            "active": True,
        },
        {
            "id": "promo-004",
            "title": "Free Shipping Week",
            "description": "Free standard shipping on all orders this week",
            "category": "all",
            "discount": "Free shipping",
            "code": "FREESHIP",
            "active": True,
        },
    ]

    if category:
        promotions = [
            p for p in promotions
            if p["category"].lower() == category.lower() or p["category"] == "all"
        ]

    return json.dumps({
        "count": len(promotions),
        "promotions": promotions,
    }, indent=2)


def calculate_cart_total(
    product_ids: list,
    promo_code: Optional[str] = None,
    shipping_method: str = "standard",
) -> str:
    """Calculate cart total with optional promo code and shipping.

    Args:
        product_ids: List of product IDs in the cart.
        promo_code: Optional promotional code to apply.
        shipping_method: Shipping method (standard, express, overnight).

    Returns:
        JSON string with cart total breakdown.
    """
    from .product_tools import PRODUCT_CATALOG

    items = []
    subtotal = 0.0

    for pid in product_ids:
        for product in PRODUCT_CATALOG:
            if product["id"] == pid:
                items.append({"name": product["name"], "price": product["price"]})
                subtotal += product["price"]
                break

    # Shipping costs
    shipping_costs = {"standard": 7.99, "express": 12.99, "overnight": 24.99}
    shipping = shipping_costs.get(shipping_method, 7.99)
    if subtotal >= 100:
        shipping = 0.0  # Free shipping over $100

    # Apply promo code
    discount = 0.0
    discount_label = None
    if promo_code:
        code = promo_code.upper()
        if code == "TECHTUESDAY":
            discount = subtotal * 0.15
            discount_label = "Tech Tuesday 15% off"
        elif code == "BUNDLE20" and len(items) >= 3:
            discount = subtotal * 0.20
            discount_label = "Bundle & Save 20% off"
        elif code == "WELCOME10":
            discount = subtotal * 0.10
            discount_label = "New Customer 10% off"
        elif code == "FREESHIP":
            shipping = 0.0
            discount_label = "Free Shipping applied"

    total = subtotal - discount + shipping

    return json.dumps({
        "items": items,
        "subtotal": round(subtotal, 2),
        "discount": round(discount, 2),
        "discount_label": discount_label,
        "shipping": round(shipping, 2),
        "shipping_method": shipping_method,
        "total": round(total, 2),
    }, indent=2)