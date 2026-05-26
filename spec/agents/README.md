# Especificaciones de agentes vigentes

La arquitectura final contiene **6 agentes lógicos**. Los agentes producen decisiones o borradores; `OutboundDispatcher` es el único componente que publica en Discord.

| ID | Ficha | Función |
|---|---|---|
| A1 | [Frontier / Coordinador](01-frontier-agent.md) | Entrada, ruteo, ensamblado y bordes |
| A2 | [Tutor](02-tutor-agent.md) | Teoría, práctica, código, quiz y orientación |
| A3 | [Admin](03-admin-agent.md) | Información administrativa publicada |
| A4 | [Follow-up](04-followup-agent.md) | Seguimiento DM con opt-in |
| A5 | [Feedback](05-feedback-agent.md) | Feedback voluntario y digest |
| A6 | [Knowledge Curator](06-knowledge-curator-agent.md) | Conocimiento/configuración docente vigente |

## Componentes fuera del SMA

`SubjectRouter`, `Auth/Role Check`, `MemoryStore`, `InputExtractor`, `OutputPolicy`, `Scheduler` y `OutboundDispatcher` son infraestructura determinista. En particular, `OutputPolicy` determina `assistance_mode` y revisa privacidad/sobre-entrega; no existe un agente separado para esa tarea.
