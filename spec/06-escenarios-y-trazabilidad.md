# Entregable 6 — Escenarios y trazabilidad

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); multi-materia en el [Entregable 3](03-multi-materia.md); memoria en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md); Discord en el [Entregable 5](05-conexion-con-discord.md).

## 1. Propósito y alcance

Tres escenarios obligatorios, cada uno centrado en un **área de tensión distinta**:

- **A — Programación y restricción pedagógica** (tensión pedagógica ↔ código evaluable).
- **B — Administrativo y límite institucional** (tensión regla pública ↔ caso particular).
- **C — Consulta mixta** (tensión multi-dominio ↔ coherencia de una sola respuesta).

Cada escenario va **paso a paso** (qué agente actúa, qué hace, qué información circula) y acompañado de un **diagrama de secuencia** con orden temporal explícito, coherente con el relato. Las materias *Programación II* y *Álgebra II* son ilustrativas (cada una en su servidor, Entregable 3).

---

## 2. Escenario A — Programación y restricción pedagógica

**Tensión:** el estudiante pide, en un turno, la **solución entregable** de un evaluable activo. El sistema debe **ayudar sin entregar la solución** en ese intercambio.

**Contexto:** *Programación II*, **DM** (el alumno trabaja su entrega en privado). Hay un **TP1 entregable activo** declarado por el docente; el ejercicio 3 forma parte de él.

**Paso a paso:**

1. **Estudiante (DM):** envía un **bloque de código** y escribe *"che, pasame resuelto el ejercicio 3 del TP1 que entrego mañana"*.
2. **Discord Gateway + pipeline de código (infra):** detecta el bloque, lo **extrae y valida**; entrega el código limpio. (Es DM, no hace falta sugerir mover a privado.)
3. **A1 Frontier:** usuario verificado; materia = *Programación II* (resuelta por el **servidor**). Clasifica `intent = apoyo_practico`. Pide a **A8** el contexto (en DM, memoria completa de la materia). Como toda consulta práctica, deriva **primero a A5**.
4. **A5 Evaluative Guard:** lee las **evaluativas activas** del Config Store. El TP1 está activo y la consulta pide **resolver el ejercicio 3**. Devuelve `is_evaluative = true` (confianza alta), con justificación. **No** redacta respuesta.
5. **A1 (decisión de borde):** con `is_evaluative = true`, A1 **no deriva a A3** (por diseño, A3 no atiende consultas que caen sobre un evaluable activo). A1 compone la respuesta manteniendo la **postura**: declina entregar el ejercicio resuelto y **ofrece la ayuda que sí corresponde** — explicar el **concepto** necesario (puede derivar a **A2** la parte teórica del tema, que no resuelve el entregable) y orientar a los docentes ante dudas sobre la consigna.
6. **Publicación (DM):** el bot deja explícito que **no** va a entregar el ejercicio resuelto, ofrece guiar el razonamiento o explicar el concepto, y **cita la fuente** de cátedra si aporta material teórico.
7. **Registro:** A8 registra el tema y el estado (`stuck`). Si el patrón se repitiera, A5 puede marcar `pattern_flag` para que el docente decida —sin bloquear al alumno.
8. **Cierre (opcional):** **A10** lanza una **encuesta** breve por DM, respetando el cooldown.

**Quién evita la sobre-entrega (trazado explícito):** **A5** detecta que la consulta cae sobre un evaluable activo y, por su dictamen, **A1 no deriva a A3** y declina la solución manteniendo la postura pedagógica. El control de **densidad** de **A4** es el mecanismo complementario para la ayuda **no evaluable** (se ve en el Escenario C). No se bloquean cadenas incrementales de preguntas (límite honesto declarado).

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord Gateway
    participant CP as Pipeline de codigo (infra)
    participant A1 as A1 Frontier
    participant A8 as A8 Memory
    participant A5 as A5 Eval Guard

    E->>D: DM con bloque de codigo + pedido de resolver el ej 3 del TP1
    D->>CP: Detecta bloque de codigo
    CP->>A1: Codigo limpio + mensaje (materia Prog II por servidor)
    A1->>A8: read contexto (DM, memoria completa)
    A8-->>A1: Extracto pedagogico
    A1->>A5: Dictamen sobre apoyo_practico
    A5-->>A1: is_evaluative true (TP1 activo, pide resolver ej 3)
    A1->>A1: No deriva a A3; mantiene la postura
    A1-->>D: Declina la solucion + ofrece explicar el concepto / reconduce
    D-->>E: No te resuelvo el entregable, pero te explico el concepto
    A1->>A8: write avance (TP1, stuck)
```

---

## 3. Escenario B — Administrativo y límite institucional

**Tensión:** una consulta mezcla **regla pública** con un **caso particular** del alumno (salud, recuperatorio). El sistema da la regla general pero **no** decide el caso ni tramita: **deriva** a la instancia humana.

**Contexto:** *Álgebra II*, **canal público** (el alumno @menciona al bot).

**Paso a paso:**

1. **Estudiante (público, @bot):** *"me enfermé el día del parcial, ¿puedo recuperarlo?"*.
2. **Discord Gateway + Auth Check (infra):** usuario verificado; materia = *Álgebra II* (por servidor). Entrega a A1 con `canal = publico`.
3. **A1 Frontier:** clasifica como **caso mixto** (regla administrativa + caso personal). Necesita la regla publicada, así que deriva a **A6**.
4. **A6 Admin Info:** lee del **Config Store** la regla de **recuperatorios** (p. ej. "hay recuperatorio con justificación oficial dentro de 72 hs"). Devuelve la **regla general literal** + una **derivación** explícita: el caso particular (si califica, certificado, ventana) lo resuelve el **docente/bedelía**.
5. **Privacy Filter (infra):** como el canal es público, sanea el borrador antes de publicar (acá la respuesta es regla general, sin datos sensibles).
6. **Publicación (público):** el bot responde con **(a)** la regla general citando que es **lo publicado por la cátedra**, y **(b)** la **frontera**: no valida certificados ni decide habilitaciones; orienta a docente/bedelía.

**Frontera trazada (qué dice vs qué deriva):** el sistema **dice** las reglas generales publicadas (recuperatorio, plazos) **citando la fuente**; **no** afirma si *ese* alumno califica, **no** tramita la licencia, **no** valida certificados → **deriva** a docente/bedelía. Coherente con los límites globales (no dar info institucional sensible, no reemplazar a la universidad).

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord Gateway
    participant A1 as A1 Frontier
    participant A6 as A6 Admin Info
    participant CS as Config Store
    participant PF as Privacy Filter (infra)

    E->>D: Canal publico, @bot, me enferme el dia del parcial puedo recuperar
    D->>A1: Mensaje + canal publico + materia Alg II
    A1->>A1: Clasifica caso mixto (regla + caso personal)
    A1->>A6: Consulta administrativa sobre recuperatorio
    A6->>CS: Lee regla publicada de recuperatorios
    CS-->>A6: Hay recuperatorio con justificacion (72 hs)
    A6-->>A1: Regla general + derivacion a docente/bedelia
    A1->>PF: Sanea borrador para canal publico
    PF-->>D: Respuesta saneada
    D-->>E: Regla general (citada) + deriva el caso particular a humano
```

---

## 4. Escenario C — Consulta mixta o ambigua

**Tensión:** un mismo mensaje mezcla **tres frentes** (teoría + administrativo + práctica con código). El sistema debe **descomponer**, tratar en un **orden fijo** y devolver **una sola respuesta sin contradicciones**.

**Contexto:** *Programación II*, **DM**. El **TP de árboles** está activo (evaluable). El alumno manda un bloque de código.

**Paso a paso (descomposición de orden fijo, Entregable 2 §8):**

1. **Estudiante (DM):** *"no entiendo bien los árboles AVL, además ¿cuándo se entrega el TP de árboles? y de paso, este recorrido *inorder* no me da bien, ¿por qué?"* + **bloque de código**. (La parte de código es una **duda conceptual**, no un pedido de resolver el entregable.)
2. **Gateway + pipeline de código:** extrae y valida el código.
3. **A1 Frontier:** detecta **mezcla** (teoría + admin + práctica). Aplica el **orden fijo**: primero filtros de política, después dominios, y **ensambla** al final.
4. **(1) A5 Evaluative Guard** (filtro de política sobre la parte práctica): el **TP de árboles** está activo, pero el código es una **duda conceptual** (no pide resolver el entregable) → `is_evaluative = false`. Habilita el frente de práctica.
5. **(2) A6 Admin Info:** devuelve la **fecha de entrega** publicada del TP de árboles (citando la fuente).
6. **(3) A2 Theory:** explica **AVL** anclado en la KB (con cita de fuente), al nivel del alumno.
7. **(4) A3 Practice → A4 Scaffolding:** A3 analiza el bug por **categorías de error** (sin reescribir la solución) y **A4** controla la **densidad** del borrador antes de publicar.
8. **A1 ensambla** una **única** respuesta ordenada: explicación de AVL → fecha de entrega → orientación del código (aclarando que no resuelve el TP). Verifica que las partes **no se contradigan** (p. ej. que la orientación no "resuelva" lo que la regla del evaluable impide).
9. **Publicación (DM)** y registro de avances en **A8**.

**Cómo evita respuestas contradictorias:** hay **un solo integrador** (A1) que arma la respuesta final; los especialistas no publican en paralelo. El orden fijo (política → admin → teoría → práctica) garantiza que el filtro evaluable de A5 ya esté aplicado **antes** de que la parte de código se redacte.

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord Gateway
    participant CP as Pipeline de codigo (infra)
    participant A1 as A1 Frontier
    participant A5 as A5 Eval Guard
    participant A6 as A6 Admin Info
    participant A2 as A2 Theory
    participant A3 as A3 Practice
    participant A4 as A4 Scaffolding

    E->>D: DM, AVL + fecha de entrega del TP + por que falla este inorder (+ bloque)
    D->>CP: Extrae codigo
    CP->>A1: Codigo limpio + mensaje
    A1->>A1: Detecta mezcla y descompone (orden fijo)
    A1->>A5: (1) Dictamen sobre la parte practica
    A5-->>A1: is_evaluative false (duda conceptual, no pide resolver el TP)
    A1->>A6: (2) Fecha de entrega del TP
    A6-->>A1: Fecha publicada (citada)
    A1->>A2: (3) Explicacion de AVL anclada en KB
    A2-->>A1: Explicacion + cita de fuente
    A1->>A3: (4) Analisis del bug conceptual (no evaluable)
    A3->>A4: draft con pistas, sin solucion
    A4-->>A1: Orientacion recortada
    A1->>A1: Ensambla una sola respuesta sin contradicciones
    A1-->>D: Respuesta unificada (teoria + fecha + orientacion)
    D-->>E: Respuesta coherente
```

---

## 5. Cobertura de los siete bloques funcionales

Los tres escenarios atacan las tensiones exigidas; el resto de los bloques quedan ejercitados aquí o en ejemplos de otros entregables, sin inventar escenarios triviales:

| Bloque funcional | Dónde se ejercita |
|---|---|
| 1. Apoyo teórico | Escenario C (AVL) |
| 2. Apoyo práctico / código | Escenarios A y C |
| 3. Autoevaluación (quiz) | Ejemplo del [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md) (quiz de pilas) |
| 4. Información administrativa | Escenarios B y C |
| 5. Acompañamiento / organización | Ejemplo de contacto proactivo del [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md) (A9) |
| 6. Feedback estudiante → docente | Cierre del Escenario A (encuesta de A10) |
| 7. Memoria entre sesiones y seguimiento | Registro en A y C; seguimiento en el [Entregable 4](04-memoria-entre-sesiones-y-seguimiento.md) |

## 6. Síntesis

Los tres escenarios muestran la coordinación en acción y son **coherentes** con el modelo de los entregables anteriores: en **A**, la restricción la sostienen **A5** (gate del evaluable) y la **postura de A1**, que declina la solución y ofrece ayuda conceptual; en **B**, A1+A6 trazan la frontera regla pública/caso particular y **derivan** a humano citando la fuente; en **C**, A1 **descompone** una consulta multi-dominio en orden fijo, **A3→A4** acota la ayuda de código no evaluable, y A1 **ensambla** una sola respuesta sin contradicciones. Los diagramas de secuencia hacen explícito el **orden temporal** y las **derivaciones**, que un diagrama de bloques ocultaría.
