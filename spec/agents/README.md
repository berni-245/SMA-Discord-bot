# Especificaciones de agentes vigentes

La arquitectura final contiene **6 agentes lógicos**. Los agentes producen decisiones o borradores; `OutboundDispatcher` es el único componente que publica en Discord.

| ID  | Ficha                                              | Función                                      |
| --- | -------------------------------------------------- | -------------------------------------------- |
| A1  | [Frontier / Coordinador](01-frontier-agent.md)     | Entrada, intención, seguridad, ruteo y bordes |
| A2  | [Tutor](02-tutor-agent.md)                         | Teoría, práctica, código, quiz, orientación y segunda barrera de crisis |
| A3  | [Admin](03-admin-agent.md)                         | Información administrativa publicada         |
| A4  | [Follow-up](04-followup-agent.md)                  | Seguimiento DM habilitado por default; opt-out y DM contactable  |
| A5  | [Feedback](05-feedback-agent.md)                   | Feedback voluntario y digest                 |
| A6  | [Knowledge Curator](06-knowledge-curator-agent.md) | KB vía `/incorporar-material`; Config vía `/actualizar-catedra` |

## Componentes fuera del SMA

`SubjectRouter`, `Auth/Role Check`, `MemoryStore`, `SafetyClassifier`, `CrisisCaseStore`, `CrisisEscalationProtocol`, `InputExtractor`, `OutputPolicy`, `Scheduler` y `OutboundDispatcher` son infraestructura determinista. En particular, `OutputPolicy` determina `assistance_mode` y revisa privacidad/sobre-entrega; no existe un agente separado para esa tarea. La crisis de bienestar se escala por protocolo, no por un séptimo agente.
