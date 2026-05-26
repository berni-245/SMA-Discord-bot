# Especificación detallada de Agentes
Spec operativa **11 agentes**; complementa [inventario](../01-inventario-y-justificacion-de-agentes.md). 7 secciones/archivo: Rol · Contexto · Prompt · Guardrails · Formato JSON · Ejemplos · Input.
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
**Salida:** JSON estricto + markdown usuario; Gateway o **A4**←**A3**; `metadata.subject_id` / `metadata.channel_type` invariantes. BDI y justificación: [E1](../01-inventario-y-justificacion-de-agentes.md).
