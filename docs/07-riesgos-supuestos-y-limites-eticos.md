# Entregable 7 — Riesgos, supuestos y límites éticos de diseño
> Glosario [00](00-glosario.md); agentes [01](01-inventario-y-justificacion-de-agentes.md); coordinación [02](02-interaccion-y-coordinacion.md); multi-materia [03](03-multi-materia.md); memoria [04](04-memoria-entre-sesiones-y-seguimiento.md); Discord [05](05-conexion-con-discord.md).
## 1. Propósito y alcance
Supuestos, anti-alucinación, fuera de dominio/ambiguas/maliciosas, filtrado, mitigaciones por agente.
## 2. Supuestos de diseño
Roles+identidad (E5); una materia=servidor (E3); docente autoridad/A11 estructura KB; LLM/RAG herramientas; feedback complementario; sin anti-fraude multi-turno.
## 3. Cómo el diseño evita alucinaciones
Anclar/reconducir: A2/A7→KB; A6→Config; cita (E5 §7); sin KB→reconducción; vigencia A11.
> **citar = no inventar**
## 4. Fuera de dominio, ambiguas y maliciosas
**A1:** cordial + "fuera del dominio del asistente de la materia" + docentes ([E2 §6](02-interaccion-y-coordinacion.md)). `<0.7` aclarar; DM materia (E3 §5); A5 `flag_review`; jailbreak rechazo; ajenos→A8 niega.
## 5. Riesgos de filtrado de información privada
A1+Privacy Filter+origen A8; A10 agregado; Privacy Hint→DM; público con consentimiento.
## 6. Riesgos creíbles y mitigaciones
| Riesgo | Cómo podría ocurrir | Mitigación en el diseño | Dónde vive |
|---|---|---|---|
| **Alucinación** | Sin base en cátedra | KB + **cita**; sin fuente → reconducción; vigencia | A2, A6, A11, A1 |
| **Filtrado entre usuarios** | Datos de otro alumno | Partición **usuario+materia**; A8 niega terceros | A8 |
| **Filtrado entre materias** | Mezclar cursadas | Servidor + tenant; `subject_id` invariante | Subject Router, A8, todos |
| **Exposición de DM en público** | Filtrar lo privado | Sanitización + Privacy Filter + origen | A1, A8, Privacy Filter |
| **Uso malicioso / jailbreak** | Ignorar instrucciones / suplantar | Rechazo cordial; guardrails | A1 (+ todos) |
| **Extracción de datos ajenos** | "¿Qué preguntó Juan?" | Sin acceso cruzado; A8 niega | A8 |
| **Resolución de evaluable (fraude)** | TP/parcial resuelto | A5 evaluable + A4 densidad; A3 socrático | A5, A4, A3 |
| **Proactivo molesto / vigilancia** | Spam / acoso | Opt-out, rate-limit, silencio | A9 |
| **Feedback ofensivo / malicioso** | Odio / ataques | Moderación A10; flag humano; bienestar | A10 |
| **Dependencia excesiva del asistente** | Dejar de pensar / consultar docente | Orientar sin resolver; reconducción | A3, A4, A1, A7 |
| **Retención de datos sensibles** | Guardar de más | Hechos mínimos; retención; borrado; controles | A8 |
| **Uso de material obsoleto** | Citar reemplazado | Versionado + vigencia auditable | A11 |
## 7. Límites éticos no negociables y dónde se hacen cumplir
| Límite | Mecanismo que lo sostiene |
|---|---|
| No corregir oficialmente trabajos/exámenes | A3 sin evaluar; sin agente calificación |
| No poner notas ni aprobar/desaprobar | Sin acceso a notas; A6/A7 sin lenguaje nota |
| No reemplazar al docente | Reconducción A1; derivación humana A6 |
| No dar información institucional sensible | A6 solo publicado; caso → deriva |
| No gestionar trámites formales | A6 deriva bedelía/secretaría |
| No tomar decisiones académicas | Docentes/áreas humanas |
| Feedback no es única fuente de evaluación | A10 digest complementario agregado |
| No acosar con proactividad | A9 opt-out, rate-limit, silencio |
| No exponer lo privado | Sanitización + Filter + origen; transferencia consentida |
## 8. Síntesis
Riesgos con mecanismos en agentes/infra (E1–E6).
