# Entregable 1 — Inventario y justificación de agentes

> Sistema multiagente de soporte a la cursada en Discord (estudiantes y docentes), con alcance **multi-materia**.

## 1. Propósito y alcance de este documento

Este es el primer entregable del diseño. Responde tres preguntas:

1. **¿Cuántos agentes hacen falta y con qué granularidad?** — y por qué esa decisión, frente a alternativas razonables.
2. **¿Qué hace cada agente?** — rol, responsabilidades, capacidades distintivas, recursos necesarios, qué aporta al sistema global y qué queda explícitamente **fuera** de su alcance.
3. **¿De qué carácter es cada agente?** — reactivo, proactivo o social, y su lectura en clave **BDI** (*Beliefs, Desires, Intentions*), con el contraste obligatorio entre un agente de orientación administrativa (reactivo) y uno de seguimiento (proactivo).

Este documento es la **capa conceptual** del inventario. La **spec operativa** de cada agente (rol/persona, contexto, system prompt, guardrails, formato de salida, ejemplos y user input esperado) vive en [`agents/`](agents/), un archivo por agente, enlazado desde cada ficha de la Sección 5.

> **Nota sobre el glosario.** Las definiciones transversales de **sesión** vs **conversación** (y su correlato con memoria intra-sesión vs persistencia entre días), junto con el resto del lenguaje ubicuo del dominio, se fijan en el [glosario (Entregable 0)](00-glosario.md), y se usan con ese mismo significado en todo el informe. Este documento no las redefine.

## 2. Contexto de diseño que condiciona el inventario

El inventario no se decide en el vacío: tres rasgos del problema empujan hacia ciertos cortes entre agentes.

- **El ambiente (Discord) tiene peso propio.** Permisos, roles de usuario (estudiante / docente / ayudante), tipos de canal (público, privado, DM, hilo, canal docente) y visibilidad acotan **qué puede percibirse** y **qué puede alterarse**. Eso obliga a que ciertos agentes existan para custodiar invariantes del entorno (privacidad por canal, aislamiento por materia) y no solo para “responder”.
- **Multi-materia.** El sistema soporta *N* materias en paralelo que pueden compartir servidor. El conocimiento teórico-administrativo y las políticas deben quedar **aislados por materia**. Esto favorece agentes **parametrizables por materia** sobre agentes “dueños” de una sola cursada.
- **Límites pedagógicos y éticos no negociables.** No resolver evaluables completos, no reemplazar al docente, no exponer lo privado, no acosar con proactividad. Estas políticas se diseñan mejor como **responsabilidades separadas y auditables** que como reglas dispersas dentro de agentes de contenido.

## 3. Decisión de granularidad

### 3.1. La decisión

Se diseñan **11 agentes especializados**, coordinados por un agente de frontera (A1) que rutea y resuelve los casos de borde. Es una arquitectura de **especialistas + frontera/orquestación liviana**, más cerca del extremo “muchos agentes especializados” que del extremo “pocos agentes generales”.

| # | Agente | Una línea | Carácter |
|---|---|---|---|
| A1 | [Frontier](agents/01-frontier-agent.md) | Recibe, clasifica intención y rutea; resuelve cordialmente los bordes (fuera de dominio, derivación humana, ambigüedad) | reactivo + social |
| A2 | [Theory](agents/02-theory-agent.md) | Explica teoría de la materia anclada en la base de conocimiento | reactivo |
| A3 | [Practice](agents/03-practice-agent.md) | Guía trabajos prácticos y analiza código sin entregar la solución | reactivo + social |
| A4 | [Scaffolding](agents/04-scaffolding-agent.md) | Editor pedagógico: recorta el borrador de A3 para no “entregar de más” | social |
| A5 | [Evaluative Guard](agents/05-evaluative-guard-agent.md) | Dictamina si la consulta cae sobre una evaluativa activa | reactivo |
| A6 | [Admin Info](agents/06-admin-info-agent.md) | Responde info administrativa pública; deriva casos particulares | **reactivo** |
| A7 | [Quiz](agents/07-quiz-agent.md) | Arma autoevaluaciones cortas con feedback orientativo | reactivo |
| A8 | [Memory](agents/08-memory-agent.md) | Custodio de la memoria longitudinal del alumno, por usuario+materia | reactivo |
| A9 | [Follow-up](agents/09-followup-agent.md) | Contacto proactivo de seguimiento, acotado por anti-spam y opt-out | **proactivo** |
| A10 | [Feedback](agents/10-feedback-agent.md) | Recoge feedback del alumno, modera y arma digests para el docente | reactivo + social |
| A11 | [KB Curator](agents/11-kb-curator-agent.md) | Incorpora el aporte docente a la base de conocimiento, versiona y marca obsolescencia | reactivo + algo proactivo |

### 3.2. Criterios de descomposición

Cada corte entre agentes responde a **al menos uno** de estos criterios de sistemas multiagente:

1. **Especialización por capacidad distintiva.** Explicar teoría (A2), guiar práctica y leer código (A3) y armar quizzes (A7) son habilidades suficientemente distintas como para tener prompts, recursos y ejemplos propios. Un único agente “docente” mezclaría posturas (explicar vs. no resolver vs. evaluar) y degradaría en todas.
2. **Aislamiento de políticas auditables.** La política “no entregar la solución en un mensaje” (A4) y la política “no tocar evaluativas activas” (A5) se separan del agente que produce contenido (A3). Así la salvaguarda es **inspeccionable y testeable** por separado, y A3 puede evolucionar sin reabrir la política.
3. **Frontera agente–ambiente.** A8 (memoria privada por usuario) y A11 (conocimiento compartido por materia) existen como custodios de invariantes del entorno —visibilidad por canal y aislamiento por materia— más que como generadores de respuestas. El entorno “empuja” su existencia.
4. **Carácter (reactivo vs proactivo).** El seguimiento proactivo (A9) tiene un ciclo de vida, disparadores y guardas (anti-spam, opt-out, horarios de silencio) radicalmente distintos de los agentes que responden a estímulos. Mezclarlo con un agente reactivo enturbiaría ambos. Ver el contraste A6↔A9 en la Sección 6.
5. **Límite de autonomía.** A11 puede decidir sola la obsolescencia *clara*, pero **difiere al docente** ante conflicto ambiguo; A5 emite dictamen pero **no redacta** la respuesta; A4 recorta pero **no escribe** contenido nuevo. Acotar la autonomía de cada uno es más simple cuando los roles están separados.

### 3.3. Por qué no “pocos agentes generales”

Un mega-agente (o 2-3 generalistas) que hiciera ruteo + contenido + política + memoria + proactividad tendría cuatro problemas concretos para *este* enunciado:

- **Posturas en conflicto en un mismo prompt:** “explicá todo lo que sepas” (teoría) convive mal con “no entregues la solución” (práctica evaluable). La calidad de ambas baja.
- **Políticas no auditables:** la salvaguarda pedagógica y el bloqueo de evaluativas quedarían diluidos en instrucciones de contenido, difíciles de revisar y de justificar ante la cátedra.
- **Carácter ambiguo:** lo reactivo y lo proactivo (con su anti-spam y opt-out) no se modelan limpio en una sola entidad.
- **Punto único de falla:** si cae, cae todo. Con especialistas, la caída del frente de programación (A3/A4/A5) **no** tumba teoría, administrativo ni autoevaluación (robustez por degradación parcial).

### 3.4. Por qué no “muchos más agentes”

También se evitó sobre-fragmentar:

- **Memoria como un solo custodio (A8), no tres agentes** (uno por capa STM/LTM/Profile). Las tres capas comparten las mismas invariantes de visibilidad y aislamiento; partirlas multiplicaría la coordinación sin beneficio.
- **Frontera y “fuera de dominio” en el mismo agente (A1).** La respuesta educada de fuera-de-dominio y la derivación a humanos son **decisiones de ruteo/borde**, no de contenido. Crear un “agente de fuera de dominio” aparte agregaría un salto de coordinación para emitir una frase. A1 ya tiene el contexto para hacerlo.
- **Multi-materia por parametrización, no por clonado.** No hay “A2 de Programación” y “A2 de Álgebra”: hay **un** A2 parametrizado por `subject_id`, con su base de conocimiento aislada. Clonar agentes por materia haría inviable escalar a *N* cursadas.

### 3.5. Cobertura: ningún bloque funcional queda sin dueño

| Necesidad del usuario | Agente(s) responsable(s) |
|---|---|
| Apoyo teórico | **A2**, con contexto de A8 y KB de A11 |
| Apoyo práctico / análisis de código | **A3**, con dictamen previo de **A5** y revisión de **A4** |
| Autoevaluación (quizzes) | **A7** |
| Información y orientación administrativa | **A6** |
| Acompañamiento y organización | **A9** (proactivo) y A1 (orientación compuesta reactiva) |
| Feedback de estudiantes para docentes | **A10** |
| Memoria entre sesiones y seguimiento | **A8** (registro) + **A9** (contacto) |
| Ruteo, fuera de dominio, derivación humana | **A1** |
| Conocimiento vivo (aporte docente) | **A11** |
| Privacidad por canal y aislamiento por materia | **A8** como custodio; invariante respetada por todos |

La Sección 7 detalla las **fronteras** entre agentes que podrían parecer solapados.

## 4. Cómo leer las fichas (Sección 5)

Cada ficha sigue el mismo formato:

- **Rol** — qué es el agente en una frase.
- **Responsabilidades** — qué hace.
- **Capacidades distintivas** — qué sabe hacer que ningún otro agente hace igual.
- **Recursos necesarios** — conocimiento, datos y herramientas conceptuales que consume.
- **Aporte al sistema** — por qué el sistema global lo necesita.
- **Fuera de alcance** — qué NO hace (frontera explícita).
- **Carácter y BDI** — reactivo/proactivo/social + *Beliefs / Desires / Intentions*.
- **Spec operativa** — enlace al detalle de bajo nivel.

## 5. Fichas de agentes

### A1 — Frontier Agent

- **Rol:** front desk del asistente. Primer agente que toca cada mensaje del estudiante.
- **Responsabilidades:** verificar autenticación; resolver materia (o pedir aclaración si es ambigua); clasificar la intención; delegar al especialista correcto; responder él mismo los casos de **borde** (fuera de dominio, caso personal mezclado con reglas, saludo); sanitizar lo que pasa a especialistas según la visibilidad del canal.
- **Capacidades distintivas:** clasificación de intención con umbral de confianza; ruteo simple y **compuesto** (p. ej. orientación = A6 + A2 ensamblados); detección de jailbreak y de código sensible publicado en público.
- **Recursos necesarios:** catálogo de agentes y sus dominios; política de privacidad por canal; estado de autenticación y rol del usuario; contexto saneado de A8.
- **Aporte al sistema:** da un **único punto de entrada** coherente y cordial; concentra la lógica de borde para que los especialistas se mantengan enfocados; es el guardián de la cortesía en fuera-de-dominio y derivaciones.
- **Fuera de alcance:** no produce contenido técnico (teoría, práctica, admin); no decide notas; no inventa info institucional.
- **Carácter y BDI:** **reactivo + social**.
  - *Beliefs:* última intención clasificada y su confianza; canal, materia, rol y estado de auth; catálogo de especialistas; política de privacidad.
  - *Desires:* que cada mensaje llegue al especialista correcto, con cordialidad y sin filtrar privacidad.
  - *Intentions:* clasificar → delegar / responder borde / pedir aclaración / rechazar no-verificado.
- **Spec operativa:** [agents/01-frontier-agent.md](agents/01-frontier-agent.md)

### A2 — Theory Agent

- **Rol:** docente paciente que explica **teoría** de la materia activa.
- **Responsabilidades:** responder dudas conceptuales ancladas en la base de conocimiento; adaptar el nivel de profundidad; dar ejemplos y resúmenes; registrar el tema cubierto en memoria.
- **Capacidades distintivas:** anclaje en KB vía recuperación (RAG) sobre material curado por A11; adaptación de nivel según el historial del alumno (de A8).
- **Recursos necesarios:** KB curada de la materia; historial pedagógico (A8); temario/programa.
- **Aporte al sistema:** cubre el frente de aprendizaje teórico sin contaminarse con la postura de “no resolver” de la práctica.
- **Fuera de alcance:** no inventa contenido si no hay base en KB (deriva a docentes); no responde práctica/admin/quiz; no mezcla otras materias; no da opiniones personales sobre el contenido.
- **Carácter y BDI:** **reactivo**.
  - *Beliefs:* la pregunta, los fragmentos de KB recuperados, el historial y el nivel inferido.
  - *Desires:* explicar el concepto al nivel del alumno, sin contradecir a la cátedra.
  - *Intentions:* anclar en KB → adaptar nivel → estructurar → registrar; si no hay KB, *handoff* para reconducción a docentes.
- **Spec operativa:** [agents/02-theory-agent.md](agents/02-theory-agent.md)

### A3 — Practice Agent

- **Rol:** guía técnico que ayuda a destrabar trabajos prácticos **sin entregar la solución**.
- **Responsabilidades:** interpretar consignas sin oficializarlas; analizar código por **categorías de error** (concepto, método, inconsistencia); señalar inconsistencias; sugerir próximos pasos socráticos; registrar avance.
- **Capacidades distintivas:** lectura de código entrante (extraído por el pipeline de ingreso de código); diagnóstico sin reescribir la solución; escalado al guard si huele a evaluativa no detectada.
- **Recursos necesarios:** KB práctica (ejercicios resueltos, patrones esperados); código del alumno; memoria de avance; dictamen previo de A5.
- **Aporte al sistema:** materializa el apoyo práctico y el análisis de código respetando la restricción pedagógica.
- **Fuera de alcance:** no entrega la solución completa (ni “casi”); no reescribe el código corregido; no ejecuta el código ni inventa salidas; no opina sobre si el alumno “va a aprobar”; no filtra tests no publicados.
- **Carácter y BDI:** **reactivo + social** (delega su borrador a A4; consulta al docente ante ambigüedad de consigna).
  - *Beliefs:* mensaje + código, consigna interpretada, KB práctica, memoria de avance, dictamen de A5.
  - *Desires:* que el alumno avance por su cuenta, sin recibir el trabajo hecho.
  - *Intentions:* interpretar → analizar → armar borrador socrático → pasar a A4 para revisión antes de publicar.
- **Spec operativa:** [agents/03-practice-agent.md](agents/03-practice-agent.md)

### A4 — Scaffolding Agent

- **Rol:** editor pedagógico. Revisa el borrador de A3 para que la respuesta **no equivalga a entregar la solución en un solo mensaje**.
- **Responsabilidades:** evaluar el borrador contra criterios de riesgo (¿incluye corrección literal?, ¿receta paso a paso?, ¿revela el algoritmo objetivo?); aprobar, **recortar**, reformular como socrático o rechazar.
- **Capacidades distintivas:** control de “densidad de ayuda” por turno; edita sin agregar conocimiento técnico nuevo.
- **Recursos necesarios:** política pedagógica vigente (densidad tolerada, proximidad a entregables); heurísticas de riesgo; resumen de cuánto se le “dio” al alumno en la sesión (de A8, sin usarlo para bloquear cadenas).
- **Aporte al sistema:** hace cumplir la restricción pedagógica de forma **auditable** y desacoplada del agente que genera el contenido. Es el patrón de *scaffolding* / control de políticas.
- **Fuera de alcance:** no escribe contenido técnico nuevo; no pide *handoff* a docente (eso es de A3); no avisa al alumno que “se recortó por política”.
- **Carácter y BDI:** **social** (su actividad es coordinación con A3 y publicación).
  - *Beliefs:* el borrador de A3, la política de densidad, el tipo de consulta y los indicadores de riesgo.
  - *Desires:* que ninguna respuesta publicada constituya la solución entregable en un mensaje.
  - *Intentions:* evaluar el borrador → approve / trim / reformulate / reject.
- **Spec operativa:** [agents/04-scaffolding-agent.md](agents/04-scaffolding-agent.md)

### A5 — Evaluative Guard Agent

- **Rol:** fiscal pedagógico. Decide si la consulta cae sobre una **instancia evaluativa activa** declarada por el docente.
- **Responsabilidades:** filtrar evaluativas vigentes según fecha; medir coincidencia textual/semántica con sus consignas; emitir un **dictamen binario** con confianza y justificación; marcar patrones sospechosos sin bloquear al alumno.
- **Capacidades distintivas:** dictamen **independiente del alumno** (dos alumnos con la misma pregunta reciben el mismo veredicto); match conservador con umbral.
- **Recursos necesarios:** lista de evaluativas activas de la materia (con ventanas y fragmentos de consigna); reloj.
- **Aporte al sistema:** separa la **decisión de política** (¿esto es evaluable activo?) de la **generación de respuesta**, haciéndola objetiva y trazable.
- **Fuera de alcance:** no redacta la respuesta al alumno; no lee la memoria del alumno (su dictamen no depende del individuo); no inventa evaluativas; no bloquea cadenas incrementales de mensajes.
- **Carácter y BDI:** **reactivo**.
  - *Beliefs:* la consulta (+ código), la lista de evaluativas activas y la fecha actual.
  - *Desires:* proteger las instancias evaluativas sin penalizar consultas legítimas.
  - *Intentions:* filtrar vigentes → calcular confianza → emitir dictamen + flags (`flag_review`, `pattern_flag`).
- **Spec operativa:** [agents/05-evaluative-guard-agent.md](agents/05-evaluative-guard-agent.md)

### A6 — Admin Info Agent

- **Rol:** orientador administrativo. Dice **solo lo que el docente publicó**; si no consta, lo dice y deriva.
- **Responsabilidades:** responder fechas, modalidad y reglas de evaluación publicadas; ante caso particular del alumno, dar la regla general (si existe) y **derivar** a la instancia humana correcta.
- **Capacidades distintivas:** cita literal de la configuración de la materia; disciplina de “no consta” como respuesta válida.
- **Recursos necesarios:** Config Store de la materia (fechas, modalidad, reglas, recuperatorios, links oficiales); catálogo de roles humanos de derivación (docente, bedelía, secretaría).
- **Aporte al sistema:** cubre la información administrativa **pública** trazando con claridad la frontera con el caso particular.
- **Fuera de alcance:** no extrapola más allá de lo publicado; no da datos del caso individual del alumno; no tramita nada; no menciona otras materias; no promete cambios futuros.
- **Carácter y BDI:** **reactivo** — *este es el polo reactivo del contraste obligatorio (ver §6)*.
  - *Beliefs:* la pregunta y el contenido del Config Store de la materia activa.
  - *Desires:* responder con exactitud lo publicado y no invadir el terreno del docente.
  - *Intentions:* buscar en Config → citar literal o “no consta” + derivar el caso particular.
- **Spec operativa:** [agents/06-admin-info-agent.md](agents/06-admin-info-agent.md)

### A7 — Quiz Agent

- **Rol:** docente que arma **autoevaluaciones cortas** con feedback orientativo (nunca calificación oficial).
- **Responsabilidades:** generar una pregunta conceptual apuntada al siguiente paso pedagógico; evaluar la respuesta contra conceptos esperados; ajustar dificultad; persistir avance.
- **Capacidades distintivas:** selección de tema según dudas previas y desempeño (de A8); preguntas abiertas cortas o multiple-choice con distractores razonables.
- **Recursos necesarios:** KB de la materia (RAG); memoria de quizzes y dudas del alumno; nivel de dificultad solicitado.
- **Aporte al sistema:** habilita la verificación de comprensión sin lenguaje de examen oficial.
- **Fuera de alcance:** no pide resolver entregables; no usa lenguaje de calificación oficial; no genera preguntas fuera de la KB; **no** invade proactivamente (eso es A9); por defecto, quizzes y feedback en DM.
- **Carácter y BDI:** **reactivo**.
  - *Beliefs:* el pedido, la KB, la memoria de desempeño y la dificultad pedida.
  - *Desires:* que el alumno verifique su comprensión y reciba feedback útil.
  - *Intentions:* generar pregunta / evaluar respuesta / ajustar dificultad → persistir en A8 y aportar métrica a A10.
- **Spec operativa:** [agents/07-quiz-agent.md](agents/07-quiz-agent.md)

### A8 — Memory Agent

- **Rol:** archivo pedagógico del alumno. Custodio de la memoria longitudinal, **particionada por usuario + materia**.
- **Responsabilidades:** leer/escribir/borrar memoria en tres capas (STM intra-sesión, LTM entre días, Pedagogical Profile); aplicar visibilidad por canal; minimizar datos; aislar materias; ejecutar los pedidos de control del usuario (`/mi-historial`, `/borrar-historial`, opt-out).
- **Capacidades distintivas:** filtrado por **visibilidad de origen** (no expone contenido nacido en DM a canal público); aislamiento estricto entre cursadas; retención configurable con borrado real (no anonimización).
- **Recursos necesarios:** stores STM/LTM/Profile; política de retención/visibilidad/minimización; preferencias del usuario (incluido opt-out).
- **Aporte al sistema:** habilita continuidad y seguimiento sin violar privacidad ni mezclar materias; es el custodio de dos invariantes centrales del entorno.
- **Fuera de alcance:** no decide *cuándo* actuar (es reactivo); no entrega memoria a quien no la pide o no tiene rol (p. ej. niega lectura a A5); no guarda datos sensibles innecesarios; no se vuelve motor de contexto general.
- **Carácter y BDI:** **reactivo** (su autonomía está en *qué* entrega, no en *cuándo*).
  - *Beliefs:* las tres capas particionadas por usuario+materia con visibilidad de origen; las preferencias del usuario.
  - *Desires:* dar continuidad pedagógica respetando privacidad y aislamiento.
  - *Intentions:* atender `read` / `write` / `delete` / `read_for_user` aplicando visibilidad, minimización y aislamiento.
- **Spec operativa:** [agents/08-memory-agent.md](agents/08-memory-agent.md)

### A9 — Follow-up Agent

- **Rol:** mentor amable que sigue el progreso del alumno **sin agobiarlo**. Inicia la interacción.
- **Responsabilidades:** ante un disparo del scheduler, detectar oportunidades de seguimiento (duda abierta vieja, quiz fallado sin reintento, TP trabado, hito próximo); priorizar una sola; redactar un recordatorio o repregunta suave con **salida fácil**; registrar el contacto.
- **Capacidades distintivas:** **proactividad acotada** — anti-spam (frecuencia máxima), horarios de silencio, opt-out, un mensaje por contacto; respeto del canal preferido sin exponer detalle privado.
- **Recursos necesarios:** memoria del alumno (A8); preferencias (opt-out, frecuencia, canal, silencio); historial de contactos; hitos próximos del Config Store; scheduler.
- **Aporte al sistema:** materializa el seguimiento pedagógico y el contacto proactivo, que ningún agente reactivo podría iniciar.
- **Fuera de alcance:** no contacta si hay opt-out; no viola rate-limit ni silencio; no usa tono de vigilancia ni *guilt-tripping*; no menciona notas; no expone contenido de DM en público; no responde consultas técnicas (eso es de los especialistas).
- **Carácter y BDI:** **proactivo** — *este es el polo proactivo del contraste obligatorio (ver §6)*.
  - *Beliefs:* dudas no cerradas e hitos del alumno; sus preferencias; cuándo y cómo fue el último contacto.
  - *Desires* (deseos propios, no inducidos por un estímulo): acompañar el progreso del alumno.
  - *Intentions:* al tick del scheduler → chequear opt-out/rate-limit → elegir una oportunidad → redactar contacto suave → registrar.
- **Spec operativa:** [agents/09-followup-agent.md](agents/09-followup-agent.md)

### A10 — Feedback Agent

- **Rol:** oído crítico de la cursada. Recoge feedback del alumno, **modera** y arma **digests** para el docente.
- **Responsabilidades:** encuestar brevemente tras interacciones resueltas (modo encuesta); agregar respuestas del período con métricas y comentarios (modo digest); moderar (filtra ataques personales y discurso de odio, **no** críticas honestas); escalar a humano casos de bienestar/seguridad.
- **Capacidades distintivas:** respeto de la política de anonimato declarada (incluso parafraseando para anonimizar); separación de feedback de cursada vs feedback del bot; agregación con mínimo de respuestas.
- **Recursos necesarios:** feedback stores (cursada y bot); política de anonimato y de agregación; cooldown por alumno; lista de docentes destinatarios.
- **Aporte al sistema:** cierra el circuito pedagógico **estudiante → docente** sin convertirse en evaluación oficial.
- **Fuera de alcance:** no reemplaza evaluación institucional; no expone feedback de DM en público sin consentimiento; no encuesta más allá del cooldown; no mezcla los dos tipos de feedback; no alimenta a otros agentes con feedback identificable.
- **Carácter y BDI:** **reactivo + social** (reactivo al encuestar; social al moderar y entregar el digest).
  - *Beliefs:* el feedback acumulado, la política de anonimato/agregación y los destinatarios.
  - *Desires:* darle al docente una señal útil y respetuosa de la cursada.
  - *Intentions:* encuestar / moderar / agregar digest → publicar al canal docente o posponer si la muestra es chica.
- **Spec operativa:** [agents/10-feedback-agent.md](agents/10-feedback-agent.md)

### A11 — KB Curator Agent

- **Rol:** bibliotecario del conocimiento de la materia. Incorpora el **aporte docente** a la base de conocimiento.
- **Responsabilidades:** validar origen (solo canal docente, rol autorizado); filtrar dominio; inferir tipo (apunte, aviso, corrección, programa); detectar conflicto con material previo; versionar e indexar; marcar obsolescencia; confirmar al docente.
- **Capacidades distintivas:** versionado con trazabilidad (marca obsoleto, no borra); detección de contradicciones; **diferir al docente** ante conflicto ambiguo; sugerir sincronizar avisos con el Config Store.
- **Recursos necesarios:** KB Store de la materia (con vigencia/versión); política de vigencia, versionado y chunking; el canal docente especializado como fuente.
- **Aporte al sistema:** mantiene el **conocimiento vivo** que consumen A2 y A7, aislado por materia y al día durante la cursada.
- **Fuera de alcance:** no borra chunks (solo marca obsoleto); no sobrescribe sin versionar; no resuelve conflictos ambiguos por su cuenta; no procesa off-topic ni datos personales; no valida la **corrección académica** (confía en el docente); no toca otras materias.
- **Carácter y BDI:** **reactivo + algo proactivo** (reacciona al aporte, pero proactivamente detecta conflictos y marca obsolescencias no pedidas).
  - *Beliefs:* el aporte nuevo, el estado de la KB (vigencia/versión) y la política de vigencia.
  - *Desires:* mantener la KB coherente y vigente por materia.
  - *Intentions:* validar origen → inferir tipo → detectar conflicto → versionar/indexar/obsoletar o diferir al docente.
- **Spec operativa:** [agents/11-kb-curator-agent.md](agents/11-kb-curator-agent.md)

## 6. Carácter reactivo / proactivo / social y BDI (análisis transversal)

### 6.1. Clasificación

| Agente | Reactivo | Proactivo | Social |
|---|:---:|:---:|:---:|
| A1 Frontier | ● | | ● |
| A2 Theory | ● | | |
| A3 Practice | ● | | ● |
| A4 Scaffolding | | | ● |
| A5 Evaluative Guard | ● | | |
| A6 Admin Info | ● | | |
| A7 Quiz | ● | | |
| A8 Memory | ● | | |
| A9 Follow-up | | ● | |
| A10 Feedback | ● | | ● |
| A11 KB Curator | ● | ◐ | |

(● = predominante, ◐ = parcial.)

La mayoría del sistema es **reactiva**: responde a estímulos del ambiente (mensajes en canales, pedidos de otros agentes). La **proactividad** está concentrada en A9 (y de forma parcial en A11). La dimensión **social** aparece donde hay coordinación o negociación explícita: A1 (rutea y dialoga con humanos en los bordes), A3↔A4 (negocian el borrador antes de publicarlo), A10 (modera y media entre alumno y docente).

### 6.2. El contraste obligatorio: A6 (reactivo) vs A9 (proactivo)

Estos dos agentes ilustran por qué el **carácter** es un criterio de diseño y no una etiqueta cosmética.

- **A6 Admin Info es reactivo por naturaleza del problema.** La información administrativa es una *consulta-respuesta*: el alumno pregunta una fecha o una regla y A6 contesta lo que la cátedra publicó. No tiene objetivos propios que perseguir; no tendría sentido que A6 “saliera” a avisar cosas por iniciativa propia. Su *desire* es de servicio (responder con exactitud), disparado siempre por un estímulo externo. En clave BDI, sus *intentions* se forman **al recibir** la consulta y mueren al responderla.

- **A9 Follow-up es proactivo por necesidad del seguimiento.** El seguimiento pedagógico exige **iniciar** la interacción: si nadie volviera a contactar al alumno, las dudas viejas quedarían sin cerrar. A9 tiene un *desire* propio (acompañar el progreso) que genera *intentions* de contacto **sin** que el alumno escriba primero; el disparo viene de un scheduler y de eventos de memoria, no de un mensaje entrante. Justamente porque la proactividad es intrusiva, A9 carga toda la salvaguarda anti-abuso (opt-out, frecuencia máxima, horarios de silencio, un mensaje por contacto, salida fácil).

Modelarlos como **agentes separados de carácter opuesto** mantiene cada lógica limpia: A6 nunca “molesta”, A9 nunca “espera”. Fundir ambos obligaría a un único agente a ser, contradictoriamente, puramente responsivo y autónomamente intrusivo a la vez.

## 7. Fronteras y no-solapamiento

Para evitar solapamientos confusos, se explicitan las fronteras entre agentes que comparten vecindad temática:

- **A2 Theory vs A3 Practice.** A2 explica **conceptos** (“¿qué diferencia hay entre pila y cola?”). A3 trabaja sobre **el TP o el código del alumno** (“¿por qué mi código duplica elementos?”). La pregunta “¿cómo resuelvo el ejercicio 3?” es de A3 (y pasa antes por A5). Si A2 recibe algo práctico, hace *handoff*.
- **A4 Scaffolding vs A5 Evaluative Guard.** Ambos “controlan”, pero distinto: **A5** emite un veredicto binario y objetivo sobre si la consulta cae en una evaluativa activa (decisión de política, independiente del alumno); **A4** recorta la **densidad** del borrador para que un único mensaje no entregue la solución (decisión de redacción). Se **componen** en el frente de práctica (A5 filtra antes, A4 recorta después); no compiten.
- **A6 Admin Info vs A9 Follow-up.** Ver §6.2: reactivo vs proactivo. A6 responde reglas; A9 inicia recordatorios (que pueden incluir hitos administrativos, pero como contacto, no como consulta).
- **A8 Memory vs A11 KB Curator.** A8 guarda lo **privado y por usuario** (dudas, avances), aislado por usuario+materia, con visibilidad de origen. A11 cura lo **compartido y por materia** (apuntes, programa), de fuente docente. Stores distintos, visibilidad distinta, fuente de escritura distinta.
- **A7 Quiz vs A3 Practice.** A7 hace preguntas conceptuales cortas de autoverificación; A3 trabaja sobre la resolución del práctico del alumno. A7 nunca pide resolver un entregable.
- **A1 Frontier vs especialistas.** A1 **rutea** y resuelve bordes (fuera de dominio, derivación humana, ambigüedad), pero **no** genera contenido de dominio. Cualquier respuesta técnica viene de un especialista.

Donde dos agentes podrían responder lo mismo, la prioridad la fija A1 al clasificar la intención; los casos mixtos se descomponen (p. ej. orientación = A6 + A2 ensamblados por A1). El detalle de coordinación, prioridades y derivaciones es materia del Entregable 2.

## 8. Supuestos y decisiones de diseño asumidas en este entregable

- **Orquestación liviana, no peer-to-peer puro.** Se asume un agente de frontera (A1) que clasifica y rutea, en lugar de coordinación totalmente distribuida entre especialistas. Reduce el costo de coordinación y centraliza la cortesía de borde. (La mecánica fina se desarrolla en el Entregable 2.)
- **Multi-materia por parametrización.** Un mismo agente atiende *N* materias, parametrizado por `subject_id`, con bases de conocimiento y políticas aisladas; no hay agentes clonados por cursada. (Se profundiza en el Entregable 3.)
- **Se adopta el patrón de andamiaje (A4).** El enunciado lo ofrece como opcional; se incluye porque hace la restricción pedagógica **auditable** y desacoplada de A3. Su rol es recortar/aprobar, nunca aportar la solución, y **no** bloquea cadenas incrementales de preguntas.
- **El “usuario” y el “contexto de Discord” se modelan como ambiente, no como agentes.** Discord es el entorno con sus sensores/actuadores; los agentes perciben y actúan sobre él, pero no se reifica al usuario como agente del sistema.
- **A5 es independiente del alumno.** Se asume que la decisión de “esto es evaluable activo” no debe depender de quién pregunta; por eso A5 no lee memoria.
- **11 agentes es el punto elegido del trade-off de granularidad**, con la justificación de la Sección 3; queda como límite honesto que más materias y features podrían tensionar la coordinación (se evalúa en el Entregable 8).
