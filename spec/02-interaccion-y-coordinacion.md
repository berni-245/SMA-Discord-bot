# Entregable 2 — Interacción y coordinación

## 1. Mecanismo de coordinación

La coordinación combina un **coordinador reactivo** (A1), especialistas y políticas deterministas:

1. El Gateway recibe un mensaje explícitamente dirigido al bot.
2. `Auth/Role Check` y `SubjectRouter` fijan usuario, rol, canal y `subject_id`.
3. A1 ejecuta frontera de seguridad e intención: aplica `SafetyClassifier`, detecta comandos explícitos, revisa cambio de materia/privacidad y lee en STM el `conversation_owner_agent` anterior.
4. Si `crisis_level` es `self_harm_ambiguous`, `self_harm_explicit` o `imminent_risk`, A1 activa `CrisisEscalationProtocol` antes de cualquier flujo pedagógico.
5. A1 decide la intención del turno. Si la intención continúa claramente en el scope del último agente, puede derivar directo a ese agente; si no, reorquesta.
6. En práctica/código, `OutputPolicy` fija `assistance_mode` antes de derivar a A2.
7. Los agentes producen un borrador o decisión. Si el agente invocado detecta baja confianza o que el turno no pertenece a su scope, devuelve `handoff_required=true` a A1.
8. `OutputPolicy` valida privacidad y restricción pedagógica sobre la salida.
9. `OutboundDispatcher` publica bajo la única identidad Discord del bot.

Los aportes docentes entran directamente a A6; los ticks de seguimiento (2–5 días post-sesión) entran a A4. No necesitan atravesar A1.

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
| Señal de autolesión, ideación suicida o riesgo humano urgente | A1 | `CrisisEscalationProtocol` crea o actualiza hilo privado en canal docente de crisis → respuesta de contención → derivación institucional |
| Tick de seguimiento (2–5 días post-sesión)      | A4            | A4 verifica `dm_contactable` → Dispatcher por DM                   |
| `/incorporar-material` o `@bot incorporar` (docente) | A6            | Pipeline `content` → KB Store → confirmación                       |
| `/actualizar-catedra` (docente)                     | A6            | Pipeline `config` → Config Store → confirmación                    |

En un DM sin materia fijada, A1 pregunta la materia antes de invocar especialistas y la conserva en STM durante la sesión. A1 también actualiza en STM el `conversation_owner_agent` cuando una respuesta queda a cargo de A2, A3 o A5.

## 3. Continuidad con último agente

El sistema no reinterpreta toda la conversación desde cero si hay continuidad clara, pero tampoco saltea la frontera A1. El ruteo usa un modelo "sticky con preflight":

1. A1 siempre recibe el turno ya autenticado y con materia resuelta.
2. A1 aplica `SafetyClassifier` y detecta comandos o cambios obvios de intención.
3. Si no hay crisis, comando, cambio de materia ni conflicto de privacidad, A1 consulta STM:

| Campo STM | Uso |
| --- | --- |
| `conversation_owner_agent` | Agente que atendió el turno anterior (`A2`, `A3` o `A5`) |
| `active_intent` | Intención vigente (`teoria`, `codigo`, `admin`, `feedback`, etc.) |
| `last_turn_at` | Permite cortar continuidad cuando vence la sesión |
| `confidence` | Señal para mantener o reorquestar |

Si el turno parece continuidad del mismo tema, A1 deriva al `conversation_owner_agent`. Si el agente receptor no puede atender, responde con:

```json
{
  "handled": false,
  "handoff_required": true,
  "handoff_reason": "fuera_de_scope | baja_confianza | cambio_de_intencion | crisis_detectada",
  "suggested_target": "A1 | A2 | A3 | A5 | CrisisEscalationProtocol"
}
```

A1 retoma el control y decide el destino final. A2 actúa como segunda barrera de seguridad porque es quien suele sostener conversaciones largas con estudiantes; si detecta señales de crisis en un turno que le llegó por continuidad, no responde como tutor y devuelve `crisis_detectada`.

## 4. Política de ayuda práctica

`OutputPolicy` consulta las evaluativas activas de Config Store y determina la postura para el pedido actual:

| `assistance_mode` | Situación                                | A2 puede producir                                                       |
| ----------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `normal`          | Práctica no entregable                   | Explicación, diagnóstico y próximos pasos                               |
| `guided_only`     | Consulta parcial sobre entregable activo | Categoría de error, pista conceptual o próximo paso; nunca código final |
| `refuse_solution` | Pedido de solución lista para entregar   | Negativa breve y guía conceptual mínima                                 |

La política se aplica a cada respuesta y no consume historial para vigilar secuencias. El estudiante puede preguntar en varios turnos; el límite es no entregar una solución completa en una salida.

## 5. Fuera de dominio y derivación humana

A1 responde los casos fuera de dominio o sin fuentes suficientes:

1. Indica de forma educada que el tema no pertenece al dominio del asistente de la materia.
2. No improvisa una respuesta ajena a sus fuentes.
3. Orienta al canal docente o instancia humana designada si el estudiante necesita resolverlo en relación con la cursada.

A3 aplica la misma derivación para decisiones sobre casos personales, certificados o trámites.

## 6. Crisis de bienestar o riesgo suicida

Este flujo no trata la situación como consulta académica ni como feedback. Si un estudiante expresa autolesión, ideación suicida, desesperación con riesgo explícito, amenaza de daño a sí mismo o a terceros, A1 activa una excepción de seguridad humana. A2 y A5 también pueden detectar el evento como segunda barrera si el turno les llegó por continuidad o por `/feedback`.

`SafetyClassifier` usa estos niveles:

| `crisis_level` | Ejemplo conceptual | Acción |
| --- | --- | --- |
| `none` | Sin señal de crisis | Flujo normal |
| `distress` | Malestar intenso sin autolesión explícita | Contención, orientación humana y pausa temporal de seguimiento automático |
| `self_harm_ambiguous` | "No quiero seguir", "quiero desaparecer" | Crear o actualizar caso |
| `self_harm_explicit` | Expresa autolesión o suicidio | Crear o actualizar caso urgente |
| `imminent_risk` | Menciona método, momento, despedida o riesgo inmediato | Crear o actualizar caso urgente y remarcar prioridad |

Reglas del caso:

1. La clave de deduplicación es `user_id + subject_id`. Si no hay caso activo, `CrisisEscalationProtocol` crea un hilo nuevo en el canal docente privado de crisis. Si ya existe un caso `open`, `acknowledged` o `escalated_to_psychology`, agrega el nuevo mensaje al mismo hilo.
2. El caso conserva `crisis_case_id`, `thread_id`, `first_detected_at`, `last_detected_at`, `max_crisis_level`, `message_count` y estado (`open`, `acknowledged`, `escalated_to_psychology`, `closed`).
3. El hilo incluye el **paquete de crisis** con la transcripción completa disponible de la conversación con ese estudiante en esa materia. Si el chat original sigue existiendo en Discord, igual se adjunta una copia/snapshot al hilo para que la cátedra y el área de psicología puedan analizar el caso sin depender de permisos, borrados o contexto disperso.
4. El bot responde al estudiante con un mensaje breve de contención, sin diagnosticar, orientando a contactar de inmediato a una persona de confianza y a los canales de emergencia o ayuda institucional definidos por la facultad.
5. Los docentes de la cátedra elevan el caso al área de psicología, bienestar estudiantil o guardia institucional según el procedimiento de la facultad.
6. Mientras el caso esté activo, A4 Follow-up queda pausado para ese usuario+materia.

Para `distress` sin autolesión/riesgo explícito no se abre caso, pero A1 registra `safety_hold_until` para que A4 no envíe seguimiento automático durante la ventana definida por la cátedra.

El caso no ingresa a digest, no se usa para evaluación docente, no alimenta memoria pedagógica ordinaria y no se publica en canales públicos. La finalidad es preservar seguridad humana, no monitorear ni sancionar al estudiante.

## 7. Información compartida

| Dato                           | Quién lo produce | Quién lo consume     | Límite                               |
| ------------------------------ | ---------------- | -------------------- | ------------------------------------ |
| `subject_id`, rol, visibilidad | Infraestructura  | Todo agente invocado | Siempre de una sola materia          |
| Chunks KB vigentes             | A6/KB Store      | A2                   | Solo materia activa                  |
| Config vigente                 | A6/Config Store  | A3, OutputPolicy, A4 | Solo datos publicados                |
| Código extraído                | InputExtractor   | A2, OutputPolicy     | Mensaje actual; no se persiste crudo |
| Hechos pedagógicos mínimos     | A2/MemoryStore   | A1, A2, A4           | Por usuario+materia y visibilidad    |
| Feedback voluntario            | A5               | A5/digest docente    | Agregado; no se alimenta desde quiz  |
| Paquete de crisis              | A1/A2/A5 + CrisisEscalationProtocol | Docentes de la cátedra | Solo canal docente privado de crisis; incluye transcripción completa disponible de la conversación del caso |

No circulan transcripciones privadas hacia docentes, datos de otros estudiantes, contenido de otra materia ni señales de vigilancia multi-turno.

La única excepción a la regla anterior es el **escalamiento de crisis**: ante riesgo humano urgente, el sistema puede compartir contenido privado con docentes de la cátedra en un canal restringido, con trazabilidad y finalidad de derivación institucional.

## 8. Roles de usuario

| Superficie                   | Estudiante                                                                | Docente/ayudante                                  |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| Entrada                      | Mención/comando en canal habilitado o DM                                  | `/incorporar-material` o `@bot incorporar` (contenido); `/actualizar-catedra` (fechas/reglas) |
| Capacidades                  | Consultar, autoevaluarse, aportar feedback, controlar memoria/seguimiento | Actualizar KB/Config, recibir digest agregado     |
| Agentes visibles lógicamente | A1, A2, A3, A5; A4 si el seguimiento sigue habilitado y el DM es contactable | A6; digest de A5; hilo privado de crisis para docentes de la cátedra |
| Privacidad                   | DM no se republica sin consentimiento, salvo excepción de crisis humana auditada | No accede a consultas privadas individuales salvo paquete de crisis restringido |

## 9. Flujo de feedback

El estudiante inicia `/feedback` o acepta una encuesta opcional; A1 reconoce ese intent y lo pasa a A5. A5 clasifica el aporte en uno de tres ejes — **cursada** (claridad, ritmo, dificultad), **material** (apuntes, ejemplos, consignas) o **asistente** (utilidad del bot) — porque son dimensiones accionables por la cátedra sin sustituir evaluaciones oficiales ni inferir desempeño desde quizzes.

A5 guarda el aporte con política de anonimato `anonimo` por defecto, conserva crítica honesta, **escala odio o ataques personales a la autoridad designada** (p. ej. `#moderacion-catedra`) y produce un digest **semanal por defecto** si alcanza la muestra mínima, o por solicitud docente. El docente ve período, `N`, anonimato, ejes agregados y comentarios anonimizados. El digest no incluye resultados de quizzes ni actividad inferida.

**Política de anonimato por defecto:** `anonimo`. Los aportes y digests no identifican al estudiante salvo que la cátedra configure `pseudonimo` o `identificado_con_consentimiento` y el estudiante otorgue consentimiento explícito en el flujo de feedback.

## 10. Síntesis

La coordinación mantiene agentes solo donde hay objetivos y posturas diferenciadas. Las invariantes difíciles de equivocarse en implementación (privacidad, modo de ayuda, memoria, envío Discord) se concentran en componentes deterministas inspeccionables.
