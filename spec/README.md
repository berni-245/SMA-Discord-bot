# Diseño de un sistema multiagente para soporte a la cursada en Discord

Diseño conceptual (sin implementación) de un **sistema multiagente** que asiste a **estudiantes** y **docentes** en la cursada de **varias materias en paralelo** sobre Discord, sin reemplazar al docente ni a los canales institucionales. Discord se modela como **ambiente** (sensores y actuadores), y el sistema como **11 agentes especializados** coordinados por un agente de frontera, más infraestructura determinista.

Este directorio contiene los **entregables de diseño**. Se recomienda leerlos en orden; el **glosario** fija el vocabulario que usan todos.

## Índice de entregables

| # | Documento | Contenido |
|---|---|---|
| 0 | [Glosario y lenguaje ubicuo](00-glosario.md) | Vocabulario del dominio por contextos acotados; define **sesión** vs **conversación** y la memoria intra-sesión vs entre días. |
| 1 | [Inventario y justificación de agentes](01-inventario-y-justificacion-de-agentes.md) | Cuántos agentes y por qué; ficha de cada uno (rol, capacidades, recursos, fuera de alcance) y su **carácter reactivo/proactivo/social + BDI**. |
| 2 | [Interacción y coordinación](02-interaccion-y-coordinacion.md) | Quién actúa primero, mecanismo de coordinación, criterios de derivación, qué se comparte y qué no, roles de usuario, circuito **estudiante → feedback → docente**. |
| 3 | [Multi-materia](03-multi-materia.md) | Cómo se resuelve el contexto de materia (**una materia = un servidor**), aislamiento por tenant, ambigüedad, escala a *N* materias. |
| 4 | [Memoria entre sesiones y seguimiento](04-memoria-entre-sesiones-y-seguimiento.md) | Qué se conserva/descarta, dónde vive (A8), retención, **contacto proactivo** (A9) y control del usuario, con un ejemplo día 1 → seguimiento. |
| 5 | [Conexión con Discord](05-conexion-con-discord.md) | Representación (**un solo bot**), **matriz agente–ambiente**, canal docente, privacidad público vs DM, **atribución de fuente** e **ingreso de código**. |
| 6 | [Escenarios y trazabilidad](06-escenarios-y-trazabilidad.md) | Tres escenarios (A pedagógico-código, B administrativo-institucional, C mixto), paso a paso, con **diagramas de secuencia**. |
| 7 | [Riesgos, supuestos y límites éticos](07-riesgos-supuestos-y-limites-eticos.md) | Supuestos, anti-alucinación, fuera de dominio/maliciosas, y tabla de **riesgos creíbles × mitigaciones**. |
| 8 | [Auto-evaluación de la arquitectura](08-autoevaluacion-de-la-arquitectura.md) | Escalabilidad, robustez/degradación y flexibilidad, con juicio, argumento anclado y **límite honesto** por métrica. |
| 9 | [Preguntas abiertas y no funcionales](09-preguntas-abiertas-y-no-funcionales.md) | Complemento: cierra explícitamente preguntas abiertas (voces, conversaciones largas, lenguajes) y no funcionales (degradación/latencia, idioma, accesibilidad). |

La **spec operativa** de cada uno de los 11 agentes (rol, system prompt, guardrails, formato de salida, ejemplos) vive en [`agents/`](agents/), enlazada desde cada ficha del Entregable 1.

## Decisiones de diseño transversales (referencia rápida)

- **Granularidad:** 11 agentes especializados + un agente de frontera (A1), en vez de pocos generalistas.
- **Coordinación:** orquestación liviana híbrida — A1 clasifica y rutea en la entrada; pipelines con handoffs directos (p. ej. `A5 → A3 → A4`); estado intra-sesión custodiado por A8.
- **Multi-materia:** **una materia = un servidor** de Discord; agentes genéricos parametrizados por materia; aislamiento por frontera de servidor + partición por tenant.
- **Discord:** **un solo bot** presente en cada servidor; agentes como roles lógicos internos; matriz agente–ambiente con vedados explícitos.
- **Memoria:** tres capas (STM intra-sesión / LTM entre días / Pedagogical Profile) en un único custodio (A8), con minimización, retención acotada y visibilidad de origen.
- **Garantías pedagógicas:** no resolver evaluables (gate de A5 + densidad de A4), atribución de fuente (citar = no inventar), reconducción a docentes ante falta de fuente, y proactividad acotada (opt-out, rate-limit).
