"""
Customer support agent logic for Ms Money Penny Store.
Implements the support workflow with escalation handling.
"""

import json
from datetime import datetime
from typing import Optional


# FAQ knowledge base
FAQ_DATABASE = {
    "return_policy": {
        "question": "What is your return policy?",
        "answer": (
            "We accept returns within 30 days of purchase with a valid receipt. "
            "Items must be in original condition with all packaging. "
            "Free return shipping is provided for all returns. "
            "Refunds are processed within 5-7 business days after we receive the item."
        ),
    },
    "shipping": {
        "question": "What are your shipping options?",
        "answer": (
            "We offer three shipping options: "
            "Standard (5-7 business days, free on orders over $100, otherwise $7.99), "
            "Express (2-3 business days, $12.99), and "
            "Overnight (1 business day, $24.99). "
            "All orders include tracking information."
        ),
    },
    "warranty": {
        "question": "What warranty do your products come with?",
        "answer": (
            "All products from the Ms Money Penny Store come with a 1-year manufacturer warranty. "
            "This covers defects in materials and workmanship under normal use. "
            "For warranty claims, contact our support team with your order number and a description of the issue."
        ),
    },
    "payment": {
        "question": "What payment methods do you accept?",
        "answer": (
            "We accept Visa, Mastercard, American Express, Discover, PayPal, "
            "Apple Pay, Google Pay, and Shop Pay. "
            "All transactions are encrypted and secure."
        ),
    },
    "price_match": {
        "question": "Do you offer price matching?",
        "answer": (
            "Yes! We offer price matching for identical items sold by authorized retailers. "
            "The item must be in stock and available for purchase at the lower price. "
            "Contact support with a link to the lower-priced item to request a price match."
        ),
    },
    "account": {
        "question": "How do I create or manage my account?",
        "answer": (
            "You can create an account at checkout or by visiting our website. "
            "Your account lets you track orders, save addresses, view order history, "
            "and manage your wishlist. You can reset your password anytime from the login page."
        ),
    },
}


def search_faq(query: str) -> str:
    """Search the FAQ database for relevant answers.

    Args:
        query: The customer's question or search terms.

    Returns:
        JSON string with matching FAQ entries.
    """
    query_lower = query.lower()
    matches = []

    for key, faq in FAQ_DATABASE.items():
        # Simple keyword matching — in production, use embeddings/vector search
        if (
            any(word in query_lower for word in key.split("_"))
            or any(word in faq["question"].lower() for word in query_lower.split())
            or any(word in faq["answer"].lower() for word in query_lower.split())
        ):
            matches.append(faq)

    if not matches:
        # Return all FAQs if no match
        matches = list(FAQ_DATABASE.values())

    return json.dumps({
        "count": len(matches),
        "results": matches,
    }, indent=2)


def create_support_ticket(
    customer_email: str,
    subject: str,
    description: str,
    priority: str = "normal",
    category: Optional[str] = None,
) -> str:
    """Create a support ticket for escalation to human agents.

    Args:
        customer_email: Customer's email address.
        subject: Brief subject of the issue.
        description: Detailed description of the problem.
        priority: Ticket priority (low, normal, high, urgent).
        category: Issue category (order, product, billing, technical, other).

    Returns:
        JSON string with ticket confirmation details.
    """
    ticket_id = f"TKT-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    return json.dumps({
        "ticket_id": ticket_id,
        "status": "created",
        "customer_email": customer_email,
        "subject": subject,
        "description": description,
        "priority": priority,
        "category": category or "other",
        "created_at": datetime.now().isoformat(),
        "estimated_response": "Within 24 hours" if priority in ("low", "normal") else "Within 4 hours",
        "message": (
            f"Support ticket {ticket_id} has been created successfully. "
            f"A member of our team will respond to {customer_email} "
            f"{'within 24 hours' if priority in ('low', 'normal') else 'within 4 hours'}."
        ),
    }, indent=2)


def get_support_hours() -> str:
    """Get current support availability.

    Returns:
        JSON string with support hours and current status.
    """
    now = datetime.now()
    hour = now.hour
    weekday = now.weekday()  # 0=Monday, 6=Sunday

    is_business_hours = weekday < 5 and 9 <= hour < 18  # Mon-Fri 9AM-6PM

    return json.dumps({
        "current_time": now.strftime("%Y-%m-%d %H:%M %Z"),
        "is_open": is_business_hours,
        "hours": "Monday-Friday 9:00 AM - 6:00 PM PST",
        "channels": {
            "live_chat": {"available": is_business_hours, "wait_time": "~2 minutes"},
            "email": {"available": True, "response_time": "Within 24 hours"},
            "phone": {"available": is_business_hours, "number": "1-800-MP-STORE"},
        },
        "message": (
            "Our support team is currently available! How can we help?"
            if is_business_hours
            else "We're currently outside business hours. Please leave a message and we'll respond within 24 hours."
        ),
    }, indent=2)