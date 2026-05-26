# Entregable 5 — Conexión con Discord (a nivel de diseño)

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); multi-materia en el [Entregable 3](03-multi-materia.md); memoria en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md).

## 1. Propósito y alcance

Discord = **ambiente**: permisos/roles/canales acotan sensores y actuadores. Representación, **matriz agente–ambiente**, canal docente, interacción, privacidad, **atribución**, **código**. Solo diseño.

## 2. Representación en Discord: un solo bot

**Un bot** por servidor de materia; 11 agentes **lógicos internos**. Una identidad vía **Discord Gateway**; coherente con A1 (Entregable 2) y **una materia = un servidor** + **Subject Router** (Entregable 3).

Roles: `estudiante`, `docente`, `ayudante`.

| Canal | Quién escribe | Visibilidad | Rol en el sistema |
|---|---|---|---|
| **Canal público de consultas** | estudiantes (y bot si lo @mencionan) | pública entre miembros | Consultas visibles; bot responde **solo si lo @mencionan** |
| **DM / privado 1:1 con el bot** | estudiante ↔ bot | privada | Consultas privadas, código sensible, quizzes, seguimiento |
| **Canal docente especializado** (`#material-cátedra` o equiv.) | **solo docencia** | lectura para estudiantes (diferenciada si la cátedra lo define) | Aporte de conocimiento → A11 |
| **Canal/hilo de cátedra** | bot (digest) y docencia | solo docencia | Digests de feedback (A10) |
| **Hilos** | según canal padre | heredan la del canal padre | Conversaciones largas; canal restringido por rol = "público entre quienes lo leen" |

> **Intermedios:** visibilidad = lectores; hilo hereda padre; canal por rol = público entre lectores; grupo pequeño = privado al servidor, público entre miembros. A8 etiqueta origen.

## 3. Cómo se dispara y se recibe una interacción

**Discord Gateway:** público (@mención + Privacy Filter); DM directo sin saneo; slash; docente → A11/digest/config; A9 por scheduler (DM o mención sin privado).

## 4. Matriz de interacción agente–ambiente (obligatoria)

**P** = percibe · **(P)** = vía A1 · **A** = actúa · **—** = vedado.

| Agente | Canal público de consultas | DM / privado | Canal docente (aporte) | Canal/hilo de cátedra (digest) |
|---|---|---|---|---|
| **A1** Frontier | P · A | P · A | — | — |
| **A2** Theory | (P) · A | (P) · A | — | — |
| **A3** Practice | (P) · A | (P) · A | — | — |
| **A4** Scaffolding | A | A | — | — |
| **A5** Evaluative Guard | (P) | (P) | — | — |
| **A6** Admin Info | (P) · A | (P) · A | — | — |
| **A7** Quiz | (P) · A | (P) · A | — | — |
| **A8** Memory | — | — | — | — |
| **A9** Follow-up | A (mención, sin detalle privado) | A | — | — |
| **A10** Feedback | — | A (encuesta) | — | A (digest) |
| **A11** KB Curator | — | — | P · A | — |

**Vedados:** A11 solo docente; A1–A9 no aporte docente; A8/A5 no actúan en canales; A9/A10 no DM→público; hilo cátedra solo A10 escribe, estudiante no percibe.

## 5. Canal especializado de aporte docente

`#material-cátedra` (docente escribe). **A11** indexa **KB Store** (vigencia, versionado). A2/A7 consumen vía RAG; aislamiento por materia (Entregable 3).

## 6. Privacidad pública vs DM

Público → Privacy Filter + @mención; DM completo. Memoria: visibilidad origen (Entregable 4). Feedback: digest agregado. Handoffs: A1 sanitiza; DM no cruza sin **transferencia explícita y consentida**. **Privacy Hint** si código sensible en público.

## 7. Atribución de fuente en lo que se publica

Cita material **vigente** (KB/Config Store); sin fuente → reconducción (Entregable 2 §6, 7). Trazabilidad interna (`chunk_id`); no cita privado ajeno.

## 8. Ingreso de código (funcionalidad 2)

Backtick, adjunto texto, link a hilo. **Code Extractor** + **Format Validator** + **Privacy Hint**. Solo texto; tamaño configurable (~100 KB / ~2000 líneas). Ilegible → no a ciegas. Flujo: Gateway → infra → **A3** en `A1→A5→A3→A4` (categorías de error, sin reescribir solución).

## 9. Componentes de soporte no-agente (identidad y configuración)

**Auth Service** + **User Mapping Store** + **Auth Check**; **Config Service** + **Config Store** + **Subject Router**. Consumen A6/A5; carga docente. Precondición antes de agentes.

## 10. Síntesis

Un bot; matriz y vedados; A11→KB; citas o reconducción; código con pipeline; público/DM coherente en respuestas, memoria, feedback, handoffs.
