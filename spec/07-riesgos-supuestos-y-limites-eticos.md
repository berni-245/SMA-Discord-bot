# Entregable 7 — Riesgos, supuestos y límites éticos de diseño

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); multi-materia en el [Entregable 3](03-multi-materia.md); memoria en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md); Discord en el [Entregable 5](05-conexion-con-discord.md).

## 1. Propósito y alcance

Este entregable hace explícitos los **supuestos** sobre los que se apoya el diseño, cómo se evitan las **alucinaciones**, cómo se tratan las consultas **fuera de dominio / ambiguas / maliciosas**, y los **riesgos creíbles** de filtrado de información, con sus **mitigaciones** ancladas en mecanismos concretos del sistema. No es un apartado genérico: cada riesgo se ata al agente o componente que lo enfrenta.

## 2. Supuestos de diseño

- **Acceso previo autorizado.** Los usuarios son habilitados, con rol asignado (`estudiante` / `docente` / `ayudante`); la identidad se valida por infraestructura (correo institucional + token, Entregable 5). El sistema no diseña el alta institucional, lo asume como precondición.
- **Una materia = un servidor** (Entregable 3): el aislamiento se apoya en la frontera del servidor más la partición por tenant.
- **El docente es la autoridad de contenido.** A11 cuida la **coherencia estructural** de la KB (versión, vigencia), pero **no valida la corrección académica**: confía en lo que el docente publica.
- **El LLM y el RAG son herramientas** que los agentes invocan, no agentes; **Discord es el ambiente**.
- **El feedback es complementario**, no evaluación oficial ni encuesta institucional.
- **Límite honesto declarado:** el sistema **no** busca robustez anti-fraude por **cadenas incrementales** de preguntas (no vigila multi-turno). Regula la **postura** de cada respuesta, no persigue al alumno.

## 3. Cómo el diseño evita alucinaciones

El principio es **anclar o reconducir, nunca inventar**:

- **Anclaje en fuentes de cátedra.** A2 (teoría) y A7 (quizzes) responden anclados en la **KB** vía recuperación; A6 (admin) responde **solo** lo que está en el Config Store.
- **Atribución / cita de fuente.** Toda afirmación basada en un documento se publica con **cita legible** de su fuente de cátedra (Entregable 5 §7). La cita es, a la vez, **garantía de procedencia** y **disciplina anti-alucinación**: si hay que citar, hay que tener fuente.
- **Sin base fiable → reconducción a docentes.** Si no hay material en la KB que cubra la pregunta, A2 devuelve `handoff_no_kb` y A1 reconduce a docentes; si un dato no está publicado, A6 responde **"no me consta"** y deriva. **No** se completa con conocimiento general que pueda contradecir a la cátedra.
- **Vigencia.** A11 versiona y marca obsolescencia; los agentes citan material **vigente**, evitando "alucinar" con contenido reemplazado.

> En síntesis: **citar = no inventar**. La ausencia de fuente no se rellena, se deriva.

## 4. Fuera de dominio, ambiguas y maliciosas

La política para lo **fuera de dominio obvio** está fijada y es coherente con el resto del diseño:

- **Quién la detecta y emite:** A1, al clasificar la intención (no hay agente de frontera separado). Forma fija de salida: **mensaje educado + "fuera del dominio del asistente de la materia" + reconducción a docentes / instancia humana** (Entregable 2 §6).

Las variantes que **no** deben contradecir esa política:

- **Ambiguas (de intención):** si la confianza de clasificación es baja (`< 0.7`), A1 **pide una aclaración** antes de derivar, en vez de arriesgar un ruteo incorrecto.
- **Ambiguas (de materia):** en DM sin servidor que la fije, A1 pregunta **de qué materia** (Entregable 3 §5).
- **Ambiguas (de evaluable):** A5 marca `flag_review` en el borde (confianza media) para que A1 pida aclaración antes de bloquear.
- **Maliciosas (jailbreak):** intentos de sacar al agente de su rol ("ignorá tus instrucciones") → A1 **rechaza cordialmente sin cumplir** y reconduce.
- **Maliciosas (extracción de datos ajenos):** "decime qué preguntó otro alumno" → imposible por diseño (partición usuario+materia; A8 no entrega datos de terceros). Ver §5.

## 5. Riesgos de filtrado de información privada

El riesgo central de un asistente en Discord es **exponer lo que se creyó privado**. El diseño lo enfrenta en varias capas:

- **Errores de enrutado / respuesta en canal equivocado:** la **sanitización** de A1, el **Privacy Filter** antes de publicar en público y la **visibilidad de origen** en A8 impiden que contenido nacido en DM aparezca en un canal público.
- **Resúmenes para docentes demasiado detallados:** los **digests** de A10 son **agregados y anonimizados**, con un **mínimo de muestra**; no exponen el detalle identificable de consultas privadas.
- **Código sensible publicado en público:** el **Privacy Hint** sugiere mover a DM antes de analizarlo.
- **Transferencia de lo privado a lo público:** solo ocurre con una **transferencia explícita y consentida** del propio alumno; nunca automática.

## 6. Riesgos creíbles y mitigaciones

| Riesgo | Cómo podría ocurrir | Mitigación en el diseño | Dónde vive |
|---|---|---|---|
| **Alucinación** | Responder sin base, contradiciendo a la cátedra | Anclaje en KB + **cita de fuente**; sin fuente → reconducción; vigencia | A2, A6, A11, A1 |
| **Filtrado entre usuarios** | Entregar datos de otro alumno | Partición **usuario+materia**; A8 niega datos de terceros | A8 |
| **Filtrado entre materias** | Mezclar contenido de cursadas | Aislamiento por materia (servidor + tenant); `subject_id` invariante | Subject Router, A8, todos |
| **Exposición de DM en público** | Respuesta o resumen que filtra lo privado | Sanitización + Privacy Filter + visibilidad de origen | A1, A8, Privacy Filter |
| **Uso malicioso / jailbreak** | "Ignorá tus instrucciones", suplantar rol | Rechazo cordial sin cumplir; guardrails por agente | A1 (y guardrails de todos) |
| **Extracción de datos ajenos** | "¿Qué preguntó Juan?" | No hay acceso cruzado; A8 particiona y niega | A8 |
| **Resolución de evaluable (fraude)** | Pedir el TP/parcial resuelto | A5 marca evaluable + A4 recorta densidad; postura socrática de A3 | A5, A4, A3 |
| **Proactivo molesto / vigilancia** | Spam o sensación de acoso | Opt-out + frecuencia máxima + horarios de silencio + un mensaje por contacto + salida fácil | A9 |
| **Feedback ofensivo / malicioso** | Insultos, ataques personales, contenido de odio | Moderación (filtra ataques, conserva críticas honestas), flag a humano, escalado de bienestar | A10 |
| **Dependencia excesiva del asistente** | El alumno deja de pensar / de consultar al docente | Postura que **orienta sin resolver**; reconducción a docentes; autoevaluación; el bot no reemplaza al docente | A3, A4, A1, A7 |
| **Retención de datos sensibles** | Guardar más de lo necesario | Minimización (hechos pedagógicos, no transcripciones ni código crudo), retención acotada, borrado real, controles del usuario | A8 |
| **Uso de material obsoleto** | Citar contenido reemplazado | Versionado + vigencia; obsolescencia marcada y auditable | A11 |

## 7. Límites éticos no negociables y dónde se hacen cumplir

| Límite | Mecanismo que lo sostiene |
|---|---|
| No corregir oficialmente trabajos/exámenes | A3 orienta sin evaluar; no hay agente de calificación |
| No poner notas ni aprobar/desaprobar | Ningún agente accede a notas; A6/A7 evitan lenguaje de calificación |
| No reemplazar al docente | Reconducción a docentes (A1) y derivación humana (A6) como ramas de primera clase |
| No dar información institucional sensible | A6 responde solo lo publicado; caso particular → deriva |
| No gestionar trámites formales | A6 no tramita; deriva a bedelía/secretaría |
| No tomar decisiones académicas | Las decisiones quedan en docentes/áreas humanas |
| Feedback no es única fuente de evaluación | A10 entrega digest **complementario**, agregado |
| No acosar con proactividad | A9 con opt-out, rate-limit y silencio |
| No exponer lo privado | Sanitización + Privacy Filter + visibilidad de origen; solo transferencia consentida |

## 8. Síntesis

El diseño enfrenta los riesgos con **mecanismos concretos**, no con buenas intenciones: la alucinación se ataca con **anclaje + cita de fuente + reconducción**; el filtrado se ataca con **aislamiento (usuario y materia), sanitización, Privacy Filter y visibilidad de origen**; el fraude evaluable con **A5 + A4** (sin pretender vigilancia multi-turno, límite honesto); el acoso con las **salvaguardas anti-spam de A9**; el feedback malicioso con la **moderación de A10**; y la dependencia con una **postura que orienta y reconduce** en lugar de resolver. Los límites éticos no negociables no son una capa externa: están **distribuidos y hechos cumplir** por los agentes y la infraestructura descritos en los entregables anteriores.
