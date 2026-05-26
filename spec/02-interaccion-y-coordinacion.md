# Entregable 2 — Interacción y coordinación

## 1. Mecanismo de coordinación

La coordinación combina un **coordinador reactivo** (A1), especialistas y políticas deterministas:

1. El Gateway recibe un mensaje explícitamente dirigido al bot.
2. `Auth/Role Check` y `SubjectRouter` fijan usuario, rol, canal y `subject_id`.
3. A1 clasifica la intención del estudiante.
4. En práctica/código, `OutputPolicy` fija `assistance_mode` antes de derivar a A2.
5. Los agentes producen un borrador o decisión.
6. `OutputPolicy` valida privacidad y restricción pedagógica sobre la salida.
7. `OutboundDispatcher` publica bajo la única identidad Discord del bot.

Los aportes docentes entran directamente a A6; los ticks consentidos de seguimiento entran a A4. No necesitan atravesar A1.

## 2. Primer interviniente y ruteo

| Evento                                          | Primer agente | Ruta                                                               |
| ----------------------------------------------- | ------------- | ------------------------------------------------------------------ |
| Teoría, quiz o checklist                        | A1            | A1 → A2 → OutputPolicy → Dispatcher                                |
| Práctica o código                               | A1            | A1 → OutputPolicy (modo) → A2 → OutputPolicy (salida) → Dispatcher |
| Pedido de solución de TP o código de evaluativa | A1            | OutputPolicy fija modo → A2 guía dentro del modo → Dispatcher      |
| Fecha, modalidad o regla general                | A1            | A1 → A3 → Dispatcher                                               |
| Consulta mixta pedagógica + administrativa      | A1            | A2 + A3 → A1 ensambla → Dispatcher                                 |
| `/feedback` o encuesta aceptada del estudiante  | A1            | A1 → A5 registra/modera; digest docente posterior                  |
| `/seguimiento activar` o desactivar             | A1            | `MemoryStore` actualiza preferencia y confirma                     |
| Tick de seguimiento con opt-in                  | A4            | A4 → Dispatcher por DM                                             |
| `/incorporar-material` docente                  | A6            | A6 → KB/Config → confirmación docente                              |

En un DM sin materia fijada, A1 pregunta la materia antes de invocar especialistas y la conserva en STM durante la sesión.

## 3. Política de ayuda práctica

`OutputPolicy` consulta las evaluativas activas de Config Store y determina la postura para el pedido actual:

| `assistance_mode` | Situación                                | A2 puede producir                                                       |
| ----------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `normal`          | Práctica no entregable                   | Explicación, diagnóstico y próximos pasos                               |
| `guided_only`     | Consulta parcial sobre entregable activo | Categoría de error, pista conceptual o próximo paso; nunca código final |
| `refuse_solution` | Pedido de solución lista para entregar   | Negativa breve y guía conceptual mínima                                 |

La política se aplica a cada respuesta y no consume historial para vigilar secuencias. El estudiante puede preguntar en varios turnos; el límite es no entregar una solución completa en una salida.

## 4. Fuera de dominio y derivación humana

A1 responde los casos fuera de dominio o sin fuentes suficientes:

1. Indica de forma educada que el tema no pertenece al dominio del asistente de la materia.
2. No improvisa una respuesta ajena a sus fuentes.
3. Orienta al canal docente o instancia humana designada si el estudiante necesita resolverlo en relación con la cursada.

A3 aplica la misma derivación para decisiones sobre casos personales, certificados o trámites.

## 5. Información compartida

| Dato                           | Quién lo produce | Quién lo consume     | Límite                               |
| ------------------------------ | ---------------- | -------------------- | ------------------------------------ |
| `subject_id`, rol, visibilidad | Infraestructura  | Todo agente invocado | Siempre de una sola materia          |
| Chunks KB vigentes             | A6/KB Store      | A2                   | Solo materia activa                  |
| Config vigente                 | A6/Config Store  | A3, OutputPolicy, A4 | Solo datos publicados                |
| Código extraído                | InputExtractor   | A2, OutputPolicy     | Mensaje actual; no se persiste crudo |
| Hechos pedagógicos mínimos     | A2/MemoryStore   | A1, A2, A4           | Por usuario+materia y visibilidad    |
| Feedback voluntario            | A5               | A5/digest docente    | Agregado; no se alimenta desde quiz  |

No circulan transcripciones privadas hacia docentes, datos de otros estudiantes, contenido de otra materia ni señales de vigilancia multi-turno.

## 6. Roles de usuario

| Superficie                   | Estudiante                                                                | Docente/ayudante                                  |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| Entrada                      | Mención/comando en canal habilitado o DM                                  | `/incorporar-material` o mención en canal docente |
| Capacidades                  | Consultar, autoevaluarse, aportar feedback, controlar memoria/seguimiento | Actualizar KB/Config, recibir digest agregado     |
| Agentes visibles lógicamente | A1, A2, A3, A5; A4 si dio opt-in                                          | A6; digest de A5                                  |
| Privacidad                   | DM no se republica sin consentimiento                                     | No accede a consultas privadas individuales       |

## 7. Flujo de feedback

El estudiante inicia `/feedback` o acepta una encuesta opcional; A1 reconoce ese intent y lo pasa a A5. A5 guarda el aporte con la política de anonimato, filtra abuso sin borrar críticas legítimas y produce un digest **semanal por defecto** si alcanza la muestra mínima, o por solicitud docente explícita. El docente ve período, cantidad de respuestas, política de anonimato, temas agregados y comentarios anonimizados. El digest no incluye resultados de quizzes ni actividad inferida.

**Política de anonimato por defecto:** `anonimo`. Los aportes y digests no identifican al estudiante salvo que la cátedra configure `pseudonimo` o `identificado_con_consentimiento` y el estudiante otorgue consentimiento explícito en el flujo de feedback. Esa postura es la predeterminada de A5 y de los digests docentes.

## 8. Síntesis

La coordinación mantiene agentes solo donde hay objetivos y posturas diferenciadas. Las invariantes difíciles de equivocarse en implementación (privacidad, modo de ayuda, memoria, envío Discord) se concentran en componentes deterministas inspeccionables.
