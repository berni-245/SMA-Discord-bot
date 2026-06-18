# Entregable 5 — Conexión con Discord

## 1. Representación

El sistema es **una aplicación de bot** presente en el servidor de cada materia. Los seis agentes son roles internos; no poseen identidades ni permisos Discord propios. El `OutboundDispatcher` es el único componente que envía mensajes.

| Espacio                         | Entrada admitida                                              | Visibilidad               | Uso                                 |
| ------------------------------- | ------------------------------------------------------------- | ------------------------- | ----------------------------------- |
| Canal de estudiantes            | `@bot` o comando                                              | Pública para sus lectores | Consultas y respuestas públicas     |
| DM estudiante-bot               | Mensaje o comando                                             | Privada                   | Código sensible, quiz y seguimiento |
| Canal docente de aporte         | `/incorporar-material`, `@bot incorporar` o `/actualizar-catedra` por rol autorizado | Docentes escriben; estudiantes leen | Contenido → KB; datos cátedra → Config |
| Canal docente privado de digest | Publicación del bot                                           | Docentes                  | Digest agregado de A5               |
| Canal docente privado de crisis | Hilo creado o actualizado por el bot ante evento de crisis    | Docentes de la cátedra | Escalamiento a psicología/bienestar |

Un hilo hereda la visibilidad del canal padre y se etiqueta `publico`. Un canal restringido por rol también es `publico` entre quienes pueden leerlo; no equivale a un `dm`.

## 2. Sensores, actuadores y comandos

- **Gateway** recibe menciones, comandos y DMs dirigidos al bot.
- **Auth/Role Check** valida acceso y que un aporte docente venga de `docente` o `ayudante`.
- **SubjectRouter** fija materia por servidor o solicita materia en DM.
- **OutboundDispatcher** publica respuestas y captura errores de entrega.
- **DM Contact Check** verifica si el estudiante puede recibir mensajes privados del bot antes de considerar entregable el seguimiento.
- **CrisisEscalationProtocol** crea o actualiza un hilo privado por caso en el canal docente de crisis y registra la derivación institucional.

Comandos previstos: `/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, `/seguimiento activar`, `/seguimiento desactivar`, `/activar-dm`, `/feedback`, `/checklist`, `/incorporar-material` y **`/actualizar-catedra`** (docentes).

## 3. Matriz agente-ambiente

**P** = percibe un evento del ambiente dirigido a su función. **(P)** = recibe internamente contexto saneado desde A1 o infraestructura. **B** = produce borrador o decisión. La escritura efectiva siempre corresponde a Dispatcher.

| Agente                     | Canal estudiante               | DM estudiante                | Canal docente de aporte | Canal docente de digest | Canal docente de crisis |
| -------------------------- | ------------------------------ | ---------------------------- | ----------------------- | ----------------------- | ----------------------- |
| A1 Frontier                | P / B                          | P / B                        | —                       | —                       | B alerta vía protocolo  |
| A2 Tutor                   | (P) / B vía A1                 | (P) / B vía A1               | —                       | —                       | —                       |
| A3 Admin                   | (P) / B vía A1                 | (P) / B vía A1               | —                       | —                       | —                       |
| A4 Follow-up               | —                              | (P) / B si seguimiento habilitado y DM contactable | —                       | —                       | —                       |
| A5 Feedback                | (P) / B vía A1 por `/feedback` | (P) / B vía A1 si voluntario | —                       | B digest                | B alerta vía protocolo si el feedback contiene riesgo humano |
| A6 Knowledge Curator       | —                              | —                            | P / B confirmación      | —                       | —                       |
| OutboundDispatcher (infra) | Escribe                        | Escribe o registra fallo     | Escribe confirmación    | Escribe digest          | Crea hilo y publica paquete de crisis |

Las celdas `—` son prohibiciones de diseño: A6 no lee canales de estudiantes; A2/A3/A4 no leen el canal docente; A5 no lee conversaciones para inferir feedback. Ningún agente escribe directamente: incluso sus borradores autorizados pasan por `OutputPolicy` y `OutboundDispatcher`. El canal docente de crisis solo recibe casos por `CrisisEscalationProtocol`, no por digest ni por monitoreo pasivo.

## 4. Ingesta docente y vigencia

El canal docente (p. ej. `#material-catedra`) distingue **dos comandos** que activan pipelines distintos en A6:

| Comando | Pipeline | Destino | Qué valida |
| --- | --- | --- | --- |
| `/incorporar-material`, `@bot incorporar` | `content` (**default**) | KB Store | Material pedagógico: apuntes, bibliografía, explicaciones, programas, adjuntos |
| `/actualizar-catedra` | `config` | Config Store | Datos estructurados de cátedra: fechas, modalidad, reglas, evaluativas activas |

Por defecto todo entra como **contenido** en KB, aunque mencione fechas o reglas. Esos datos **no** se parsean ni versionan en Config sin `/actualizar-catedra`. Si A6 detecta intención administrativa en el camino default, **sugiere** ese comando en la confirmación, pero **no descarta** el aporte.

Correcciones en Config requieren `/actualizar-catedra`; correcciones de apuntes, `/incorporar-material`. Ante conflicto ambiguo en config → `pendiente_confirmacion` y pregunta al docente.

Así, la fecha que A3 responde y las evaluativas que `OutputPolicy` controla provienen **solo** del pipeline `config`, no de material libre en KB.

## 5. Privacidad pública y DM

- En canales `publico`, el bot solo responde a evento dirigido y `OutputPolicy` impide mezclar datos de origen `dm`.
- Un dato nacido en `dm` no aparece en una respuesta `publico` ni en un digest identificable.
- A4 solo envía seguimiento por DM con seguimiento habilitado (default) y `dm_contactable=true`; ante fallo no existe fallback público.
- A5 entrega a docentes feedback agregado y voluntario, no transcripciones ni resultados de quizzes.
- **Transferencia consentida:** si el estudiante pide explícitamente compartir un fragmento de DM en un canal `publico`, A1 valida el pedido, `OutputPolicy` autoriza solo ese fragmento y Dispatcher publica con trazabilidad.
- **Excepción de crisis:** si un mensaje de `dm` o `publico` contiene señales de autolesión, ideación suicida o riesgo humano urgente, el sistema no lo republica en canales estudiantiles, pero sí crea o actualiza un hilo restringido en el canal docente de crisis con el paquete de crisis y la transcripción completa disponible de la conversación con ese estudiante en esa materia.

## 6. Hilos de crisis para cátedra

El canal docente privado de crisis funciona como una bandeja de casos, no como digest ni como feedback:

1. `SafetyClassifier` asigna `crisis_level`.
2. `CrisisCaseStore` busca caso activo por `user_id + subject_id`.
3. Si no existe caso activo, Dispatcher crea un hilo nuevo en el canal docente de crisis.
4. Si ya existe caso `open`, `acknowledged` o `escalated_to_psychology`, Dispatcher agrega el nuevo mensaje al mismo hilo y actualiza `max_crisis_level`.
5. El hilo contiene usuario, materia, timestamps, canal de origen, nivel detectado, mensaje detonante, respuesta del bot y transcripción completa disponible de la conversación.
6. Los docentes de la cátedra usan ese hilo para elevar el caso al área de psicología/bienestar de la facultad y luego marcar estado `acknowledged`, `escalated_to_psychology` o `closed`.

Aunque el chat original exista en Discord, el snapshot en el hilo evita depender de mensajes borrados, permisos del canal original o contexto distribuido entre DM/hilo/canal.

## 7. Contactabilidad por DM

El diseño no asume que todos los estudiantes puedan recibir DMs del bot. Algunos pueden tener bloqueados los mensajes privados de miembros del servidor o reglas de privacidad equivalentes; por eso el seguimiento requiere una etapa de habilitación:

1. Si el estudiante interactúa primero por DM, Dispatcher marca `dm_contactable=true`.
2. Si el estudiante interactúa en canal `publico`, A1 informa una sola vez que el seguimiento privado requiere abrir DM con el bot o ejecutar `/activar-dm`.
3. `/activar-dm` intenta abrir/enviar un mensaje privado mínimo. Si se entrega, queda `dm_contactable=true`; si falla, queda `dm_contactable=false` y el bot explica en el canal donde se invocó el comando que no pudo habilitar el privado, sin mencionar dudas ni historial.
4. Si la plataforma exigiera una relación de contacto o amistad para habilitar DMs, esa acción queda como paso manual del estudiante antes de `/activar-dm`. No se modela como obligación pedagógica ni como permiso para publicar seguimiento en canales públicos.

Este paso separa consentimiento de seguimiento (`follow_up_enabled`) de posibilidad técnica de entrega (`dm_contactable`).

## 8. Ingreso de código

Mecanismos base admitidos:

1. Bloque de código en el mensaje actual dirigido al bot.
2. Adjunto de texto en ese mensaje (`.py`, `.java`, `.c`, `.js`, `.txt` u otro formato textual validable).

No se aceptan en el flujo base enlaces a mensajes previos ni capturas: ampliarían permisos/historial o impedirían análisis textual confiable.

Se fija un límite conceptual configurable de tamaño (por ejemplo, 100 KB o 2000 líneas). Si el adjunto no es textual, excede el límite, está ilegible o el estudiante pide analizar código pero no lo adjunta, el bot solicita reenviar un bloque o archivo válido y no improvisa análisis.

Flujo:

1. Gateway recibe mención/comando o DM con código.
2. `InputExtractor` extrae el bloque o adjunto y valida tamaño/formato.
3. Si el mensaje es público y contiene una entrega sensible, se sugiere continuar por DM.
4. A1 deriva a A2 con el texto validado.
5. `OutputPolicy` consulta evaluativas vigentes y fija `normal`, `guided_only` o `refuse_solution`.
6. A2 redacta ayuda compatible con el modo; Dispatcher publica la respuesta aprobada.

## 9. Permisos y restricciones de plataforma

- En canales donde interactúa, el bot requiere permisos equivalentes a ver el canal y enviar mensajes (`VIEW_CHANNEL`, `SEND_MESSAGES`).
- Para crisis, el bot requiere permiso de crear hilos o publicar en el canal docente privado de crisis; si falla, registra alerta operativa y avisa por el canal docente alternativo definido por la cátedra.
- El flujo base no necesita recuperar mensajes históricos; no depende de `READ_MESSAGE_HISTORY`. La excepción es el snapshot de crisis, que puede requerir leer mensajes de la conversación activa o del DM para adjuntar la transcripción completa disponible al hilo docente.
- Las menciones y comandos evitan diseñar una lectura pasiva de mensajes ordinarios; si se quisiera esa capacidad habría que contemplar el intent privilegiado `MESSAGE_CONTENT`.
- Los DMs pueden fallar por configuración del usuario o restricciones de Discord; el fallo se registra como `delivery_failed` y `dm_contactable=false`, sin cambiar de canal.

## 10. Referencias de plataforma

- Discord, [Message Resource](https://docs.discord.com/developers/resources/message): contenido de mensajes e implicancias de intents.
- Discord, [Application Commands](https://docs.discord.com/developers/tutorials/upgrading-to-application-commands): comandos como entrada explícita a la aplicación.
- Discord, [User Resource](https://docs.discord.com/developers/resources/user): creación y uso de DMs.
- Discord, [Opcodes and Status Codes](https://docs.discord.com/developers/topics/opcodes-and-status-codes): fallos de entrega como `50007`.

## 11. Síntesis

La solución usa capacidades realistas de Discord: eventos explícitos, una identidad de bot y permisos mínimos. La arquitectura de seis agentes no cambia estas garantías; las vuelve más sencillas porque publicación, privacidad y extracción de entradas quedan en componentes únicos.
