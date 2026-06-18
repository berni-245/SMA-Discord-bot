# Entregable 9 — Registro de decisiones y no funcionales

## 1. Decisiones cerradas

| Pregunta                                                | Decisión                                                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Cuántos agentes?                                       | Seis agentes lógicos; políticas y stores son infraestructura                                                                                        |
| ¿Cómo se determina la materia?                          | Un servidor por materia; en DM A1 solicita selección si es ambigua                                                                                  |
| ¿Cómo entra contenido docente?                          | `/incorporar-material` o `@bot incorporar` → pipeline `content` → KB Store                                                                        |
| ¿Cómo entran fechas/reglas/evaluativas oficiales?       | Con **`/actualizar-catedra`** → pipeline `config` → Config Store. Si llegan por `/incorporar-material`, van a KB como contenido y A6 puede **sugerir** el comando |
| ¿Dónde quedan fechas/reglas para A3/OutputPolicy?       | Solo en Config Store vía `/actualizar-catedra`; KB no es fuente oficial administrativa                                                                            |
| ¿Cómo entra código?                                     | Bloque o adjunto textual del mensaje actual dirigido al bot                                                                                         |
| ¿Se aceptan links a mensajes previos?                   | No en el flujo base                                                                                                                                 |
| ¿Cómo se limita una evaluativa?                         | `OutputPolicy` usa `normal`, `guided_only`, `refuse_solution` por salida                                                                            |
| ¿Se vigilan cadenas de consultas?                       | No                                                                                                                                                  |
| ¿Cómo se inicia seguimiento?                            | **Habilitado por default** al primer contacto pedagógico; `/seguimiento desactivar` para opt-out; A4 contacta **2–5 días** post-sesión, solo por DM si `dm_contactable=true` |
| ¿Cómo se habilita el DM?                                | El estudiante debe iniciar el privado, ejecutar `/activar-dm` o cumplir el mecanismo equivalente de la plataforma; si se había pensado "volverse amigo del bot", queda modelado como requisito de contactabilidad, no como publicación pública |
| ¿Ítems de feedback?                                    | Tres ejes — cursada, material, asistente — accionables por la cátedra sin duplicar evaluaciones oficiales                                           |
| ¿Qué pasa si falla un DM?                               | Se registra fallo, se marca `dm_contactable=false`; no se publica fallback                                                                          |
| ¿Cómo llega feedback a docentes?                        | A5 agrega únicamente aportes voluntarios                                                                                                            |
| ¿Política de anonimato del feedback?                    | `anonimo` por defecto; `pseudonimo` o `identificado_con_consentimiento` solo con consentimiento explícito del estudiante y configuración de cátedra |
| ¿Quién genera quizzes y con qué criterio de dificultad? | A2; alineados al tema consultado y a la unidad o bloque vigente en KB, calibrados al nivel del material citado                                      |
| ¿Quién publica en Discord?                              | `OutboundDispatcher` bajo una única identidad de bot                                                                                                |
| ¿Cómo coordinan agentes?                                | A1 decide intención en cada turno y usa `conversation_owner_agent` como continuidad; si el agente receptor detecta baja confianza o fuera de scope, devuelve a A1; A6 y A4 reciben sus propios disparadores explícitos |
| ¿Usuario o Discord son agentes?                         | No; usuario es actor y Discord es ambiente con sensores/actuadores                                                                                  |
| ¿Quién valida salidas pedagógicas?                      | `OutputPolicy` como política determinista, no como séptimo agente                                                                                   |
| ¿Qué voz usa el bot?                                    | Una personalidad consistente y clara; cambia la postura, no la identidad                                                                            |
| ¿Conversaciones largas?                                 | STM conserva contexto mínimo de sesión; referencias a código deben reenviarse como bloque/adjunto                                                   |
| ¿Quién detecta autolesión/ideación suicida?             | A1 con `SafetyClassifier` en la frontera de cada turno; A2 y A5 actúan como segunda barrera si el mensaje les llega por continuidad o feedback      |
| ¿Cómo se evita abrir varios hilos de crisis?            | `CrisisCaseStore` deduplica por `user_id + subject_id`; nuevos mensajes actualizan el mismo hilo hasta que el caso pase a `closed`                   |
| ¿Qué ve la cátedra ante crisis?                         | Un hilo privado para docentes de la cátedra con usuario, materia, nivel, timestamps, respuesta del bot y transcripción completa disponible de la conversación para elevar a psicología/bienestar |
| ¿Hay carga inicial además del canal docente?            | Puede existir un seed inicial; luego A6 y la versión docente confirmada tienen prioridad                                                            |
| ¿Quién valida material docente?                         | Se confía en rol autorizado; conflictos ambiguos quedan pendientes de confirmación                                                                  |
| ¿Lenguajes de programación?                             | Lista textual configurable por materia; formatos no reconocidos se solicitan nuevamente                                                             |
| ¿Retención del feedback?                                | Store separado por materia; no entrena ni alimenta A2/A4 y sigue la retención definida por cátedra                                                  |

## 2. Requisitos no funcionales

| Dimensión              | Requisito conceptual                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Privacidad             | No exponer DM, memoria ni feedback identificable en público                                                                  |
| Aislamiento            | Toda lectura/escritura incluye `subject_id`; memoria además incluye usuario                                                  |
| Trazabilidad           | Versionar fuentes; citar respuesta; registrar envíos/fallos sin contenido excesivo; en crisis, auditar hilo, estado y accesos |
| Minimización           | No persistir código ni transcripciones crudas por defecto; excepción: snapshot completo de conversación para caso de crisis activo |
| Control usuario        | Historial, borrado y consentimiento de seguimiento disponibles                                                               |
| Moderación             | Conservar crítica legítima y escalar abuso o riesgo humano; crisis no entra a digest ni feedback ordinario                    |
| Fallo cerrado          | Si no se puede aplicar OutputPolicy o verificar fuente, no publicar respuesta sustantiva                                     |
| Plataforma             | Interacciones por evento explícito; evitar lectura pasiva e historial innecesario                                            |
| Latencia/degradación   | Una respuesta normal prioriza un solo round de agente; ante indisponibilidad se informa y se preservan flujos independientes |
| Idioma y accesibilidad | Español claro por defecto, tono respetuoso, mensajes breves y estructura legible; traducción queda como extensión            |

## 3. Parámetros a definir por implementación/cátedra

- Tiempo de inactividad que cierra una sesión (p. ej. 30–60 min).
- Ventana de seguimiento dentro del rango 2–5 días post-sesión.
- Tamaño máximo de bloques o adjuntos de código.
- Retención exacta si difiere del default de cursada + 6 meses.
- Frecuencia máxima y horarios de silencio para A4.
- Muestra mínima y periodicidad del digest de A5.
- Canal humano concreto de derivación por materia.
- Canal docente privado de crisis y procedimiento de elevación a psicología/bienestar.
- Retención y cierre manual de casos de crisis.

## 4. Estado de cobertura

La propuesta cubre teoría, práctica/código, autoevaluación, administración, acompañamiento, feedback, memoria/seguimiento y escalamiento de crisis; define actualización docente, privacidad, fuera de dominio, escenarios, Discord como ambiente y autoevaluación de la arquitectura. Los parámetros abiertos no impiden implementar el diseño: son configuraciones institucionales u operativas.
