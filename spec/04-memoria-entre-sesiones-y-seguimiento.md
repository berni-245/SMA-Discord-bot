# Entregable 4 — Memoria entre sesiones y seguimiento

## 1. Dos niveles de memoria

|               | STM intra-sesión                             | LTM entre sesiones                                                        |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| Propósito     | Coordinar el intercambio actual              | Continuidad y seguimiento                                                 |
| Vida          | Hasta inactividad/cierre de sesión           | Cursada + 6 meses, salvo borrado                                          |
| Ejemplos      | `subject_id` elegido en DM, intención actual | Tema consultado, duda abierta, quiz a retomar, preferencia de seguimiento |
| Uso proactivo | Nunca                                        | Solo para A4 con opt-in                                                   |

`MemoryStore` es infraestructura gobernada, no un agente: aplica partición usuario+materia, visibilidad de origen, retención y comandos del usuario.

## 2. Información persistida

Se conserva lo mínimo útil:

- tema/unidad consultada y estado de duda (`abierta` o `cerrada`);
- resultado pedagógico de un quiz, sin nota oficial;
- estado general de un trabajo (`en_progreso` o `stuck`) y categoría de dificultad;
- tipo de ayuda brindada (`teoria`, `practica`, `quiz`, `orientacion`) y, si aplica, referencia a un hilo público relevante, sin copiar su contenido;
- opt-in/opt-out, último seguimiento y fallos de entrega;
- visibilidad de origen de cada hecho.

No se conservan por defecto transcripciones crudas, código fuente, certificados, datos médicos, comentarios privados destinados a docentes ni señales para vigilar cadenas de preguntas.

## 3. Operaciones y control del estudiante

| Comando                   | Efecto                                           |
| ------------------------- | ------------------------------------------------ |
| `/mi-historial`           | Entrega un resumen de la materia activa          |
| `/borrar-historial`       | Elimina LTM de usuario+materia                   |
| `/restablecer-perfil`     | Elimina preferencias pedagógicas inferidas       |
| `/seguimiento activar`    | Registra opt-in para DM proactivo en esa materia |
| `/seguimiento desactivar` | Retira consentimiento; A4 no vuelve a contactar  |

Las operaciones dejan log mínimo de auditoría sin retener el contenido borrado.

## 4. Lectura y actualización

| Componente/agente | Operación permitida                                                | Alcance                           |
| ----------------- | ------------------------------------------------------------------ | --------------------------------- |
| A1 Frontier       | Leer STM de materia seleccionada y ejecutar comandos del usuario   | Sesión/materia activa             |
| A2 Tutor          | Solicitar escritura de hechos pedagógicos y leer resumen permitido | Usuario+materia; sin código crudo |
| A4 Follow-up      | Leer oportunidades LTM y registrar contacto/fallo                  | Solo con opt-in                   |
| A5 Feedback       | Ninguna lectura de memoria pedagógica                              | No infiere feedback               |
| A6 Curator        | Ningún acceso a memoria estudiantil                                | Solo KB/Config de materia         |

`MemoryStore` valida cada operación, aplica visibilidad y retención, y niega cualquier acceso cruzado de usuario o materia.

## 5. Privacidad

Cada hecho conserva `origin_visibility`. Cuando el bot responde en público, `MemoryStore` no entrega detalle de origen DM y `OutputPolicy` impide republicarlo. En DM puede reutilizarse el contexto de la misma materia. Solo una transferencia explícita del estudiante permite compartir contenido privado.

## 6. Seguimiento proactivo

A4 Follow-up es el agente proactivo. El `Scheduler` solo lo invoca si `follow_up_optin=true` y no existe opt-out.

Puede considerar:

- una duda abierta sin retomar;
- un quiz que el estudiante quiso repasar;
- un estado `stuck`;
- un hito próximo publicado en Config Store asociado a un tema consultado.

Antes de generar un mensaje, A4 respeta frecuencia máxima, horarios de silencio y un único tema por contacto. La salida es **solo DM**. Si Discord no permite enviarlo, `OutboundDispatcher` registra `delivery_failed`; jamás reemplaza el DM por una mención pública.

## 7. Ejemplo día 1 / día N

1. En DM de Programación II, el estudiante ejecuta `/seguimiento activar` y pide un quiz sobre pilas.
2. A2 formula la autoevaluación, da devolución orientativa y solicita guardar: `tema=pilas`, `duda=abierta`, `origen=dm`.
3. Cuatro días después, el Scheduler detecta opt-in y habilita a A4.
4. A4 lee el hecho mínimo, verifica límites y redacta un DM: “¿Querés retomar el ejemplo de pilas que habíamos visto? Si preferís que no te escriba sobre esto, decime y lo desactivo.”
5. Dispatcher envía o registra el fallo; MemoryStore registra el contacto o la imposibilidad.

## 8. Síntesis

La memoria necesaria para cumplir la consigna se modela como almacenamiento con reglas explícitas, no como un interlocutor autónomo. La única autonomía vinculada al historial está en A4 y queda acotada por consentimiento, privacidad y frecuencia.
