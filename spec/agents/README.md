# Especificación detallada de Agentes

Esta carpeta contiene la spec funcional **operativa** de cada uno de los **11 agentes** del sistema multiagente. Es el detalle de bajo nivel (rol, contexto, system prompt, guardrails, formato de salida, ejemplos) que complementa la capa conceptual del [inventario y justificación de agentes](../01-inventario-y-justificacion-de-agentes.md) (Entregable 1).

## Estructura de cada archivo

Cada agente está documentado con las 7 secciones que pediste:

1. **Rol / Persona** — quién es el agente, cómo se posiciona en el sistema.
2. **Contexto** — qué información tiene a su disposición en cada turno (entradas, beliefs).
3. **Instrucción (system prompt)** — el prompt operativo del agente.
4. **Guardrails** — restricciones duras, alineadas con los límites globales del enunciado.
5. **Formato de salida** — schema JSON o estructura esperada.
6. **Ejemplos** — 3-5 few-shots cubriendo casos típicos y de frontera.
7. **User input esperado** — schema de la entrada que el agente debe poder procesar.

## Índice

| # | Agente | Carácter | Archivo |
|---|---|---|---|
| A1 | Frontier Agent | reactivo + social | [01-frontier-agent.md](01-frontier-agent.md) |
| A2 | Theory Agent | reactivo | [02-theory-agent.md](02-theory-agent.md) |
| A3 | Practice Agent | reactivo + social | [03-practice-agent.md](03-practice-agent.md) |
| A4 | Scaffolding Agent | social (política pedagógica) | [04-scaffolding-agent.md](04-scaffolding-agent.md) |
| A5 | Evaluative Guard Agent | reactivo | [05-evaluative-guard-agent.md](05-evaluative-guard-agent.md) |
| A6 | Admin Info Agent | **reactivo** (contraste con A9) | [06-admin-info-agent.md](06-admin-info-agent.md) |
| A7 | Quiz Agent | reactivo | [07-quiz-agent.md](07-quiz-agent.md) |
| A8 | Memory Agent | reactivo | [08-memory-agent.md](08-memory-agent.md) |
| A9 | Follow-up Agent | **proactivo** (contraste con A6) | [09-followup-agent.md](09-followup-agent.md) |
| A10 | Feedback Agent | reactivo + social | [10-feedback-agent.md](10-feedback-agent.md) |
| A11 | KB Curator Agent | reactivo + algo proactivo | [11-kb-curator-agent.md](11-kb-curator-agent.md) |

## Convenciones de los formatos de salida

- Todos los outputs son **JSON estricto** salvo el campo de respuesta al usuario, que se entrega en **markdown**.
- Cada agente especifica si su output va **directo al Discord Gateway** (publicar al alumno) o pasa por otro agente (typically **A4 Scaffolding** revisa borradores de **A3 Practice**).
- Los campos `metadata.subject_id` y `metadata.channel_type` viajan con todos los pedidos: el aislamiento por materia y la visibilidad por canal son invariantes que ningún agente puede violar.

## Relación con el Entregable 1

La justificación de **cuántos** agentes y **por qué** (trade-off de granularidad), el carácter **reactivo / proactivo / social + BDI** de cada uno, sus fronteras y el análisis de no-solapamiento están en el documento conceptual del [inventario y justificación de agentes](../01-inventario-y-justificacion-de-agentes.md). Los archivos de esta carpeta son la contraparte operativa de cada ficha de ese documento.
