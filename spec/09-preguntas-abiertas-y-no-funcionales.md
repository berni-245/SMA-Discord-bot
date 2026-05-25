# 09 — Preguntas abiertas (registro de postura)

> Complemento de los entregables 1–8. Vocabulario en el [glosario (Entregable 0)](00-glosario.md).

## 1. Propósito

Este documento reúne **todas** las preguntas de diseño que la consigna dejaba abiertas y fija la **postura del grupo** sobre cada una. Cuando una pregunta ya se desarrolla en otro entregable, se da la **referencia**; las que no tenían lugar propio (voces conversacionales, manejo de conversaciones largas, lenguajes de programación, fuentes de conocimiento y prioridad, y los no funcionales) se **cierran aquí**.

Convención: cada ítem lleva **Postura** y, si corresponde, **(Ver …)** apuntando al entregable donde se argumenta en detalle.

## 2. Arquitectura multiagente

- **Fuera de dominio — ¿quién detecta/clasifica y con qué texto?**
  **Postura:** lo detecta y responde **A1 (Frontier)** como parte de su clasificación de intención; no hay un agente "out-of-domain" separado (sería duplicar deliberación). Texto: mensaje cordial + "fuera del dominio del asistente de la materia" + reconducción a docentes. *(Ver [Entregable 2 §6](02-interaccion-y-coordinacion.md) y [Entregable 7 §4](07-riesgos-supuestos-y-limites-eticos.md).)*

- **¿Orquestador único o peer-to-peer?**
  **Postura:** **orquestación liviana híbrida** — A1 clasifica y rutea en la entrada; pipelines con handoffs directos donde el orden es natural; estado intra-sesión en un custodio (A8). Ni orquestador estricto ni peer-to-peer puro. *(Ver [Entregable 2 §2](02-interaccion-y-coordinacion.md).)*

- **¿Hace falta un agente guardián / de andamiaje (scaffolding)?**
  **Postura:** **sí**, y son dos, separados del que genera contenido: **A5 (Evaluative Guard)** dictamina si la consulta cae sobre un evaluable activo, y **A4 (Scaffolding)** acota la densidad del borrador de A3 antes de publicar. Se justifica por aislamiento de políticas auditables; no bloquea cadenas incrementales. *(Ver [Entregable 1](01-inventario-y-justificacion-de-agentes.md) (A4, A5) y [Entregable 2 §2/§5](02-interaccion-y-coordinacion.md).)*

- **¿Se modela el "usuario" o el "contexto de Discord" como agente?**
  **Postura:** **no**. Discord es el **ambiente** (sensores/actuadores) y el usuario un actor externo; reificarlos como agentes no aporta deliberación. *(Ver [Entregable 5 §1](05-conexion-con-discord.md) y [Entregable 7 §2](07-riesgos-supuestos-y-limites-eticos.md).)*

## 3. Discord y experiencia de usuario

- **¿Cómo se nudgea al estudiante hacia DM para código/datos sensibles?**
  **Postura:** el **Privacy Hint** (infra) detecta código sensible publicado en canal público y **sugiere** mover a DM antes de analizar; es un *nudge*, no una imposición. *(Ver [Entregable 5 §6 y §8](05-conexion-con-discord.md).)*

- **¿Cómo se etiquetan los canales "solo rol estudiante" respecto de público/privado? (casos intermedios)**
  **Postura:** la visibilidad la define **quién puede leer**, no el tamaño: hilo hereda del canal padre; canal por rol = "público entre quienes lo leen"; grupo pequeño = privado al resto pero público entre sus miembros. *(Ver [Entregable 5 §2](05-conexion-con-discord.md).)*

- **¿Comandos slash que fuerzan un modo u otro?**
  **Postura:** hay **comandos slash** para operaciones explícitas (`/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, `/checklist`), pero **no** se fuerza público/privado con slash: la privacidad la da el canal y, para código sensible, el nudge a DM. *(Ver [Entregable 5 §3 y §8](05-conexion-con-discord.md).)*

- **Ingreso de código — resto de la UX (más allá del mecanismo obligatorio).**
  **Postura:** se admiten **bloque de código**, **adjunto de texto** y **enlace a mensaje previo**; **no** se exigen hilos obligatorios para consultar; adjuntos **no** textuales (binarios, imágenes-de-código) se rechazan con aviso. *(Ver [Entregable 5 §8](05-conexion-con-discord.md).)*

- **¿Una sola personalidad conversacional o varias "voces"?**
  **Postura (desarrollada aquí):** una **única identidad de bot**, con **voces diferenciadas por agente** según su rol — A2 didáctico y paciente; A3 técnico, como un par más adelantado; A6 neutro y literal; A9 suave y sin urgencia. Todas comparten el registro rioplatense y la cordialidad de A1. Diferenciar por agente es barato (cada ficha define su tono) y coherente con la especialización; un tono único aplanaría la experiencia. **Límite honesto:** la coherencia entre voces depende de mantener disciplina de estilo entre fichas.

- **¿Cómo se manejan conversaciones largas y referencias a mensajes anteriores?**
  **Postura (desarrollada aquí):** dentro de una **sesión**, la **STM** (custodiada por A8) sostiene el hilo y permite resolver referencias del tipo "seguí con lo anterior"; para **código**, las referencias se resuelven con el **enlace a mensaje** del pipeline de ingreso; entre sesiones, la continuidad la da la **LTM** (hechos pedagógicos, no transcripciones). **Límite honesto:** el sistema no garantiza recordar el texto exacto de mensajes viejos (minimización). *(Mecanismo base en [Entregable 4 §2](04-memoria-entre-sesiones-y-seguimiento.md).)*

## 4. Estudiantes, docentes y feedback

- **¿El feedback es identificado, pseudónimo o anónimo hacia el docente?**
  **Postura:** **configurable por la cátedra** (`anónimo` / `pseudónimo` / `identificado con consentimiento`); por defecto agregado y anonimizado. *(Ver [Entregable 2 §10](02-interaccion-y-coordinacion.md).)*

- **¿Quién posee la moderación del feedback antes de que lo vea la cátedra?**
  **Postura:** **ambos** — A10 (agente) modera automáticamente (filtra ataques personales/odio, conserva críticas honestas) y deja **flag para un humano**; casos de bienestar se **escalan** a humano. *(Ver [Entregable 2 §10](02-interaccion-y-coordinacion.md) y [Entregable 7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*

- **¿El docente usa los mismos agentes que el estudiante o capacidades separadas?**
  **Postura:** **capacidades separadas** — el docente no entra al pipeline de atención al estudiante; aporta vía A11, lee digests de A10 y configura la materia. *(Ver [Entregable 2 §9](02-interaccion-y-coordinacion.md) y [Entregable 3 §8](03-multi-materia.md).)*

## 5. Datos y conocimiento

- **¿Otras fuentes iniciales (importación masiva, PDF legacy)? ¿Orden de prioridad ante conflicto?**
  **Postura (desarrollada aquí):** la **fuente viva** de conocimiento es el **canal docente** curado por A11. Se admite una **carga inicial** (p. ej. PDFs/legacy) como *seed* de la KB, pero una vez indexada sigue la misma política de **vigencia/versionado**. Ante conflicto entre una fuente previa y un aporte nuevo del canal docente, **prevalece lo más reciente publicado por la cátedra** (lo previo queda `obsoleto`, auditable); si la contradicción es ambigua, A11 hace `defer_to_teacher`. *(Mecanismo en [Entregable 1, A11](01-inventario-y-justificacion-de-agentes.md) y [Entregable 5 §5](05-conexion-con-discord.md).)*

- **¿Cómo se versiona/marca vigencia cuando cambia el programa?**
  **Postura:** **A11** versiona (cada cambio crea versión nueva, la previa queda `obsoleto`, no se borra) y etiqueta `vigencia`; los agentes citan material **vigente**. *(Ver [glosario §5](00-glosario.md) y [Entregable 5 §5](05-conexion-con-discord.md).)*

- **¿Quién valida en el mundo real antes de que un agente use un post?**
  **Postura:** **confianza en el docente** como autoridad de contenido. A11 valida **origen y rol** (solo canal docente, rol autorizado) y la **coherencia estructural** de la KB, pero **no** la corrección académica; conflicto ambiguo → `defer_to_teacher`. No hay doble revisión externa. *(Ver [Entregable 7 §2](07-riesgos-supuestos-y-limites-eticos.md) y [Entregable 1, A11](01-inventario-y-justificacion-de-agentes.md).)*

- **¿Lenguajes permitidos / stack fijo? ¿Global o por materia?**
  **Postura (desarrollada aquí):** **configurable por materia**, con default tolerante. A3 razona sobre estructura/semántica de cualquier código de texto; cada materia puede declarar sus **lenguajes esperados** y, si llega código fuera de ese conjunto, A3 lo señala en vez de adivinar. Un stack global fijo no escala a *N* materias. **Límite honesto:** A3 no ejecuta código; lenguajes de nicho reciben orientación más genérica.

- **Multi-materia: ¿agente genérico parametrizado, por materia, o mix? ¿Quién posee la verdad si comparten Discord?**
  **Postura:** **agentes genéricos parametrizados por materia** (un *tenant* por servidor). Como **una materia = un servidor**, las materias **no** comparten Discord: cada una es dueña de su servidor y sus stores, así que la pregunta de "quién posee la verdad al compartir" se disuelve. *(Ver [Entregable 3](03-multi-materia.md).)*

## 6. Coordinación y conflictos

- **Si dos agentes podrían responder lo mismo, ¿quién tiene prioridad?**
  **Postura:** A1 fija **un único destino** por mensaje al clasificar la intención; no hay dos especialistas publicando en paralelo. *(Ver [Entregable 2 §8](02-interaccion-y-coordinacion.md).)*

- **Mezcla (teoría + código + admin): ¿orden fijo o paralelo?**
  **Postura:** **descomposición con orden fijo** (política/privacidad → admin → teoría → práctica), ensamblada por A1 en una sola respuesta sin contradicciones. *(Ver [Entregable 2 §8](02-interaccion-y-coordinacion.md) y el Escenario C de [Entregable 6 §4](06-escenarios-y-trazabilidad.md).)*

- **¿Hay estado compartido entre agentes durante una sesión y quién lo controla?**
  **Postura:** sí, la **STM**, controlada por **A8** (no se difunde agente por agente; es una pizarra con dueño). *(Ver [Entregable 2 §7.3](02-interaccion-y-coordinacion.md) y [Entregable 4 §2](04-memoria-entre-sesiones-y-seguimiento.md).)*

- **Memoria entre sesiones: retención, granularidad, dueño, auditoría, alineación del proactivo con privacidad/opt-out.**
  **Postura:** retención **1 cursada + 6 meses** (borrado real al expirar); granularidad de **hechos pedagógicos mínimos** (no transcripciones); dueño **A8**; auditoría con **log mínimo de operación**; el proactivo (A9) respeta visibilidad de origen, opt-out y rate-limit. *(Ver [Entregable 4 §3, §5, §6 y §7](04-memoria-entre-sesiones-y-seguimiento.md).)*

## 7. Autoevaluación y límites pedagógicos

- **¿Quién genera las preguntas de quiz y con qué criterio de dificultad?**
  **Postura:** **A7 (Quiz Agent)**, apuntando al **siguiente paso pedagógico**: si el alumno tuvo dudas en un tema, prioriza ese; si avanzó, sube dificultad; siempre preguntando si quiere seguir. *(Ver [Entregable 1, A7](01-inventario-y-justificacion-de-agentes.md) y el Escenario D de [Entregable 6 §5](06-escenarios-y-trazabilidad.md).)*

- **¿Cómo se distingue "ayuda para aprender" de "hacer la tarea" en cada respuesta, sin anti-fraude multi-turno?**
  **Postura:** por respuesta — **A5** bloquea resolver un evaluable activo y **A4** acota la densidad de la ayuda no evaluable, sobre una **postura** socrática de A3. **Límite honesto declarado:** no se persiguen **cadenas incrementales** de preguntas. *(Ver [Entregable 2 §5](02-interaccion-y-coordinacion.md) y [Entregable 7 §2](07-riesgos-supuestos-y-limites-eticos.md).)*

## 8. Privacidad, seguridad y abuso

- **¿Se almacenan conversaciones o código? ¿Finalidad y retención?**
  **Postura:** **no** se guardan transcripciones ni código crudo; solo **hechos pedagógicos** para el seguimiento, con retención acotada. *(Ver [Entregable 4 §3 y §5](04-memoria-entre-sesiones-y-seguimiento.md).)*

- **¿Cómo se clasifica/aísla el almacenamiento según origen público vs DM?**
  **Postura:** cada registro lleva **visibilidad de origen** (`publico`/`privado`/`dm`); en canal público no se entrega lo nacido en DM. *(Ver [Entregable 4 §6](04-memoria-entre-sesiones-y-seguimiento.md) y [Entregable 5 §6](05-conexion-con-discord.md).)*

- **¿Cómo se separa/integra esa retención con la memoria entre sesiones?**
  **Postura:** **misma capa LTM**, con etiquetas de visibilidad y minimización; no hay un almacén paralelo. *(Ver [Entregable 4 §3 y §6](04-memoria-entre-sesiones-y-seguimiento.md).)*

- **¿Qué ocurre con el feedback hacia docentes (retención, visibilidad, si alimenta otros agentes)?**
  **Postura:** se entrega **agregado/anonimizado** según política; **no** se usa para entrenar ni alimentar a otros agentes con contenido identificable. *(Ver [Entregable 2 §10](02-interaccion-y-coordinacion.md) y [Entregable 7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*

- **¿Cómo se reduce el filtrado de datos entre usuarios y entre materias?**
  **Postura:** partición **usuario+materia** (A8 niega datos de terceros) y **una materia = un servidor** (frontera física + tenant). *(Ver [Entregable 3 §4](03-multi-materia.md) y [Entregable 7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*

## 9. Requisitos no funcionales (a nivel conceptual)

- **Latencia y degradación: ¿qué hace el sistema si un paso falla o tarda demasiado?**
  **Postura (desarrollada aquí):** **degradación elegante por frente** — si un agente/paso falla o supera un timeout conceptual, A1 informa que **ese** frente no está disponible y ofrece alternativas o reconducción, sin colgar toda la interacción. **Límite honesto:** la detección (health-check/timeout) está descrita conceptualmente, no afinada. *(Robustez global en [Entregable 8 §3](08-autoevaluacion-de-la-arquitectura.md).)*

- **Idioma, tono y accesibilidad: ¿un solo idioma o varios?**
  **Postura (desarrollada aquí):** **español rioplatense por defecto**, con adaptación al idioma del alumno si difiere; **no** es un sistema multilingüe pleno. Accesibilidad: respuestas en **texto/markdown** legible (compatible con lectores de pantalla), concisas, sin imágenes de texto; el código va en bloques. El tono es el de cada agente, sin condescendencia.

## 10. Evaluación del propio diseño

- **¿Qué escala se usa? ¿Métricas adicionales? ¿Cómo se priorizarían mejoras en otra iteración?**
  **Postura:** escala **cualitativa Bajo/Medio/Alto** (distinguiendo plano de agentes vs operativo); métrica adicional de **trazabilidad/auditabilidad**; y una **priorización de mejoras** (resiliencia de puntos únicos, costo operativo de N servidores, capacidades transversales a materia). *(Ver [Entregable 8 §1 y §5](08-autoevaluacion-de-la-arquitectura.md).)*

## 11. Cierre

Ninguna de estas posturas cambia la arquitectura: la **afinan** y dejan registro explícito de las decisiones. Todas son coherentes con los entregables previos (multi-materia por parametrización, STM/LTM, un solo bot, postura pedagógica) y con los **límites honestos** reconocidos en el [Entregable 8](08-autoevaluacion-de-la-arquitectura.md).
