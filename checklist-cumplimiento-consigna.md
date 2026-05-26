# Checklist de cumplimiento: SMA Discord Bot — Diseño multiagente

## Alcance

| Elemento              | Valor                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| Consigna auditada     | `enunciado.md`                                                                                              |
| Entregables revisados | `spec/00-glosario.md` a `spec/09-preguntas-abiertas-y-no-funcionales.md`, `spec/README.md`, `spec/agents/*` |
| Fecha de revisión     | 2026-05-25                                                                                                  |
| Modo                  | `solo auditoria`                                                                                            |

## Leyenda

- `[x] CUMPLE`: evidencia suficiente y consistente.
- `[ ] PARCIAL`: cobertura incompleta o justificación insuficiente.
- `[ ] PENDIENTE`: ausente, contradictorio o no verificable.
- `[x] NO APLICA`: excluido justificadamente por alcance.

## Resumen

| Estado    | Cantidad |
| --------- | -------: |
| Cumple    |       70 |
| Parcial   |        2 |
| Pendiente |        0 |
| No aplica |        0 |

**Dictamen:** `Cumple con pendientes` (2 observaciones menores de postura sobre preguntas abiertas).

## Requisitos Obligatorios

### Glosario inicial

| Estado       | ID      | Requisito atómico                                                                                                       | Evidencia verificada                                                                                 | Pendiente o acción |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-001 | Glosario al inicio del documento principal (primeras páginas)                                                           | `spec/00-glosario.md` (entregable 0, abre la serie)                                                  | —                  |
| `[x] CUMPLE` | REQ-002 | Definir `sesión` vs `conversación` cuadrando con memoria intra-sesión vs persistencia entre días y usarlo uniformemente | `00-glosario.md` §1 (`Conversación`, `Sesión`, `STM`, `LTM`); uso coherente en `02-…` §3 y `04-…` §1 | —                  |

### Entregable 1 — Inventario y justificación de agentes

| Estado       | ID      | Requisito atómico                                                                                    | Evidencia verificada                                                              | Pendiente o acción |
| ------------ | ------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-010 | Decidir cantidad/granularidad de agentes con trade-off justificado                                   | `01-…` §1 (6 vs 11) y §7 (trade-off de integrar teoría/práctica/quiz en A2)       | —                  |
| `[x] CUMPLE` | REQ-011 | Por cada agente: rol, responsabilidades, capacidades distintivas, recursos, aporte, fuera de alcance | `01-…` §5 fichas A1–A6 (cada una incluye los 6 campos) y `spec/agents/0[1-6]-…md` | —                  |
| `[x] CUMPLE` | REQ-012 | Carácter reactivo/proactivo/social + BDI por agente                                                  | `01-…` §6 tabla + línea BDI en cada ficha §5                                      | —                  |
| `[x] CUMPLE` | REQ-013 | Contraste explícito agente informativo (F4) reactivo vs seguimiento proactivo (F7)                   | `01-…` §6 párrafo final ("A3 Admin es reactivo… A4 Follow-up es proactivo…")      | —                  |

### Entregable 2 — Interacción y coordinación

| Estado       | ID      | Requisito atómico                                                              | Evidencia verificada                                                                   | Pendiente o acción |
| ------------ | ------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-020 | Primer interviniente ante mensaje típico y casos límite                        | `02-…` §2 tabla de ruteo + `03-…` §5 (DM sin materia)                                  | —                  |
| `[x] CUMPLE` | REQ-021 | Salida ante fuera de dominio: quién emite y si hay clasificación previa        | `02-…` §4 (A1 clasifica y emite)                                                       | —                  |
| `[x] CUMPLE` | REQ-022 | Criterios de derivación entre agentes                                          | `02-…` §2 tabla evento→primer agente→ruta                                              | —                  |
| `[x] CUMPLE` | REQ-023 | Información que se comparte y lo que no                                        | `02-…` §5 tabla "dato/produce/consume/límite"                                          | —                  |
| `[x] CUMPLE` | REQ-024 | Mecanismo conceptual de coordinación descrito                                  | `02-…` §1 (coordinador reactivo + OutputPolicy + OutboundDispatcher)                   | —                  |
| `[x] CUMPLE` | REQ-025 | Distinción estudiante vs docente en Discord                                    | `02-…` §6 tabla de roles                                                               | —                  |
| `[x] CUMPLE` | REQ-026 | Cómo el feedback estudiante llega a docente (agentes, agregación, visibilidad) | `02-…` §7 (A1→A5, digest semanal default, política de anonimato, contenido del digest) | —                  |

### Entregable 3 — Multi-materia

| Estado       | ID      | Requisito atómico                                                       | Evidencia verificada                                                               | Pendiente o acción |
| ------------ | ------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-030 | Cómo se resuelve/recibe el contexto de materia, explícito y justificado | `03-…` §1 (un servidor = una materia) y §2 (`SubjectRouter`)                       | —                  |
| `[x] CUMPLE` | REQ-031 | Aislamiento KB, Config, canal docente y reglas evaluativas por materia  | `03-…` §3 tabla de stores particionados + §4 aporte docente atado a servidor       | —                  |
| `[x] CUMPLE` | REQ-032 | Qué ocurre ante ambigüedad de materia                                   | `03-…` §5 (DM sin materia, pregunta en otro servidor, docente con varias materias) | —                  |

### Entregable 4 — Memoria entre sesiones y seguimiento

| Estado       | ID      | Requisito atómico                                                                          | Evidencia verificada                                                                             | Pendiente o acción |
| ------------ | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------ |
| `[x] CUMPLE` | REQ-040 | Qué se conserva entre sesiones y qué se descarta                                           | `04-…` §2 listas explícitas de conservar/descartar                                               | —                  |
| `[x] CUMPLE` | REQ-041 | Dónde vive y cómo agentes leen/actualizan                                                  | `04-…` §4 tabla por agente + `MemoryStore` como infraestructura                                  | —                  |
| `[x] CUMPLE` | REQ-042 | Disparador del contacto proactivo (eventos, periodicidad, silencio) y relación con Discord | `04-…` §6 (Scheduler, opt-in, frecuencia máxima, horarios de silencio, solo DM)                  | —                  |
| `[x] CUMPLE` | REQ-043 | Control de usuario (opt-out/consentimiento)                                                | `04-…` §3 comandos `/seguimiento activar/desactivar`, `/borrar-historial`, `/restablecer-perfil` | —                  |
| `[x] CUMPLE` | REQ-044 | Ejemplo día 1 → tiempo después → mensaje de seguimiento                                    | `04-…` §7 (5 pasos, materia Programación II, pilas)                                              | —                  |

### Entregable 5 — Conexión con Discord

| Estado       | ID      | Requisito atómico                                                                         | Evidencia verificada                                                                                                      | Pendiente o acción |
| ------------ | ------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-050 | Representación del sistema (bot/canales/hilos), justificada                               | `05-…` §1 (una app de bot, tabla de espacios)                                                                             | —                  |
| `[x] CUMPLE` | REQ-051 | Matriz agente–ambiente obligatoria                                                        | `05-…` §3 matriz por agente × tipo de canal                                                                               | —                  |
| `[x] CUMPLE` | REQ-052 | Indicar prohibiciones explícitas de lectura/escritura por diseño                          | `05-…` §3 (celdas "—" + párrafo "Las celdas — son prohibiciones de diseño…")                                              | —                  |
| `[x] CUMPLE` | REQ-053 | Canal docente especializado: visibilidad, vínculo con KB/Config y versionado              | `05-…` §4 + `03-…` §4 + `00-glosario.md` `Aporte docente`, `Versionado`                                                   | —                  |
| `[x] CUMPLE` | REQ-054 | Cómo el usuario dispara la interacción y recibe respuesta                                 | `05-…` §1 (mención/comando), §2 (sensores/actuadores)                                                                     | —                  |
| `[x] CUMPLE` | REQ-055 | Privacidad público/DM aplicada al bot, memoria, feedback y agentes                        | `05-…` §5 + `04-…` §5 + `02-…` §7 (digest no incluye DM ni quizzes)                                                       | —                  |
| `[x] CUMPLE` | REQ-056 | Ingreso de código: formatos, límites razonables, qué hace si falta/ilegible (obligatorio) | `05-…` §6 (bloque/adjunto, lista de extensiones, 100 KB/2000 líneas, comportamiento si falta)                             | —                  |
| `[x] CUMPLE` | REQ-057 | Tratamiento de canales intermedios (hilos, restringidos, grupos) etiquetados              | `05-…` §1 párrafo final (hilo hereda padre, restringido = público para sus lectores, grupo pequeño = privado al servidor) | —                  |

### Entregable 6 — Escenarios y trazabilidad

| Estado       | ID      | Requisito atómico                                                          | Evidencia verificada                                                     | Pendiente o acción |
| ------------ | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------ |
| `[x] CUMPLE` | REQ-060 | ≥3 escenarios en distintas áreas de tensión, paso a paso                   | `06-…` §§1–3 (A pedagógica-código, B admin-institucional, C mixto)       | —                  |
| `[x] CUMPLE` | REQ-061 | ≥1 diagrama de secuencia con orden temporal, usuario+agentes+ambiente      | `06-…` §1 mermaid `sequenceDiagram` (también en §§2,3,4)                 | —                  |
| `[x] CUMPLE` | REQ-062 | Escenario A: pedido de solución entregable evaluable y postura del sistema | `06-…` §1 ("pasame resuelto el ejercicio 3 del TP1" → `refuse_solution`) | —                  |
| `[x] CUMPLE` | REQ-063 | Escenario B: caso particular con derivación humana                         | `06-…` §2 (recuperatorio por enfermedad → regla general + derivación)    | —                  |
| `[x] CUMPLE` | REQ-064 | Escenario C: consulta mixta con orden/descomposición                       | `06-…` §3 (AVL + fecha + código `inorder`)                               | —                  |
| `[x] CUMPLE` | REQ-065 | Diagramas coherentes con el paso a paso textual                            | `06-…` cada `sequenceDiagram` refleja los pasos numerados del escenario  | —                  |

### Entregable 7 — Riesgos, supuestos y límites éticos

| Estado       | ID      | Requisito atómico                                                           | Evidencia verificada                                                                        | Pendiente o acción |
| ------------ | ------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-070 | Cómo se evitan alucinaciones + reconducción a docentes ante falta de fuente | `07-…` §2 (fila "Responder sin fuente vigente") + §3                                        | —                  |
| `[x] CUMPLE` | REQ-071 | Política para irrelevantes/fuera de dominio + ambiguas/maliciosas           | `07-…` §3 + filas "Instrucciones para ignorar límites" / "Pedido malicioso de datos ajenos" | —                  |
| `[x] CUMPLE` | REQ-072 | Riesgos de filtrado público de código/DM + mitigaciones                     | `07-…` §2 ("Exponer una consulta DM", "Código desde histórico…")                            | —                  |

### Entregable 8 — Auto-evaluación de la arquitectura

| Estado       | ID      | Requisito atómico                                                  | Evidencia verificada                                                                        | Pendiente o acción |
| ------------ | ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-080 | Sección dedicada de auto-evaluación                                | `08-…` todo el documento                                                                    | —                  |
| `[x] CUMPLE` | REQ-081 | Por métrica: juicio + argumento anclado al diseño + límite honesto | `08-…` §§2,3,4 (cada una con "Evaluación", argumento concreto y "Límite/Trade-off honesto") | —                  |
| `[x] CUMPLE` | REQ-082 | Escalabilidad multi-materia                                        | `08-…` §2 (alta conceptual + límites de operación)                                          | —                  |
| `[x] CUMPLE` | REQ-083 | Robustez ante fallo de agente de programación (F2)                 | `08-…` §3 tabla + párrafo de A2 caído                                                       | —                  |
| `[x] CUMPLE` | REQ-084 | Flexibilidad para nuevo agente (ej. bienestar estudiantil)         | `08-…` §4 (4 pasos de integración + límite honesto)                                         | —                  |

### Cobertura funcional (Funcionalidades F1–F7 y requisitos transversales)

| Estado       | ID      | Requisito atómico                                                              | Evidencia verificada                                                              | Pendiente o acción |
| ------------ | ------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | REQ-090 | F1 Apoyo teórico (responder, explicar, ejemplos, resúmenes)                    | `01-…` §5 ficha A2 + tabla §4                                                     | —                  |
| `[x] CUMPLE` | REQ-091 | F2 Apoyo práctico (interpretar, revisar avances, detectar errores, sugerir)    | Ficha A2 (§5) + `02-…` §2 ruteo de práctica/código                                | —                  |
| `[x] CUMPLE` | REQ-092 | F2 Escenario programación: analizar código, errores, fragmentos, destrabar     | A2 + `InputExtractor` + `OutputPolicy` (`01-…` §4, `05-…` §6)                     | —                  |
| `[x] CUMPLE` | REQ-093 | F2 Mecanismo concreto justificado para ingreso de código                       | `05-…` §6 (bloque + adjunto textual; rechazo de links/capturas justificado)       | —                  |
| `[x] CUMPLE` | REQ-094 | F3 Autoevaluación (quizzes, verificación, feedback orientativo)                | Ficha A2 (genera/evalúa quizzes) + `02-…` §3 + glosario `Quiz`                    | —                  |
| `[x] CUMPLE` | REQ-095 | F4 Administrativo: reglas publicadas + orientación a humanos                   | Ficha A3 + `02-…` §4 + escenario B                                                | —                  |
| `[x] CUMPLE` | REQ-096 | F5 Acompañamiento y organización (recordatorios, checklists, orientación)      | A2 (checklists) + A4 (recordatorios consentidos) + `/checklist` en `05-…` §2      | —                  |
| `[x] CUMPLE` | REQ-097 | F6 Feedback: qué ve el docente, periodicidad, agregación/anonimato             | `02-…` §7 (digest semanal por defecto, contenido explícito, anonimato) + ficha A5 | —                  |
| `[x] CUMPLE` | REQ-098 | F6 Prevé abuso o feedback malicioso                                            | `07-…` §2 ("Feedback ofensivo") + ficha A5 §4 (modera, escala humano)             | —                  |
| `[x] CUMPLE` | REQ-099 | F7 Persistencia mínima + contacto proactivo + diferenciación STM vs LTM        | `04-…` §§1–7 completo                                                             | —                  |
| `[x] CUMPLE` | REQ-100 | F7 Respeta visibilidad por canal (DM no se filtra)                             | `04-…` §5 + `05-…` §5                                                             | —                  |
| `[x] CUMPLE` | REQ-101 | Privacidad público vs DM                                                       | `05-…` §5 + `00-glosario.md` `Visibilidad de origen`                              | —                  |
| `[x] CUMPLE` | REQ-102 | Canales intermedios etiquetados como público o privado                         | `05-…` §1 párrafo final                                                           | —                  |
| `[x] CUMPLE` | REQ-103 | Actualización docente: canal especializado + pipeline + vigencia               | `05-…` §4 + ficha A6 + `03-…` §4                                                  | —                  |
| `[x] CUMPLE` | REQ-104 | Fuera de dominio: respuesta educada + fuera del dominio + consultar a docentes | `02-…` §4 (3 pasos explícitos) + glosario `Reconducción a docentes`               | —                  |
| `[x] CUMPLE` | REQ-105 | Los 7 bloques funcionales cubiertos en escenarios                              | `06-…` §5 tabla cobertura funcionalidad×escenario                                 | —                  |

## Límites Y Restricciones

| Estado       | ID      | Restricción                                                         | Evidencia verificada                                                                                 | Pendiente o acción |
| ------------ | ------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | LIM-001 | No corregir oficialmente trabajos o exámenes                        | `07-…` §4 ("No corregir oficialmente ni calificar")                                                  | —                  |
| `[x] CUMPLE` | LIM-002 | No poner notas ni aprobar/desaprobar                                | `07-…` §4 + ficha A2 §5 "no califica"                                                                | —                  |
| `[x] CUMPLE` | LIM-003 | No reemplazar al docente                                            | `07-…` §4 ("No reemplazar docentes…")                                                                | —                  |
| `[x] CUMPLE` | LIM-004 | No dar información institucional sensible                           | `07-…` §3 + ficha A3 §5 "no decide si un alumno califica…"                                           | —                  |
| `[x] CUMPLE` | LIM-005 | No gestionar trámites formales                                      | Ficha A3 §5 + escenario B                                                                            | —                  |
| `[x] CUMPLE` | LIM-006 | No tomar decisiones académicas oficiales                            | `07-…` §4                                                                                            | —                  |
| `[x] CUMPLE` | LIM-007 | Feedback no es única fuente de evaluación docente                   | Ficha A5 §4 "Nunca presentes el digest como evaluación oficial" + `07-…` §4                          | —                  |
| `[x] CUMPLE` | LIM-008 | No acosar mediante proactivo / no explotar memoria                  | `04-…` §6 (frecuencia, silencio) + `07-…` §4                                                         | —                  |
| `[x] CUMPLE` | LIM-009 | No exponer DM en canales públicos salvo transferencia consentida    | `04-…` §5 + `05-…` §5 + glosario `Transferencia consentida`                                          | —                  |
| `[x] CUMPLE` | LIM-010 | Restricción pedagógica: no solución evaluable en un solo mensaje    | `02-…` §3 modos `guided_only`/`refuse_solution` + escenario A                                        | —                  |
| `[x] CUMPLE` | LIM-011 | NO se exige vigilar/bloquear cadenas incrementales (postura)        | `02-…` §3 final ("no consume historial para vigilar secuencias"); `00-glosario` `Cadena incremental` | —                  |
| `[x] CUMPLE` | LIM-012 | F4: no datos específicos del caso, no trámite, no reemplaza oficial | Escenario B + ficha A3 §5                                                                            | —                  |
| `[x] CUMPLE` | LIM-013 | F6: no sustituye evaluaciones; no expone datos sensibles            | `02-…` §7 (digest sin quizzes ni transcripciones) + ficha A5 §4                                      | —                  |
| `[x] CUMPLE` | LIM-014 | F7: no sustituye comunicaciones oficiales                           | `04-…` §6 + ficha A4 §5                                                                              | —                  |

## Formato Y Artefactos Exigidos

| Estado       | ID      | Artefacto o formato                                   | Evidencia verificada                                                       | Pendiente o acción |
| ------------ | ------- | ----------------------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | FMT-001 | Documento principal en Markdown                       | Todo `spec/` en `.md`                                                      | —                  |
| `[x] CUMPLE` | FMT-002 | Glosario al inicio (sección temprana de definiciones) | `spec/00-glosario.md` (entregable 0)                                       | —                  |
| `[x] CUMPLE` | FMT-003 | Matriz agente–ambiente (tabla)                        | `05-…` §3                                                                  | —                  |
| `[x] CUMPLE` | FMT-004 | Diagrama de secuencia con orden temporal explícito    | `06-…` 4 `mermaid sequenceDiagram`                                         | —                  |
| `[x] CUMPLE` | FMT-005 | Multi-materia aplicable a N materias (no monolítico)  | `03-…` §6 ("Agregar una cursada exige registrar… pero no agregar agentes") | —                  |

## Decisiones Abiertas Que La Entrega Debe Cerrar

| Estado        | ID      | Decisión requerida                                                          | Postura encontrada                                                                                                                                                            | Pendiente o acción                                                                                                   |
| ------------- | ------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `[x] CUMPLE`  | DEC-001 | Quién detecta fuera de dominio                                              | A1 Frontier clasifica y emite (`02-…` §4)                                                                                                                                     | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-002 | Único orquestador vs P2P                                                    | Coordinador reactivo A1 (`02-…` §1; `09-…` §1)                                                                                                                                | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-003 | Agente guardián/scaffolding                                                 | No como agente; `OutputPolicy` determinista (`09-…` §1)                                                                                                                       | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-004 | Usuario/Discord como agente                                                 | No; usuario es actor, Discord es ambiente (`09-…` §1)                                                                                                                         | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-005 | Nudge a DM para código sensible                                             | `05-…` §6 paso 3 (sugerencia de continuar por DM)                                                                                                                             | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-006 | UX adicional para ingreso de código                                         | Slash commands (`/feedback`, `/incorporar-material`, etc.) + bloque/adjunto (`05-…` §2, §6)                                                                                   | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-007 | Personalidad única o "voces"                                                | "Una personalidad consistente… cambia la postura, no la identidad" (`09-…` §1)                                                                                                | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-008 | Conversaciones largas                                                       | STM contexto mínimo + reenvío de bloque/adjunto (`09-…` §1)                                                                                                                   | —                                                                                                                    |
| `[ ] PARCIAL` | DEC-009 | Feedback: identificado/pseudónimo/anónimo agregado hacia docente            | Diseño expone los 3 valores `anonimo`/`pseudonimo`/`identificado_con_consentimiento` como configurables por cátedra; no fija un default explícito en la consigna de auditoría | Sugerencia: declarar default seguro (p. ej. `anonimo` salvo consentimiento) en `02-…` §7 o `09-…` §1                 |
| `[x] CUMPLE`  | DEC-010 | Quién modera feedback                                                       | A5 (`spec/agents/05-feedback-agent.md` §3.3, §3.4 escalada humana)                                                                                                            | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-011 | Docente usa mismos agentes o capacidades separadas                          | Capacidades separadas: A6 + digest A5; sin acceso a consultas privadas (`02-…` §6)                                                                                            | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-012 | Otras fuentes iniciales y prioridad                                         | Seed opcional; prioridad a versión docente confirmada (`09-…` §1)                                                                                                             | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-013 | Versionado/vigencia del canal docente                                       | A6 versiona; `vigente/obsoleto/pendiente_confirmacion` (`00-glosario.md` §5; `05-…` §4)                                                                                       | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-014 | Quién valida antes del uso                                                  | Confianza en rol autorizado; conflictos ambiguos `pendiente_confirmacion` (`09-…` §1)                                                                                         | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-015 | Lenguajes permitidos por materia                                            | "Lista textual configurable por materia" (`09-…` §1)                                                                                                                          | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-016 | Multi-materia: genérico vs por materia                                      | Genéricos parametrizados por `subject_id` (`03-…` §1)                                                                                                                         | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-017 | Prioridad si dos agentes responden lo mismo                                 | A1 orquesta y ensambla; ruteo único por tabla `02-…` §2                                                                                                                       | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-018 | Mezcla teoría+código+admin: orden                                           | A1 separa intención y ensambla en una salida (escenario C)                                                                                                                    | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-019 | Estado compartido durante sesión y dueño                                    | STM en `MemoryStore` por usuario+materia (`04-…` §1, §4)                                                                                                                      | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-020 | Memoria entre sesiones: retención, granularidad, dueño                      | Cursada + 6 meses, hechos mínimos, `MemoryStore` (`04-…` §1, §2)                                                                                                              | —                                                                                                                    |
| `[ ] PARCIAL` | DEC-021 | Quién genera quizzes y criterio de dificultad                               | A2 los genera; criterio de dificultad no fijado                                                                                                                               | Sugerencia: explicitar criterio (p. ej. progresivo por unidad, o "según el tema consultado") en ficha A2 o `09-…` §3 |
| `[x] CUMPLE`  | DEC-022 | Distinción "ayuda para aprender" vs "ayuda que hace la tarea" por respuesta | `OutputPolicy.assistance_mode` (`normal/guided_only/refuse_solution`) (`02-…` §3)                                                                                             | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-023 | Si se almacenan código/conversaciones                                       | No por defecto; hechos mínimos (`04-…` §2)                                                                                                                                    | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-024 | Aislamiento por origen público/DM                                           | `origin_visibility` por hecho (`04-…` §5; `00-glosario.md` `Visibilidad de origen`)                                                                                           | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-025 | Integración retención y memoria entre sesiones                              | Mismo `MemoryStore` con políticas explícitas (`04-…` §1, §4)                                                                                                                  | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-026 | Qué ocurre con feedback hacia docentes (retención, entrenamiento)           | Feedback Store por materia, no entrena A2/A4, retención por cátedra (`09-…` §1)                                                                                               | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-027 | Reducción de filtrado entre usuarios/materias                               | `SubjectRouter` + partición + matriz §3 + tabla riesgos                                                                                                                       | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-028 | Latencia y degradación                                                      | "Una respuesta normal prioriza un solo round… ante indisponibilidad se informa" (`09-…` §2) + `08-…` §3                                                                       | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-029 | Idioma, tono y accesibilidad                                                | Español claro, tono respetuoso, traducción como extensión (`09-…` §2)                                                                                                         | —                                                                                                                    |
| `[x] CUMPLE`  | DEC-030 | Escala/métricas adicionales de autoevaluación                               | Escala cualitativa "alta/media/alta" + 5 dimensiones extra (`08-…` §5)                                                                                                        | —                                                                                                                    |

## Consistencia Y Factibilidad

| Estado       | ID      | Control                                                                             | Evidencia o conflicto                                                              | Pendiente o acción |
| ------------ | ------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------ |
| `[x] CUMPLE` | CAL-001 | Glosario coherente con el resto del texto                                           | STM/LTM y `subject_id` se usan con el mismo sentido en `02-…`, `04-…`, `05-…`      | —                  |
| `[x] CUMPLE` | CAL-002 | Matriz agente–ambiente coherente con permisos y roles                               | A6 solo lee canal docente; A4 solo escribe DM; coherente con `02-…` §6 y `07-…` §4 | —                  |
| `[x] CUMPLE` | CAL-003 | Escenarios y diagramas de secuencia coherentes                                      | Pasos numerados y `sequenceDiagram` describen el mismo flujo en A, B, C, D         | —                  |
| `[x] CUMPLE` | CAL-004 | Flujo ingreso de código coherente con escenario A                                   | `05-…` §6 pasos 1–6 igualan escenario A (`06-…` §1)                                | —                  |
| `[x] CUMPLE` | CAL-005 | 7 bloques funcionales cubiertos por escenarios                                      | `06-…` §5 tabla de cobertura                                                       | —                  |
| `[x] CUMPLE` | CAL-006 | No solapamiento confuso de responsabilidades                                        | Trade-off explícito en `01-…` §7 y separación entre A2/A3/A4/A5/A6                 | —                  |
| `[x] CUMPLE` | CAL-007 | Anti-alucinación alineado con reconducción a docentes                               | `07-…` §2 + ficha A1 + `02-…` §4                                                   | —                  |
| `[x] CUMPLE` | CAL-008 | Argumentos de autoevaluación anclados al diseño con límite                          | `08-…` §§2,3,4 cada métrica con argumento y "Límite honesto"                       | —                  |
| `[x] CUMPLE` | CAL-009 | Privacidad coherente entre retención, memoria, feedback, multi-materia y público/DM | `04-…` §5, `05-…` §5, `02-…` §7 y `03-…` §3 sin contradicciones                    | —                  |
| `[x] CUMPLE` | CAL-010 | Canal docente coherente con base de conocimiento                                    | `05-…` §4 alimenta KB/Config que A2/A3 consumen                                    | —                  |
| `[x] CUMPLE` | CAL-011 | Si hay políticas, alineadas con NO bloqueo de cadenas incrementales                 | `OutputPolicy` actúa por respuesta, no por historial (`02-…` §3 final)             | —                  |
| `[x] CUMPLE` | CAL-012 | Riesgos creíbles con mitigaciones reales (no relleno)                               | `07-…` §2 tabla de 15 filas riesgo↔mitigación↔responsable                          | —                  |

## Pendientes Priorizados

| Prioridad | IDs     | Cambio requerido                                                                                                                                                                           | Donde corregir                                                                                   |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Baja      | DEC-009 | Declarar default explícito de política de anonimato para `A5`/digests (p. ej. `anonimo` salvo consentimiento explícito); está implícito en el guardrail de A5 pero no fijado como postura. | `spec/02-interaccion-y-coordinacion.md` §7 o `spec/09-preguntas-abiertas-y-no-funcionales.md` §1 |
| Baja      | DEC-021 | Explicitar el criterio de dificultad con el que A2 genera quizzes (p. ej. acorde al tema consultado y la unidad vigente en KB).                                                            | Ficha `spec/agents/02-tutor-agent.md` o `spec/09-…` §1                                           |

## Conclusión

Dictamen: **Cumple con pendientes**. La especificación cubre los 8 entregables obligatorios, las 7 funcionalidades, los requisitos de glosario, matriz agente–ambiente y diagrama de secuencia, los límites globales y las decisiones abiertas; los escenarios A/B/C abordan las tres tensiones pedidas y los diagramas son coherentes con el paso a paso. Riesgos residuales: dos posturas implícitas sobre preguntas abiertas (anonimato del feedback y criterio de dificultad de quizzes) conviene explicitarlas para evitar interpretaciones. Validaciones efectuadas: lectura completa de `enunciado.md` y de los entregables 0–9, fichas de los 6 agentes y `spec/README.md`; verificación cruzada entre matriz agente–ambiente, escenarios, ingreso de código y política de salida; comprobación de coherencia STM/LTM y de aislamiento multi-materia. Limites de la auditoría: no se ejecutaron herramientas externas; las referencias a la API/permisos de Discord se aceptan como citas conceptuales declaradas en `05-…` §8.
