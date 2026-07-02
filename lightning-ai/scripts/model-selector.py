#!/usr/bin/env python3
"""
Lightning AI Model Selector — Ms Money Penny Store
====================================================
Intelligent model routing based on task requirements,
cost constraints, and performance needs.

Usage:
    python model-selector.py --task chat --budget 0.01 --latency 2.0
    python model-selector.py --task reasoning --context-size 200000
    python model-selector.py --list-models
    python model-selector.py --compare gpt-oss-120b gemini-3-flash
"""

import argparse
import json
import sys

# ── Lightning AI Model Registry ──────────────────────────────────────────────

MODELS = {
    # Lightning AI Native Models
    "gpt-oss-20b": {
        "provider": "Lightning AI",
        "input_cost": 0.05,
        "output_cost": 0.20,
        "cache_input": 0.01,
        "cache_output": 0.05,
        "latency": 3.04,
        "throughput": 6.43,
        "context_length": 128000,
        "tier": "economy",
        "strengths": ["cheapest", "batch-processing", "simple-tasks"],
    },
    "gpt-oss-120b": {
        "provider": "Lightning AI",
        "input_cost": 0.10,
        "output_cost": 0.40,
        "cache_input": 0.02,
        "cache_output": 0.10,
        "latency": 0.90,
        "throughput": 177.56,
        "context_length": 128000,
        "tier": "standard",
        "strengths": ["high-throughput", "code-gen", "production-chat"],
    },
    "llama-3.3-70b": {
        "provider": "Lightning AI",
        "input_cost": 0.30,
        "output_cost": 0.30,
        "cache_input": 0.07,
        "cache_output": 0.07,
        "latency": 0.83,
        "throughput": 60.23,
        "context_length": 128000,
        "tier": "standard",
        "strengths": ["balanced", "multilingual", "open-source"],
    },
    "deepseek-v3.1": {
        "provider": "Lightning AI",
        "input_cost": 0.32,
        "output_cost": 1.10,
        "cache_input": 0.08,
        "cache_output": 0.28,
        "latency": 0.65,
        "throughput": 90.23,
        "context_length": 164000,
        "tier": "standard",
        "strengths": ["reasoning", "math", "science", "code-review"],
    },
    "nvidia-nemotron-3-super-120b": {
        "provider": "Lightning AI",
        "input_cost": 1.40,
        "output_cost": 3.00,
        "cache_input": 0.35,
        "cache_output": 0.75,
        "latency": 1.06,
        "throughput": 376.15,
        "context_length": 256000,
        "tier": "premium",
        "strengths": ["fastest-throughput", "enterprise", "long-context"],
    },
    "minimax-m2.5": {
        "provider": "Lightning AI",
        "input_cost": 1.00,
        "output_cost": 4.80,
        "cache_input": 0.25,
        "cache_output": 1.20,
        "latency": 0.85,
        "throughput": 108.49,
        "context_length": 196000,
        "tier": "premium",
        "strengths": ["creative-content", "multi-modal", "high-context"],
    },
    "kimi-k2.5": {
        "provider": "Lightning AI",
        "input_cost": 2.32,
        "output_cost": 12.00,
        "cache_input": 0.58,
        "cache_output": 3.00,
        "latency": 0.63,
        "throughput": 280.46,
        "context_length": 256000,
        "tier": "premium",
        "strengths": ["ultra-long-context", "research", "lowest-latency"],
    },
    "glm-5": {
        "provider": "Lightning AI",
        "input_cost": 3.60,
        "output_cost": 12.80,
        "cache_input": 0.90,
        "cache_output": 3.20,
        "latency": 4.86,
        "throughput": 54.95,
        "context_length": 200000,
        "tier": "premium",
        "strengths": ["advanced-reasoning", "multilingual", "analytics"],
    },
    # OpenAI Models
    "gpt-5-nano": {
        "provider": "OpenAI",
        "input_cost": 0.05,
        "output_cost": 0.40,
        "latency": 2.42,
        "throughput": 107.33,
        "context_length": 400000,
        "tier": "economy",
        "strengths": ["huge-context", "lightweight", "cost-efficient"],
    },
    "gpt-3.5-turbo": {
        "provider": "OpenAI",
        "input_cost": 0.50,
        "output_cost": 1.50,
        "latency": 1.15,
        "throughput": 88.68,
        "context_length": 16000,
        "tier": "standard",
        "strengths": ["legacy", "simple-chat", "well-tested"],
    },
    "gpt-5-mini": {
        "provider": "OpenAI",
        "input_cost": 0.25,
        "output_cost": 2.00,
        "latency": 35.39,
        "throughput": 3.23,
        "context_length": 400000,
        "tier": "premium",
        "strengths": ["deep-reasoning", "complex-analysis", "accuracy"],
    },
    # Google Models
    "gemini-2.5-flash-lite": {
        "provider": "Google",
        "input_cost": 0.10,
        "output_cost": 0.40,
        "latency": 4.80,
        "throughput": 7.61,
        "context_length": 1000000,
        "tier": "economy",
        "strengths": ["1M-context", "document-analysis", "cheap"],
    },
    "gemini-3-flash": {
        "provider": "Google",
        "input_cost": 0.50,
        "output_cost": 1.00,
        "latency": 1.66,
        "throughput": 159.34,
        "context_length": 1000000,
        "tier": "standard",
        "strengths": ["1M-context", "high-throughput", "multi-modal"],
    },
    "gemini-2.5-flash": {
        "provider": "Google",
        "input_cost": 0.30,
        "output_cost": 2.50,
        "latency": 5.42,
        "throughput": 20.31,
        "context_length": 1000000,
        "tier": "standard",
        "strengths": ["1M-context", "reasoning", "balanced"],
    },
}

# ── Task-to-Model Mapping ────────────────────────────────────────────────────

TASK_RECOMMENDATIONS = {
    "chat": ["gpt-oss-120b", "llama-3.3-70b", "gemini-3-flash"],
    "reasoning": ["deepseek-v3.1", "gpt-5-mini", "glm-5"],
    "code": ["gpt-oss-120b", "deepseek-v3.1", "llama-3.3-70b"],
    "batch": ["gpt-oss-20b", "gpt-5-nano", "gemini-2.5-flash-lite"],
    "creative": ["minimax-m2.5", "gpt-oss-120b", "gemini-3-flash"],
    "documents": ["gemini-3-flash", "nvidia-nemotron-3-super-120b", "gemini-2.5-flash"],
    "enterprise": ["nvidia-nemotron-3-super-120b", "gpt-oss-120b", "gemini-3-flash"],
    "research": ["kimi-k2.5", "gpt-5-mini", "deepseek-v3.1"],
    "multilingual": ["llama-3.3-70b", "glm-5", "gemini-3-flash"],
}


def list_models(sort_by="input_cost"):
    """Print all models sorted by the given field."""
    sorted_models = sorted(MODELS.items(), key=lambda x: x[1].get(sort_by, 0))
    print(f"\n{'Model':<35} {'Provider':<15} {'In ⚡/M':<10} {'Out ⚡/M':<10} "
          f"{'Latency':<10} {'Tput':<10} {'Context':<10} {'Tier':<10}")
    print("─" * 120)
    for name, m in sorted_models:
        print(f"{name:<35} {m['provider']:<15} {m['input_cost']:<10.2f} "
              f"{m['output_cost']:<10.2f} {m['latency']:<10.2f} "
              f"{m['throughput']:<10.2f} {m['context_length']:<10,} {m['tier']:<10}")
    print()


def recommend(task=None, budget=None, latency=None, context_size=None):
    """Recommend the best model based on constraints."""
    candidates = list(MODELS.items())

    # Filter by context size
    if context_size:
        candidates = [(n, m) for n, m in candidates if m["context_length"] >= context_size]

    # Filter by latency
    if latency:
        candidates = [(n, m) for n, m in candidates if m["latency"] <= latency]

    # Filter by budget (input cost per M tokens)
    if budget:
        candidates = [(n, m) for n, m in candidates if m["input_cost"] <= budget]

    # Score by task relevance
    if task and task in TASK_RECOMMENDATIONS:
        preferred = TASK_RECOMMENDATIONS[task]
        task_matches = [(n, m) for n, m in candidates if n in preferred]
        if task_matches:
            candidates = task_matches

    if not candidates:
        print("\n⚠️  No models match all constraints. Try relaxing your requirements.\n")
        return

    # Sort by cost-effectiveness (lower input cost first, then higher throughput)
    candidates.sort(key=lambda x: (x[1]["input_cost"], -x[1]["throughput"]))

    print(f"\n🏆 Recommended Models:")
    print(f"   Task: {task or 'any'} | Budget: ⚡{budget or 'any'}/M | "
          f"Latency: {latency or 'any'}s | Context: {context_size or 'any'}")
    print("─" * 80)
    for i, (name, m) in enumerate(candidates[:5], 1):
        marker = "→" if i == 1 else " "
        print(f"  {marker} {i}. {name}")
        print(f"      Provider: {m['provider']} | Cost: ⚡{m['input_cost']}/{m['output_cost']} | "
              f"Latency: {m['latency']}s | Throughput: {m['throughput']} tok/s | "
              f"Context: {m['context_length']:,}")
        print(f"      Strengths: {', '.join(m['strengths'])}")
    print()


def compare_models(model_names):
    """Side-by-side comparison of specified models."""
    models = {n: MODELS[n] for n in model_names if n in MODELS}
    missing = [n for n in model_names if n not in MODELS]
    if missing:
        print(f"\n⚠️  Unknown models: {', '.join(missing)}")

    if not models:
        print("No valid models to compare.")
        return

    print(f"\n📊 Model Comparison:")
    print("─" * 80)
    fields = [
        ("Provider", "provider"),
        ("Input Cost (⚡/M)", "input_cost"),
        ("Output Cost (⚡/M)", "output_cost"),
        ("Latency (s)", "latency"),
        ("Throughput (tok/s)", "throughput"),
        ("Context Length", "context_length"),
        ("Tier", "tier"),
        ("Strengths", "strengths"),
    ]

    # Header
    header = f"{'Metric':<25}"
    for name in models:
        header += f" {name:<30}"
    print(header)
    print("─" * (25 + 31 * len(models)))

    for label, field in fields:
        row = f"{label:<25}"
        for name, m in models.items():
            val = m.get(field, "N/A")
            if isinstance(val, list):
                val = ", ".join(val[:3])
            elif isinstance(val, (int, float)) and field == "context_length":
                val = f"{val:,}"
            row += f" {str(val):<30}"
        print(row)
    print()


def estimate_cost(model_name, input_tokens, output_tokens, use_cache=False):
    """Estimate cost for a specific model and token count."""
    if model_name not in MODELS:
        print(f"⚠️  Unknown model: {model_name}")
        return

    m = MODELS[model_name]
    if use_cache and "cache_input" in m:
        in_cost = (input_tokens / 1_000_000) * m["cache_input"]
        out_cost = (output_tokens / 1_000_000) * m.get("cache_output", m["output_cost"])
    else:
        in_cost = (input_tokens / 1_000_000) * m["input_cost"]
        out_cost = (output_tokens / 1_000_000) * m["output_cost"]

    total = in_cost + out_cost
    print(f"\n💰 Cost Estimate — {model_name}")
    print(f"   Input:  {input_tokens:>12,} tokens × ⚡{m['input_cost']}/M = ⚡{in_cost:.4f}")
    print(f"   Output: {output_tokens:>12,} tokens × ⚡{m['output_cost']}/M = ⚡{out_cost:.4f}")
    print(f"   {'(cached prices)' if use_cache else ''}")
    print(f"   ────────────────────────────────")
    print(f"   Total:  ⚡{total:.4f}")
    print(f"   Est. Time: {(input_tokens + output_tokens) / m['throughput']:.1f}s at {m['throughput']} tok/s")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Lightning AI Model Selector — Find the optimal model for your use case."
    )
    parser.add_argument("--list-models", action="store_true", help="List all available models")
    parser.add_argument("--sort-by", default="input_cost",
                        choices=["input_cost", "output_cost", "latency", "throughput", "context_length"],
                        help="Sort field for --list-models")
    parser.add_argument("--task", choices=list(TASK_RECOMMENDATIONS.keys()),
                        help="Task type for recommendation")
    parser.add_argument("--budget", type=float, help="Max input cost (⚡/M tokens)")
    parser.add_argument("--latency", type=float, help="Max acceptable latency (seconds)")
    parser.add_argument("--context-size", type=int, help="Required minimum context length")
    parser.add_argument("--compare", nargs="+", help="Compare specific models side by side")
    parser.add_argument("--estimate", nargs=3, metavar=("MODEL", "INPUT_TOKENS", "OUTPUT_TOKENS"),
                        help="Estimate cost for a model")
    parser.add_argument("--cached", action="store_true", help="Use cached token prices for estimate")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    if args.list_models:
        if args.json:
            print(json.dumps(MODELS, indent=2))
        else:
            list_models(sort_by=args.sort_by)
    elif args.compare:
        compare_models(args.compare)
    elif args.estimate:
        model, in_tok, out_tok = args.estimate
        estimate_cost(model, int(in_tok), int(out_tok), use_cache=args.cached)
    else:
        recommend(
            task=args.task,
            budget=args.budget,
            latency=args.latency,
            context_size=args.context_size,
        )


if __name__ == "__main__":
    main()