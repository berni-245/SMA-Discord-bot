# 09 — Preguntas abiertas (registro de postura)
> Entregables 1–8. Glosario [00](00-glosario.md).
## 1. Propósito
**Todas** las preguntas abiertas de la consigna con **postura del grupo**. Si ya está desarrollada en otro entregable → referencia; si no tenía lugar propio (voces, conversaciones largas, lenguajes, fuentes/prioridad, NF) → se cierra aquí.
Convención: **Postura** + **(Ver …)** al entregable detallado.
## 2. Arquitectura multiagente
- **Fuera de dominio:** **A1 (Frontier)** clasifica; sin agente OOD separado. Cordial + "fuera del dominio del asistente de la materia" + docentes. *( [E2 §6](02-interaccion-y-coordinacion.md), [E7 §4](07-riesgos-supuestos-y-limites-eticos.md).)*
- **Orquestación:** **híbrida** — A1 entrada; handoffs directos; STM en A8. *( [E2 §2](02-interaccion-y-coordinacion.md).)*
- **Guardián/scaffolding:** **sí** — **A5** evaluable activo; **A4** densidad borrador A3; sin bloqueo multi-turno. *( [E1](01-inventario-y-justificacion-de-agentes.md), [E2 §2/§5](02-interaccion-y-coordinacion.md).)*
- **Usuario/Discord agente:** **no**; Discord ambiente; usuario actor externo. *( [E5 §1](05-conexion-con-discord.md), [E7 §2](07-riesgos-supuestos-y-limites-eticos.md).)*
## 3. Discord y experiencia de usuario
- **Nudge DM código:** **Privacy Hint** sugiere DM antes de analizar (no imposición). *( [E5 §6/§8](05-conexion-con-discord.md).)*
- **Canales por rol:** visibilidad = **quién lee**; hilo hereda padre. *( [E5 §2](05-conexion-con-discord.md).)*
- **Slash:** `/mi-historial`, `/borrar-historial`, `/restablecer-perfil`, `/checklist`; privacidad por canal + nudge DM. *( [E5 §3/§8](05-conexion-con-discord.md).)*
- **Código UX:** bloque, adjunto texto, enlace mensaje; sin hilos obligatorios; rechaza binarios/imagen-código. *( [E5 §8](05-conexion-con-discord.md).)*
- **Voces (aquí):** un bot; voces por agente — A2 didáctico; A3 técnico-par; A6 neutro; A9 suave; rioplatense+A1. *Límite:* coherencia entre fichas.
- **Conversaciones largas (aquí):** **STM** A8 en sesión + enlace para código; **LTM** hechos entre sesiones. *Límite:* sin texto exacto de mensajes viejos. *( [E4 §2](04-memoria-entre-sesiones-y-seguimiento.md).)*
## 4. Estudiantes, docentes y feedback
- **Feedback anonimato:** configurable (`anónimo`/`pseudónimo`/`identificado`); default agregado/anonimizado. *( [E2 §10](02-interaccion-y-coordinacion.md).)*
- **Moderación:** A10 auto (ataques/odio fuera, críticas OK) + flag humano; bienestar escalado. *( [E2 §10](02-interaccion-y-coordinacion.md), [E7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*
- **Docente vs estudiante:** capacidades separadas — A11, A10 digest, config. *( [E2 §9](02-interaccion-y-coordinacion.md), [E3 §8](03-multi-materia.md).)*
## 5. Datos y conocimiento
- **Fuentes/conflicto (aquí):** viva = canal docente (A11); *seed* PDF/legacy con vigencia; reciente del canal gana (`obsoleto` auditable); ambiguo → `defer_to_teacher`. *( [E1 A11](01-inventario-y-justificacion-de-agentes.md), [E5 §5](05-conexion-con-discord.md).)*
- **Versionado:** A11 versiona; previa `obsoleto`; agentes citan **vigente**. *( [glosario §5](00-glosario.md), [E5 §5](05-conexion-con-discord.md).)*
- **Validación:** confianza docente; A11 origen/rol + coherencia estructural, no corrección académica. *( [E7 §2](07-riesgos-supuestos-y-limites-eticos.md), [E1 A11](01-inventario-y-justificacion-de-agentes.md).)*
- **Lenguajes (aquí):** **por materia**, default tolerante; A3 estructura/semántica; fuera del set declarado → señala. *Límite:* sin ejecución; nichos más genéricos.
- **Multi-materia:** genéricos parametrizados; **una materia = un servidor** → sin verdad compartida en Discord. *( [E3](03-multi-materia.md).)*
## 6. Coordinación y conflictos
- **Prioridad:** A1 un destino por mensaje. *( [E2 §8](02-interaccion-y-coordinacion.md).)*
- **Mezcla:** orden fijo (política→admin→teoría→práctica); A1 ensambla. *( [E2 §8](02-interaccion-y-coordinacion.md), Esc. C [E6 §4](06-escenarios-y-trazabilidad.md).)*
- **Estado sesión:** **STM** custodiada por **A8**. *( [E2 §7.3](02-interaccion-y-coordinacion.md), [E4 §2](04-memoria-entre-sesiones-y-seguimiento.md).)*
- **Memoria entre sesiones:** retención **1 cursada + 6 meses** (borrado real); hechos pedagógicos mínimos (no transcripciones); dueño **A8**; log mínimo de operación; A9 alineado con visibilidad de origen, opt-out y rate-limit. *( [E4 §3/§5/§6/§7](04-memoria-entre-sesiones-y-seguimiento.md).)*
## 7. Autoevaluación y límites pedagógicos
- **Quizzes:** **A7**, siguiente paso pedagógico (dudas→ese tema; avance→sube). *( [E1 A7](01-inventario-y-justificacion-de-agentes.md), Esc. D [E6 §5](06-escenarios-y-trazabilidad.md).)*
- **Aprender vs tarea:** A5 bloquea evaluable; A4 acota densidad; A3 socrático. *Límite:* sin cadenas incrementales. *( [E2 §5](02-interaccion-y-coordinacion.md), [E7 §2](07-riesgos-supuestos-y-limites-eticos.md).)*
## 8. Privacidad, seguridad y abuso
- **Almacenamiento:** no transcripciones ni código crudo; hechos pedagógicos; retención acotada. *( [E4 §3/§5](04-memoria-entre-sesiones-y-seguimiento.md).)*
- **Público vs DM:** visibilidad `publico`/`privado`/`dm`; público sin contenido de DM. *( [E4 §6](04-memoria-entre-sesiones-y-seguimiento.md), [E5 §6](05-conexion-con-discord.md).)*
- **LTM:** misma capa LTM, etiquetas + minimización. *( [E4 §3/§6](04-memoria-entre-sesiones-y-seguimiento.md).)*
- **Feedback docente:** agregado/anonimizado; no entrena otros agentes. *( [E2 §10](02-interaccion-y-coordinacion.md), [E7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*
- **Filtrado:** partición usuario+materia (A8); una materia = un servidor. *( [E3 §4](03-multi-materia.md), [E7 §6](07-riesgos-supuestos-y-limites-eticos.md).)*
## 9. Requisitos no funcionales (a nivel conceptual)
- **Latencia/degradación (aquí):** **degradación elegante por frente** — agente/paso caído o timeout → A1 informa frente no disponible + alternativas/reconducción, sin colgar todo. *Límite:* health-check/timeout conceptual. *( [E8 §3](08-autoevaluacion-de-la-arquitectura.md).)*
- **Idioma/accesibilidad (aquí):** español rioplatense default; adaptación al idioma del alumno; no multilingüe pleno; markdown legible (lectores pantalla); código en bloques; tono por agente sin condescendencia.
## 10. Evaluación del propio diseño
- **Escala/métricas:** Bajo/Medio/Alto (agentes vs operativo); trazabilidad; priorizar SPOF, *N* servidores, transversal. *( [E8 §1/§5](08-autoevaluacion-de-la-arquitectura.md).)*
## 11. Cierre
Ninguna postura cambia la arquitectura: **afinan** decisiones explícitas. Coherentes con parametrización multi-materia, STM/LTM, un bot, postura pedagógica y límites [E8](08-autoevaluacion-de-la-arquitectura.md).
