# Entregable 7 — Riesgos, supuestos y límites éticos

## 1. Supuestos

- Cada materia posee un servidor registrado y stores aislados.
- Usuarios y roles fueron autorizados antes de interactuar.
- La cátedra es autoridad del contenido; A6 mantiene vigencia pero no certifica corrección académica.
- El bot recibe en servidor solo comandos o menciones dirigidas a él.

## 2. Riesgos y mitigaciones

| Riesgo | Consecuencia | Mitigación y responsable |
|---|---|---|
| Responder sin fuente vigente | Información inventada u obsoleta | A2/A3 citan KB/Config; sin fuente, A1 reconduce |
| Fecha docente no aplicada | A3 informa una versión vieja | A6 escribe directamente Config Store versionado |
| Mezcla entre materias | Filtrado o respuesta incorrecta | SubjectRouter + partición por `subject_id` |
| Exponer una consulta DM | Violación de privacidad | MemoryStore etiqueta origen; OutputPolicy bloquea publicación |
| Entregar un TP resuelto | Fraude o sustitución del aprendizaje | OutputPolicy fija `guided_only/refuse_solution`; A2 no entrega solución |
| Vigilar consultas sucesivas | Pérdida de confianza y exceso de datos | No se registran señales antifraude multi-turno |
| Feedback identificado o inferido | Analítica no consentida | A5 procesa solo aportes voluntarios y agregados |
| Seguimiento intrusivo | Spam o exposición | A4 solo por DM con opt-in, cooldown, silencio y opt-out |
| DM no entregable | Fallo de continuidad | Dispatcher registra fallo; no usa canal público |
| Lectura pasiva del servidor | Dependencia de intent privilegiado | Comandos/menciones explícitas; no depender de `MESSAGE_CONTENT` |
| Código desde histórico o formato no textual | Permisos ampliados o análisis inseguro | InputExtractor admite bloque/adjunto del mensaje actual |
| Feedback ofensivo | Daño a docentes/estudiantes | A5 modera abuso y escala riesgo humano |

## 3. Consultas fuera de dominio y casos humanos

A1 debe declarar el límite del asistente y orientar a docentes cuando la pregunta sea ajena a la materia, no tenga base documental o requiera criterio humano. A3 solo comunica reglas generales publicadas; no determina si un certificado o trámite de una persona es válido.

## 4. Límites no negociables

| Límite | Dónde se hace cumplir |
|---|---|
| No corregir oficialmente ni calificar | A2 y OutputPolicy |
| No entregar soluciones completas evaluables | OutputPolicy + A2 |
| No reemplazar docentes ni decisiones institucionales | A1 + A3 |
| No filtrar DM ni datos de terceros | MemoryStore + OutputPolicy |
| No convertir feedback en evaluación oficial | A5 |
| No acosar mediante seguimiento | A4 + Scheduler + preferencias |
| No mezclar materias | SubjectRouter + stores |

## 5. Síntesis

Reducir agentes no reduce controles: los límites con resultado determinista quedan centralizados en infraestructura auditable, y los agentes conservan únicamente decisiones pedagógicas, administrativas, sociales o proactivas.
