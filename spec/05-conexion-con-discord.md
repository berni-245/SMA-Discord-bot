# Entregable 5 — Conexión con Discord

## 1. Representación

El sistema es **una aplicación de bot** presente en el servidor de cada materia. Los seis agentes son roles internos; no poseen identidades ni permisos Discord propios. El `OutboundDispatcher` es el único componente que envía mensajes.

| Espacio | Entrada admitida | Visibilidad | Uso |
|---|---|---|---|
| Canal de estudiantes | `@bot` o comando | Pública para sus lectores | Consultas y respuestas públicas |
| DM estudiante-bot | Mensaje o comando | Privada | Código sensible, quiz y seguimiento |
| Canal docente | `/incorporar-material` o `@bot incorporar` por rol autorizado | Según permisos de cátedra | Actualización KB/Config |
| Canal docente privado de digest | Publicación del bot | Docentes | Digest agregado de A5 |

Un hilo hereda la visibilidad del canal padre. Un canal restringido es público entre quienes pueden leerlo; no equivale a un DM. Un grupo pequeño o DM grupal se trata como **privado respecto del servidor, pero compartido entre sus participantes**: el bot no republica afuera, pero tampoco promete confidencialidad 1:1.

## 2. Sensores, actuadores y comandos

- **Gateway** recibe menciones, comandos y DMs dirigidos al bot.
- **Auth/Role Check** valida acceso y que un aporte docente venga de `docente` o `ayudante`.
- **SubjectRouter** fija materia por servidor o solicita materia en DM.
- **OutboundDispatcher** publica respuestas y captura errores de entrega.

Comandos previstos: `/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, `/seguimiento activar`, `/seguimiento desactivar`, `/feedback`, `/checklist` y `/incorporar-material`.

## 3. Matriz agente-ambiente

**P** = percibe un evento del ambiente dirigido a su función. **(P)** = recibe internamente contexto saneado desde A1 o infraestructura. **B** = produce borrador o decisión. La escritura efectiva siempre corresponde a Dispatcher.

| Agente | Canal estudiante | DM estudiante | Canal docente de aporte | Canal docente de digest |
|---|---|---|---|---|
| A1 Frontier | P / B | P / B | — | — |
| A2 Tutor | (P) / B vía A1 | (P) / B vía A1 | — | — |
| A3 Admin | (P) / B vía A1 | (P) / B vía A1 | — | — |
| A4 Follow-up | — | (P) / B con opt-in | — | — |
| A5 Feedback | (P) / B vía A1 por `/feedback` | (P) / B vía A1 si voluntario | — | B digest |
| A6 Knowledge Curator | — | — | P / B confirmación | — |
| OutboundDispatcher (infra) | Escribe | Escribe o registra fallo | Escribe confirmación | Escribe digest |

Las celdas `—` son prohibiciones de diseño: A6 no lee canales de estudiantes; A2/A3/A4 no leen el canal docente; A5 no lee conversaciones para inferir feedback. Ningún agente escribe directamente: incluso sus borradores autorizados pasan por `OutputPolicy` y `OutboundDispatcher`.

## 4. Ingesta docente y vigencia

A6 procesa exclusivamente aportes explícitos del canal autorizado:

| Tipo de aporte | Destino vigente |
|---|---|
| Apunte, bibliografía, explicación, programa | KB Store versionado |
| Fecha, modalidad, regla de evaluación, evaluativa activa | Config Store versionado |
| Corrección clara | Nueva versión vigente; anterior obsoleta |
| Conflicto ambiguo | `pendiente_confirmacion` y pregunta al docente |

Así, la fecha que A3 responde y las evaluativas que `OutputPolicy` controla provienen del mismo dato actualizado por la cátedra.

## 5. Privacidad pública y DM

- En canales públicos, el bot solo responde a evento dirigido y `OutputPolicy` aplica `PrivacyFilter`.
- Un dato nacido en DM no aparece en una respuesta pública ni en un digest identificable.
- A4 solo envía seguimiento por DM tras opt-in; ante fallo no existe fallback público.
- A5 entrega a docentes feedback agregado y voluntario, no transcripciones ni resultados de quizzes.

## 6. Ingreso de código

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

## 7. Permisos y restricciones de plataforma

- En canales donde interactúa, el bot requiere permisos equivalentes a ver el canal y enviar mensajes (`VIEW_CHANNEL`, `SEND_MESSAGES`).
- El flujo base no necesita recuperar mensajes históricos; no depende de `READ_MESSAGE_HISTORY`.
- Las menciones y comandos evitan diseñar una lectura pasiva de mensajes ordinarios; si se quisiera esa capacidad habría que contemplar el intent privilegiado `MESSAGE_CONTENT`.
- Los DMs pueden fallar por configuración del usuario o restricciones de Discord; el fallo se registra sin cambiar de canal.

## 8. Referencias de plataforma

- Discord, [Message Resource](https://docs.discord.com/developers/resources/message): contenido de mensajes e implicancias de intents.
- Discord, [Application Commands](https://docs.discord.com/developers/tutorials/upgrading-to-application-commands): comandos como entrada explícita a la aplicación.
- Discord, [User Resource](https://docs.discord.com/developers/resources/user): creación y uso de DMs.
- Discord, [Opcodes and Status Codes](https://docs.discord.com/developers/topics/opcodes-and-status-codes): fallos de entrega como `50007`.

## 9. Síntesis

La solución usa capacidades realistas de Discord: eventos explícitos, una identidad de bot y permisos mínimos. La arquitectura de seis agentes no cambia estas garantías; las vuelve más sencillas porque publicación, privacidad y extracción de entradas quedan en componentes únicos.
