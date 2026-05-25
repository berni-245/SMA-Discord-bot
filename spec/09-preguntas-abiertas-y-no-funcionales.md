# 09 — Preguntas abiertas y requisitos no funcionales (decisiones)

> Complemento de los entregables 1–8. Vocabulario en el [glosario (Entregable 0)](00-glosario.md). Aquí el grupo **toma postura explícita** sobre las cuestiones que el diseño dejaba abiertas o implícitas, para que queden cerradas y argumentadas.

## 1. Propósito

Los entregables anteriores resolvieron las decisiones centrales. Este documento cierra, de forma explícita, un conjunto de **preguntas abiertas** y **requisitos no funcionales** que estaban implícitos o sin tratar, con una decisión y su justificación.

## 2. Preguntas abiertas (postura del grupo)

### 2.1. ¿Una sola personalidad conversacional o varias "voces"?

**Decisión: una única identidad de bot, con voces diferenciadas por tipo de ayuda.**

Hay **un solo bot** (Entregable 5), pero cada agente tiene un **tono propio** acorde a su rol: A2 (teoría) didáctico y paciente; A3 (práctica) técnico, como un par más adelantado; A6 (admin) neutro y literal; A9 (seguimiento) suave y sin urgencia. Todas las voces comparten el registro rioplatense y la cordialidad de A1.

**Por qué:** un tono único para todo aplanaría la experiencia (la voz que sirve para explicar teoría no es la que sirve para acotar una respuesta administrativa). Diferenciar por agente es barato (cada ficha ya define su tono) y coherente con la especialización. **Límite honesto:** la coherencia entre voces depende de mantener disciplina de estilo entre fichas.

### 2.2. ¿Cómo se manejan conversaciones largas y referencias a mensajes previos?

**Decisión: la STM sostiene el hilo dentro de la sesión; la LTM, entre sesiones.**

- Dentro de una **sesión**, la **STM** (custodiada por A8) mantiene los mensajes recientes y permite resolver referencias del tipo "lo que dijiste antes" o "seguí con eso".
- Para **código**, las referencias a mensajes previos se resuelven con el **enlace a mensaje** del pipeline de ingreso (Entregable 5 §8).
- Más allá de la sesión, la continuidad la da la **LTM** (dudas/temas), no la transcripción literal.

**Por qué:** separar STM/LTM (Entregable 4) ya da el mecanismo; no hace falta reconstruir la conversación palabra por palabra. **Límite honesto:** el sistema **no** garantiza recordar el texto exacto de mensajes viejos; recuerda **hechos pedagógicos**, no transcripciones (minimización).

### 2.3. ¿Lenguajes de programación permitidos / stack fijo?

**Decisión: configurable por materia, con un comportamiento por defecto tolerante.**

- Por **defecto**, A3 razona sobre **estructura y semántica** de cualquier código de texto, sin atarse a un lenguaje.
- Cada **materia** puede declarar (en su configuración) los **lenguajes esperados** de la cursada; si llega código en un lenguaje fuera de ese conjunto, A3 lo señala y pide confirmación en vez de adivinar.

**Por qué:** un stack global fijo no escala a *N* materias con tecnologías distintas; la parametrización por materia (Entregable 3) ya es el patrón natural. **Límite honesto:** A3 no ejecuta código; su análisis es conceptual, así que lenguajes muy de nicho pueden recibir orientación más genérica.

## 3. Requisitos no funcionales (a nivel conceptual)

### 3.1. Latencia y degradación ante un paso lento o caído

**Decisión: degradación elegante por frente, sin bloquear toda la respuesta.**

Si un agente o paso **falla o tarda demasiado** (timeout conceptual), el sistema no cuelga la interacción entera: A1 informa cordialmente que **ese** frente no está disponible por ahora y ofrece **alternativas** (otros frentes) o **reconducción** a docentes. Es la contracara, a nivel de un solo pedido, de la robustez analizada en el [Entregable 8 §3](08-autoevaluacion-de-la-arquitectura.md).

**Límite honesto:** el **mecanismo de detección** (health-check / timeout) está descrito conceptualmente, no afinado; es lo primero a endurecer en otra iteración.

### 3.2. Idioma

**Decisión: español rioplatense por defecto; el bot responde en el idioma del alumno si difiere.**

El default de la cursada es español; si un alumno escribe consistentemente en otro idioma, los agentes pueden responder en ese idioma (las fichas de `agents/` ya lo contemplan). No es un sistema multilingüe pleno: es un default claro con adaptación razonable.

### 3.3. Accesibilidad y formato

**Decisión: respuestas en texto/markdown legible, sin depender de imágenes.**

Las respuestas se entregan como **texto plano o markdown** simple (compatible con lectores de pantalla de Discord), concisas y sin adornos innecesarios. El código va en bloques con triple backtick; no se responde con imágenes de texto. Esto mantiene la accesibilidad y la trazabilidad de lo que el bot dice.

## 4. Cierre

Estas decisiones no cambian la arquitectura: la afinan en los bordes que quedaban abiertos. Todas son coherentes con los entregables previos (multi-materia por parametrización, STM/LTM, un solo bot, postura pedagógica) y con los límites honestos ya reconocidos en el [Entregable 8](08-autoevaluacion-de-la-arquitectura.md).
