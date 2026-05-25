# Entregable 4 — Memoria entre sesiones y seguimiento

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes A8/A9 en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); aislamiento por materia en el [Entregable 3](03-multi-materia.md).

## 1. Propósito y alcance

Este entregable define **qué** recuerda el sistema del alumno entre sesiones (y qué descarta), **dónde** vive esa memoria, **cómo** la leen y actualizan los agentes, **cómo** se dispara el **contacto proactivo** y **cómo** el usuario lo controla. Cierra con un **ejemplo** día 1 → seguimiento que respeta los límites globales.

## 2. Dos memorias distintas: intra-sesión vs entre días

La distinción es la columna vertebral del diseño de memoria (y está fijada en el [glosario](00-glosario.md)):

| | **Memoria intra-sesión (STM)** | **Persistencia entre sesiones (LTM + Pedagogical Profile)** |
|---|---|---|
| Alcance | Una **sesión** | Entre días / a lo largo de la cursada |
| Contenido | Estado volátil **compartido entre agentes** durante el intercambio | Hechos **pedagógicos longitudinales** |
| Vida | Se **descarta** al cerrar la sesión | **Persiste** hasta expiración o borrado |
| Rol | Coordinación dentro de un turno/conversación | Habilita **seguimiento** y **contacto proactivo** |
| Dueño | **A8** (custodio) | **A8** (custodio) |

Ambas coexisten, pero cumplen roles distintos y **no se confunden**: el seguimiento proactivo (A9) usa **solo** la capa entre días; la STM nunca lo alimenta (ver §8). Esto evita tratar estado volátil de coordinación como si fuera registro de seguimiento.

## 3. Qué se conserva y qué se descarta

**Se conserva (LTM), porque aporta al seguimiento:**

- **Dudas**: tema, estado (`abierta` / `cerrada`), último contacto y **visibilidad de origen**.
- **Temas / unidades vistas**.
- **Quizzes**: tema + resultado.
- **Avances en TPs**: estado (`stuck` / `en_progreso` / `cerca`).
- **Errores recurrentes** (categorías, no el código literal).
- **Hitos y motivaciones pedagógicas** que originaron interacciones.

**Pedagogical Profile** (síntesis por usuario+materia): estilo de aprendizaje, fortalezas y debilidades; se actualiza incrementalmente.

**Se descarta o no se guarda:**

- La **STM** completa, al cerrar la sesión.
- **Transcripciones crudas y código enviado**: por defecto **no** se almacena el diálogo literal ni el código del alumno; se guarda el **hecho pedagógico** que aporta al seguimiento (p. ej. "TP1, error de mutación en loop, estado `stuck`"), no el fragmento de código.
- Charla off-topic, opiniones del alumno sobre docentes, metadata identitaria innecesaria y datos sensibles (médicos, de terceros).

> **Decisión explícita (cierra una pregunta abierta).** La finalidad de la memoria es el **seguimiento pedagógico**, no la reconstrucción de conversaciones. Por eso se guardan **hechos pedagógicos mínimos**, no conversaciones ni código crudos. Es el principio de **minimización** aplicado al diseño.

## 4. Dónde vive la memoria y cómo se lee/actualiza

- **Custodio único: A8 Memory Agent.** Es el agente dedicado; ningún otro agente persiste memoria del alumno por su cuenta. A8 es la **única fuente de verdad**.
- **Tres capas:** STM, LTM y Pedagogical Profile, todas **particionadas por usuario + materia** (coherente con el Entregable 3: como una materia = un servidor, el aislamiento de memoria coincide con la frontera de la materia).
- **Lectura (`read`):** un agente pide a A8 un extracto. A8 aplica **visibilidad por canal** (§6), **minimización** (entrega lo justo) y **aislamiento por materia**. Puede **negar** la lectura a quien no tiene rol para usarla (p. ej. A5 Evaluative Guard, cuyo dictamen debe ser independiente del alumno).
- **Escritura (`write`):** el agente envía el evento con metadata (`usuario`, `materia`, `origen_canal`, `timestamp`, `agente_emisor`); A8 decide la capa (STM / LTM / Profile) y la persiste.

**Quién escribe qué (resumen):**

| Agente | Qué registra en A8 |
|---|---|
| A2 Theory | Dudas y temas cubiertos |
| A3 Practice | Avance en TPs, errores recurrentes |
| A7 Quiz | Resultado de quizzes |
| A9 Follow-up | Registro del contacto proactivo realizado |
| A5 Evaluative Guard | **Nada**: no lee ni escribe memoria (independencia del dictamen) |

## 5. Retención, propiedad y auditoría

- **Propiedad:** A8 posee el registro longitudinal, por usuario+materia.
- **Retención:** por defecto **1 cursada + 6 meses**, configurable por la cátedra. Al expirar, el dato **se borra** (no se anonimiza: se borra).
- **Auditoría:** las operaciones de memoria dejan un **log mínimo de operación, sin contenido** → soporta **trazabilidad** sin retener lo que no corresponde.
- **Control del usuario** (comandos, ruteados por A1 a A8):
  - `/mi-historial` → A8 devuelve un **resumen legible** de LTM + perfil de la materia activa (`read_for_user`).
  - `/borrar-historial` → borra la **LTM** del usuario para esa materia.
  - `/restablecer-perfil` → resetea el **Pedagogical Profile** de esa materia.
  - **Opt-out de seguimiento** → marca `no_proactive_use` en todas las particiones del usuario (no borra contenido; apaga el proactivo).
  - Pedido de "olvidate de mí" → **borrado real** de esa partición, con confirmación.

## 6. Visibilidad de origen: la privacidad por canal dentro de la memoria

Cada registro lleva su **visibilidad de origen** (`publico` / `privado` / `dm`), y A8 la respeta al entregar:

- **Lectura en canal público:** A8 **omite** los registros de origen `dm`/`privado`; a lo sumo entrega un resumen genérico ("el alumno consultó antes sobre el tema X"), sin el detalle nacido en privado.
- **Lectura en DM/privado:** A8 puede entregar lo que corresponde a esa materia.

Así, la **invariante de privacidad por canal** vive también en la memoria: lo que nació en DM **no** se filtra a un canal público a través de un extracto, salvo una **transferencia explícita y consentida** del propio alumno. Esto condiciona directamente al contacto proactivo (§7).

## 7. Contacto proactivo (A9)

- **Quién:** A9 Follow-up, **proactivo**, fuera del pipeline reactivo. Lo dispara un **scheduler** (no un mensaje entrante).
- **Disparadores (oportunidades), leídas de A8 + Config Store:**
  - Duda **abierta** hace más de *N* días sin cierre.
  - Quiz **fallado** sin reintento.
  - TP en `stuck` hace más de *N* días.
  - **Hito próximo** (parcial, recuperatorio, entrega de TP) en los próximos ~7 días, sobre todo si hay dudas relacionadas.
- **Periodicidad máxima:** `frecuencia_max` (por defecto **1 por semana**), configurable. **Un solo mensaje por contacto** y **una sola oportunidad priorizada** (no se acumulan 4 temas en un mensaje).
- **Reglas de silencio:** `horarios_silencio` (no contactar de madrugada, etc.); si toca un horario de silencio, se pospone.
- **Relación con Discord:** **DM por defecto**; opcionalmente `mention_publico` si el usuario lo configuró, pero **sin exponer detalle privado** (si la duda nació en DM, se menciona solo el tema general).
- **Control del usuario (opt-out):** A9 **chequea opt-out primero**; si está activo, no contacta. El **primer** follow-up de un usuario **siempre** incluye la salida fácil ("decime si preferís que no te escriba más sobre esto"); si el usuario pide parar, se setea el opt-out vía A8.
- **Tono:** suave, sin urgencia, **sin vigilancia ni *guilt-tripping***; nunca menciona notas ni "tu situación de cursada".

**Coherencia con los límites globales:** el proactivo no **acosa** (rate-limit + horarios de silencio + un mensaje + opt-out), no **expone** en público lo nacido en DM, y no **reemplaza** comunicaciones oficiales de la cátedra.

## 8. Por qué la STM no participa del seguimiento

El seguimiento proactivo usa **únicamente** la persistencia entre días (LTM + Profile). La STM es estado de **coordinación** intra-sesión y muere con la sesión; si alimentara el proactivo, se borraría la frontera entre "lo que pasó en este rato" y "lo que vale la pena seguir". Mantenerlas separadas es lo que permite, a la vez, **coordinar** dentro de una conversación y **acompañar** a lo largo de la cursada sin mezclar ambos propósitos.

## 9. Ejemplo breve: día 1 → seguimiento (mini-escenario)

Materia: **Programación II** (su propio servidor). Canal: **DM**.

1. **Día 1 (DM).** El alumno pide un quiz de pilas y **falla** la pregunta sobre el tope tras varios `push`/`pop` (concepto LIFO). **A7** evalúa y **escribe en A8** (LTM): duda abierta `pilas - LIFO`, quiz `resultado=false`, `origen=dm`. La interacción ocurrió en privado → queda marcada como `dm`.
2. **+4 días.** El **scheduler** dispara a **A9**. A9 **lee de A8**: hay una duda abierta de hace 4 días y un quiz fallado sin reintento. Chequea: opt-out (no), rate-limit (sin contacto previo reciente), horario (fuera de silencio). **Prioriza** esa única oportunidad.
3. **Mensaje de seguimiento (por DM).** A9 redacta:
   > "Hola, hace unos días vimos pilas y quedaste con una duda sobre cómo cambia el tope después de varios `push`/`pop`. ¿La retomamos con otro ejemplo, o preferís repasar primero el material? Si por ahora no, sin problema — decime si preferís que no te escriba más sobre esto."

   A9 **registra el contacto** en A8 para que el próximo ciclo sepa que ya hubo.

**Por qué no contradice los límites globales:**

- Va por **DM**, el mismo medio donde nació la duda → **no** expone en público contenido privado.
- **Una** sola oportunidad, **un** mensaje, dentro de la frecuencia máxima → **no** es acoso.
- Incluye la **salida fácil** (opt-out) → control del usuario.
- **No** menciona notas ni evalúa; tono **suave** → no vigilancia.
- Es sobre el **mismo tema** previo (continuidad pedagógica), sin reemplazar al docente.

## 10. Síntesis

La memoria se organiza en dos planos con roles distintos: **STM** (intra-sesión, volátil, para coordinar) y **LTM + Pedagogical Profile** (entre días, persistente, para seguir). Ambos viven en un **único custodio, A8**, particionados por **usuario + materia**, con **minimización** (hechos pedagógicos, no transcripciones ni código crudos), **retención acotada** (1 cursada + 6 meses, borrado real al expirar) y **visibilidad de origen** que extiende la privacidad por canal a la memoria. El **contacto proactivo (A9)** se nutre solo de la capa entre días, se dispara por oportunidades y hitos, y queda acotado por **frecuencia máxima, horarios de silencio, un mensaje por contacto y opt-out**, de modo que el seguimiento acompañe sin acosar ni filtrar lo privado.
