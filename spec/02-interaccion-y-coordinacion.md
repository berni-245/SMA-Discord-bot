# Entregable 2 — Interacción y coordinación

> Sistema multiagente de soporte a la cursada en Discord. Vocabulario en el [glosario (Entregable 0)](00-glosario.md); inventario de agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md).

## 1. Propósito y alcance

Este entregable describe **cómo colaboran** los 11 agentes: quién actúa primero, con qué mecanismo se coordinan, bajo qué criterios se derivan el trabajo, qué información se comparten (y qué no), cómo se resuelven los casos fuera de dominio y cómo el diseño distingue a **estudiantes** de **docentes**, incluido el circuito **estudiante → feedback → docente**.

No repite las responsabilidades de cada agente (eso está en el Entregable 1) ni desarrolla escenarios completos paso a paso con diagrama de secuencia (eso es el Entregable 6). Acá se fija el **modelo de coordinación** que esos escenarios instancian.

## 2. Mecanismo de coordinación: orquestación liviana híbrida

### 2.1. La decisión

Se adopta una **orquestación liviana híbrida**, que combina tres patrones de coordinación clásicos, cada uno en su lugar:

1. **Supervisor de entrada (A1 Frontier).** Todo mensaje de un **estudiante** entra por A1, que clasifica la **intención** y decide el destino. A1 es el único punto de entrada y el responsable de la cortesía de borde. No es un supervisor *total*: no re-media cada paso intermedio.
2. **Cadena de responsabilidad (pipelines definidos).** Dentro de un dominio, los especialistas se pasan trabajo **directamente**, sin volver a A1 en cada salto. El caso canónico es el pipeline de práctica: `A5 (dictamen) → A3 (borrador) → A4 (recorte) → publicación`. A1 no interviene entre A3 y A4.
3. **Pizarra acotada (*blackboard*) para el estado intra-sesión.** El estado compartido durante una sesión (STM) **no** viaja agente por agente: vive en un único custodio, **A8 Memory**, que lo entrega filtrado por visibilidad y minimizado a quien lo pide. Es una pizarra con dueño, no un canal de difusión.

Los mensajes entre agentes son **handoffs tipados**: cada salida declara `decision`, `target`/`handoff_payload` y la justificación, de modo que la derivación sea trazable.

### 2.2. Por qué este mecanismo y no otros

- **No un orquestador estricto** (A1 mediando cada salto): agregaría un cuello de botella y costo de coordinación en pipelines que ya tienen un orden natural y fijo (p. ej. práctica). El control que importa —que ningún borrador de práctica se publique sin pasar por A4— se garantiza con el pipeline, no centralizando todo en A1.
- **No peer-to-peer puro**: sin un punto de entrada que clasifique, se multiplican los riesgos de **vacío** (nadie atiende), **solapamiento** (dos agentes responden) y **bucles** de derivación. La cortesía de borde (fuera de dominio, derivación humana) quedaría dispersa.
- **No negociación / *contract-net* / puja por tareas**: los roles son **fijos y especializados**; no hay competencia por “quién toma la tarea”. Introducir negociación sería costo de coordinación sin beneficio, dado que la asignación está determinada por la intención.

> **Resumen del mecanismo:** *supervisor de entrada (A1)* + *cadena de responsabilidad (pipelines)* + *pizarra acotada con dueño (A8)*, sobre *handoffs tipados y trazables*.

## 3. Quién actúa primero

### 3.1. Mensaje típico de un estudiante

**A1 Frontier siempre actúa primero** ante un mensaje de estudiante. Su secuencia de decisión:

1. **¿Usuario verificado?** Si no, rechaza cordialmente y orienta a la verificación. No procede.
2. **¿Materia en contexto resuelta?** Si el Subject Router devuelve **ambigüedad de materia**, A1 hace **una** pregunta para desambiguar antes de derivar.
3. **Clasifica la intención** y deriva (ver criterios en §4). Si la confianza es baja (`< 0.7`), pide una aclaración en vez de arriesgar un ruteo incorrecto.
4. **Sanitiza** lo que pasa al especialista según la visibilidad del canal.

Dos flujos representativos (el detalle paso a paso es del Entregable 6):

- **Consulta teórica:** `A1 → (A8 lee contexto) → A2 (ancla en KB) → Privacy Filter → publica`.
- **Consulta práctica con código:** `A1 → A5 (dictamen evaluativo) → A3 (borrador socrático) → A4 (recorta densidad) → publica`.

### 3.2. Casos límite (quién actúa primero)

| Caso límite | Primer actor y acción |
|---|---|
| Usuario no verificado | **A1**: rechazo cordial + orientación a verificación; no deriva |
| Materia ambigua (p. ej. en DM, sin servidor que la fije) | **A1**: una pregunta de desambiguación; no deriva hasta resolverla |
| Código sensible en canal público | **A1**: sugiere mover a DM **antes** de derivar a A3 |
| Intento de jailbreak | **A1**: rechazo cordial sin cumplir + reconducción |
| Fuera de dominio | **A1**: respuesta educada + reconducción a docentes (§6) |
| Caso personal mezclado con reglas / trámite | **A1**: regla general (si A6 la tiene) + derivación humana |
| Aporte en canal docente | **A11** (no A1): el flujo docente no pasa por el pipeline de estudiante (§9) |
| Contacto de seguimiento | **A9** (no A1): es proactivo, lo dispara el scheduler, no un mensaje entrante |

## 4. Criterios de derivación entre agentes

La derivación primaria la decide A1 a partir de la **intención**. Las derivaciones secundarias las inician los propios especialistas cuando topan con el límite de su rol.

### 4.1. Derivación primaria (desde A1)

| Intención | Destino | Criterio |
|---|---|---|
| `apoyo_teorico` | A2 | Pregunta conceptual de la materia |
| `apoyo_practico` | A5 → A3 | Siempre pasa por el dictamen de A5 antes de A3 |
| `quiz` / `autoevaluacion` | A7 | Pedido de autoevaluación |
| `info_administrativa` | A6 | Fechas, modalidad, reglas publicadas |
| `feedback` (cursada o bot) | A10 | Aporte de retroalimentación |
| `orientacion` | A6 + A2 (compuesto) | “No sé por dónde empezar” → checklist/fechas + punto de entrada en contenido, ensamblado por A1 |
| `control_memoria` | A8 | Comandos `/mi-historial`, `/borrar-historial`, opt-out |
| `caso_mixto` / `tramite` | A1 (responde) + derivación humana | Caso particular del alumno: regla general + a quién acudir |
| `fuera_de_dominio` | A1 (responde) | Respuesta educada + reconducción a docentes |
| `saludo` / `charla_casual` | A1 (responde) | Saludo breve + ofrecimiento de ayuda |

### 4.2. Derivación secundaria (entre especialistas)

| Origen | Destino | Disparador |
|---|---|---|
| A2 Theory | A1 (`handoff_no_kb`) | No hay base en KB → reconducción a docentes (no inventar) |
| A2 Theory | A1 (`handoff_other_domain`) | La pregunta es práctica/admin, no teórica |
| A3 Practice | A4 Scaffolding | Borrador listo (`draft_ready`): revisión pedagógica obligatoria antes de publicar |
| A3 Practice | A1 (`handoff_teacher`) | Consigna ambigua a nivel de cátedra (criterio docente) |
| A3 Practice | A5 (`escalate_to_guard`) | Sospecha de evaluable activo que A5 no marcó |
| A4 Scaffolding | A3 (`reject`) | El borrador entrega solución: vuelve a A3 con motivo |
| A7 Quiz | A10 | Aporta `feedback_metric` (resuelto/no) tras evaluar |
| Cualquiera | A8 | Lectura/escritura de memoria (A8 puede **negar** según rol; ver §7) |

**Principio de derivación:** un agente deriva cuando la consulta **excede su rol** o cuando una **política** lo exige (A3 siempre a A4; práctica siempre por A5). Nunca deriva “para sacarse el problema de encima” sin justificación tipada.

**El dictamen de A5 actúa como *gate*:** si A5 marca `is_evaluative = true` (la consulta cae sobre un evaluable activo), A1 **no** deriva a A3; mantiene la postura, declina resolver el entregable y ofrece ayuda conceptual o reconducción. A3 solo atiende consultas prácticas que A5 dejó pasar (`is_evaluative = false`).

## 5. Coordinación y límites éticos: coherencia

El mecanismo de coordinación **materializa** los límites no negociables; no son reglas aparte:

- **No resolver un evaluable en un mensaje** → garantizado por el **pipeline** de práctica: A5 filtra lo evaluable activo y A4 recorta densidad. Ningún borrador de A3 llega al usuario sin pasar por A4.
- **No exponer lo privado** → garantizado por la **sanitización** en A1 + la **visibilidad de origen** que aplica A8 + el **Privacy Filter** antes de publicar en canal público.
- **No reemplazar al docente** → la **reconducción** (A1) y la **derivación humana** son ramas de primera clase del ruteo, no excepciones.
- **No mezclar materias** → `subject_id` viaja como invariante en **todos** los handoffs; ningún salto puede cambiarlo.
- **No acosar con proactividad** → A9 vive **fuera** del pipeline reactivo y se autolimita (opt-out, frecuencia máxima, horarios de silencio).

## 6. Salida ante consultas fuera de dominio o no atendibles

**Quién clasifica:** A1, en el paso de clasificación de intención (no hay un agente de frontera separado; A1 *es* la frontera).

**Quién emite la respuesta:** A1 mismo, porque es una decisión de **borde/ruteo**, no de contenido. La forma de la salida está fijada:

1. **Mensaje educado** que reconoce la consulta.
2. Aclaración de que el tema **está fuera del dominio** del asistente de esa materia.
3. **Reconducción a docentes** o al canal/instancia humana que la cátedra designe.

Hay dos orígenes de “no atendible”, tratados igual de cara al usuario:

- **Fuera de dominio obvio** (debates genéricos de IA, temas ajenos): A1 lo detecta al clasificar.
- **Sin base fiable** (un especialista no tiene material en KB, p. ej. A2 con `handoff_no_kb`): el especialista devuelve el control a A1, que aplica la **misma** política de reconducción en lugar de inventar.

Esta coherencia —no inventar, reconducir cuando no hay base— se retoma en el Entregable 7 (riesgos: anti-alucinación).

## 7. Qué información se comparte entre agentes (y qué no)

### 7.1. Lo que circula

| Dato | Quién lo provee | Quién lo consume | Para qué |
|---|---|---|---|
| `subject_id`, `channel_type` | invariantes en cada pedido | todos | Aislamiento por materia y visibilidad por canal |
| `sanitized_user_message` | A1 | especialistas | Consulta saneada según el canal |
| Extracto de memoria | A8 (filtrado + minimizado) | A2, A3, A7, A9 | Continuidad pedagógica |
| Dictamen evaluativo | A5 | A3 (y A1) | Ajustar la postura ante evaluable activo |
| Borrador (`draft`) | A3 | A4 | Revisión de densidad antes de publicar |
| `feedback_metric` | A7 | A10 | Alimentar el feedback de cursada |
| Chunks de KB | A11 (curaduría) | A2, A7 (vía RAG) | Anclar respuestas en material vigente |

### 7.2. Lo que NO circula (y por qué)

- **Contenido nacido en DM hacia canal público** — *privacidad*. La sanitización (A1) y la visibilidad de origen (A8) lo impiden; solo lo cruza una **transferencia explícita y consentida** del propio alumno.
- **Memoria del alumno hacia A5** — *consistencia/objetividad*. El dictamen evaluativo debe ser **independiente del individuo**; A8 **niega** la lectura a A5.
- **Feedback identificable hacia otros agentes** — *privacidad*. A10 no alimenta ni “entrena” a otros agentes con feedback identificable del alumno.
- **Contenido entre materias** — *aislamiento*. Ningún extracto cruza la partición `usuario+materia`.
- **Conocimiento de dominio hacia A4** — *mínimo privilegio*. A4 edita densidad; no necesita (ni recibe) el saber técnico, para no “completar” la solución.

Los tres criterios que gobiernan el reparto son **privacidad** (DM, entre usuarios, entre materias), **consistencia** (una sola fuente de verdad de memoria en A8; un solo ensamblador de respuesta en A1) y **costo** (minimización: se pasa lo necesario, no todo el contexto; A1 no re-media cada salto).

### 7.3. Estado compartido intra-sesión: quién lo controla

El estado compartido **durante una sesión** (STM) lo controla **A8**, no los agentes que lo usan. A8 decide qué entrega según canal, rol y minimización. Esto evita que el estado se difunda sin control y mantiene una única fuente de verdad. La **persistencia entre sesiones** (LTM y perfil) es otra capa, con su propio gobierno, y se desarrolla en el Entregable 4.

## 8. Prioridad y resolución de conflictos

- **Si dos agentes podrían responder lo mismo**, la prioridad la fija A1 al clasificar la intención: hay **un** destino primario por mensaje. No hay dos agentes publicando en paralelo sobre la misma consulta.
- **Consulta mixta** (p. ej. teoría + código + admin en un mensaje): A1 **descompone** y aplica un **orden fijo priorizado**:
  1. **Filtros de política y privacidad primero**: verificación, sanitización y —si hay código que roza un evaluable— el dictamen de A5.
  2. **Dominios después, en orden definido**: lo administrativo/estructural (A6) antes que lo conceptual (A2), y la práctica (A3→A4) como rama propia.
  3. **A1 ensambla una sola respuesta** coherente, evitando que dos especialistas se contradigan.
- **Por qué orden fijo y no paralelo**: el ensamblado secuencial con un único integrador (A1) elimina el riesgo de respuestas contradictorias o redundantes; el costo en latencia es aceptable para el volumen esperado. Cuando la mezcla es **genuinamente ambigua** (no se entiende qué se pide), A1 puede re-preguntar antes de descomponer.

## 9. Roles de usuario: estudiante vs docente

El diseño distingue ambas audiencias por **rol de Discord, canal y capacidades**, con **superficies separadas**: el docente **no** entra al pipeline de atención al estudiante.

| Aspecto | Estudiante | Docente |
|---|---|---|
| Punto de entrada | Mensaje en canal de estudiantes o DM → **A1** | **Canal docente especializado** (aporte) y panel/hilo de cátedra (lectura) |
| Agentes que lo atienden | A1 + especialistas (A2–A8, A10 en modo encuesta), seguimiento de A9 | **A11** (curaduría de KB), **A10** (digest), configuración del Config Store |
| Capacidades | Consultar teoría/práctica, autoevaluarse, recibir seguimiento, dar feedback, controlar su memoria | Aportar/actualizar conocimiento, leer feedback agregado, configurar materia y evaluativas |
| Permisos de canal | Lectura/escritura en canales de estudiante; DM con el bot | Escritura en canal docente; lectura del hilo/panel de cátedra |
| Disparadores típicos | Mensajes, comandos como `/mi-historial`, `/checklist` | Publicación en canal docente; comandos de configuración (conceptual) |

**Por qué superficies separadas:** mantiene los *guardrails* simples (los agentes de estudiante nunca tienen que decidir “¿esto lo pide un docente?”), respeta los permisos del entorno y reduce la exposición (el docente lee **agregados**, no consultas individuales). Es coherente con el aislamiento por materia: un docente opera sobre **su** materia.

## 10. Flujo estudiante → feedback → docente

Este es el circuito que cierra el lazo pedagógico, íntegramente mediado por **A10 Feedback**:

1. **Disparo (reactivo):** tras una consulta resuelta (A2/A3), un quiz (A7) o el cierre de un TP, A10 lanza una **encuesta** breve al alumno, respetando el **cooldown** y, por defecto, por DM.
2. **Almacenamiento:** la respuesta se guarda con la **política de anonimato** que definió la cátedra (`anónimo` / `pseudónimo` / `identificado con consentimiento`), más `timestamp`, materia y tipo de interacción. Queda **aislada por materia** y conserva su **visibilidad de origen**.
3. **Moderación (agente + humano):** A10 filtra **ataques personales y discurso de odio** (quedan como *flag* para un humano) y **conserva las críticas honestas**, anonimizadas. Un caso de **bienestar/seguridad** se **escala a un humano** con prioridad, sin esperar al digest.
4. **Agregación:** A10 arma un **digest** periódico (por defecto semanal) **si** hay muestra mínima; si no, lo posterga. Incluye tasa de resolución, temas con fricción y comentarios anonimizados.
5. **Entrega:** el digest se publica en el **canal/hilo docente** con cabecera (materia, período, N de respuestas, política de anonimato).

**Qué ve el docente:** datos **agregados** de su materia, nunca el detalle identificable de consultas privadas. **Con qué disparador:** periódico (semanal por defecto) o manual. **Agregación/anonimato:** siempre agregado, con el nivel de anonimato configurado.

**Límite:** el feedback es **complementario**; no reemplaza la evaluación oficial ni es su única fuente. Esta restricción se coordina con el rol de A10 y se retoma en el Entregable 7 (abuso de feedback).

## 11. Síntesis

La coordinación se apoya en **un único punto de entrada (A1)** que clasifica y rutea, **pipelines con handoffs directos** donde el orden es natural y la política lo exige, y **un custodio de estado (A8)** que evita difundir contexto sin control. Los **límites éticos** no son una capa externa: están **incrustados en el flujo** (A5+A4 para lo evaluable, sanitización+A8+Privacy Filter para lo privado, reconducción/derivación para lo que excede al asistente). Estudiantes y docentes operan en **superficies separadas**, y el **feedback** viaja del alumno al docente **agregado y moderado**, cerrando el circuito pedagógico sin invadir la evaluación formal.

Los **escenarios paso a paso** y el **diagrama de secuencia** que instancian este modelo son materia del Entregable 6.
