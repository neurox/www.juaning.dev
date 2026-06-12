---
title: "LLMs Locales en Apple Silicon: Guía Práctica de Ollama y MLX"
seoTitle: "Ejecutar LLMs Locales en Apple Silicon: Guía de Ollama vs MLX | Juan Gómez"
description: "Una guía arquitectónica práctica para ejecutar LLMs de peso abierto localmente en Apple Silicon — comparativa Ollama vs MLX para Mac M1-M3, compensaciones de cuantización, benchmarks reales en M1 Max 64GB y patrones de integración para flujos de trabajo de IA locales."
date: "2026-06-11"
categories:
  - "IA"
  - "Backend"
tags:
  - "Apple Silicon"
  - "Ollama"
  - "MLX"
  - "Llama 3.1"
  - "Qwen"
  - "Python"
  - "IA Local"
icon: "terminal"
url: "/es/post/2026/llms-locales-apple-silicon-ollama-mlx/"
---

El caso para ejecutar modelos de lenguaje grandes (LLMs) localmente nunca ha sido más sólido. Privacidad garantizada (cero datos saliendo de tu máquina), latencia predecible (sin fluctuación de red), cero costos por token, y capacidad de funcionar sin conexión son ventajas contundentes para cualquier flujo de trabajo de desarrollo que interactúe con LLMs.

La arquitectura de memoria unificada de Apple Silicon la hace excepcionalmente capaz para inferencia local a nivel profesional y de consumo. A diferencia de configuraciones con GPU discretas donde la VRAM es un límite duro, el pool de memoria unificada de Apple es compartido entre CPU y GPU. Una MacBook Pro con 64 GB de memoria unificada puede cargar modelos que requerirían una GPU de datacenter de más de $20,000 USD para igualar.

Esta guía ofrece una comparación arquitectónica profunda de las dos cadenas de herramientas dominantes para inferencia local de LLMs en Apple Silicon -- **Ollama** y **MLX** -- con tutoriales de instalación, guía de selección de modelos, benchmarks reales y patrones de integración para producción.

## Por Qué Apple Silicon Cambia la Ecuación

La restricción principal para la inferencia de LLMs no es el cómputo sino el ancho de banda de memoria. Cada token generado requiere que el modelo completo fluya a través del procesador. Las GPUs discretas pagan un impuesto de transferencia PCIe al mover datos entre la RAM del sistema y la VRAM. Apple Silicon elimina esto: el modelo se carga una vez en la memoria unificada y permanece allí, accesible a máximo ancho de banda tanto para CPU como para GPU.

El M1 Max entrega **400 GB/s** de ancho de banda de memoria. Para ponerlo en perspectiva:

- Un modelo de 7B parámetros en cuantización 4-bit ocupa aproximadamente 4.5 GB
- A 400 GB/s, el modelo puede transmitirse a través de la GPU en ~11 ms
- A una generación de aproximadamente 20-40 tokens por segundo, la GPU procesa ~8-16 GB/s -- muy dentro del presupuesto de ancho de banda

La implicación práctica: **la velocidad de generación de tokens en Apple Silicon está limitada principalmente por el tamaño del modelo y la cuantización, no por el ancho de banda de memoria.** Un modelo de 7B genera aproximadamente a la misma velocidad en un M1 Max que en un M3 Max. La ventaja de los chips más nuevos se manifiesta en modelos más grandes donde hay más RAM disponible, o en el procesamiento de prompts (prefill) donde el cómputo bruto importa más.

## Comparativa de Herramientas: Ollama vs MLX

Los dos enfoques principales para inferencia local de LLMs en macOS sirven diferentes casos de uso.

| Característica | Ollama | MLX |
|---|---|---|
| Nivel de abstracción | Alto | Bajo |
| Gestión de modelos | Integrada (`ollama pull`) | Descarga manual |
| API | Compatible con OpenAI | Requiere envoltorio |
| Aceleración GPU | Backend MPS | Metal nativo |
| Fine-tuning | No | Sí |
| Muestreo personalizado | No | Control total |
| Múltiples modelos | Fácil | Manual |

**Ollama** es la opción correcta cuando quieres ser productivo de inmediato. Gestiona descargas de modelos, variantes de cuantización, y expone una API HTTP compatible con OpenAI listo para usar. Es el camino más rápido de cero a un LLM local funcionando.

**MLX** es el framework de machine learning de Apple, construido específicamente para Apple Silicon. Te da acceso directo a los pesos del modelo, tensores y la GPU. Escribes código Python directamente contra el modelo. Es la opción correcta cuando necesitas hacer fine-tuning, implementar estrategias de muestreo personalizadas, o integrar el modelo como componente en un pipeline Python más grande en lugar de una API independiente.

Para la mayoría de los flujos de trabajo de desarrollo, la arquitectura correcta es ambas: **Ollama para experimentación y prototipado, MLX para integración en producción.**

## Instalación Paso a Paso

### Ollama

Ollama se instala limpiamente via Homebrew y no requiere configuración adicional en Apple Silicon -- la aceleración GPU via Metal está habilitada por defecto.

```bash
brew install ollama

# Iniciar el daemon
ollama serve
```

En una terminal separada, descarga un modelo y verifica:

```bash
ollama pull llama3.1:8b
ollama pull qwen2.5:7b
ollama list
```

El primer `ollama pull` descarga ~4.7 GB para Llama 3.1 8B en cuantización Q4_K_M. Descargas subsecuentes comparten capas cacheadas, por lo que descargar Qwen 2.5 7B después de Llama 3.1 reutiliza cualquier capa base superpuesta.

Verifica que la API funciona:

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Escribe una función en Rust para calcular SHA-256."}],
    "stream": false
  }'
```

Esto devuelve una respuesta estándar de chat completions de OpenAI. Cualquier SDK de OpenAI puede apuntar a este endpoint cambiando `base_url` a `http://localhost:11434/v1`.

### MLX

MLX requiere Python y el paquete `mlx-lm` de Apple. Utilizo UV para gestión de dependencias estricta y reproducible.

```bash
# Instalar UV si no está presente
curl -LsSf https://astral.sh/uv/install.sh | sh

# Crear un entorno limpio
uv venv .venv
source .venv/bin/activate
uv pip install mlx-lm transformers huggingface_hub
```

Descarga un modelo pre-cuantizado del hub comunitario MLX en Hugging Face:

```bash
huggingface-cli download mlx-community/Llama-3.1-8B-Instruct-4bit \
  --local-dir models/llama-3.1-8b-4bit
```

Ejecuta inferencia directamente:

```python
from mlx_lm import load, generate

model_path = "models/llama-3.1-8b-4bit"
model, tokenizer = load(model_path)

prompt = "Explica la diferencia entre memoria unificada y VRAM discreta."
response = generate(model, tokenizer, prompt, verbose=True, max_tokens=512)
print(response)
```

Los modelos MLX también pueden convertirse desde safetensors de Hugging Face usando el script `convert` incluido con `mlx-lm`:

```bash
python -m mlx_lm.convert --hf-path meta-llama/Llama-3.1-8B-Instruct --q-bits 4
```

Este paso de conversión es necesario solo para modelos que carecen de una variante cuantizada MLX pre-construida. La mayoría de los modelos populares ya tienen un espejo en `mlx-community`.

## Selección de Modelos y Cuantización

Elegir el modelo correcto para tu hardware es un balance de tres variables: capacidad, velocidad y memoria.

**La regla general del presupuesto de memoria:**

- Modelo cuantizado a 4-bit: `parámetros_en_B × 0.55` GB para pesos
- Añade 1--2 GB para el caché KV en contexto de 8K
- Duplica el caché KV por cada aumento de 4× en contexto (32K necesita ~2×, 128K necesita ~4×)

En M1 Max con 64 GB, después de macOS y otras aplicaciones, aproximadamente 52--56 GB están disponibles para carga de modelos. Esto admite cómodamente cualquier modelo de 7B--13B con contexto generoso, y con gestión cuidadosa de memoria, modelos de 30B+ son factibles a velocidades reducidas.

Aquí hay benchmarks reales recolectados en un MacBook Pro M1 Max (64 GB, 400 GB/s de ancho de banda) usando `mlx-lm` para las entradas MLX y las métricas integradas de `ollama` para las entradas Ollama:

| Modelo | Tamaño | Herramienta | Quant | RAM (GB) | Prompt (tok/s) | Gen (tok/s) |
|---|---|---|---|---|---|---|
| Qwen 2.5 7B | 7B | Ollama | Q4_K_M | 4.8 | 95 | 42 |
| Qwen 2.5 7B | 7B | MLX | 4-bit | 4.5 | 102 | 48 |
| Llama 3.1 8B | 8B | Ollama | Q4_K_M | 5.5 | 82 | 35 |
| Llama 3.1 8B | 8B | MLX | 4-bit | 5.0 | 90 | 38 |
| Mistral Nemo | 12B | Ollama | Q4_K_M | 8.0 | 62 | 24 |
| DeepSeek Coder V2 | 16B | MLX | 4-bit | 10.5 | 48 | 17 |
| Qwen 2.5 32B | 32B | MLX | 4-bit | 19.5 | 30 | 11 |
| Qwen 2.5 32B | 32B | Ollama | Q4_K_M | 21.0 | 26 | 9 |

**Observaciones clave:**

- **MLX supera consistentemente a Ollama por 5--15%** en tokens por segundo porque evita la sobrecarga HTTP y la capa de abstracción MPS, llamando a Metal directamente.
- **Los modelos de 7B--8B son el punto óptimo** para uso interactivo: 35--48 tok/s es más rápido que la velocidad de lectura cómoda.
- **Los modelos de 12B--16B son utilizables** para procesamiento por lotes y generación de código donde un tiempo de respuesta de 2--4 segundos es aceptable.
- **Los modelos de 32B son viables** para trabajos por lotes fuera de línea pero demasiado lentos para chat interactivo (9--11 tok/s es una latencia notable).

### Guía de Cuantización

| Nivel de Quant | Calidad vs FP16 | Ratio de Tamaño | Recomendado Para |
|---|---|---|---|
| Q4_K_M / 4-bit | ~93% | 25% | Uso general en hardware con memoria limitada |
| Q5_K_M / 5-bit | ~96% | 32% | Cuando la calidad es crítica y la RAM lo permite |
| Q8_0 / 8-bit | ~99% | 50% | Máxima calidad, duplica el requisito de memoria |
| FP16 | 100% | 100% | Solo para evaluación o fine-tuning |

Para M1 Max 64 GB, Q4_K_M es el valor predeterminado práctico. Preserva suficiente calidad para seguir instrucciones, generación de código y tareas de razonamiento, mientras mantiene 3--4 modelos diferentes disponibles simultáneamente para diferentes tareas.

## Patrones de Integración

### Reemplazo Directo de OpenAI

La API de Ollama es compatible a nivel de cable con el endpoint de chat completions de OpenAI. Cambiar entre inferencia local y en la nube requiere modificar un solo valor de configuración:

```python
from openai import OpenAI

# Apuntar a Ollama local
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# Cambiar a proveedor en la nube
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

Este es el patrón de integración más simple y funciona con cualquier SDK de OpenAI (Python, Node.js, Go, etc.) y cualquier herramienta que soporte endpoints personalizados compatibles con OpenAI.

### Enrutamiento Independiente del Modelo con Litellm

Litellm proporciona una interfaz universal para más de 100 proveedores de LLM. Puede enrutar peticiones entre modelos locales y en la nube con un solo cambio de configuración:

```bash
pip install litellm
litellm --model ollama/llama3.1:8b --port 4000
```

Esto inicia un proxy en el puerto 4000 que expone la misma API compatible con OpenAI. Cambia el string del modelo para enrutar a Anthropic, Groq, Together, o cualquier otro proveedor:

```python
import litellm

response = litellm.completion(
    model="ollama/llama3.1:8b",  # Cambiar a "groq/llama3-70b" para la nube
    messages=[{"role": "user", "content": "Hola"}]
)
```

El parámetro `model` de Litellm es lo único que cambia entre inferencia local y en la nube. Esto habilita un poderoso patrón híbrido: usa modelos locales durante desarrollo y CI/CD, cambia a modelos en la nube en producción.

### Integración con IDE via Continue.dev

Continue es un asistente de código open source que se integra con VS Code y JetBrains. Soporta Ollama como proveedor de modelos:

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Llama 3.1 Local",
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

Con esta configuración, los autocompletados de código, chat y ediciones en línea se ejecutan completamente locales. Ningún dato sale de la máquina. El modelo DeepSeek Coder de 16B proporciona autocompletados de alta calidad a ~17 tok/s, lo suficientemente rápido para que el autocompletado se sienta receptivo.

## Cuándo la Inferencia Local es la Decisión Correcta

**Buen ajuste:**

- **Desarrollo y prototipado.** Prueba prompts, itera en mensajes del sistema y valida el comportamiento del modelo sin incurrir en costos de API. El ciclo de retroalimentación es más rápido cuando la latencia se mide en milisegundos en lugar de segundos.
- **Validación en CI/CD.** Ejecuta pruebas y validaciones impulsadas por IA en pipelines CI sin depender de APIs externas o gestionar claves API como secretos. Cada desarrollador tiene un entorno determinista y reproducible.
- **Cargas de trabajo con datos sensibles.** Procesamiento de documentos, análisis legales, datos médicos y código propietario nunca salen de tu red.
- **Entornos sin conexión.** Sistemas aislados, despliegues de campo y escenarios de viaje donde el acceso a internet no es confiable.

**Mal ajuste:**

- **Servicio en producción de alta concurrencia.** Un solo M1 Max puede manejar 2-4 peticiones concurrentes antes de que la latencia se degrade. Para cargas de trabajo de API en producción, la inferencia en la nube con clusters de GPU es necesaria.
- **Procesamiento por lotes de gran volumen.** Procesar miles de documentos a través de un modelo local ocupa la máquina durante horas. Las APIs en la nube ofrecen escalado horizontal y mayor rendimiento.
- **Contextos largos (128K+ tokens).** El caché KV crece cuadráticamente con la longitud del contexto. 128K tokens en un modelo de 7B a Q4 requiere ~12 GB solo para el caché KV, consumiendo el presupuesto de memoria del modelo.

**El patrón híbrido** recomendado para la mayoría de los equipos: usa inferencia local durante desarrollo, CI/CD y para rutas con datos sensibles. Enruta peticiones de alto tráfico a proveedores en la nube. Litellm hace que este cambio sea transparente -- el código que llama no cambia.

## Conclusiones Arquitectónicas

Apple Silicon, particularmente el M1 Max con 64 GB de memoria unificada, es una estación de trabajo legítima para inferencia local. Los modelos en el rango de 7B--13B se ejecutan a velocidades interactivas (35--50 tok/s), los modelos de 16B son utilizables para cargas de trabajo no interactivas, y los modelos de 30B+ son factibles con cuantización y paciencia.

El ecosistema de herramientas ha madurado hasta el punto donde los LLMs locales se integran limpiamente en flujos de trabajo de desarrollo reales. Ollama proporciona el camino más rápido de cero a un modelo funcionando. MLX proporciona el control necesario para integración en producción. Litellm unifica ambos detrás de una sola API.

La pregunta ya no es "¿puedes ejecutar un LLM localmente?" sino "¿deberías hacerlo?" Para desarrollo, CI/CD y cargas de trabajo con datos sensibles, la respuesta es cada vez más sí. El costo de la inferencia en Apple Silicon es cero en el margen -- el hardware ya está en tu escritorio.

```bash
# Descarga un modelo y descubre lo que tu hardware puede hacer
ollama pull llama3.1:8b
ollama run llama3.1:8b
```

El benchmark más convincente es el que ejecutas tú mismo.
