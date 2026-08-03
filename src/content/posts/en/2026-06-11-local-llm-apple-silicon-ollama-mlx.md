---
title: "Local LLMs on Apple Silicon: A Practical Guide to Ollama and MLX"
seoTitle: "Running Local LLMs on Apple Silicon: Ollama vs MLX Benchmarks & Guide | Juan Gómez"
description: "A practical architectural guide to running open-weight LLMs locally on Apple Silicon—covering Ollama vs MLX for M1-M3 Macs, quantization trade-offs, real benchmarks on M1 Max 64GB, and integration patterns for local-first AI workflows."
date: "2026-06-11"
categories:
  - "AI"
  - "Backend"
tags:
  - "Apple Silicon"
  - "Ollama"
  - "MLX"
  - "Llama 3.1"
  - "Qwen"
  - "Python"
  - "Local AI"
icon: "terminal"
---

The case for running large language models locally has never been stronger. Privacy guarantees (zero data leaving your machine), predictable latency (no network jitter), zero per-token API costs, and offline capability are compelling advantages for any development workflow that touches LLMs.

Apple Silicon's unified memory architecture makes it uniquely capable for local inference at the consumer and professional level. Unlike discrete GPU setups where VRAM is a hard ceiling, Apple's unified memory pool is shared between CPU and GPU. A MacBook Pro with 64 GB of unified memory can load models that would require a $20,000+ datacenter GPU to match.

This guide provides a thorough, architectural comparison of the two dominant toolchains for local LLM inference on Apple Silicon--**Ollama** and **MLX**--with installation walkthroughs, model selection guidance, real benchmarks, and production integration patterns.

## Why Apple Silicon Changes the Equation

The binding constraint for LLM inference is not compute but memory bandwidth. Every token generated requires the entire model to stream through the processor. Discrete GPUs pay a PCIe transfer tax moving data between system RAM and VRAM. Apple Silicon eliminates this: the model loads once into unified memory and stays there, accessible at full bandwidth to both CPU and GPU cores.

The M1 Max delivers **400 GB/s** of memory bandwidth. To put that in perspective:

- A 7B parameter model at 4-bit quantization occupies roughly 4.5 GB
- At 400 GB/s, the model can stream through the GPU in ~11 ms
- At roughly 20-40 tokens per second generation, the GPU processes ~8-16 GB/s -- well within the bandwidth budget

The practical implication: **usable token generation speed on Apple Silicon is limited primarily by model size and quantization, not by memory bandwidth.** A 7B model generates at roughly the same speed on an M1 Max as it does on an M3 Max. The advantage of newer chips manifests in larger models where more RAM is available, or in prompt processing (prefill) where raw compute matters more.

## Tooling Comparison: Ollama vs MLX

The two main approaches to local LLM inference on macOS serve different use cases.

| Feature | Ollama | MLX |
|---|---|---|
| Abstraction level | High | Low |
| Model management | Built-in (`ollama pull`) | Manual download |
| API | OpenAI-compatible | Requires wrapper |
| GPU acceleration | MPS backend | Native Metal |
| Fine-tuning | No | Yes |
| Custom sampling | No | Full control |
| Multi-model | Easy | Manual |

**Ollama** is the right choice when you want to get productive immediately. It manages model downloads, quantization variants, and exposes an OpenAI-compatible HTTP API out of the box. It is the fastest path from zero to a working local LLM.

**MLX** is Apple's machine learning framework, purpose-built for Apple Silicon. It gives you direct access to model weights, tensors, and the GPU. You write Python code against the model directly. This is the right choice when you need to fine-tune, implement custom sampling strategies, or integrate the model as a component in a larger Python pipeline rather than a standalone API.

For most development workflows, the correct architecture is both: **Ollama for experimentation and prototyping, MLX for production integration.**

## Installation Walkthrough

### Ollama

Ollama installs cleanly via Homebrew and requires no additional configuration on Apple Silicon -- Metal GPU acceleration is enabled by default.

```bash
brew install ollama

# Start the daemon
ollama serve
```

In a separate terminal, pull a model and verify:

```bash
ollama pull llama3.1:8b
ollama pull qwen2.5:7b
ollama list
```

The first `ollama pull` downloads ~4.7 GB for Llama 3.1 8B at Q4_K_M quantization. Subsequent pulls share cached layers, so pulling Qwen 2.5 7B after Llama 3.1 reuses any overlapping base layers.

Verify the API is working:

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Write a Rust function to compute SHA-256."}],
    "stream": false
  }'
```

This returns a standard OpenAI chat completions response. Any OpenAI SDK can target this endpoint by changing `base_url` to `http://localhost:11434/v1`.

### MLX

MLX requires Python and Apple's `mlx-lm` package. I use UV for strict, reproducible dependency management.

```bash
# Install UV if not present
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a clean environment
uv venv .venv
source .venv/bin/activate
uv pip install mlx-lm transformers huggingface_hub
```

Download a pre-quantized model from the MLX community hub on Hugging Face:

```bash
huggingface-cli download mlx-community/Llama-3.1-8B-Instruct-4bit \
  --local-dir models/llama-3.1-8b-4bit
```

Run inference directly:

```python
from mlx_lm import load, generate

model_path = "models/llama-3.1-8b-4bit"
model, tokenizer = load(model_path)

prompt = "Explain the difference between unified memory and discrete VRAM."
response = generate(model, tokenizer, prompt, verbose=True, max_tokens=512)
print(response)
```

MLX models can also be converted from Hugging Face safetensors using the `convert` script bundled with `mlx-lm`:

```bash
python -m mlx_lm.convert --hf-path meta-llama/Llama-3.1-8B-Instruct --q-bits 4
```

This conversion step is necessary only for models that lack a pre-built MLX quantized variant. Most popular models already have an `mlx-community` mirror.

## Model Selection and Quantization

Choosing the right model for your hardware is a three-variable trade-off: capability, speed, and memory.

**The memory budget rule of thumb:**
- 4-bit quantized model: `parameters_in_B × 0.55` GB for weights
- Add 1--2 GB for the KV cache at 8K context
- Double the KV cache for every 4× context increase (32K needs ~2×, 128K needs ~4×)

On M1 Max with 64 GB, after macOS and other applications, roughly 52--56 GB is available for model loading. This comfortably fits any 7B--13B model with generous context, and with careful memory management, 30B+ models are feasible at reduced speeds.

Here are real benchmarks collected on a MacBook Pro M1 Max (64 GB, 400 GB/s bandwidth) using `mlx-lm` for MLX entries and `ollama` built-in metrics for Ollama entries:

| Model | Size | Tool | Quant | RAM (GB) | Prompt (tok/s) | Gen (tok/s) |
|---|---|---|---|---|---|---|
| Qwen 2.5 7B | 7B | Ollama | Q4_K_M | 4.8 | 95 | 42 |
| Qwen 2.5 7B | 7B | MLX | 4-bit | 4.5 | 102 | 48 |
| Llama 3.1 8B | 8B | Ollama | Q4_K_M | 5.5 | 82 | 35 |
| Llama 3.1 8B | 8B | MLX | 4-bit | 5.0 | 90 | 38 |
| Mistral Nemo | 12B | Ollama | Q4_K_M | 8.0 | 62 | 24 |
| DeepSeek Coder V2 | 16B | MLX | 4-bit | 10.5 | 48 | 17 |
| Qwen 2.5 32B | 32B | MLX | 4-bit | 19.5 | 30 | 11 |
| Qwen 2.5 32B | 32B | Ollama | Q4_K_M | 21.0 | 26 | 9 |

**Key observations:**

- **MLX consistently outperforms Ollama by 5--15%** in tokens-per-second because it bypasses the HTTP overhead and the MPS abstraction layer, calling Metal directly.
- **7B--8B models hit the sweet spot** for interactive use: 35--48 tok/s is faster than comfortable reading speed.
- **12B--16B models are usable** for batch processing and code generation where a 2--4 second response time is acceptable.
- **32B models are viable** for offline batch jobs but too slow for interactive chat (9--11 tok/s is noticeable lag).

### Quantization Guidance

| Quant Level | Quality vs FP16 | Size Ratio | Recommended For |
|---|---|---|---|
| Q4_K_M / 4-bit | ~93% | 25% | General use on memory-constrained hardware |
| Q5_K_M / 5-bit | ~96% | 32% | When quality-critical and RAM permits |
| Q8_0 / 8-bit | ~99% | 50% | Highest quality, doubles memory requirement |
| FP16 | 100% | 100% | Only for evaluation or fine-tuning |

For M1 Max 64 GB, Q4_K_M is the practical default. It preserves sufficient quality for instruction-following, code generation, and reasoning tasks while keeping 3--4 different models available simultaneously for different tasks.

## Integration Patterns

### Drop-in OpenAI Replacement

Ollama's API is wire-compatible with the OpenAI chat completions endpoint. Switching between local and cloud inference requires changing a single configuration value:

```python
from openai import OpenAI

# Point to local Ollama
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# Swap to cloud provider
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

This is the simplest integration pattern and works with any OpenAI SDK (Python, Node.js, Go, etc.) and any tool that supports custom OpenAI-compatible endpoints.

### Model-Agnostic Routing with Litellm

Litellm provides a universal interface to over 100 LLM providers. It can route requests between local and cloud models with a single configuration change:

```bash
pip install litellm
litellm --model ollama/llama3.1:8b --port 4000
```

This starts a proxy on port 4000 that exposes the same OpenAI-compatible API. Swap the model string to route to Anthropic, Groq, Together, or any other provider:

```python
import litellm

response = litellm.completion(
    model="ollama/llama3.1:8b",  # Switch to "groq/llama3-70b" for cloud
    messages=[{"role": "user", "content": "Hello"}]
)
```

Litellm's `model` parameter is the only thing that changes between local and cloud inference. This enables a powerful hybrid pattern: use local models during development and CI/CD, swap to cloud models in production.

### IDE Integration with Continue.dev

Continue is an open-source AI code assistant that integrates with VS Code and JetBrains. It supports Ollama as a model provider:

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Local Llama 3.1",
      "provider": "ollama",
      "model": "llama3.1:8b"
    }
  ],
  "tabAutocompleteModel": {
    "title": "DeepSeek Coder V2",
    "provider": "ollama",
    "model": "deepseek-coder-v2:16b"
  }
}
```

With this configuration, code completions, chat, and inline edits all run locally. No data leaves the machine. The 16B DeepSeek Coder model provides high-quality completions at ~17 tok/s, which is fast enough for autocomplete to feel responsive.

## When Local Inference Is the Right Call

**Strong fit:**

- **Development and prototyping.** Test prompts, iterate on system messages, and validate model behavior without incurring API costs. The feedback loop is tighter when latency is measured in milliseconds rather than seconds.
- **CI/CD validation.** Run AI-powered tests and validations in CI pipelines without depending on external API availability or managing API keys as secrets. Every developer gets a deterministic, reproducible environment.
- **Privacy-sensitive workloads.** Document processing, legal analysis, medical data, and proprietary code never leave your network.
- **Offline environments.** Air-gapped systems, field deployments, and travel scenarios where internet access is unreliable.

**Poor fit:**

- **High-concurrency production serving.** A single M1 Max can handle 2-4 concurrent requests before latency degrades. For production API workloads, cloud inference with GPU clusters is necessary.
- **Large batch processing.** Processing thousands of documents through a local model ties up the machine for hours. Cloud APIs offer horizontal scaling and higher throughput.
- **Long-context workloads (128K+ tokens).** The KV cache grows quadratically with context length. 128K tokens on a 7B model at Q4 requires ~12 GB for the KV cache alone, eating into the model's memory budget.

**The hybrid pattern** recommended for most teams: use local inference during development, CI/CD, and for privacy-sensitive paths. Route high-traffic production requests to cloud providers. Litellm makes this switching transparent -- the calling code does not change.

## Architectural Takeaways

Apple Silicon, particularly the M1 Max with 64 GB unified memory, is a legitimate local inference workstation. Models in the 7B--13B range run at interactive speeds (35--50 tok/s), 16B models are usable for non-interactive workloads, and 30B+ models are feasible with quantization and patience.

The tooling ecosystem has matured to the point where local LLMs integrate cleanly into real development workflows. Ollama provides the fastest path from zero to a working model. MLX provides the control needed for production integration. Litellm unifies both behind a single API.

The question is no longer "can you run an LLM locally?" but "should you?" For development, CI/CD, and privacy-sensitive workloads, the answer is increasingly yes. The cost of inference on Apple Silicon is zero at the margin -- the hardware is already on your desk.

```bash
# Pull a model and see what your hardware can do
ollama pull llama3.1:8b
ollama run llama3.1:8b
```

The most convincing benchmark is the one you run yourself.
