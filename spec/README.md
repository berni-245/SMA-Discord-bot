# Diseño del sistema multiagente de soporte en Discord

Diseño conceptual de un asistente para estudiantes y docentes en múltiples materias sobre Discord. Discord es el **ambiente** del sistema: canales, roles, permisos y visibilidad condicionan lo que el bot percibe y publica.

## Decisión de arquitectura

El sistema usa **un solo bot** y **6 agentes lógicos**, parametrizados por `subject_id`:

| Agente                    | Responsabilidad principal                                        |
| ------------------------- | ---------------------------------------------------------------- |
| A1 Frontier / Coordinador | Clasifica, deriva, ensambla y reconduce a humanos                |
| A2 Tutor                  | Teoría, práctica/código, autoevaluación y orientación pedagógica |
| A3 Admin                  | Fechas y reglas publicadas; deriva casos particulares            |
| A4 Follow-up              | Seguimiento proactivo por DM con opt-in                          |
| A5 Feedback               | Feedback voluntario, moderación y digest docente                 |
| A6 Knowledge Curator      | Incorpora aportes docentes versionados a KB o Config             |

La memoria, el ruteo de materia, la extracción de código, las políticas de salida y el envío a Discord son **infraestructura determinista**, no agentes. Esta decisión reduce handoffs y mantiene separados los comportamientos que sí requieren una postura propia.

## Entregables

| N.º | Documento                                                                 | Contenido                                          |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------- |
| 0   | [Glosario](00-glosario.md)                                                | Lenguaje común, sesión/conversación y componentes  |
| 1   | [Inventario y justificación](01-inventario-y-justificacion-de-agentes.md) | Seis agentes, recursos, BDI y trade-off            |
| 2   | [Interacción y coordinación](02-interaccion-y-coordinacion.md)            | Ruteo, pipelines, feedback y derivación            |
| 3   | [Multi-materia](03-multi-materia.md)                                      | Tenant, stores y ambigüedad en DM                  |
| 4   | [Memoria y seguimiento](04-memoria-entre-sesiones-y-seguimiento.md)       | Persistencia mínima y proactividad consentida      |
| 5   | [Conexión con Discord](05-conexion-con-discord.md)                        | Sensores, actuadores, permisos e ingreso de código |
| 6   | [Escenarios y trazabilidad](06-escenarios-y-trazabilidad.md)              | Casos integradores y secuencias                    |
| 7   | [Riesgos y límites](07-riesgos-supuestos-y-limites-eticos.md)             | Mitigaciones y límites éticos                      |
| 8   | [Autoevaluación](08-autoevaluacion-de-la-arquitectura.md)                 | Escala, robustez y extensibilidad                  |
| 9   | [Decisiones abiertas](09-preguntas-abiertas-y-no-funcionales.md)          | Posturas y requisitos no funcionales               |

Las fichas operativas vigentes están en [`agents/`](agents/).

## Garantías centrales

- Una materia nunca consume datos ni memoria de otra.
- No se entrega una solución evaluable completa en una respuesta; sí se permite guía parcial.
- Los aportes docentes entran por `/incorporar-material` o mención explícita y actualizan la fuente vigente.
- El seguimiento es únicamente por DM con opt-in previo.
- El feedback docente contiene solo aportes voluntarios y agregados.
- `OutboundDispatcher` es el único componente que escribe efectivamente en Discord.
