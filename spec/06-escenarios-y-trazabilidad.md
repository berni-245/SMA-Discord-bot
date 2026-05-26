# Entregable 6 — Escenarios y trazabilidad

## 1. Escenario A — Código de evaluativa activa

**Contexto:** DM de Programación II; el estudiante ya seleccionó esa materia en la sesión. TP1 está activo.

1. El estudiante envía un bloque de código y pide: “pasame resuelto el ejercicio 3 del TP1”.
2. `InputExtractor` valida el bloque; `MemoryStore` aporta solo la materia elegida en STM.
3. A1 reconoce apoyo práctico y solicita la postura de salida.
4. `OutputPolicy` lee Config Store, identifica el TP activo y deriva a A2 con `refuse_solution`.
5. A2 rechaza producir una solución lista para entregar, pero señala una categoría de error o una pista mínima.
6. Dispatcher responde por DM y `MemoryStore` registra `tema=TP1`, `estado=stuck`, sin código crudo.

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord/Dispatcher
    participant I as InputExtractor
    participant A1 as A1 Frontier
    participant OP as OutputPolicy
    participant A2 as A2 Tutor
    participant M as MemoryStore
    E->>D: DM con codigo + pedi resolver TP1
    D->>I: Extraer codigo
    I->>A1: Mensaje y codigo validado
    A1->>M: Materia elegida en STM
    M-->>A1: Programacion II
    A1->>OP: Evaluar postura
    OP-->>A2: refuse_solution
    A2-->>D: Negativa + pista conceptual minima
    D-->>E: Orientacion sin solucion entregable
    A2->>M: Guardar hecho pedagogico minimo
```

## 2. Escenario B — Regla general y caso particular

**Contexto:** canal público de Álgebra II; el estudiante menciona al bot: “me enfermé el día del parcial, ¿puedo recuperarlo?”.

1. SubjectRouter fija Álgebra II por el servidor.
2. A1 detecta información administrativa con caso personal.
3. A3 lee la regla vigente de recuperatorios en Config Store.
4. A3 redacta únicamente la regla general citada y deriva la evaluación del certificado o habilitación a docente/bedelía.
5. `OutputPolicy` confirma que la salida pública no contenga dato privado; Dispatcher publica.

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord/Dispatcher
    participant A1 as A1 Frontier
    participant A3 as A3 Admin
    participant C as Config Store
    participant OP as OutputPolicy
    E->>D: @bot puedo recuperar si me enferme
    D->>A1: canal publico, Algebra II
    A1->>A3: Regla general + caso particular
    A3->>C: Recuperatorios vigentes
    C-->>A3: Regla publicada
    A3->>OP: Borrador con cita y derivacion
    OP-->>D: Salida publica aprobada
    D-->>E: Regla general + consultar a humano
```

## 3. Escenario C — Consulta mixta con ayuda parcial

**Contexto:** DM de Programación II. El TP de árboles está activo. El estudiante pregunta qué es AVL, cuándo entrega y por qué su recorrido `inorder` falla, adjuntando código.

1. A1 separa intención pedagógica y administrativa.
2. A3 obtiene la fecha publicada desde Config Store.
3. `OutputPolicy` marca la revisión del código como `guided_only`, porque es consulta parcial sobre un TP activo.
4. A2 explica AVL con cita de KB, propone diagnóstico conceptual del código y no reescribe la solución.
5. A1 ensambla explicación, fecha y orientación en una sola respuesta; Dispatcher la envía por DM.

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant A1 as A1 Frontier
    participant A3 as A3 Admin
    participant OP as OutputPolicy
    participant A2 as A2 Tutor
    participant D as Discord/Dispatcher
    E->>A1: AVL + fecha TP + codigo inorder
    A1->>A3: Consultar fecha
    A3-->>A1: Fecha citada
    A1->>OP: Revisar ayuda sobre TP activo
    OP-->>A2: guided_only
    A2-->>A1: Teoria + pista de debugging
    A1-->>D: Respuesta unica ensamblada
    D-->>E: Fecha + explicacion + guia parcial
```

## 4. Escenario D — Feedback y seguimiento

1. En DM, el estudiante pide un quiz de pilas; A2 lo genera y ofrece devolución orientativa.
2. El estudiante usa `/feedback`; A1 lo enruta a A5, que registra voluntariamente su comentario para un digest agregado.
3. El estudiante ejecuta `/seguimiento activar`; A1 lo enruta a MemoryStore, que guarda consentimiento.
4. Días después, Scheduler invoca A4 por una duda abierta; A4 redacta un DM suave.
5. Dispatcher envía el DM o registra fallo, sin publicar nada en el servidor.

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant A1 as A1 Frontier
    participant A2 as A2 Tutor
    participant A5 as A5 Feedback
    participant M as MemoryStore
    participant A4 as A4 Follow-up
    participant D as Discord/Dispatcher
    E->>A1: Quiero un quiz de pilas
    A1->>A2: Generar autoevaluacion
    A2-->>D: Pregunta y devolucion orientativa
    D-->>E: Quiz y orientacion
    E->>A1: /feedback comentario voluntario
    A1->>A5: Registrar feedback voluntario
    A5->>A5: Guardar para digest agregado
    E->>A1: /seguimiento activar
    A1->>M: Registrar opt-in
    M-->>D: Confirmacion de opt-in
    D-->>E: Seguimiento activado
    Note over M,A4: Pasan dias
    M->>A4: Oportunidad consentida
    A4-->>D: DM suave de continuidad
    D-->>E: Seguimiento o fallo registrado
```

## 5. Cobertura

| Funcionalidad | Escenario |
|---|---|
| Teoría | C |
| Práctica y código | A, C |
| Autoevaluación | D |
| Administrativo | B, C |
| Acompañamiento | C, D |
| Feedback docente | D |
| Memoria y proactividad | D |

Los escenarios trazan las decisiones críticas: ayuda graduada sin vigilancia, derivación humana, ingreso de código concreto, feedback voluntario, materia resuelta correctamente en DM y seguimiento consentido.
