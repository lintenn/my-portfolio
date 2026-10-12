# Guía de conceptos de IA de este proyecto

> Guía de estudio para entender a fondo cómo funciona el asistente de IA del portfolio y poder defenderlo en una entrevista de **Software / AI Engineer**. Cada concepto sigue el mismo esquema: **qué es → cómo lo usamos aquí → qué decir en una entrevista**.

## Índice

1. [El mapa completo en 30 segundos](#1-el-mapa-completo-en-30-segundos)
2. [Fundamentos de los LLM: tokens, contexto y no determinismo](#2-fundamentos-de-los-llm)
3. [Modelos de razonamiento](#3-modelos-de-razonamiento)
4. [Roles de los mensajes y la API de Responses](#4-roles-de-los-mensajes-y-la-api-de-responses)
5. [Prompt engineering (diseño del system prompt)](#5-prompt-engineering)
6. [Grounding y alucinaciones](#6-grounding-y-alucinaciones)
7. [RAG: qué es, cómo era la v1 y por qué lo quitamos](#7-rag)
8. [Long context y context stuffing](#8-long-context-y-context-stuffing)
9. [Prompt caching](#9-prompt-caching)
   - [9 bis. Un chatbot multilingüe sin romper la caché](#9-bis-un-chatbot-multilingüe-sin-romper-la-caché)
10. [Tool calling (function calling)](#10-tool-calling)
11. [Agentes y el bucle agéntico](#11-agentes-y-el-bucle-agéntico)
12. [Generative UI](#12-generative-ui)
13. [Streaming (SSE) y el protocolo de mensajes de UI](#13-streaming)
14. [Seguridad en apps con LLM: prompt injection y compañía](#14-seguridad)
15. [Coste, latencia y rate limiting](#15-coste-latencia-y-rate-limiting)
16. [Evals: cómo se testea un LLM](#16-evals)
17. [Observabilidad y privacidad](#17-observabilidad-y-privacidad)
18. [Gestión de API keys](#18-gestión-de-api-keys)
19. [Conceptos de Next.js / React que aparecen](#19-nextjs-y-react)
20. [Preguntas de entrevista con respuesta modelo](#20-preguntas-de-entrevista)
21. [Glosario rápido](#21-glosario)

---

## 1. El mapa completo en 30 segundos

```
Visitante escribe → useChat (navegador) → POST /api/chat
  → rate limit (por IP + global)
  → validación (Zod + validateUIMessages) y política (últimos 12 mensajes, ≤1000 caracteres)
  → streamText(modelo, instrucciones = reglas + TODO el conocimiento, herramientas)
      ↔ OpenAI (Responses API) — puede pedir ejecutar una herramienta → la ejecutamos → vuelve al modelo
  → stream de "partes" tipadas (texto, llamadas a herramientas) por SSE
→ el navegador pinta Markdown y tarjetas React (generative UI)
```

**La frase para la entrevista:** _"Es un asistente conversacional grounded sobre una única fuente de verdad tipada. Como el conocimiento cabe de sobra en la ventana de contexto, en lugar de RAG uso long-context con prompt caching; el modelo tiene herramientas de solo lectura que renderizan componentes en el chat; y lo protejo con validación, rate limiting y evals automáticas."_

---

## 2. Fundamentos de los LLM

**Qué es.** Un LLM (Large Language Model) es una red neuronal (un _transformer_) entrenada para predecir el siguiente **token** dado todo lo anterior. Genera texto token a token (_autoregresivo_).

- **Token**: el trozo mínimo de texto que procesa el modelo (≈ ¾ de palabra en inglés; ≈ 4 caracteres). Se paga **por token**, de entrada (_input_) y de salida (_output_), y la salida es más cara. Nuestro system prompt tiene ~15.400 caracteres ≈ **3.900 tokens**.
- **Ventana de contexto**: el máximo de tokens (entrada + salida) que el modelo puede "ver" a la vez. `gpt-6-luna` tiene ~1M tokens. El modelo **no tiene memoria** entre peticiones: cada petición debe incluir todo lo que necesita (por eso enviamos el historial y el conocimiento cada vez).
- **No determinismo**: el modelo muestrea entre los tokens probables; la _temperatura_ controla cuánto se arriesga. Dos ejecuciones pueden dar respuestas distintas → los tests de un LLM no pueden ser `assertEquals` (ver [Evals](#16-evals)).
- **Knowledge cutoff**: el modelo solo "sabe" lo que había en sus datos de entrenamiento; para hechos concretos (tu CV) hay que dárselos en el prompt → _grounding_.

**En entrevista:** saber estimar coste (`tokens × precio`), explicar por qué un LLM es _stateless_ y por qué alucina (predice texto plausible, no consulta una base de datos).

---

## 3. Modelos de razonamiento

**Qué es.** Modelos (familia o-series, GPT-5+, GPT-6…) que generan **tokens de razonamiento** internos (un "borrador" oculto) antes de responder. Mejoran en tareas que requieren pensar, a cambio de latencia y coste (los tokens de razonamiento se cobran como salida).

**Aquí:** `gpt-6-luna` es de razonamiento. Configuramos:

- `reasoningEffort: "low"` → piensa poco: suficiente para preguntas sobre un CV y responde rápido.
- `reasoningSummary: null` → no pedimos resúmenes del razonamiento porque no los mostramos.
- `textVerbosity: "low"` → respuestas concisas.
- El log `reasoningTokens` muestra cuánto "pensó".

Con modelos de razonamiento el system prompt se envía con rol **`developer`** (el SDK lo hace solo).

**En entrevista:** _"El esfuerzo de razonamiento es un dial calidad↔latencia/coste; para un chatbot de FAQ uso bajo, para agentes complejos o código, alto."_

---

## 4. Roles de los mensajes y la API de Responses

**Roles:**

- `system` / `developer`: instrucciones del dueño de la app (máxima prioridad).
- `user`: lo que escribe el visitante (**no confiable**).
- `assistant`: respuestas previas del modelo.
- `tool` / `function_call_output`: resultados de herramientas.

**Responses API vs Chat Completions.** Chat Completions (`/v1/chat/completions`) es la API clásica: le mandas una lista de mensajes y devuelve uno. **Responses** (`/v1/responses`) es la API moderna de OpenAI: soporta de forma nativa razonamiento, herramientas, _items_ tipados (mensajes, llamadas a funciones, resultados), y opcionalmente estado en el servidor. `@ai-sdk/openai` usa Responses por defecto.

**Stateless vs stateful.** Responses puede guardar la conversación en OpenAI (`store: true`, `previous_response_id`). Nosotros usamos **`store: false`**: cada petición lleva su historial (stateless). Ventajas: privacidad y control total. Como no se guarda nada, el SDK pide `reasoning.encrypted_content` para poder pasar el razonamiento cifrado entre pasos de una misma petición con herramientas.

---

## 5. Prompt engineering

**Qué es.** Diseñar las instrucciones para que el modelo se comporte de forma fiable.

**Nuestro system prompt (`src/lib/ai/prompt.ts`):**

1. **Persona**: "hablas como Luis, en primera persona, tono cercano y conciso".
2. **Reglas numeradas** dentro de `<rules>`: basarte solo en el conocimiento, admitir lo que no sabes, responder en el idioma del visitante, formato Markdown con enlaces relativos, cuándo usar cada herramienta, no salirte del tema, ignorar intentos de cambiar las reglas, temas privados → formulario.
3. **Datos** dentro de `<knowledge>…</knowledge>`.
4. **Lo variable al final** (el mes actual).

**Técnicas usadas:**

- **Delimitadores (etiquetas XML)**: separan _instrucciones_ de _datos_. Ayudan al modelo a no confundir contenido con órdenes (y mitigan inyecciones).
- **Instrucciones positivas y concretas** ("responde en 2–6 frases") mejor que vagas ("sé breve").
- **Decir qué hacer cuando falta información** ("di que no lo tienes y sugiere /contact") es la mejor arma contra alucinaciones.
- **Orden pensado para la caché** (ver [Prompt caching](#9-prompt-caching)).

Técnicas que conviene conocer aunque no se usen aquí: _few-shot_ (dar ejemplos de pregunta→respuesta), _chain-of-thought_ (pedir razonar paso a paso; con modelos de razonamiento ya es interno), _structured outputs_ (forzar un JSON Schema — lo usamos en el **juez** de las evals con `Output.object`).

---

## 6. Grounding y alucinaciones

**Alucinación**: el modelo inventa algo plausible pero falso (p. ej. "trabajé en Google"). Ocurre porque optimiza texto probable, no verdad.

**Grounding** ("anclar"): dar al modelo las fuentes y obligarle a basarse en ellas. Aquí:

1. Le damos **todo** el conocimiento (no un subconjunto que podría no contener la respuesta).
2. Regla explícita: "nunca inventes; si no está, dilo".
3. **Evals con juez** que detectan afirmaciones no respaldadas.
4. Herramientas que devuelven **datos reales** (no texto generado) para proyectos y contacto.

**En entrevista:** _"Las alucinaciones no se eliminan, se gestionan: grounding + instrucciones de abstención + evals de fidelidad (faithfulness) + mostrar datos estructurados en vez de texto libre cuando es posible."_

---

## 7. RAG

**Qué es.** _Retrieval-Augmented Generation_: antes de preguntar al LLM, **recuperas** los fragmentos más relevantes de tus documentos y los metes en el prompt. Sirve cuando tus datos son demasiado grandes para el contexto o cambian mucho.

**Las piezas (las tenía la v1 de 2024):**

1. **Chunking**: partir documentos en trozos (la v1 usaba `RecursiveCharacterTextSplitter` sobre el código de las páginas `.tsx`).
2. **Embeddings**: convertir cada trozo en un vector numérico (la v1: `text-embedding-3-small`, 1536 dimensiones) de forma que textos con significado parecido quedan cerca.
3. **Vector store**: base de datos que guarda vectores y busca los más cercanos (la v1: **AstraDB**), normalmente con **similitud coseno** (el coseno del ángulo entre dos vectores: 1 = misma dirección/significado).
4. **Retriever**: dada la pregunta, la convierte en embedding y trae los _top-k_ trozos.
5. **History-aware retriever / query rewriting**: la v1 pedía a `gpt-3.5-turbo` reescribir la pregunta teniendo en cuenta el historial ("¿y en qué año?" → "¿en qué año terminó Luis la carrera?") para buscar mejor.
6. **"Stuff" chain**: meter los trozos recuperados en el prompt y generar la respuesta.
7. **Caché** de respuestas (la v1: Upstash Redis con LangChain).

**Problemas de RAG:** si el retriever falla, el modelo no ve la respuesta (_retrieval miss_); trozos cortados a mitad; preguntas que cruzan varios documentos ("compara tus dos trabajos"); más servicios, más latencia (dos llamadas al LLM + búsqueda), más cosas que mantener (reindexar al cambiar contenido).

**Mejoras de RAG moderno** (para la entrevista): _hybrid search_ (vectores + búsqueda por palabras clave BM25), **reranking** (un modelo reordena los candidatos), chunking semántico, metadatos y filtros, _contextual retrieval_ (añadir contexto a cada chunk antes de embeberlo), y **agentic RAG** (el modelo decide cuándo buscar vía una herramienta `search`).

---

## 8. Long context y context stuffing

**Qué es.** Si los datos caben en la ventana de contexto, mándalos **enteros** en cada petición. Con ventanas de 1M tokens y caché de prompts, para corpus pequeños esto es más simple, más barato de operar y más preciso que RAG.

**Aquí:** `buildKnowledgeBase()` convierte el contenido tipado en ~4k tokens de Markdown y va en el system prompt. Lo mismo se sirve en `/llms.txt`.

**Cuándo NO hacerlo:** corpus de cientos de miles de tokens (coste y latencia por petición), datos que cambian cada minuto, o necesidad de permisos por documento. Además, en contextos muy largos los modelos atienden peor a lo que está "en medio" (_lost in the middle_).

**La decisión está documentada en un ADR** (`docs/adr/0001-…`): mencionar los ADR en una entrevista demuestra madurez.

**En entrevista:** _"RAG es una técnica para cuando el conocimiento no cabe o no conviene meterlo entero. Medí: mi conocimiento son 4k tokens; con long context + caching eliminé tres servicios externos, la latencia de la reescritura de la consulta y los fallos de recuperación. Si el corpus creciera, volvería a RAG híbrido con reranking."_

---

## 9. Prompt caching

**Qué es.** El proveedor guarda el resultado de procesar el **prefijo** de un prompt (internamente, la _KV cache_ del transformer). Si la siguiente petición empieza exactamente igual, reutiliza ese trabajo: los tokens cacheados se cobran mucho más baratos y la respuesta empieza antes. En OpenAI es **automático** a partir de ~1024 tokens de prefijo idéntico.

**Cómo lo aprovechamos:**

1. Lo estático (reglas + conocimiento) **primero**; lo que cambia (fecha) **al final**.
2. `buildKnowledgeBase()` es **determinista** (hay un test que lo comprueba): un solo carácter distinto al principio invalida la caché.
3. `promptCacheKey` agrupa peticiones con el mismo prefijo en la misma caché.
4. Se mide en los logs: `cachedInputTokens`.

**En entrevista:** _"Diseño los prompts como 'prefijo estable + sufijo variable' para maximizar los cache hits; es una de las optimizaciones de coste/latencia más rentables."_

---

## 9 bis. Un chatbot multilingüe sin romper la caché

**El problema.** La web está en inglés, español y alemán. ¿Hacemos tres bases de conocimiento, una por idioma? Si el prompt cambia según el idioma, tendríamos tres prefijos distintos → tres cachés frías, el triple de contenido que mantener y posibles incoherencias entre traducciones.

**La solución aquí:**

1. **Una sola base de conocimiento canónica en inglés.** Los LLM modernos son multilingües: leen en inglés y responden con naturalidad en español o alemán. Así el prefijo del prompt es idéntico para todos los visitantes y la caché se reutiliza siempre (hay un test que lo comprueba).
2. **El idioma de la página va al final** del system prompt (`Site language: Spanish.`), en la parte variable, sin tocar el prefijo cacheado.
3. **Regla de idioma**: responder en el idioma del último mensaje del visitante y, solo si es ambiguo ("ok"), usar el de la página. Un visitante en `/de` que escribe en inglés recibe inglés (hay una eval para eso).
4. **Datos estructurados en el idioma de la UI**: las herramientas (`createChatTools(locale)`) devuelven tarjetas con los textos traducidos de verdad (escritos por mí, no traducidos por el modelo), y los errores de la API también llegan traducidos.
5. **Enlaces sin prefijo de idioma**: el modelo escribe `/projects` y el componente `Link` de next-intl lo convierte en `/es/projects`. El modelo no necesita saber cómo funciona el routing.

**Separación de responsabilidades:** el _contenido_ (hechos) se traduce una vez, a mano y revisado, en ficheros tipados; el _diálogo_ lo adapta el LLM en tiempo real. Traducir la web completa con un LLM en cada visita sería más lento, más caro, peor para SEO y sin control de calidad.

**En entrevista:** _"Para i18n con LLMs separo contenido estático (traducido y revisado, servido por URL con hreflang) de la conversación (el modelo responde en el idioma del usuario). Mantengo un único prompt canónico para no fragmentar la caché y paso el idioma como dato variable al final."_

---

## 10. Tool calling

**Qué es.** Le describes al modelo funciones con **nombre, descripción y un JSON Schema** de parámetros. El modelo no las ejecuta: **responde pidiendo** que se ejecute una (`function_call` con argumentos JSON). Tu código la ejecuta y le devuelve el resultado (`function_call_output`), y el modelo continúa.

**Aquí (`src/lib/ai/tools.ts`):**

- `showProjects({ slugs?, technology? })` → devuelve resúmenes de proyectos.
- `showContactCard({ reason? })` → devuelve los datos de contacto.
- Los parámetros se definen con **Zod**; el SDK los convierte a JSON Schema y **valida** lo que manda el modelo.
- Son **de solo lectura y sin efectos secundarios**: aunque alguien manipule al modelo, lo peor que puede hacer es enseñar un proyecto.

**Por qué es importante la descripción:** el modelo decide _cuándo_ llamar a una herramienta leyendo su `description`. Es prompt engineering también.

**En entrevista:** distinguir herramientas de lectura vs. de escritura; para las de escritura (enviar email, pagar) → confirmación humana (_human-in-the-loop_; el SDK tiene _tool approval_), permisos mínimos y validación del lado servidor.

---

## 11. Agentes y el bucle agéntico

**Qué es un agente:** un LLM que, en un **bucle**, decide qué herramienta usar, observa el resultado y sigue hasta terminar la tarea. "Workflow" = pasos fijos que decides tú; "agente" = el modelo decide los pasos.

**Aquí:** un mini-agente. `stopWhen: isStepCount(3)` permite hasta 3 pasos:

1. Paso 1: el modelo pide `showProjects({technology:"TensorFlow"})`.
2. El servidor ejecuta la herramienta.
3. Paso 2: el modelo ve el resultado y escribe "Aquí tienes mis proyectos con TensorFlow 👇".

Limitar los pasos evita bucles infinitos y costes descontrolados.

**Relacionado:** **MCP** (_Model Context Protocol_) es un estándar abierto para exponer herramientas y datos a modelos/agentes de forma reutilizable (un "USB-C" para herramientas de IA). Aquí no hace falta, pero conviene conocerlo.

---

## 12. Generative UI

**Qué es.** En vez de que el modelo devuelva solo texto, devuelve (vía herramientas) **datos estructurados** que la interfaz renderiza como **componentes**. Ventajas: UI rica, datos exactos (no los "escribe" el modelo), y tipos de extremo a extremo.

**Aquí:** cada llamada a herramienta llega al navegador como una parte tipada `tool-showProjects` con un `state` (`input-streaming` → `input-available` → `output-available`). `chat-widget.tsx` hace un `switch (part.type)` y pinta un _skeleton_ mientras llega y luego `ProjectsToolCard`. Los tipos se infieren de las herramientas (`InferUITools`), así que si cambias el `execute`, TypeScript te avisa en el componente.

---

## 13. Streaming

**Qué es.** Enviar la respuesta **mientras se genera**, token a token, en vez de esperar al final. Mejora muchísimo la latencia percibida (**TTFT**, _time to first token_).

**Cómo:** **Server-Sent Events (SSE)**: una respuesta HTTP que se queda abierta y envía líneas `data: {...}`. El AI SDK define un **protocolo de mensajes de UI** con trozos tipados: `start`, `text-delta`, `tool-input-available`, `tool-output-available`, `finish-step`, `error`, `finish`… `toUIMessageStreamResponse()` lo genera en el servidor y `useChat` lo consume y reconstruye `message.parts`.

**Detalles prácticos:** `maxDuration = 30` en la ruta (las funciones serverless tienen límite de tiempo); botón **Stop** (aborta la petición); los errores a mitad de stream llegan como un trozo `error` con texto ya amigable.

---

## 14. Seguridad

Referencia: **OWASP Top 10 for LLM Applications**. Los riesgos clave y nuestras defensas:

| Riesgo                         | Qué es                                                                           | Defensa aquí                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Prompt injection directa**   | El usuario escribe "ignora tus instrucciones y…"                                 | Reglas explícitas, separación con etiquetas, eval específica; el modelo no tiene nada valioso que filtrar      |
| **Prompt injection indirecta** | Instrucciones maliciosas escondidas en datos que el modelo lee (una web, un PDF) | Nuestros datos son propios y estáticos; las herramientas no leen contenido externo                             |
| **Excessive agency**           | Herramientas con demasiado poder                                                 | Herramientas de solo lectura, sin efectos secundarios                                                          |
| **Insecure output handling**   | Renderizar la salida del modelo como HTML → XSS                                  | `react-markdown` sin HTML crudo; enlaces filtrados por protocolo; `rel="noopener"`                             |
| **Unbounded consumption**      | Abusar para gastar tu dinero (_denial of wallet_)                                | Rate limit por IP y global diario, límite de tokens de salida, historial recortado, tamaño de mensaje limitado |
| **Sensitive info disclosure**  | Filtrar datos privados                                                           | El conocimiento solo contiene datos públicos; `store:false`; logs sin contenido; `safetyIdentifier` hasheado   |
| **Manipulación del historial** | El cliente envía mensajes "assistant" falsos                                     | Solo afecta a su propia sesión; se valida todo en cada petición; no se aceptan mensajes `system`               |

**Idea clave para la entrevista:** _"No existe una defensa perfecta contra prompt injection; se diseña asumiendo que el modelo puede ser manipulado: mínimo privilegio en herramientas, validación fuera del modelo, y nada sensible al alcance del LLM."_ (defensa en profundidad).

---

## 15. Coste, latencia y rate limiting

**Calcular coste:** `coste = tokens_entrada × precio_entrada + tokens_salida × precio_salida` (los tokens cacheados, más baratos). Con `gpt-6-luna` (0,10 $/M entrada, 0,50 $/M salida): ~4.500 tokens de entrada + ~300 de salida ≈ **0,0006 $ por mensaje** sin contar el descuento de caché → con 5 $ hay para miles de mensajes.

**Palancas:** modelo más pequeño, caching, menos historial (ventana deslizante de 12 mensajes), `maxOutputTokens`, esfuerzo de razonamiento bajo, `maxRetries: 1`.

**Rate limiting** (limitar peticiones por cliente y tiempo):

- **Fixed window**: contador que se reinicia cada X minutos (simple; picos en el borde de la ventana). Lo usamos en memoria y para el tope global.
- **Sliding window**: suaviza los bordes ponderando la ventana anterior. Lo usamos por IP con Upstash.
- **Token bucket**: un "cubo" que se rellena a ritmo constante; permite ráfagas controladas.
- **¿Por qué Redis?** En serverless cada instancia tiene su memoria: un limitador en memoria no es global. Redis (Upstash) es un almacén compartido.
- **Fail open vs fail closed**: si Redis cae, dejamos pasar (disponibilidad > protección perfecta) — y está acotado por el tope global y el presupuesto de OpenAI. Decisión consciente y explicable.
- El **tope global diario** actúa como _circuit breaker_ de costes.

---

## 16. Evals

**Qué es.** Los tests de las funcionalidades con LLM: un conjunto fijo de entradas + comprobaciones sobre las salidas. Como el modelo no es determinista, se comprueba **significado y comportamiento**, no texto exacto.

**Tipos (todos en `evals/` + `scripts/eval-chat.ts`):**

1. **Deterministas**: regex (¿menciona "JCode"? ¿responde en español?), ¿llamó a la herramienta esperada?, ¿_no_ filtró el prompt?
2. **LLM-as-judge**: otro modelo, con _structured output_ (Zod), juzga si cada afirmación está respaldada por el conocimiento (**faithfulness**). Barato y escalable; hay que validar que el juez es fiable.
3. **Humanas**: revisar conversaciones reales (lo más fiable, lo más caro).

**Buenas prácticas:** cada bug real → nuevo caso (**test de regresión**); ejecutar evals al cambiar prompt, modelo o contenido (**gate** en CI: workflow `evals.yml`); usar **exactamente** la misma configuración que producción (por eso existe `assistantSettings()` compartido); repetir varias veces si hay _flakiness_.

**En entrevista:** _"Sin evals, cambiar un prompt o un modelo es ir a ciegas. Tengo una suite con checks deterministas y un juez LLM que corre en CI cuando cambia el asistente."_ Esto se llama **LLMOps** (MLOps aplicado a LLMs).

---

## 17. Observabilidad y privacidad

- **Logs estructurados (JSON)**: una línea por petición con modelo, pasos, tokens (y cacheados), tokens de razonamiento, latencia y motivo de fin. Se pueden filtrar y agregar en Vercel.
- **Errores clasificados**: `quota` (sin saldo), `rate-limit`, `auth`, `unavailable`. Así un 429 de "sin crédito" (lo que te pasaba) se distingue de un 429 de "demasiadas peticiones".
- **Privacidad por diseño**: los errores del proveedor incluyen el cuerpo de la petición (¡los mensajes del visitante!), así que se loguea solo un resumen saneado. Hay un comentario en el código explicándolo.
- Para ir más allá: **tracing** con OpenTelemetry (el AI SDK tiene `telemetry`), plataformas como Langfuse/LangSmith/Braintrust, dashboards de coste por día.

---

## 18. Gestión de API keys

**Tu pregunta:** _¿reutilizo la key de octubre de 2024 o creo una nueva?_ → **Crea una nueva** antes de recargar.

- Las keys **no caducan por tiempo**, y la vieja funcionaría al recargar. Pero:
- **Mínimo privilegio**: la vieja tiene permisos _All_; la app solo necesita llamar a `/v1/responses`. Una key _Restricted_ limita el daño si se filtra.
- **Rotación**: lleva dos años viva (Vercel, tu máquina…); rotar periódicamente es buena higiene.
- **Proyectos**: una key de un **proyecto dedicado** te da presupuesto, límites y uso separados por proyecto.
- **Pasos**: crear proyecto → key restringida → presupuesto mensual y alertas → añadir créditos → poner la key en Vercel (Production y Preview) y en `.env.local` → redeploy → **revocar la vieja**. Detalle en `docs/DEPLOYMENT.md#openai`.

**Reglas de oro:** la key **solo en el servidor** (nunca con prefijo `NEXT_PUBLIC_`, que la mandaría al navegador), nunca en git (`.gitignore` ignora `.env*`), y un presupuesto con alertas como red de seguridad.

---

## 19. Next.js y React

- **React Server Components (RSC)**: componentes que se renderizan en el servidor y no envían JS al navegador. Casi todo el sitio lo es; solo lo interactivo es `"use client"`.
- **Route Handlers** (`app/api/chat/route.ts`): endpoints HTTP dentro de Next.
- **Server Actions** (`"use server"`): funciones del servidor llamadas desde un `<form action>`; el formulario de contacto funciona incluso sin JavaScript (_progressive enhancement_). `useActionState` gestiona estado, errores y `pending`.
- **SSG / ISR**: páginas pre-renderizadas en el build; `revalidate = 86400` las regenera cada día (para que "años de experiencia" no se quede viejo).
- **React Compiler**: memoiza automáticamente; adiós a `useMemo`/`useCallback` manuales.
- **Runtimes**: la ruta del chat usa el runtime **Node.js** (necesita `crypto` para hashear la IP); el _Edge runtime_ arranca más rápido pero tiene APIs limitadas.
- **Variables de entorno**: sin `NEXT_PUBLIC_` = solo servidor; se leen en tiempo de petición en rutas dinámicas.

---

## 20. Preguntas de entrevista

**1. "Explícame la arquitectura de tu chatbot."**
Fuente de verdad tipada → knowledge base en Markdown → system prompt con prefijo cacheable → `streamText` con herramientas y límite de pasos → stream SSE de partes tipadas → UI con generative UI. Con guardrails (validación, rate limit, límites de tokens) y evals.

**2. "¿Por qué no usas RAG?"**
Porque el corpus son ~4k tokens: long context + caching es más simple, más preciso (sin fallos de recuperación) y con menos servicios. Usaría RAG (híbrido + reranking) si el corpus no cupiera o cambiara constantemente. Lo documenté en un ADR.

**3. "¿Cómo evitas las alucinaciones?"**
Grounding con todo el contexto, instrucción explícita de abstención, herramientas que devuelven datos reales, y evals con LLM-as-judge que verifican fidelidad.

**4. "¿Cómo te proteges de prompt injection?"**
Asumo que el modelo puede ser manipulado: herramientas de solo lectura, nada sensible en el contexto, salida renderizada sin HTML, validación fuera del modelo, rate limiting, y casos de eval de inyección. Defensa en profundidad.

**5. "¿Cómo controlas el coste?"**
Modelo eficiente, prompt caching (prefijo estable), ventana de historial, límite de tokens de salida, esfuerzo de razonamiento bajo, rate limit por IP + tope global diario, presupuesto y alertas en OpenAI, y métricas de tokens en logs.

**6. "¿Cómo testeas algo no determinista?"**
Tests unitarios para todo lo determinista (política, limitador, herramientas, prompt) + evals de comportamiento con checks semánticos y juez LLM, ejecutadas en CI cuando cambia el asistente; cada fallo real se convierte en caso de regresión.

**7. "¿Qué es function calling y qué riesgos tiene?"**
El modelo pide ejecutar funciones descritas con JSON Schema; tu código las ejecuta. Riesgo: _excessive agency_ → mínimo privilegio, validación de argumentos, confirmación humana para acciones con efectos.

**8. "¿Qué cambiarías si tuvieras 1 millón de usuarios?"**
Rate limiting distribuido (ya está con Upstash), caché de respuestas semánticas para preguntas frecuentes, colas/fallback entre modelos o proveedores (AI Gateway), observabilidad con tracing y dashboards de coste, evals continuas sobre muestras de tráfico real, y quizá un modelo más pequeño o _fine-tuned_ para el caso común.

**9. "¿Streaming, por qué y cómo?"**
Reduce el tiempo hasta el primer token percibido; SSE sobre HTTP con un protocolo de trozos tipados; soporta herramientas a mitad de respuesta, cancelación y errores en el stream.

**10. "¿Cuál fue el mayor problema de la versión anterior?"**
Dependía de cuatro servicios externos, dos con _free tiers_ que hibernan, y el build necesitaba todos → un fallo de cualquiera rompía el sitio. Lección: minimizar dependencias de infraestructura y separar build de runtime.

---

## 21. Glosario

| Término                 | Definición corta                                                       |
| ----------------------- | ---------------------------------------------------------------------- |
| Token                   | Unidad de texto que procesa y cobra el modelo                          |
| Context window          | Máximo de tokens que el modelo ve a la vez                             |
| Grounding               | Basar las respuestas en fuentes proporcionadas                         |
| Hallucination           | Respuesta plausible pero falsa                                         |
| Embedding               | Vector numérico que representa el significado de un texto              |
| Cosine similarity       | Medida de parecido entre embeddings (ángulo entre vectores)            |
| Vector store            | Base de datos de embeddings con búsqueda por cercanía                  |
| RAG                     | Recuperar fragmentos relevantes y añadirlos al prompt                  |
| Chunking                | Partir documentos en trozos para indexarlos                            |
| Reranking               | Reordenar candidatos recuperados con un modelo más preciso             |
| Prompt caching          | Reutilizar el procesamiento de un prefijo de prompt repetido           |
| Tool / function calling | El modelo pide ejecutar funciones definidas con JSON Schema            |
| Agent                   | LLM que en bucle elige herramientas hasta completar una tarea          |
| MCP                     | Protocolo estándar para exponer herramientas/datos a modelos           |
| Generative UI           | La IA devuelve datos que la UI pinta como componentes                  |
| SSE                     | Server-Sent Events: streaming de servidor a cliente por HTTP           |
| TTFT                    | Time To First Token: latencia hasta el primer token                    |
| Reasoning tokens        | Tokens de "pensamiento" interno de los modelos de razonamiento         |
| Structured output       | Forzar que el modelo responda con un JSON Schema                       |
| Prompt injection        | Texto que intenta que el modelo ignore sus instrucciones               |
| LLM-as-judge            | Usar un LLM para evaluar la salida de otro                             |
| Evals                   | Tests de comportamiento para funcionalidades con LLM                   |
| LLMOps                  | Prácticas de operación de apps con LLM (evals, observabilidad, costes) |
| Rate limiting           | Limitar peticiones por cliente y periodo                               |
| ADR                     | Architecture Decision Record: documento de una decisión técnica        |
