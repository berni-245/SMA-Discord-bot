# Entregable 2 — Interacción y coordinación

> Sistema multiagente de soporte a la cursada en Discord. Vocabulario en el [glosario (Entregable 0)](00-glosario.md); inventario de agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md).

## 1. Propósito y alcance

**Cómo colaboran** los 11 agentes: orden, coordinación, derivación, compartición de información, fuera de dominio, **estudiante / docente**, **estudiante → feedback → docente**. No repite Entregable 1 (agentes) ni Entregable 6 (escenarios). Fija el **modelo de coordinación** instanciado allí.

## 2. Mecanismo de coordinación: orquestación liviana híbrida

### 2.1. La decisión

Tres patrones:

1. **Supervisor de entrada (A1 Frontier).** Mensaje **estudiante** → A1 clasifica **intención** y rutea. Entrada única y cortesía de borde; no re-media cada paso.
2. **Cadena de responsabilidad.** Especialistas pasan trabajo **sin** volver a A1: `A5 → A3 → A4 → publicación`.
3. **Pizarra acotada (*blackboard*).** STM en **A8**; entrega filtrada/minimizada. Dueño único, no difusión.

Handoffs **tipados**: `decision`, `target`/`handoff_payload` + justificación.

### 2.2. Por qué este mecanismo y no otros

- **No orquestador estricto:** cuello de botella; evaluable vía pipeline, no A1 en cada salto.
- **No P2P puro:** vacío, solapamiento, bucles; borde disperso.
- **No negociación / *contract-net*:** roles fijos; asignación por intención.

> **Resumen:** *A1 entrada* + *pipelines* + *A8 pizarra*, *handoffs tipados*.

## 3. Quién actúa primero

### 3.1. Mensaje típico de un estudiante

**A1 primero:** (1) verificación, (2) materia o **una** desambiguación, (3) intención (§4; `< 0.7` → aclarar), (4) sanitizar.

- **Teórica:** `A1 → A8 → A2 → Privacy Filter → publica`.
- **Práctica:** `A1 → A5 → A3 → A4 → publica`.

### 3.2. Casos límite (quién actúa primero)

| Caso límite | Primer actor y acción |
|---|---|
| Usuario no verificado | **A1**: rechazo cordial + orientación a verificación; no deriva |
| Materia ambigua (p. ej. en DM, sin servidor que la fije) | **A1**: una pregunta de desambiguación; no deriva hasta resolverla |
| Código sensible en canal público | **A1**: sugiere mover a DM **antes** de derivar a A3 |
| Intento de jailbreak | **A1**: rechazo cordial sin cumplir + reconducción |
| Fuera de dominio | **A1**: respuesta educada + reconducción a docentes (§6) |
| Caso personal mezclado con reglas / trámite | **A1**: regla general (si A6 la tiene) + derivación humana |
| Aporte en canal docente | **A11** (no A1): flujo docente fuera del pipeline estudiante (§9) |
| Contacto de seguimiento | **A9** (no A1): proactivo por scheduler, no mensaje entrante |

## 4. Criterios de derivación entre agentes

Primaria A1; secundaria especialistas.

### 4.1. Derivación primaria (desde A1)

| Intención | Destino | Criterio |
|---|---|---|
| `apoyo_teorico` | A2 | Pregunta conceptual de la materia |
| `apoyo_practico` | A5 → A3 | Siempre dictamen A5 antes de A3 |
| `quiz` / `autoevaluacion` | A7 | Pedido de autoevaluación |
| `info_administrativa` | A6 | Fechas, modalidad, reglas publicadas |
| `feedback` (cursada o bot) | A10 | Aporte de retroalimentación |
| `orientacion` | A6 + A2 (compuesto) | “No sé por dónde empezar” → checklist/fechas + punto de entrada en contenido, ensamblado por A1 |
| `control_memoria` | A8 | Comandos `/mi-historial`, `/borrar-historial`, opt-out |
| `caso_mixto` / `tramite` | A1 (responde) + derivación humana | Caso particular: regla general + a quién acudir |
| `fuera_de_dominio` | A1 (responde) | Respuesta educada + reconducción a docentes |
| `saludo` / `charla_casual` | A1 (responde) | Saludo breve + ofrecimiento de ayuda |

### 4.2. Derivación secundaria (entre especialistas)

| Origen | Destino | Disparador |
|---|---|---|
| A2 Theory | A1 (`handoff_no_kb`) | No hay base en KB → reconducción a docentes (no inventar) |
| A2 Theory | A1 (`handoff_other_domain`) | Pregunta práctica/admin, no teórica |
| A3 Practice | A4 Scaffolding | Borrador listo (`draft_ready`): revisión pedagógica obligatoria antes de publicar |
| A3 Practice | A1 (`handoff_teacher`) | Consigna ambigua a nivel de cátedra (criterio docente) |
| A3 Practice | A5 (`escalate_to_guard`) | Sospecha de evaluable activo que A5 no marcó |
| A4 Scaffolding | A3 (`reject`) | Borrador entrega solución: vuelve a A3 con motivo |
| A7 Quiz | A10 | Aporta `feedback_metric` (resuelto/no) tras evaluar |
| Cualquiera | A8 | Lectura/escritura de memoria (A8 puede **negar** según rol; ver §7) |

Deriva por **exceso de rol** o **política** (A3→A4; práctica vía A5). **Gate A5:** `is_evaluative = true` → no A3; A3 solo con `false`.

## 5. Coordinación y límites éticos: coherencia

Evaluable → A5+A4; privado → A1+A8+Privacy Filter; docente → reconducción/derivación; `subject_id` invariante; proactivo → A9 acotado (opt-out, frecuencia, silencio).

## 6. Salida ante consultas fuera de dominio o no atendibles

**A1** clasifica y responde: reconocimiento, fuera de dominio, reconducción a docentes. Igual con `handoff_no_kb` (sin inventar). Entregable 7.

## 7. Qué información se comparte entre agentes (y qué no)

### 7.1. Lo que circula

| Dato | Quién lo provee | Quién lo consume | Para qué |
|---|---|---|---|
| `subject_id`, `channel_type` | invariantes en cada pedido | todos | Aislamiento por materia y visibilidad por canal |
| `sanitized_user_message` | A1 | especialistas | Consulta saneada según el canal |
| Extracto de memoria | A8 (filtrado + minimizado) | A2, A3, A7, A9 | Continuidad pedagógica |
| Dictamen evaluativo | A5 | A3 (y A1) | Postura ante evaluable activo |
| Borrador (`draft`) | A3 | A4 | Revisión de densidad antes de publicar |
| `feedback_metric` | A7 | A10 | Feedback de cursada |
| Chunks de KB | A11 (curaduría) | A2, A7 (vía RAG) | Anclar respuestas en material vigente |

### 7.2. Lo que NO circula (y por qué)

- DM→público (*privacidad*); memoria→A5 (*consistencia*); feedback identificable→otros (*privacidad*); entre materias (*aislamiento*); dominio→A4 (*mínimo privilegio*).

### 7.3. Estado compartido intra-sesión: quién lo controla

**A8** controla STM. LTM: Entregable 4.

## 8. Prioridad y resolución de conflictos

Un destino/mensaje (A1). Mixta: política+A5 → A6 → A2 / A3→A4 → ensamblado A1. Ambigüedad → re-pregunta.

## 9. Roles de usuario: estudiante vs docente

Superficies separadas; docente fuera del pipeline estudiante.

| Aspecto | Estudiante | Docente |
|---|---|---|
| Punto de entrada | Mensaje en canal de estudiantes o DM → **A1** | **Canal docente especializado** (aporte) y panel/hilo de cátedra (lectura) |
| Agentes que lo atienden | A1 + especialistas (A2–A8, A10 en modo encuesta), seguimiento de A9 | **A11** (curaduría de KB), **A10** (digest), configuración del Config Store |
| Capacidades | Consultar teoría/práctica, autoevaluarse, recibir seguimiento, dar feedback, controlar su memoria | Aportar/actualizar conocimiento, leer feedback agregado, configurar materia y evaluativas |
| Permisos de canal | Lectura/escritura en canales de estudiante; DM con el bot | Escritura en canal docente; lectura del hilo/panel de cátedra |
| Disparadores típicos | Mensajes, comandos como `/mi-historial`, `/checklist` | Publicación en canal docente; comandos de configuración (conceptual) |

Docente ve **agregados**; *guardrails* y permisos por canal.

## 10. Flujo estudiante → feedback → docente

**A10:** encuesta (cooldown, DM) → anonimato de cátedra → moderación (odio *flag*; bienestar escala humana) → digest agregado (semanal) → canal/hilo docente. Complementario a evaluación oficial (Entregable 7).

## 11. Síntesis

A1 + pipelines + A8; límites incrustados; superficies separadas; feedback agregado. Escenarios: Entregable 6.
