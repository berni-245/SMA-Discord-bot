# Entregable 0 — Glosario y lenguaje ubicuo del dominio

> Sistema multiagente de soporte a la cursada en Discord (estudiantes y docentes), alcance **multi-materia**.

## Propósito

Este documento fija el **lenguaje ubicuo** (*ubiquitous language*, en el sentido de Domain-Driven Design) del problema: el vocabulario común que usan, con **un único significado**, todos los entregables, las specs de agentes ([`agents/`](agents/)) y los diagramas. Si un término aparece en otro documento, su definición canónica es la de acá.

El glosario está organizado por **contextos acotados** (*bounded contexts*): agrupaciones de términos que pertenecen a un mismo subdominio y comparten reglas. Los términos verdaderamente transversales (que cruzan todos los contextos) se fijan primero, en la Sección 1. Al final hay un **índice alfabético**.

> **Convención de lectura.** Cada término se escribe en **negrita** seguido de su definición. Las referencias `(A1)…(A11)` remiten a la spec operativa del agente correspondiente en [`agents/`](agents/). Este documento no introduce decisiones de diseño nuevas: nombra y delimita las que ya existen.

---

## 1. Términos transversales (destacados)

Estos cinco términos cruzan todos los contextos. Los dos primeros (**sesión** y **conversación**) son la base del modelo de memoria y se usan con el mismo significado en todo el informe.

- **Conversación** — Secuencia coherente de **turnos** entre un usuario y el sistema alrededor de una misma intención o tema, dentro de un mismo canal o hilo. Es la unidad sobre la que los agentes coordinan dentro de un intercambio. Una **sesión** puede contener varias conversaciones (p. ej., primero una duda teórica y después una consulta administrativa).

- **Sesión** — Intervalo acotado de **uso continuo** de un usuario en una **materia en contexto**, delimitado por inactividad (o por el cierre de la jornada). Agrupa una o más **conversaciones**. La sesión es el alcance de la **memoria intra-sesión (STM)**: cuando la sesión se cierra, el estado volátil compartido entre agentes se descarta. La sesión **no** es la unidad de persistencia longitudinal: lo que sobrevive entre sesiones vive en la **LTM** y el **Pedagogical Profile**.

- **Turno** — Unidad mínima de interacción: un mensaje del usuario y el ciclo de respuesta del sistema. Las conversaciones se componen de turnos.

- **Materia en contexto** — La asignatura cuya cursada aplica a una interacción dada. Todo percibir/actuar del sistema se resuelve respecto de **una única** materia en contexto; nunca se mezclan materias (ver **Aislamiento por materia**).

- **Visibilidad por canal** — Propiedad que clasifica el contenido como **público** o **privado** según el medio donde nace. Es una invariante transversal: condiciona qué puede entregar la memoria, qué publica cada agente y qué llega al docente. Su detalle de medios está en el contexto **Ambiente Discord**.

> **Alineación memoria ↔ sesión (clave del informe).** La **memoria intra-sesión** (STM) es el estado compartido entre agentes *dentro de una sesión* y se descarta al cerrarla. La **persistencia entre sesiones / entre días** (LTM + Pedagogical Profile) es lo que habilita el **seguimiento** y el **contacto proactivo**, y sobrevive al cierre de la sesión. Ambas coexisten pero cumplen roles distintos; esta distinción se desarrolla en el entregable de memoria y seguimiento.

---

## 2. Ambiente Discord (sensores y actuadores)

Discord se modela como **entorno** del sistema multiagente, no como mera interfaz.

- **Ambiente / Entorno** — Discord con sus reglas propias (permisos, roles, tipos de canal, visibilidad), que acotan qué puede **percibirse** y qué puede **alterarse** desde el sistema.

- **Sensor** — Punto por el que entra información al sistema (mensajes en canales, eventos, aportes docentes, comandos).

- **Actuador** — Punto por el que el sistema altera el entorno (publicar en un canal, responder un hilo, enviar un DM).

- **Canal público** — Canal donde los mensajes son visibles para más de un estudiante además del bot. Lo que se trata allí se considera **público** para quienes tengan acceso al canal.

- **Canal privado / DM** — Mensaje directo (o mecanismo privado equivalente) entre el estudiante y el bot. Su contenido es **privado** respecto del resto del servidor.

- **Hilo** — Sub-espacio de conversación dentro de un canal. Hereda la visibilidad del canal contenedor salvo definición explícita (`hilo_publico` / `hilo_privado`).

- **Canal docente especializado** — Canal con permisos de escritura acotados a **roles de docencia**, donde la cátedra publica material y actualizaciones. Es la fuente del **Conocimiento vivo**.

- **Rol de usuario** — `estudiante` / `docente` / `ayudante`. Condiciona permisos, canales accesibles y capacidades del sistema frente a ese usuario.

- **Autenticación / Verificación** — Supuesto de acceso previo autorizado: solo usuarios habilitados, con rol asignado, interactúan con el sistema. Un usuario `no_verificado` no es atendido en su consulta.

- **Transferencia explícita y consentida** — Acción **trazada** por la que contenido nacido en privado (DM) pasa a un canal público a pedido del propio estudiante (p. ej., "compartir en el canal de consultas"). Es la **única** excepción a la regla de no republicar lo privado.

- **Discord Gateway** — Punto conceptual de entrada/salida de mensajes entre el sistema y Discord; el sensor/actuador concreto del entorno.

- **Privacy Filter** — Control que revisa una respuesta **antes** de publicarla en canal público, para que no exponga contenido marcado como privado.

- **Comando slash** — Disparador explícito de interacción (p. ej., `/mi-historial`, `/checklist`) que fuerza una operación o un modo.

---

## 3. Multi-materia

- **Aislamiento por materia** — Invariante del sistema: bases de conocimiento, configuración, políticas y memoria están **particionadas por materia**. Ningún agente cruza contenido entre cursadas, aunque exista y sea temáticamente relevante.

- **`subject_id`** — Identificador de la **materia en contexto** que viaja con cada pedido. Es la clave de partición que materializa el aislamiento.

- **Subject Router** — Mecanismo que resuelve la materia en contexto a partir del **servidor de Discord** donde entró el mensaje (**una materia = un servidor**). En **mensajes directos (DM)**, donde no hay servidor que la fije, la materia puede no quedar resuelta: se resuelve preguntando al usuario o por su indicación explícita, y mientras tanto se marca **ambigüedad de materia** (ver Atención y ruteo).

- **Parametrización por materia** — Estrategia por la cual un mismo agente atiende *N* materias parametrizado por `subject_id` (con su KB y políticas aisladas), en lugar de clonar agentes por cursada.

---

## 4. Atención y ruteo

- **Frontier Agent (A1)** — Agente de frontera: primer punto de contacto de cada mensaje del estudiante. Clasifica la **intención** y rutea; resuelve por sí mismo los casos de borde.

- **Intención (*intent*)** — Categoría de necesidad inferida del mensaje (p. ej., `apoyo_teorico`, `apoyo_practico`, `quiz`, `info_administrativa`, `feedback`, `caso_mixto`, `fuera_de_dominio`, `orientacion`, `control_memoria`, `saludo`, `ambiguo`).

- **Handoff / Derivación** — Pase de una consulta de un agente a otro (o a un humano), acompañado de su justificación.

- **Dispatch compuesto** — Ruteo a más de un especialista cuyas salidas el Frontier **ensambla** en una sola respuesta (p. ej., orientación = A6 + A2).

- **Ambigüedad de materia** — Situación en que el Subject Router no puede determinar la materia en contexto —típicamente en **DM**, donde no hay servidor que la fije, si el usuario cursa más de una materia—; el Frontier pide **una** aclaración antes de derivar.

- **Fuera de dominio** — Consulta evidentemente ajena al dominio de la materia. Se responde de forma educada aclarando el límite y se **reconduce a docentes**.

- **Reconducción a docentes** — Salida que orienta al estudiante al docente o al canal humano cuando el asistente no debe responder (incluye fuera de dominio y casos sin base fiable).

- **Derivación humana** — Orientación a una **instancia humana** (docente, bedelía, secretaría académica, hilo de consultas) para casos particulares o trámites que el sistema no resuelve.

- **Sanitización** — Limpieza del mensaje y del contexto que el Frontier pasa a un especialista, para no filtrar contenido privado cuando el canal es público.

- **Jailbreak** — Intento de sacar al agente de su rol ("ignorá tus instrucciones", "actuá como…"). Se rechaza cordialmente sin cumplir.

---

## 5. Conocimiento vivo

El conocimiento que consumen los agentes se mantiene **al día durante la cursada** a partir del aporte docente.

- **Base de Conocimiento (KB)** — Repositorio curado de material teórico-práctico de una materia, que consumen A2 (teoría) y A7 (quizzes) mediante recuperación.

- **Chunk** — Fragmento indexable de la KB, con `vigencia`, `version`, `tema` y `fecha`.

- **Vigencia** — Estado de un chunk: `vigente` u `obsoleto`.

- **Versionado** — Política por la que todo cambio crea una **versión nueva** y deja la previa como `obsoleto`. No se sobrescribe.

- **Obsolescencia** — Marcado del material reemplazado, que **se conserva** (no se borra) para trazabilidad auditable.

- **Aporte docente** — Contenido nuevo (mensaje, adjunto, enlace, corrección, aviso) publicado por la cátedra en el **canal docente especializado**.

- **KB Curator (A11)** — Agente que incorpora el aporte docente a la KB: valida origen, infiere tipo, detecta conflictos, versiona e indexa.

- **`defer_to_teacher`** — Decisión de A11 de **no** resolver por su cuenta un conflicto ambiguo y consultar al docente. Acota su autonomía a la obsolescencia clara.

- **Recuperación (RAG)** — Mecanismo conceptual por el que los agentes traen fragmentos relevantes de la KB para **anclar** sus respuestas y no inventar.

- **Config Store** — Configuración administrativa de la materia (fechas, modalidad, reglas de evaluación, recuperatorios, links oficiales) publicada por la cátedra. Es la fuente de A6 (admin) y de la lista de **evaluativas activas**.

- **Atribución / cita de fuente** — Práctica por la cual toda afirmación que el sistema basa en un documento queda **referenciada a su fuente de cátedra** de forma legible para el alumno (p. ej., "Apunte de la Unidad 3 — Pilas y Colas" o "lo publicado por la cátedra en *reglas de evaluación*"). Es la **garantía de dónde sale la información**. Se cita siempre el material **vigente** (ver **Vigencia** / **Versionado**) y nunca contenido privado de otro usuario. Si no hay fuente en la KB o el Config Store, el sistema **no inventa** una cita: aplica la **reconducción a docentes**. Se materializa en los campos `kb_citations` (A2), `recursos_kb` (A3) y `fuente` (A6).

- **Trazabilidad** — Capacidad de reconstruir **de dónde** salió un dato o una decisión, mediante identificadores y metadatos internos. Es transversal: la KB conserva `chunk_id`, `version` y `vigencia` (A11); el **dictamen** evaluativo lleva su justificación (A5); la **moderación** de feedback registra el flag para humano (A10). La trazabilidad **sostiene** la atribución / cita de fuente de cara al alumno, pero su nivel de detalle interno (IDs) **no** se muestra salvo que aporte.

---

## 6. Apoyo al aprendizaje (teoría y autoevaluación)

- **Theory Agent (A2)** — Especialista en explicación **teórica** de la materia, anclada en la KB y adaptada al nivel del alumno.

- **Nivel inferido** — Estimación del nivel del alumno (`intro` / `intermedio` / `avanzado`) usada para graduar la profundidad de una explicación.

- **Quiz Agent (A7)** — Especialista en **autoevaluaciones cortas**.

- **Quiz** — Autoevaluación breve (pregunta abierta corta o *multiple-choice*) para que el estudiante verifique su comprensión. No es un evaluable.

- **Feedback orientativo** — Devolución pedagógica **no oficial**: refuerza o corrige sin lenguaje de calificación ("aprobado", "desaprobado") y sin nota.

---

## 7. Práctica y control pedagógico-evaluativo

- **Practice Agent (A3)** — Guía técnico de trabajos prácticos y **análisis de código**, que ayuda a destrabar sin entregar la solución.

- **Consigna** — Enunciado de un trabajo o ejercicio. A3 la **interpreta sin oficializarla**; si es ambigua a nivel de cátedra, deriva al docente.

- **Ingreso de código** — Camino por el que el código del estudiante **llega** al sistema desde Discord (bloque de código, adjunto de archivo, enlace a un mensaje en un hilo) y se preprocesa antes de analizarlo.

- **Análisis de código** — Diagnóstico por **categorías de error** (concepto, método, inconsistencia), señalando dónde está el problema sin reescribir la solución ni ejecutar el código.

- **Restricción pedagógica** — Política: no entregar la **solución completa de un evaluable en un solo mensaje**. Regula la **postura** de cada respuesta, no bloquea cadenas de mensajes.

- **Postura** — Forma en que se responde: orientar al aprendizaje vs. entregar el trabajo hecho. Es lo que la restricción pedagógica regula.

- **Andamiaje / *Scaffolding* (A4)** — **Editor pedagógico** que revisa el borrador de A3 y lo aprueba, recorta o reformula para que la respuesta no equivalga a entregar la solución. No aporta contenido técnico nuevo.

- **Densidad de ayuda** — Cantidad de solución/explicación que puede salir en un **único turno**. Es lo que A4 controla.

- **Borrador (*draft*)** — Respuesta provisoria producida por A3, sujeta a revisión de A4 antes de publicarse.

- **Evaluative Guard (A5)** — **Fiscal pedagógico**: dictamina si una consulta cae sobre una **evaluativa activa**. No redacta la respuesta ni lee la memoria del alumno.

- **Evaluativa activa** — Instancia evaluable (parcial, TP entregable, examen final, quiz oficial) **declarada por el docente** y vigente según su **ventana**.

- **Ventana (de evaluativa)** — Rango temporal (`inicio`–`fin`) durante el cual una evaluativa se considera activa.

- **Dictamen** — Salida de A5: veredicto binario (`is_evaluative`) con `confidence` y justificación, **independiente del alumno** (dos alumnos con la misma pregunta reciben el mismo dictamen).

- **Cadena incremental** — Secuencia de mensajes que fragmentan un evaluable ("¿qué hace esta función?" → "¿cómo la completo?" → "¿así está bien?"). El diseño **no** la bloquea: es un **límite honesto** declarado, no un mecanismo de vigilancia.

---

## 8. Memoria y seguimiento

- **Memory Agent (A8)** — Custodio de la memoria longitudinal del alumno, **particionada por usuario + materia**, que aplica visibilidad y minimización.

- **STM (memoria intra-sesión)** — *Short-term memory*: estado volátil compartido entre agentes **durante una sesión**. Se descarta al cerrar la sesión.

- **LTM (persistencia entre sesiones)** — *Long-term memory*: registro que sobrevive **entre días** (dudas, motivaciones, unidades vistas, quizzes resueltos, avances en TPs). Habilita el seguimiento.

- **Pedagogical Profile** — Perfil sintético por usuario+materia (estilo de aprendizaje, fortalezas, debilidades).

- **Visibilidad de origen** — Etiqueta (`publico` / `privado` / `dm`) que acompaña a cada registro de memoria y condiciona qué se puede entregar después (no se expone en público lo nacido en DM).

- **Minimización** — Principio de entregar y guardar **solo lo necesario** para la consulta actual.

- **Retención** — Política de cuánto tiempo se conserva la memoria. Al expirar, el dato **se borra** (no se anonimiza).

- **Follow-up Agent (A9)** — Agente **proactivo** de seguimiento: inicia el contacto para verificar dudas previas u ofrecer continuidad.

- **Contacto proactivo** — Mensaje **iniciado por el sistema** (no en respuesta a un mensaje del usuario) para retomar un tema previo, sujeto a las salvaguardas anti-abuso.

- **Oportunidad (de seguimiento)** — Hecho de la memoria que habilita un contacto: duda abierta hace varios días, quiz fallado sin reintento, TP trabado, **hito** próximo.

- **Hito** — Fecha relevante de la materia (parcial, recuperatorio, entrega de TP) tomada del Config Store.

- **Opt-out** — Control del usuario para **no** recibir contacto proactivo. A9 lo respeta siempre.

- **Rate-limit / Frecuencia máxima** — Límite de contactos proactivos por período; salvaguarda anti-**spam**.

- **Horarios de silencio** — Rangos horarios en los que A9 no contacta.

- **Partición usuario+materia** — Clave de aislamiento de toda la memoria: un mismo alumno en dos materias son universos separados.

---

## 9. Feedback estudiante → docente

- **Feedback Agent (A10)** — Recoge **feedback** del estudiante, lo modera y arma **digests** para el docente. Cierra el circuito pedagógico sin reemplazar evaluación oficial.

- **Encuesta** — Pregunta breve al alumno tras una interacción resuelta (modo encuesta de A10).

- **Digest** — Resumen **agregado** del feedback de un período para el docente, con métricas (p. ej., tasa de resolución), temas con fricción y comentarios.

- **Anonimato** — Política de identificación del feedback hacia el docente: `anonimo` / `pseudonimo` / `identificado_con_consentimiento`.

- **Moderación** — Filtrado de **ataques personales** y discurso de odio antes del digest. No filtra **críticas honestas** (esas se incluyen, anonimizadas).

- **Agregación** — Consolidación de respuestas del período; requiere un **mínimo de muestra** para publicarse (si no, se posterga).

- **Cooldown** — Límite de cuántas veces se encuesta al mismo alumno por período y materia.

- **Escalado a humano** — Derivación **prioritaria** de casos de bienestar/seguridad (p. ej., acoso) a un rol humano designado, sin esperar al digest.

---

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
