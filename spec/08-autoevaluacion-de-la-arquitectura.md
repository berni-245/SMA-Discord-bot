# Entregable 8 — Auto-evaluación de la arquitectura

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); multi-materia en el [Entregable 3](03-multi-materia.md); memoria en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md); Discord en el [Entregable 5](05-conexion-con-discord.md); riesgos en el [Entregable 7](07-riesgos-supuestos-y-limites-eticos.md).

## 1. Propósito y escala

Esta sección evalúa el **propio diseño** con criterios de sistemas multiagente, evitando que la entrega sea "completa pero poco reflexiva". Para cada métrica damos **juicio + argumento anclado al diseño + límite honesto**.

**Escala (cualitativa, tres niveles):** **Bajo** (frágil o sin resolver) · **Medio** (resuelto con reservas) · **Alto** (resuelto con argumento sólido). Distinguimos, cuando hace falta, el **plano de agentes** (la arquitectura lógica) del **plano operativo** (infraestructura y despliegue), porque no siempre puntúan igual.

| Métrica | Juicio |
|---|---|
| Escalabilidad (multi-materia) | **Alto** en agentes / **Medio** en operación |
| Robustez / degradación | **Alto** |
| Flexibilidad / extensibilidad | **Alto** (con reserva en políticas) |

## 2. Escalabilidad (crecimiento del número de materias)

**Juicio: Alto en el plano de agentes, Medio en el plano operativo.**

**Argumento (anclado al diseño):**

- Se eligieron **agentes genéricos parametrizados por materia**, no agentes por materia ([Entregable 1 §3.4](01-inventario-y-justificacion-de-agentes.md), [Entregable 3 §6](03-multi-materia.md)). Agregar una materia es **levantar un servidor + crear particiones + registrarla en el Subject Router**; **no** se clonan ni se agregan agentes. El número de agentes a coordinar es **constante** respecto de *N* materias.
- No hay un **orquestador central global**: A1 actúa por servidor/materia ([Entregable 2 §2](02-interaccion-y-coordinacion.md)), así que la coordinación no tiene un único punto que sature al crecer *N*.
- Los stores están **particionados por materia** (KB/Config/Feedback) y por **usuario+materia** (memoria), de modo que el crecimiento de una materia no contamina ni frena a las otras.

**Límite honesto (cuellos de botella conceptuales):**

- El cuello **no** es de orquestación lógica, sino **operativo**: "una materia = un servidor" implica gestionar *N* servidores (alta, permisos, presencia del bot en muchos *guilds*, límites/rate-limits de la plataforma). A escala de cientos de materias, eso es costo real de operación.
- El **seguimiento proactivo (A9)** recorre usuarios × materias; con *N* grande, el costo de los ciclos del scheduler y de la Notification Policy crece linealmente.
- El **conocimiento vivo** (RAG/indexación de A11) escala con la cantidad de KB activas.
- Es decir: el modelo de agentes escala bien; la **infraestructura por servidor** es lo que habría que vigilar primero.

## 3. Robustez / degradación (fallo del frente de programación)

**Juicio: Alto.**

**Argumento (anclado al diseño):**

- El frente de programación —**A3 Practice + A4 Scaffolding** + el pipeline de código + **A5** en su rol de guard de práctica— está **desacoplado** de los demás frentes por la coordinación de especialistas ([Entregable 1 §3.3](01-inventario-y-justificacion-de-agentes.md), [Entregable 2](02-interaccion-y-coordinacion.md)).
- Si **A3/A4 fallan o no están disponibles:**
  - **Se mantiene:** teoría (A2), administrativo (A6), autoevaluación (A7), feedback (A10), memoria y seguimiento (A8/A9) y el ruteo (A1). Ninguno depende del frente de código.
  - **Se degrada:** únicamente el **apoyo práctico / análisis de código**.
  - **Cómo se comunica:** A1, al clasificar `apoyo_practico` y detectar el frente caído, responde cordialmente que la ayuda con código no está disponible por ahora, **reconduce a docentes** y ofrece atender consultas de teoría/admin/quiz. Es una **degradación parcial elegante**, no una caída total.
- **Fail-safe pedagógico:** si el que falla es **A5** (el guard), el sistema toma la postura **conservadora** de **no** derivar a A3 (sin guard no puede garantizar que no se resuelva un evaluable), degradando la práctica a "no disponible" en vez de arriesgar la restricción pedagógica.

**Límite honesto:**

- **Puntos únicos de falla compartidos:** A1 (Frontier) es el único punto de entrada del ruteo; si cae A1, cae todo. Lo mismo el **Discord Gateway** y la **infraestructura de identidad** (son el ambiente y su puerta).
- **A8 (memoria)** es compartido: si falla, los demás agentes siguen respondiendo pero **sin contexto longitudinal** (degradación de **calidad**, no caída).
- La degradación elegante **depende** de que A1 "sepa" que el frente está caído (un *health-check* conceptual); sin esa señal, podría intentar derivar y fallar de forma menos prolija. No está modelado el detalle de detección.

## 4. Flexibilidad / extensibilidad (incorporar un agente nuevo)

**Juicio: Alto, con reserva en el plano de políticas.**

**Argumento (anclado al diseño):** incorporar, por ejemplo, un **Agente de Bienestar Estudiantil** (orientación a recursos de apoyo, ánimo, derivación a servicios humanos) requiere, **como mínimo**:

1. **Definir el agente** con su rol, guardrails y formato de salida, siguiendo el mismo molde que las fichas del [Entregable 1](01-inventario-y-justificacion-de-agentes.md).
2. **Agregar una intención** (`bienestar`) al clasificador de **A1** y su regla de derivación ([Entregable 2 §4](02-interaccion-y-coordinacion.md)).
3. **Ubicarlo en la matriz agente–ambiente** ([Entregable 5 §4](05-conexion-con-discord.md)): casi seguro **solo DM** (tema sensible), nunca canal público, con **derivación humana prioritaria**.
4. **Fijar sus políticas**: privacidad reforzada, minimización de memoria, y el límite de **no diagnosticar** (deriva a servicios humanos).

No hace falta **rediseñar**: A1 ya rutea por intención, A8 ya particiona memoria, la **derivación humana** ya es una rama de primera clase, y el principio de "no reemplazar al humano" ya está. Más aún, **A10 ya tiene un *hook* de escalado de bienestar/seguridad** ([Entregable 1, A10](01-inventario-y-justificacion-de-agentes.md); [Entregable 7 §6](07-riesgos-supuestos-y-limites-eticos.md)): el nuevo agente **extiende** ese punto existente en lugar de abrir uno nuevo.

**Límite honesto:**

- El costo real **no es arquitectónico sino de política y responsabilidad**: qué deriva, a quién, con qué urgencia, y cómo se cuida la privacidad de un tema delicado.
- **Tensión con el aislamiento por materia:** el bienestar **no** es necesariamente por materia (un alumno está mal "en general", no "en Álgebra II"). Eso roza el supuesto "todo aislado por materia / un servidor por materia" ([Entregable 3](03-multi-materia.md)): habría que decidir si el agente de bienestar es **per-materia** o **transversal**, y lo segundo rompería levemente el modelo de *tenant*. Es el límite más serio de la extensión.
- Cada intención nueva **agranda el clasificador** de A1, con más riesgo de mala clasificación a medida que crecen las categorías.

## 5. Métrica adicional y priorización de mejoras

**Métrica adicional — Trazabilidad / auditabilidad: Alto.** El diseño deja rastro de *de dónde* sale cada cosa: cita de fuente en las respuestas, `chunk_id`/versión/vigencia en la KB (A11), justificación en el dictamen de A5, log mínimo de operaciones de memoria (A8) y *flag* a humano en la moderación (A10). Límite honesto: la auditabilidad está descrita conceptualmente, no se fijó el detalle de los registros de auditoría.

**Si tuviéramos otra iteración, priorizaríamos:**

1. **Resiliencia de los puntos únicos** (A1, Gateway, A8): definir *health-checks* y degradación explícita, hoy solo esbozada.
2. **Costo operativo de *N* servidores:** evaluar si conviene una variante de despliegue para escala alta, sin perder el aislamiento.
3. **Capacidades transversales a materia** (como bienestar): decidir un modelo claro para lo que no encaja en un único *tenant*.

## 6. Síntesis

La arquitectura puntúa **alto** en las tres dimensiones a nivel lógico: escala por **parametrización** sin multiplicar agentes, **degrada parcialmente** sin que el fallo del frente de código tumbe los demás, y **extiende** agregando un especialista y una intención sin rediseño. Los límites honestos están en otro plano: la **operación de muchos servidores**, los **puntos únicos compartidos** (A1, Gateway, A8) y las **capacidades transversales a materia** que tensionan el aislamiento. Reconocerlos es parte de la evaluación: el diseño es sólido en lo conceptual y sabe **dónde** miraría primero si tuviera que crecer.
