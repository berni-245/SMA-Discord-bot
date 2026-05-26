# Entregable 6 — Escenarios y trazabilidad

> [E0](00-glosario.md) · [E1](01-inventario-y-justificacion-de-agentes.md) · [E2](02-interaccion-y-coordinacion.md) · [E3](03-multi-materia.md) · [E4](04-memoria-entre-sesiones-y-seguimiento.md) · [E5](05-conexion-con-discord.md)

## 1. Propósito y alcance

Tres escenarios obligatorios por **tensión**: **A** pedagogía↔evaluable; **B** regla pública↔caso particular; **C** multi-dominio↔respuesta única. Cada uno: pasos + **diagrama de secuencia**. *Prog II* / *Álgebra II* ilustrativas (E3).

## 2. Escenario A — Programación y restricción pedagógica

**Tensión:** solución entregable de evaluable activo en un turno → ayuda sin entregar solución. **Contexto:** *Prog II*, DM, TP1 activo (ej. 3).

1. DM: código + pedido resolver ej. 3 TP1.
2. Infra: extrae código.
3. **A1:** `apoyo_practico`; A8 contexto; → **A5**.
4. **A5:** `is_evaluative=true` (TP1, ej. 3); sin redactar.
5. **A1:** no A3; declina; concepto → **A2**.
6. **A2:** concepto KB + cita; sin procedimiento entregable.
7. **A1:** ensambla declina + concepto + reconduce docentes.
8. **A8** `stuck`; opc. **A10** encuesta. Anti sobre-entrega: **A5**+postura **A1**/**A2**; **A4** en no evaluable (C).

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord Gateway
    participant CP as Pipeline de codigo (infra)
    participant A1 as A1 Frontier
    participant A8 as A8 Memory
    participant A5 as A5 Eval Guard
    participant A2 as A2 Theory

    E->>D: DM con bloque de codigo + pedido de resolver el ej 3 del TP1
    D->>CP: Detecta bloque de codigo
    CP->>A1: Codigo limpio + mensaje (materia Prog II por servidor)
    A1->>A8: read contexto (DM, memoria completa)
    A8-->>A1: Extracto pedagogico
    A1->>A5: Dictamen sobre apoyo_practico
    A5-->>A1: is_evaluative true (TP1 activo, pide resolver ej 3)
    A1->>A1: No deriva a A3 (evaluable activo)
    A1->>A2: Deriva solo el concepto subyacente (no la resolucion)
    A2-->>A1: Explicacion conceptual + cita de fuente
    A1-->>D: Declina el ejercicio + explica el concepto + reconduce
    D-->>E: Recibe ayuda conceptual, sin la solucion del entregable
    A1->>A8: write avance (TP1, stuck)
```

## 3. Escenario B — Administrativo y límite institucional

**Tensión:** regla + caso particular → regla general, derivar humano. **Contexto:** *Álgebra II*, público @bot.

1. Pregunta recuperatorio por enfermedad.
2. Infra: verificado, Alg II, público → A1.
3. **A1:** caso mixto → **A6**.
4. **A6:** regla Config (ej. 72 h justificación) + derivación docente/bedelía.
5. **Privacy Filter:** sanea (sin sensibles).
6. Publica regla citada + frontera (no valida certificados).

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

## 4. Escenario C — Consulta mixta o ambigua

**Tensión:** teoría+admin+práctica → orden fijo, una respuesta. **Contexto:** *Prog II*, DM, TP árboles activo; código = duda conceptual.

1. Mensaje AVL + fecha TP + bug inorder + código.
2. Infra → A1: mezcla, orden fijo (E2 §8).
3. **A5:** `is_evaluative=false`.
4. **A6:** fecha citada.
5. **A2:** AVL + cita.
6. **A3→A4:** bug por categorías; densidad acotada.
7. **A1** ensambla AVL→fecha→código (sin resolver TP); **A8** registra. Un integrador; A5 antes de redactar código.

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

## 5. Escenario D (opcional) — Acompañamiento, autoevaluación, feedback y seguimiento

Bloques 3/5/6/7 no cubiertos por A/B/C. *Prog II*, DM.

1. Orientación: A1 → A6 fechas + A2 entrada (A8); ensambla.
2. Quiz: A7 → A8, métrica A10.
3. A10 encuesta (cooldown).
4. +N días: A9 scheduler, duda abierta + parcial, DM opt-out. Ver [E4](04-memoria-entre-sesiones-y-seguimiento.md).

```mermaid
sequenceDiagram
    actor E as Estudiante
    participant D as Discord Gateway
    participant A1 as A1 Frontier
    participant A6 as A6 Admin Info
    participant A2 as A2 Theory
    participant A7 as A7 Quiz
    participant A10 as A10 Feedback
    participant A9 as A9 Follow-up

    E->>D: DM, no se que repasar para el parcial
    D->>A1: Mensaje (intent orientacion)
    A1->>A6: Checklist y fechas (Config Store)
    A1->>A2: Punto de entrada segun lo visto
    A1-->>D: Orientacion ensamblada (acompanamiento)
    D-->>E: Que repasar + por donde empezar
    E->>D: Pido un quiz del tema
    D->>A7: Genera quiz
    A7-->>D: Pregunta corta
    E->>D: Responde
    D->>A7: Evalua
    A7-->>D: Feedback orientativo
    A7->>A10: Metrica de resolucion
    A10-->>D: Encuesta breve (te sirvio?)
    Note over E,A9: Pasan varios dias
    A9->>A9: Detecta duda abierta + parcial proximo
    A9-->>D: DM recordatorio suave + salida facil
    D-->>E: Seguimiento sobre el mismo tema
```

## 6. Cobertura de los siete bloques funcionales

| Bloque | Dónde |
|---|---|
| 1. Teoría | C (AVL) |
| 2. Práctica/código | A, C |
| 3. Quiz | **D**, [E4](04-memoria-entre-sesiones-y-seguimiento.md) |
| 4. Admin | B, C, D |
| 5. Acompañamiento | **D**, [E4](04-memoria-entre-sesiones-y-seguimiento.md) |
| 6. Feedback | **D**, cierre A |
| 7. Memoria/seguimiento | **D**, A/C, [E4](04-memoria-entre-sesiones-y-seguimiento.md) |

## 7. Síntesis

**A:** A5 gate + A1/A2 concepto. **B:** A6 regla citada, deriva particular. **C:** orden fijo, A3→A4, ensamblaje A1. Diagramas = orden temporal y derivaciones.
