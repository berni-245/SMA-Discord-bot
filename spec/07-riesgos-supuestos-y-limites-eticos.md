# Entregable 7 — Riesgos, supuestos y límites éticos

## 1. Supuestos

- Cada materia posee un servidor registrado y stores aislados.
- Usuarios y roles fueron autorizados antes de interactuar.
- La cátedra es autoridad del contenido; A6 mantiene vigencia pero no certifica corrección académica.
- El bot recibe en servidor solo comandos o menciones dirigidas a él.

## 2. Riesgos y mitigaciones

| Riesgo                                      | Consecuencia                               | Mitigación y responsable                                                            |
| ------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Responder sin fuente vigente                | Información inventada u obsoleta           | A2/A3 citan KB/Config; sin fuente, A1 reconduce                                     |
| Fecha docente no aplicada                   | A3 informa una versión vieja               | Solo `/actualizar-catedra` escribe Config Store; A3 no usa fechas sueltas en KB     |
| Mezcla entre materias                       | Filtrado o respuesta incorrecta            | SubjectRouter + partición por `subject_id`                                          |
| Pedido malicioso de datos ajenos            | Revelar consultas o desempeño de terceros  | MemoryStore solo entrega la partición del usuario autenticado; A1 rechaza el pedido |
| Exponer una consulta DM                     | Violación de privacidad                    | MemoryStore etiqueta origen; OutputPolicy bloquea publicación                       |
| Entregar un TP resuelto                     | Fraude o sustitución del aprendizaje       | OutputPolicy fija `guided_only/refuse_solution`; A2 no entrega solución             |
| Vigilar consultas sucesivas                 | Pérdida de confianza y exceso de datos     | No se registran señales antifraude multi-turno                                      |
| Feedback identificado o inferido            | Analítica no consentida                    | A5 procesa solo aportes voluntarios y agregados                                     |
| Seguimiento intrusivo                       | Spam o exposición                          | A4 solo por DM, habilitado por default con opt-out, `dm_contactable`, ventana 2–5 días post-sesión, cooldown y silencio |
| DM no entregable                            | Fallo de continuidad                       | Dispatcher registra fallo, marca `dm_contactable=false`; no usa canal público       |
| Lectura pasiva del servidor                 | Dependencia de intent privilegiado         | Comandos/menciones explícitas; no depender de `MESSAGE_CONTENT`                     |
| Código desde histórico o formato no textual | Permisos ampliados o análisis inseguro     | InputExtractor admite bloque/adjunto del mensaje actual                             |
| Feedback ofensivo                           | Daño a docentes/estudiantes                | A5 no almacena odio/ataques; escala a autoridad designada; conserva crítica legítima en digest        |
| Mensaje con autolesión, ideación suicida o riesgo humano | Falta de intervención humana a tiempo | A1 aplica `SafetyClassifier`; A2/A5 son segunda barrera; `CrisisEscalationProtocol` crea o actualiza un hilo privado para docentes de la cátedra con transcripción completa disponible y derivación a psicología/bienestar |
| Duplicación de alertas de crisis            | Ruido operativo y demora en respuesta humana | `CrisisCaseStore` deduplica por `user_id + subject_id`; nuevos mensajes actualizan el mismo hilo hasta cierre |
| Seguimiento automático durante malestar o crisis | Mensaje inoportuno o dañino                | A4 se pausa mientras exista caso `open`, `acknowledged` o `escalated_to_psychology`, o mientras esté vigente `safety_hold_until` |
| Dependencia excesiva del bot                | Reemplazar razonamiento o consulta docente | A2 orienta sin resolver; A1 reconduce ante decisiones/fuentes faltantes             |
| Instrucciones para ignorar límites          | El bot abandona su rol o filtra datos      | A1 y OutputPolicy rechazan el intento y mantienen permisos/fuentes                  |

## 3. Consultas fuera de dominio y casos humanos

A1 debe declarar el límite del asistente y orientar a docentes cuando la pregunta sea ajena a la materia, no tenga base documental o requiera criterio humano. A3 solo comunica reglas generales publicadas; no determina si un certificado o trámite de una persona es válido.

Ante autolesión, ideación suicida o riesgo humano urgente, el sistema no intenta contener el caso como tutor ni lo deriva a un canal público. A1 activa el protocolo de crisis; A2 o A5 pueden detectarlo como segunda barrera si el turno les llegó por continuidad o feedback. El bot envía contención breve al estudiante y el caso queda en manos de docentes de la cátedra para elevación al área institucional correspondiente.

## 4. Límites no negociables

| Límite                                               | Dónde se hace cumplir         |
| ---------------------------------------------------- | ----------------------------- |
| No corregir oficialmente ni calificar                | A2 y OutputPolicy             |
| No entregar soluciones completas evaluables          | OutputPolicy + A2             |
| No reemplazar docentes ni decisiones institucionales | A1 + A3                       |
| No filtrar DM ni datos de terceros                   | MemoryStore + OutputPolicy    |
| No convertir feedback en evaluación oficial          | A5                            |
| No acosar mediante seguimiento                       | A4 + Scheduler + preferencias |
| No mezclar materias                                  | SubjectRouter + stores        |
| No duplicar casos de crisis ni tratarlos como feedback | CrisisCaseStore + A1/A5       |
| No dejar un riesgo humano sin escalamiento privado   | A1/A2/A5 + CrisisEscalationProtocol |

## 5. Síntesis

Concentrar la lógica en pocos agentes no implica menos controles: los límites con resultado determinista quedan centralizados en infraestructura auditable, y los agentes conservan únicamente decisiones pedagógicas, administrativas, sociales o proactivas.
