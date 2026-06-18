# Entregable 4 — Memoria entre sesiones y seguimiento

## 1. Dos niveles de memoria

|               | STM intra-sesión                             | LTM entre sesiones                                                        |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| Propósito     | Coordinar el intercambio actual              | Continuidad y seguimiento                                                 |
| Vida          | Hasta inactividad o cierre de jornada         | Cursada + 6 meses, salvo borrado                                          |
| Ejemplos      | `subject_id` elegido en DM, intención actual, `conversation_owner_agent` | Tema consultado, duda abierta, quiz a retomar, preferencia de seguimiento |
| Uso proactivo | Nunca                                        | Solo para A4 si el seguimiento sigue habilitado (default activo)          |

`MemoryStore` es infraestructura gobernada, no un agente: aplica partición usuario+materia, visibilidad de origen, retención y comandos del usuario.

Los casos de crisis no viven en la LTM pedagógica: se registran en `CrisisCaseStore`, separado por usuario+materia, con acceso restringido a docentes de la cátedra y finalidad de derivación institucional.

## 2. Información persistida

Se conserva lo mínimo útil:

- tema/unidad consultada y estado de duda (`abierta` o `cerrada`);
- resultado pedagógico de un quiz, sin nota oficial;
- estado general de un trabajo (`en_progreso` o `stuck`) y categoría de dificultad;
- tipo de ayuda brindada (`teoria`, `practica`, `quiz`, `orientacion`) y, si aplica, referencia a un hilo `publico` relevante, sin copiar su contenido;
- `follow_up_enabled` (default `true`), `dm_contactable`, último seguimiento y fallos de entrega;
- `safety_hold_until` cuando hubo malestar intenso sin caso de crisis, para bloquear contacto proactivo temporal;
- visibilidad de origen (`publico` o `dm`) de cada hecho.

No se conservan por defecto transcripciones crudas, código fuente, certificados, datos médicos, comentarios privados destinados a docentes ni señales para vigilar cadenas de preguntas. La excepción es el snapshot de conversación asociado a un caso de crisis abierto en `CrisisCaseStore`; no alimenta personalización, seguimiento ni feedback.

## 3. Operaciones y control del estudiante

| Comando                   | Efecto                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `/mi-historial`           | Entrega un resumen de la materia activa                     |
| `/borrar-historial`       | Elimina LTM de usuario+materia                              |
| `/restablecer-perfil`     | Elimina preferencias pedagógicas inferidas                  |
| `/seguimiento desactivar` | Registra opt-out; A4 deja de contactar en esa materia       |
| `/seguimiento activar`    | Reactiva seguimiento tras un opt-out previo                 |
| `/activar-dm`             | Guía al estudiante para abrir o probar el DM con el bot     |

Al primer contacto pedagógico en una materia, `follow_up_enabled=true` y el bot informa brevemente que puede desactivarse con `/seguimiento desactivar`. Si el contacto ocurrió en canal `publico`, también sugiere abrir un DM con el bot mediante `/activar-dm` o enviándole un primer mensaje privado. Esa acción deja `dm_contactable=true` solo si Dispatcher puede crear/enviar el DM; si Discord lo rechaza, se conserva `dm_contactable=false`.

## 4. Lectura y actualización

| Componente/agente | Operación permitida                                                | Alcance                              |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------ |
| A1 Frontier       | Leer STM de materia seleccionada y ejecutar comandos del usuario   | Sesión/materia activa                |
| A2 Tutor          | Solicitar escritura de hechos pedagógicos y leer resumen permitido | Usuario+materia; sin código crudo    |
| A4 Follow-up      | Leer oportunidades LTM y registrar contacto/fallo                  | Solo si seguimiento habilitado, DM contactable, sin caso de crisis activo y sin `safety_hold_until` vigente |
| A5 Feedback       | Ninguna lectura de memoria pedagógica                              | No infiere feedback                  |
| A6 Curator        | Ningún acceso a memoria estudiantil                                | Solo KB/Config de materia           |
| CrisisEscalationProtocol | Leer/crear/actualizar caso de crisis y snapshot conversacional | Usuario+materia; canal docente de crisis |

`MemoryStore` valida cada operación, aplica visibilidad y retención, y niega cualquier acceso cruzado de usuario o materia.

`CrisisCaseStore` valida deduplicación por `user_id + subject_id`: un estudiante no genera múltiples hilos por mandar varios mensajes de crisis en la misma materia. Si el caso sigue `open`, `acknowledged` o `escalated_to_psychology`, los nuevos mensajes actualizan el mismo hilo; un caso nuevo solo se abre luego de `closed`.

## 5. Privacidad

Cada hecho conserva `origin_visibility` (`publico` o `dm`). Cuando el bot responde en un canal `publico`, `MemoryStore` no entrega detalle de origen `dm` y `OutputPolicy` impide republicarlo. En DM puede reutilizarse el contexto de la misma materia. Solo una **transferencia consentida** del estudiante permite compartir contenido nacido en DM hacia un canal `publico`.

## 6. Seguimiento proactivo

A4 Follow-up es el agente proactivo. El `Scheduler` lo evalúa **entre 2 y 5 días** después del cierre de sesión (inactividad o fin de jornada), solo si `follow_up_enabled=true`, `dm_contactable=true`, no hay caso de crisis activo, no hay `safety_hold_until` vigente, existe una oportunidad pertinente y la cursada sigue vigente. No programa seguimiento al cierre del cuatrimestre.

Puede considerar:

- una duda abierta sin retomar;
- un quiz que el estudiante quiso repasar;
- un estado `stuck`;
- un hito próximo publicado en Config Store asociado a un tema consultado.

Antes de generar un mensaje, A4 respeta frecuencia máxima, horarios de silencio y un único tema por contacto. La salida es **solo DM** e incluye `/seguimiento desactivar`. Si Discord no permite enviarlo, `OutboundDispatcher` registra `delivery_failed`, marca `dm_contactable=false` y deja pendiente que el estudiante vuelva a abrir o autorizar el canal privado; jamás reemplaza el DM por una mención pública.

## 7. Ejemplo día 1 / día N

1. En DM de Programación II, el estudiante pide un quiz sobre pilas (seguimiento ya habilitado por default y `dm_contactable=true` porque inició el privado).
2. A2 formula la autoevaluación, da devolución orientativa y solicita guardar: `tema=pilas`, `duda=abierta`, `origen=dm`.
3. La sesión cierra por inactividad esa noche. Tres días después, el Scheduler habilita a A4.
4. A4 lee el hecho mínimo, verifica pertinencia y redacta un DM: “¿Querés retomar el ejemplo de pilas que habíamos visto? Si preferís que no te escriba sobre esto, usá `/seguimiento desactivar`.”
5. Dispatcher envía o registra el fallo; MemoryStore registra el contacto o la imposibilidad.

## 8. Síntesis

La memoria necesaria para cumplir la consigna se modela como almacenamiento con reglas explícitas, no como un interlocutor autónomo. La única autonomía vinculada al historial está en A4 y queda acotada por opt-out, privacidad, ventana temporal y frecuencia.
