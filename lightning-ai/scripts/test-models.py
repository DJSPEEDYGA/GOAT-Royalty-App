#!/usr/bin/env python3
"""
Lightning AI Model APIs — Test Script
=======================================
Tests connectivity and basic functionality of all Lightning AI models.

Usage:
    export LIGHTNING_API_KEY="your-key"
    python test-models.py                    # Test default model
    python test-models.py --model gpt-oss-20b  # Test specific model
    python test-models.py --all              # Test all models
    python test-models.py --benchmark        # Run performance benchmark
"""

import argparse
import json
import os
import sys
import time

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package required. Run: pip install openai")
    sys.exit(1)

# ── Configuration ────────────────────────────────────────────────────────────

API_KEY = os.environ.get("LIGHTNING_API_KEY", "")
BASE_URL = os.environ.get("LIGHTNING_API_BASE", "https://api.lightning.ai/v1")
DEFAULT_MODEL = os.environ.get("LIGHTNING_DEFAULT_MODEL", "gpt-oss-120b")

ALL_MODELS = [
    "gpt-oss-20b",
    "gpt-oss-120b",
    "llama-3.3-70b",
    "deepseek-v3.1",
    "nvidia-nemotron-3-super-120b",
    "minimax-m2.5",
    "kimi-k2.5",
    "glm-5",
    "gpt-5-nano",
    "gpt-3.5-turbo",
    "gpt-5-mini",
    "gemini-2.5-flash-lite",
    "gemini-3-flash",
    "gemini-2.5-flash",
]

TEST_PROMPT = "What is 2 + 2? Reply with just the number."
BENCHMARK_PROMPT = (
    "Write a detailed product description for a luxury smartwatch "
    "that combines fitness tracking with elegant design. Include "
    "key features, materials, and target audience. About 200 words."
)


def get_client():
    """Create OpenAI-compatible client for Lightning AI."""
    if not API_KEY:
        print("⚠️  LIGHTNING_API_KEY not set.")
        print("   Export it: export LIGHTNING_API_KEY='your-key-here'")
        print("   Get one at: https://lightning.ai")
        sys.exit(1)
    return OpenAI(api_key=API_KEY, base_url=BASE_URL)


def test_model(client, model_name, prompt=TEST_PROMPT, verbose=True):
    """Test a single model and return results."""
    if verbose:
        print(f"\n  Testing: {model_name}")
        print(f"  Prompt:  \"{prompt[:60]}...\"" if len(prompt) > 60 else f"  Prompt:  \"{prompt}\"")

    start = time.time()
    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256,
            temperature=0.3,
        )
        elapsed = time.time() - start
        content = response.choices[0].message.content.strip()
        usage = response.usage

        result = {
            "model": model_name,
            "status": "✅ OK",
            "response": content[:100],
            "latency": round(elapsed, 2),
            "input_tokens": usage.prompt_tokens if usage else 0,
            "output_tokens": usage.completion_tokens if usage else 0,
            "total_tokens": usage.total_tokens if usage else 0,
        }

        if verbose:
            print(f"  Status:  ✅ OK ({elapsed:.2f}s)")
            print(f"  Reply:   \"{content[:80]}\"")
            print(f"  Tokens:  {result['input_tokens']} in / {result['output_tokens']} out")

        return result

    except Exception as e:
        elapsed = time.time() - start
        result = {
            "model": model_name,
            "status": "❌ FAIL",
            "error": str(e)[:200],
            "latency": round(elapsed, 2),
        }
        if verbose:
            print(f"  Status:  ❌ FAIL ({elapsed:.2f}s)")
            print(f"  Error:   {str(e)[:100]}")
        return result


def test_all_models(client):
    """Test all available models."""
    print("\n" + "═" * 60)
    print("  ⚡ Lightning AI — Testing All Models")
    print("═" * 60)

    results = []
    passed = 0
    failed = 0

    for model in ALL_MODELS:
        result = test_model(client, model)
        results.append(result)
        if "OK" in result["status"]:
            passed += 1
        else:
            failed += 1

    print("\n" + "─" * 60)
    print(f"  Results: ✅ {passed} passed / ❌ {failed} failed / 📊 {len(ALL_MODELS)} total")
    print("─" * 60)

    return results


def run_benchmark(client, model_name):
    """Run a performance benchmark on a specific model."""
    print(f"\n{'═' * 60}")
    print(f"  ⚡ Benchmarking: {model_name}")
    print(f"{'═' * 60}")

    iterations = 3
    latencies = []
    token_rates = []

    for i in range(iterations):
        print(f"\n  Run {i + 1}/{iterations}:")
        start = time.time()

        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": BENCHMARK_PROMPT}],
                max_tokens=512,
                temperature=0.7,
            )
            elapsed = time.time() - start
            usage = response.usage
            output_tokens = usage.completion_tokens if usage else 0

            latencies.append(elapsed)
            rate = output_tokens / elapsed if elapsed > 0 else 0
            token_rates.append(rate)

            print(f"    Latency: {elapsed:.2f}s | Tokens: {output_tokens} | Rate: {rate:.1f} tok/s")

        except Exception as e:
            print(f"    ❌ Error: {str(e)[:100]}")

    if latencies:
        avg_lat = sum(latencies) / len(latencies)
        avg_rate = sum(token_rates) / len(token_rates)
        min_lat = min(latencies)
        max_lat = max(latencies)

        print(f"\n  {'─' * 50}")
        print(f"  📊 Benchmark Results for {model_name}:")
        print(f"     Avg Latency:    {avg_lat:.2f}s")
        print(f"     Min Latency:    {min_lat:.2f}s")
        print(f"     Max Latency:    {max_lat:.2f}s")
        print(f"     Avg Throughput: {avg_rate:.1f} tok/s")
        print(f"  {'─' * 50}")


def test_streaming(client, model_name):
    """Test streaming response from a model."""
    print(f"\n  📡 Streaming test: {model_name}")

    start = time.time()
    tokens = 0

    try:
        stream = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": "Count from 1 to 10."}],
            max_tokens=128,
            stream=True,
        )

        print("  Response: ", end="", flush=True)
        for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)
                tokens += 1

        elapsed = time.time() - start
        print(f"\n  ✅ Streaming OK — {tokens} chunks in {elapsed:.2f}s")

    except Exception as e:
        elapsed = time.time() - start
        print(f"\n  ❌ Streaming failed: {str(e)[:100]}")


def main():
    parser = argparse.ArgumentParser(description="Test Lightning AI Model APIs")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model to test")
    parser.add_argument("--all", action="store_true", help="Test all models")
    parser.add_argument("--benchmark", action="store_true", help="Run performance benchmark")
    parser.add_argument("--stream", action="store_true", help="Test streaming")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    client = get_client()

    if args.all:
        results = test_all_models(client)
        if args.json:
            print(json.dumps(results, indent=2))
    elif args.benchmark:
        run_benchmark(client, args.model)
    elif args.stream:
        test_streaming(client, args.model)
    else:
        result = test_model(client, args.model)
        if args.json:
            print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()