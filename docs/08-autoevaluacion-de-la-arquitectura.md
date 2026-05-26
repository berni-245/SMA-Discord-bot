# Entregable 8 — Auto-evaluación de la arquitectura

> Glosario [00](00-glosario.md); agentes [01](01-inventario-y-justificacion-de-agentes.md); coordinación [02](02-interaccion-y-coordinacion.md); multi-materia [03](03-multi-materia.md); memoria [04](04-memoria-entre-sesiones-y-seguimiento.md); Discord [05](05-conexion-con-discord.md); riesgos [07](07-riesgos-supuestos-y-limites-eticos.md).

## 1. Propósito y escala

Evaluación del diseño con criterios multiagente: **juicio + argumento + límite honesto**/métrica. Escala **Bajo** · **Medio** · **Alto**; distinguir plano **agentes** (lógico) vs **operativo** (infra).

| Métrica | Juicio |
|---|---|
| Escalabilidad (multi-materia) | **Alto** en agentes / **Medio** en operación |
| Robustez / degradación | **Alto** |
| Flexibilidad / extensibilidad | **Alto** (con reserva en políticas) |

## 2. Escalabilidad (crecimiento del número de materias)

**Juicio: Alto en agentes, Medio en operación.**

**Argumento:** agentes genéricos por materia ([E1 §3.4](01-inventario-y-justificacion-de-agentes.md), [E3 §6](03-multi-materia.md)) — nueva materia = servidor+particiones+Subject Router; **no** se clonan agentes; A1 por servidor ([E2 §2](02-interaccion-y-coordinacion.md)); stores particionados (KB/Config/Feedback; memoria usuario+materia).

**Límite:** cuello **operativo** (*N* servidores, bot en muchos *guilds*, rate-limits); **A9** (scheduler) y **A11** (RAG) escalan con uso. Infra por servidor vigilar primero.

## 3. Robustez / degradación (fallo del frente de programación)

**Juicio: Alto.**

**Argumento:** frente **A3+A4+A5** + pipeline código **desacoplado** ([E1 §3.3](01-inventario-y-justificacion-de-agentes.md), [E2](02-interaccion-y-coordinacion.md)). Caída A3/A4: siguen teoría (A2), admin (A6), quiz (A7), feedback (A10), memoria (A8/A9), ruteo (A1); degrada solo práctica/código; A1 informa y reconduce. **A5** caído → no derivar a A3 (postura conservadora).

**Límite:** SPOF A1, Discord Gateway, identidad; A8 caído → sin LTM (calidad, no caída total); degradación requiere health-check conceptual (no modelado en detalle).

## 4. Flexibilidad / extensibilidad (incorporar un agente nuevo)

**Juicio: Alto, con reserva en políticas.**

**Argumento (ej. Bienestar):** ficha rol/guardrails; intención `bienestar` en **A1**; matriz **solo DM** + derivación humana ([E5 §4](05-conexion-con-discord.md)); no diagnosticar. Sin rediseño: A1 rutea, A8 particiona; **A10** *hook* bienestar ([E1 A10](01-inventario-y-justificacion-de-agentes.md); [E7 §6](07-riesgos-supuestos-y-limites-eticos.md)).

**Límite:** costo política/privacidad; bienestar puede ser **transversal** → tensiona tenant por materia ([E3](03-multi-materia.md)); más intenciones → clasificador A1 más frágil.

## 5. Métrica adicional y priorización de mejoras

**Trazabilidad / auditabilidad: Alto** — cita de fuente, `chunk_id`/vigencia (A11), dictamen A5, log A8, flag A10. Límite: conceptual, sin detalle registros.

**Prioridad:** (1) resiliencia SPOF (A1, Gateway, A8); (2) costo *N* servidores sin perder aislamiento; (3) capacidades transversales (bienestar).

## 6. Síntesis

**Alto** en lógica: parametrización, degradación parcial si cae código, extensión con especialista+intención. Límites: operación multi-servidor, SPOF compartidos, transversal vs tenant.
