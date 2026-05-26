# Entregable 0 — Glosario y lenguaje ubicuo del dominio

> Sistema multiagente de soporte a la cursada en Discord (estudiantes y docentes), alcance **multi-materia**.

## Propósito

**Lenguaje ubicuo** (DDD): un significado en entregables, [`agents/`](agents/) y diagramas. Por **bounded contexts**; transversales §1; **índice** §10.

> Término **negrita** + definición. `(A1)…(A11)` → [`agents/`](agents/). Nombra decisiones existentes; no crea nuevas.

## 1. Términos transversales (destacados)

- **Conversación** — **Turnos** coherentes usuario↔sistema, misma intención/tema, canal/hilo. Una **sesión** puede tener varias.
- **Sesión** — Uso continuo en **materia en contexto** (inactividad o fin de jornada). Alcance **STM**; al cerrar, volátil descartado. Persistencia: **LTM** + **Pedagogical Profile**.
- **Turno** — Mensaje usuario + respuesta sistema.
- **Materia en contexto** — Una materia por interacción; sin mezclar (**Aislamiento por materia**).
- **Visibilidad por canal** — **Público**/**privado** por medio de origen; condiciona memoria, publicación, docente (§2).

> **STM** intra-sesión vs **LTM+Profile** entre días: roles distintos (entregable memoria).

## 2. Ambiente Discord (sensores y actuadores)

Discord = **entorno**. **Ambiente/Entorno** — permisos, roles, canales, visibilidad. **Sensor** — entrada (mensajes, eventos, aportes, comandos). **Actuador** — salida (publicar, hilo, DM). **Canal público** — visible a varios estudiantes. **Canal privado/DM** — privado al servidor. **Hilo** — sub-conversación; hereda visibilidad (`hilo_publico`/`hilo_privado`). **Canal docente especializado** — docencia escribe; fuente **Conocimiento vivo**. **Rol de usuario** — `estudiante`/`docente`/`ayudante`. **Autenticación/Verificación** — solo habilitados; `no_verificado` no atendido. **Transferencia explícita y consentida** — privado→público trazado; única excepción. **Discord Gateway** — frontera mensajes. **Privacy Filter** — pre-publicación en público. **Comando slash** — `/mi-historial`, `/checklist`, etc.

## 3. Multi-materia

**Aislamiento por materia** — KB, config, políticas, memoria particionadas. **`subject_id`** — clave partición. **Subject Router** — materia por servidor; en **DM** puede fallar → **ambigüedad de materia** (§4). **Parametrización por materia** — un agente, *N* materias, sin clonar.

## 4. Atención y ruteo

**Frontier Agent (A1)** — clasifica **intención**, rutea, bordes. **Intención (*intent*)** — `apoyo_teorico`, `apoyo_practico`, `quiz`, `info_administrativa`, `feedback`, `caso_mixto`, `fuera_de_dominio`, `orientacion`, `control_memoria`, `saludo`, `ambiguo`. **Handoff/Derivación** — pase con justificación. **Dispatch compuesto** — A1 ensambla (A6+A2). **Ambigüedad de materia** — aclarar antes de derivar. **Fuera de dominio** — límite + **reconducción a docentes**. **Reconducción a docentes** — docente/canal humano sin base fiable. **Derivación humana** — docente, bedelía, secretaría, trámites. **Sanitización** — no filtrar privado a especialistas en público. **Jailbreak** — rechazo cordial.

## 5. Conocimiento vivo

**KB** — material materia; A2/A7 RAG. **Chunk** — fragmento con `vigencia`, `version`, `tema`, `fecha`. **Vigencia** — `vigente`/`obsoleto`. **Versionado** — nueva versión; previa obsoleta. **Obsolescencia** — conservar reemplazado. **Aporte docente** — canal docente. **KB Curator (A11)** — incorpora, versiona. **`defer_to_teacher`** — conflicto ambiguo → docente. **RAG** — anclar respuestas. **Config Store** — admin materia; A6, evaluativas activas. **Atribución/cita de fuente** — referencia cátedra legible; vigente; sin privado ajeno; sin fuente → reconducción (`kb_citations` A2, `recursos_kb` A3, `fuente` A6). **Trazabilidad** — origen/decisión (`chunk_id`, dictamen A5, moderación A10); sostiene cita al alumno.

## 6. Apoyo al aprendizaje (teoría y autoevaluación)

**Theory Agent (A2)** — teoría KB, nivel alumno. **Nivel inferido** — `intro`/`intermedio`/`avanzado`. **Quiz Agent (A7)** — autoevaluaciones. **Quiz** — verificación breve; no evaluable. **Feedback orientativo** — no oficial, sin nota.

## 7. Práctica y control pedagógico-evaluativo

**Practice Agent (A3)** — TP/código sin solución. **Consigna** — interpretada sin oficializar; ambigüedad → docente. **Ingreso de código** — bloque/adjunto/enlace preprocesado. **Análisis de código** — categorías error; sin reescribir ni ejecutar. **Restricción pedagógica** — no solución completa evaluable en un mensaje; regula **postura**, no bloquea cadenas. **Postura** — orientar vs entregar hecho. **Andamiaje/Scaffolding (A4)** — revisa borrador A3. **Densidad de ayuda** — por turno (A4). **Borrador (*draft*)** — A3 pre-A4. **Evaluative Guard (A5)** — evaluativa activa; sin redactar ni memoria alumno. **Evaluativa activa** — declarada, en **ventana**. **Ventana** — `inicio`–`fin`. **Dictamen** — `is_evaluative`, `confidence`, justificación; independiente del alumno. **Cadena incremental** — no bloqueada; límite honesto.

## 8. Memoria y seguimiento

**Memory Agent (A8)** — longitudinal usuario+materia. **STM** — intra-sesión, volátil. **LTM** — entre días. **Pedagogical Profile** — sintético usuario+materia. **Visibilidad de origen** — `publico`/`privado`/`dm`. **Minimización** — solo necesario. **Retención** — borrado real al expirar. **Follow-up Agent (A9)** — proactivo. **Contacto proactivo** — iniciado por sistema; anti-abuso. **Oportunidad** — duda abierta, quiz fallado, TP trabado, **hito**. **Hito** — fecha Config Store. **Opt-out** — sin proactividad. **Rate-limit** — anti-spam. **Horarios de silencio** — sin contacto A9. **Partición usuario+materia** — universos separados.

## 9. Feedback estudiante → docente

**Feedback Agent (A10)** — recoge, modera, **digests**. **Encuesta** — breve post-interacción. **Digest** — agregado período. **Anonimato** — `anonimo`/`pseudonimo`/`identificado_con_consentimiento`. **Moderación** — odio/ataques no; críticas sí. **Agregación** — mínimo muestra. **Cooldown** — límite encuestas. **Escalado a humano** — bienestar prioritario.

## 10. Índice alfabético

| Término | Contexto |
|---|---|
| Actuador | §2 Ambiente Discord |
| Agregación | §9 Feedback |
| Aislamiento por materia | §3 Multi-materia |
| Ambiente / Entorno | §2 Ambiente Discord |
| Ambigüedad de materia | §4 Atención y ruteo |
| Análisis de código | §7 Práctica y control |
| Andamiaje / Scaffolding (A4) | §7 Práctica y control |
| Anonimato | §9 Feedback |
| Aporte docente | §5 Conocimiento vivo |
| Atribución / cita de fuente | §5 Conocimiento vivo |
| Autenticación / Verificación | §2 Ambiente Discord |
| Base de Conocimiento (KB) | §5 Conocimiento vivo |
| Borrador (draft) | §7 Práctica y control |
| Cadena incremental | §7 Práctica y control |
| Canal docente especializado | §2 Ambiente Discord |
| Canal privado / DM | §2 Ambiente Discord |
| Canal público | §2 Ambiente Discord |
| Chunk | §5 Conocimiento vivo |
| Comando slash | §2 Ambiente Discord |
| Config Store | §5 Conocimiento vivo |
| Consigna | §7 Práctica y control |
| Contacto proactivo | §8 Memoria y seguimiento |
| Conversación | §1 Transversales |
| Cooldown | §9 Feedback |
| `defer_to_teacher` | §5 Conocimiento vivo |
| Densidad de ayuda | §7 Práctica y control |
| Derivación humana | §4 Atención y ruteo |
| Dictamen | §7 Práctica y control |
| Digest | §9 Feedback |
| Discord Gateway | §2 Ambiente Discord |
| Dispatch compuesto | §4 Atención y ruteo |
| Encuesta | §9 Feedback |
| Escalado a humano | §9 Feedback |
| Evaluative Guard (A5) | §7 Práctica y control |
| Evaluativa activa | §7 Práctica y control |
| Feedback Agent (A10) | §9 Feedback |
| Feedback orientativo | §6 Apoyo al aprendizaje |
| Follow-up Agent (A9) | §8 Memoria y seguimiento |
| Frontier Agent (A1) | §4 Atención y ruteo |
| Fuera de dominio | §4 Atención y ruteo |
| Handoff / Derivación | §4 Atención y ruteo |
| Hilo | §2 Ambiente Discord |
| Hito | §8 Memoria y seguimiento |
| Horarios de silencio | §8 Memoria y seguimiento |
| Ingreso de código | §7 Práctica y control |
| Intención (intent) | §4 Atención y ruteo |
| Jailbreak | §4 Atención y ruteo |
| KB Curator (A11) | §5 Conocimiento vivo |
| LTM (persistencia entre sesiones) | §8 Memoria y seguimiento |
| Materia en contexto | §1 Transversales |
| Memory Agent (A8) | §8 Memoria y seguimiento |
| Minimización | §8 Memoria y seguimiento |
| Moderación | §9 Feedback |
| Nivel inferido | §6 Apoyo al aprendizaje |
| Obsolescencia | §5 Conocimiento vivo |
| Oportunidad (de seguimiento) | §8 Memoria y seguimiento |
| Opt-out | §8 Memoria y seguimiento |
| Parametrización por materia | §3 Multi-materia |
| Partición usuario+materia | §8 Memoria y seguimiento |
| Pedagogical Profile | §8 Memoria y seguimiento |
| Postura | §7 Práctica y control |
| Practice Agent (A3) | §7 Práctica y control |
| Privacy Filter | §2 Ambiente Discord |
| Quiz | §6 Apoyo al aprendizaje |
| Quiz Agent (A7) | §6 Apoyo al aprendizaje |
| Rate-limit / Frecuencia máxima | §8 Memoria y seguimiento |
| Recuperación (RAG) | §5 Conocimiento vivo |
| Reconducción a docentes | §4 Atención y ruteo |
| Restricción pedagógica | §7 Práctica y control |
| Retención | §8 Memoria y seguimiento |
| Rol de usuario | §2 Ambiente Discord |
| Sanitización | §4 Atención y ruteo |
| Sensor | §2 Ambiente Discord |
| Sesión | §1 Transversales |
| STM (memoria intra-sesión) | §8 Memoria y seguimiento |
| `subject_id` | §3 Multi-materia |
| Subject Router | §3 Multi-materia |
| Theory Agent (A2) | §6 Apoyo al aprendizaje |
| Transferencia explícita y consentida | §2 Ambiente Discord |
| Trazabilidad | §5 Conocimiento vivo |
| Turno | §1 Transversales |
| Versionado | §5 Conocimiento vivo |
| Ventana (de evaluativa) | §7 Práctica y control |
| Vigencia | §5 Conocimiento vivo |
| Visibilidad de origen | §8 Memoria y seguimiento |
| Visibilidad por canal | §1 Transversales |
