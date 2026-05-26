# Entregable 4 — Memoria entre sesiones y seguimiento

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes A8/A9 en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md); aislamiento por materia en el [Entregable 3](03-multi-materia.md).

## 1. Propósito y alcance

**Qué** recuerda entre sesiones (y qué descarta), **dónde** vive, **lectura/escritura** por agentes, **proactivo (A9)** y **control del usuario**. Ejemplo día 1 → seguimiento.

## 2. Dos memorias distintas: intra-sesión vs entre días

([glosario](00-glosario.md)):

| | **Memoria intra-sesión (STM)** | **Persistencia entre sesiones (LTM + Pedagogical Profile)** |
|---|---|---|
| Alcance | Una **sesión** | Entre días / a lo largo de la cursada |
| Contenido | Estado volátil **compartido entre agentes** durante el intercambio | Hechos **pedagógicos longitudinales** |
| Vida | Se **descarta** al cerrar la sesión | **Persiste** hasta expiración o borrado |
| Rol | Coordinación dentro de un turno/conversación | Habilita **seguimiento** y **contacto proactivo** |
| Dueño | **A8** (custodio) | **A8** (custodio) |

STM **no** alimenta A9 (§8).

## 3. Qué se conserva y qué se descarta

**LTM:** dudas (tema, `abierta`/`cerrada`, contacto, **visibilidad de origen**); temas vistos; quizzes; TPs (`stuck`/`en_progreso`/`cerca`); errores recurrentes (categorías); hitos/motivaciones.

**Pedagogical Profile:** estilo, fortalezas, debilidades (incremental).

**No:** STM al cerrar; transcripciones/código crudos (solo hecho pedagógico); off-topic, opiniones sobre docentes, datos sensibles.

> **Decisión explícita.** Seguimiento pedagógico, no reconstrucción de chats → **minimización**.

## 4. Dónde vive la memoria y cómo se lee/actualiza

**A8** único custodio. Capas STM/LTM/Profile; partición **usuario + materia**. `read`: visibilidad (§6), minimización, puede **negar** (A5). `write`: metadata → A8 elige capa.

| Agente | Qué registra en A8 |
|---|---|
| A2 Theory | Dudas y temas cubiertos |
| A3 Practice | Avance en TPs, errores recurrentes |
| A7 Quiz | Resultado de quizzes |
| A9 Follow-up | Contacto proactivo realizado |
| A5 Evaluative Guard | **Nada**: no lee ni escribe |

## 5. Retención, propiedad y auditoría

A8 posee registro. Retención **1 cursada + 6 meses** → **borrado** al expirar. Log sin contenido. Comandos (vía A1): `/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, opt-out (`no_proactive_use`), borrado con confirmación.

## 6. Visibilidad de origen: la privacidad por canal dentro de la memoria

`publico` / `privado` / `dm`. En público A8 **omite** privado/dm (resumen genérico máximo). DM no filtra a público salvo **transferencia explícita y consentida**.

## 7. Contacto proactivo (A9)

Scheduler → A9. Disparadores (A8+Config): duda abierta >N días; quiz fallado; TP `stuck`; hito ~7 días. `frecuencia_max` (1/semana), un mensaje/oportunidad, `horarios_silencio`. DM default; `mention_publico` sin detalle privado. Opt-out primero; primer contacto con salida fácil. Tono suave, sin notas.

## 8. Por qué la STM no participa del seguimiento

Solo LTM+Profile. STM = coordinación volátil; mezclar borra frontera rato vs cursada.

## 9. Ejemplo breve: día 1 → seguimiento (mini-escenario)

**Programación II**, **DM**. Día 1: quiz pilas, falla LIFO → A7 escribe A8 (`pilas-LIFO`, `resultado=false`, `origen=dm`). +4 días: A9 lee oportunidad, chequea opt-out/rate/silencio, contacta por DM:

> "Hola, hace unos días vimos pilas y quedaste con una duda sobre cómo cambia el tope después de varios `push`/`pop`. ¿La retomamos con otro ejemplo, o preferís repasar primero el material? Si por ahora no, sin problema — decime si preferís que no te escriba más sobre esto."

Registra contacto. Respeta: DM, un mensaje, opt-out, sin notas, continuidad sin reemplazar docente.

## 10. Síntesis

STM vs LTM+Profile en **A8**; minimización; retención acotada; visibilidad de origen; **A9** solo entre días, acotado.
