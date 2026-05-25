# Entregable 5 — Conexión con Discord (a nivel de diseño)

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); multi-materia en el [Entregable 3](03-multi-materia.md); memoria en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md).

## 1. Propósito y alcance

Discord es el **ambiente** del sistema (no una mera capa de UI): sus permisos, roles, tipos de canal y visibilidad acotan qué puede **percibirse** (sensores) y qué puede **alterarse** (actuadores). Este entregable define cómo se representa el sistema en Discord, la **matriz agente–ambiente**, el canal de aporte docente, cómo se dispara y recibe una interacción, la privacidad público vs DM, la **atribución de fuente** y el **ingreso de código**. Todo a nivel de diseño, sin implementación.

## 2. Representación en Discord: un solo bot

**Decisión: una sola aplicación de bot**, presente en el servidor de cada materia. Los 11 agentes son **roles lógicos internos** del sistema, **no** bots separados.

**Justificación:**

- **Una sola identidad y un solo punto de I/O** con el ambiente (el **Discord Gateway**): más simple de operar y de razonar que *N* bots negociando.
- **Coherente con la orquestación liviana** (Entregable 2): A1 es el punto de entrada lógico; multiplicar bots externos recrearía la coordinación que ya resuelve A1 internamente.
- **Coherente con "una materia = un servidor"** (Entregable 3): el mismo bot está presente en cada servidor; el **Subject Router** resuelve la materia por el servidor de origen.

**Roles de Discord:** `estudiante`, `docente`, `ayudante`. Condicionan permisos, canales accesibles y la superficie de capacidades (Entregable 2, §9).

**Disposición de canales por servidor de materia:**

| Canal | Quién escribe | Visibilidad | Rol en el sistema |
|---|---|---|---|
| **Canal público de consultas** | estudiantes (y bot si lo @mencionan) | pública entre miembros | Consultas visibles; el bot responde **solo si lo @mencionan** |
| **DM / privado 1:1 con el bot** | estudiante ↔ bot | privada | Consultas privadas, código sensible, quizzes, seguimiento |
| **Canal docente especializado** (`#material-cátedra` o equiv.) | **solo docencia** | lectura para estudiantes (diferenciada si la cátedra lo define) | Aporte de conocimiento → A11 |
| **Canal/hilo de cátedra** | bot (digest) y docencia | solo docencia | Entrega de digests de feedback (A10) |
| **Hilos** | según canal padre | heredan la del canal padre | Conversaciones largas; un canal restringido por rol se trata como "público entre quienes lo leen" |

La **convivencia estudiantes/docentes** se materializa en esta separación de canales y permisos: las superficies separadas del Entregable 2 no son solo lógicas, son canales distintos con permisos distintos.

> **Casos intermedios de visibilidad.** La regla general es que la visibilidad la define **quiénes pueden leer**, no el tamaño del espacio: un **hilo** hereda la visibilidad de su canal padre; un **canal restringido por rol** (p. ej. solo estudiantes) se trata como **público entre quienes pueden leerlo**; un **grupo pequeño** (canal o DM grupal de pocos integrantes) se trata como **privado respecto del resto del servidor, pero público entre sus miembros** — el bot no republica fuera del grupo lo dicho dentro, ni asume privacidad 1:1 como en un DM. La memoria (A8) etiqueta estos orígenes con su visibilidad para no filtrarlos luego.

## 3. Cómo se dispara y se recibe una interacción

Todo entra y sale por el **Discord Gateway** (el sensor/actuador concreto):

- **En canal público:** el estudiante **@menciona** al bot. El bot responde en el canal; la respuesta es visible para todos los habilitados a leerlo, por lo que pasa por el **Privacy Filter** (saneo) antes de publicarse.
- **En DM:** el estudiante escribe directamente; el bot responde 1:1 con memoria completa de la materia, **sin** saneo público.
- **Comandos slash:** disparadores explícitos (`/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, `/checklist`, etc.) que fuerzan una operación.
- **Docente:** publica en el **canal docente especializado** (dispara a A11); lee el **digest** en el canal/hilo de cátedra; configura la materia (comandos de configuración).
- **Proactivo (A9):** no lo dispara un mensaje del usuario sino el scheduler; sale por DM (por defecto) o como mención pública sin detalle privado.

## 4. Matriz de interacción agente–ambiente (obligatoria)

Refuerza el encuadre de **sensores y actuadores**: para cada agente, en qué tipos de canal **percibe** y en cuáles **actúa**.

**Leyenda:** **P** = percibe directamente del canal · **(P)** = percibe indirectamente (la consulta le llega vía el ruteo de A1, no lee el canal por su cuenta) · **A** = actúa (publica/escribe) · **—** = vedado o no aplica por diseño.

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

**Vedados explícitos por diseño (no es omisión, es regla):**

- **A11** no percibe ni actúa en canales de estudiante (público/DM): separación docente/estudiante. Solo opera en el canal docente.
- **A1–A9** no perciben ni actúan en el canal docente de aporte: solo A11 lo cura.
- **A8** (memoria) y **A5** (dictamen) **no actúan en ningún canal**: son custodio interno y juez interno, respectivamente; su salida es para otros agentes, no para el ambiente.
- **A9 / A10** nunca publican en canal público contenido nacido en **DM**.
- En el **canal/hilo de cátedra** solo escribe **A10** (el digest); ningún agente de estudiante percibe ese canal.

> El **Discord Gateway** es el sensor/actuador físico; los agentes perciben y actúan **a través** de él. La columna "percibe directo" (P) corresponde a quien efectivamente lee eventos del canal: A1 (mensajes de estudiante), A11 (aportes docentes) y A10 (respuestas de encuesta en DM).

## 5. Canal especializado de aporte docente

- **Qué es:** un canal por materia (`#material-cátedra` o el nombre que defina la cátedra), con **escritura restringida al rol docente/ayudante**. Los estudiantes pueden leerlo (con la diferenciación que la cátedra decida).
- **Quién lo procesa:** **A11 KB Curator**. Detecta el aporte, valida origen y rol, infiere el tipo (apunte, aviso, corrección, programa), versiona e indexa en la **KB Store** de esa materia, y marca obsolescencia de lo reemplazado.
- **Vínculo con la base de conocimiento:** lo que A11 cura es lo que A2 (teoría) y A7 (quizzes) consumen vía recuperación. Así el **conocimiento vivo** se mantiene al día durante la cursada, con **vigencia** y **versionado** auditables.
- **Aislamiento (Entregable 3):** el canal docente vive dentro del servidor de su materia; su contenido **solo** alimenta la KB de esa materia. El aporte de una materia no puede entrar a la KB de otra.

## 6. Privacidad pública vs DM

La regla base es **canal público = público / DM = privado**, y se aplica de forma coherente en cuatro frentes:

- **Respuestas del bot:** en canal público pasan por el **Privacy Filter** (no exponen memoria sensible ni detalle privado); en DM se responde completo. El bot solo habla en público si lo @mencionan.
- **Memoria entre sesiones (Entregable 4):** cada registro lleva **visibilidad de origen**; A8 no entrega en canal público lo nacido en DM.
- **Feedback a docentes:** A10 entrega **digests agregados y anonimizados** según la política de la cátedra; no expone el detalle identificable de consultas privadas.
- **Agentes:** A1 **saniza** lo que pasa a especialistas en canal público; `subject_id` y `channel_type` viajan como invariantes, pero el **contenido de DM no cruza** a público salvo una **transferencia explícita y consentida** del alumno.

**Canal sugerido para código/datos sensibles:** si un estudiante publica en canal público código que parece sensible (p. ej. de un entregable), el **Privacy Hint** sugiere **mover a DM** antes de analizarlo. Es un *nudge*, no una imposición.

## 7. Atribución de fuente en lo que se publica

Toda afirmación que el bot basa en un documento se publica con **cita de fuente legible** (ver glosario: *atribución / cita de fuente*, *trazabilidad*):

- **Qué se cita:** material de cátedra **vigente** — p. ej. "Apunte de la Unidad 3" (KB) o "lo publicado por la cátedra en *reglas de evaluación*" (Config Store). Nunca se cita contenido privado de otro usuario.
- **Sin fuente:** si no hay base en la KB o el Config Store, el bot **no inventa** la cita: aplica la **reconducción a docentes** (coherente con el Entregable 2, §6, y con el manejo de alucinaciones del Entregable 7).
- **Cómo se sostiene:** internamente con **trazabilidad** (`chunk_id` / campo de Config), que **no** se muestra al alumno salvo que aporte. Es la "garantía de dónde sale la información".
- **Coherencia con privacidad:** como solo se cita material de cátedra (público o aportado por el docente), la atribución **no** filtra contenido privado ni en canal público ni en DM.

## 8. Ingreso de código (funcionalidad 2)

El camino "estudiante aporta código → agente lo interpreta" queda trazado así:

**Mecanismos admitidos (cualquiera de estos):**

1. **Bloque de código** con triple backtick en el mensaje.
2. **Adjunto de archivo de texto** (`.py`, `.java`, `.c`, `.txt`, etc.).
3. **Enlace a un mensaje previo** en un hilo.

**Pipeline determinista (infraestructura, no agente):**

- **Code Extractor** — extrae el contenido según el formato (bloque / adjunto / link).
- **Format Validator** — detecta formato ilegible o incompatible.
- **Privacy Hint** — si se publicó en canal público y parece sensible, sugiere mover a DM (§6).

**Límites razonables:**

- Solo **texto** (no binarios ni imágenes-de-código): un binario o una captura de pantalla se rechaza con aviso.
- Tamaño máximo por envío **configurable** (p. ej. del orden de ~100 KB o ~2000 líneas), para no degradar el análisis ni la latencia.
- Lenguaje detectable; si no se reconoce, A3 puede pedir que el alumno lo indique.

**Qué hace el sistema si falta el código o es ilegible:** **no analiza a ciegas**. El Format Validator avisa al alumno y pide reenviarlo en un formato válido (bloque o adjunto de texto). Si el código se esperaba pero no llegó, A3 lo solicita explícitamente antes de continuar.

**Flujo completo:** estudiante envía código → **Gateway** lo detecta → **Code Extractor** + **Format Validator** (y **Privacy Hint** si corresponde) → código limpio entregado a **A3** dentro del pipeline de práctica (`A1 → A5 → A3 → A4 → publicación`, Entregable 2). El análisis de A3 es por **categorías de error**, sin reescribir la solución.

## 9. Componentes de soporte no-agente (identidad y configuración)

Cerramos acá las historias de **registro** e **identidad** que el Entregable 3 anticipó como infraestructura. Se modelan como **no-agente** porque son deterministas, sin deliberación ni objetivo pedagógico (modelarlas como agentes sumaría coordinación inútil).

- **Infraestructura de identidad** (cierra "estudiante se registra/verifica" y "validar identidad / revisar roles"):
  - **Auth Service** — el usuario informa su correo institucional, recibe un **token** por mail y lo ingresa en Discord; valida dominio y token.
  - **User Mapping Store** — persiste el mapping `Discord ↔ cuenta institucional`.
  - Toda consulta de estudiante chequea este mapping (**Auth Check**) antes de invocar agentes. El **rol** de Discord viaja en el contexto (lo consume A1; A11 valida rol docente/ayudante).
- **Infraestructura de configuración docente** (cierra "registrar el servidor como materia" / declarar config):
  - **Config Service** — ABM de fechas, modalidad, reglas y **evaluativas activas**; persiste en el **Config Store** por materia.
  - **Subject Router** — asocia el servidor a la materia y particiona (Entregable 3).
  - Quienes **consumen** esa configuración sí son agentes (A6 admin, A5 evaluativas), pero la **carga** del dato es operación directa del docente.

Estas piezas **habilitan** la materia, la identidad y los roles **antes** de que cualquier agente actúe; son precondiciones de infraestructura, no flujos de agentes.

## 10. Síntesis

El sistema se representa como **un solo bot** presente en el servidor de cada materia, con agentes lógicos internos e infraestructura determinista para lo que no delibera (identidad, configuración, ruteo, saneo, extracción de código). La **matriz agente–ambiente** fija qué percibe y qué publica cada agente, con vedados explícitos que sostienen la **separación estudiante/docente** y la **privacidad por canal**. El **canal docente** alimenta la KB vía A11; las **respuestas** citan su fuente de cátedra y, sin fuente, reconducen en vez de inventar; el **código** entra por bloque/adjunto/link con un pipeline determinista y límites razonables. Público vs DM se respeta en respuestas, memoria, feedback y handoffs entre agentes.
