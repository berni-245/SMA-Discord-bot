# Resumen de cambios aplicados a la especificación

## Resultado

Se implementaron las recomendaciones pendientes de `reporte-revision-spec.md`: la arquitectura pasó de **11 a 6 agentes lógicos**, sin perder ninguna funcionalidad requerida por la consigna y conservando los ajustes previos de compatibilidad con Discord.

## Arquitectura vigente

| Agente | Responsabilidad |
|---|---|
| A1 Frontier / Coordinador | Ruteo, ensamblado y reconducción a humanos |
| A2 Tutor | Teoría, práctica/código, autoevaluación y orientación |
| A3 Admin | Fechas/reglas publicadas y derivación de casos particulares |
| A4 Follow-up | Seguimiento proactivo solo por DM con opt-in |
| A5 Feedback | Feedback voluntario, moderación y digest docente |
| A6 Knowledge Curator | Incorporación docente versionada en KB o Config |

## Componentes convertidos en infraestructura

- `MemoryStore` reemplaza al antiguo agente de memoria y aplica STM/LTM, retención, visibilidad y preferencias.
- `OutputPolicy` reemplaza los agentes de guardia/revisión: define `normal`, `guided_only` o `refuse_solution`, limita sobre-entrega y aplica privacidad.
- `SubjectRouter`, `Auth/Role Check`, `InputExtractor`, `Scheduler` y `OutboundDispatcher` concentran operaciones deterministas.

## Funcionalidad y robustez conservadas

- A2 puede orientar sobre un TP activo sin entregar una solución lista para presentar.
- A6 escribe material pedagógico en KB y fechas/reglas/evaluativas en Config Store versionado.
- A4 opera solo por DM tras `/seguimiento activar`; si Discord rechaza el mensaje, se registra el fallo sin mención pública.
- A5 procesa solo feedback voluntario; los quizzes no se convierten automáticamente en analítica docente.
- La materia en DM se selecciona explícitamente o se reutiliza desde STM de la sesión.

## Discord

- El diseño utiliza un solo bot y un único `OutboundDispatcher`.
- En servidor se procesan comandos o menciones dirigidas al bot, evitando depender de lectura pasiva de mensajes ordinarios.
- El flujo base de código acepta bloque o adjunto textual del mensaje actual; no necesita historial de mensajes.
- Los permisos mínimos y el posible fallo de DMs están documentados en `spec/05-conexion-con-discord.md`.

## Documentación actualizada

- Se reescribieron los entregables `spec/README.md` y `spec/00-*` a `spec/09-*` para la arquitectura de seis agentes.
- Se reemplazaron las fichas operativas de `spec/agents/` por las seis fichas vigentes.
- Se actualizaron escenarios y autoevaluación para declarar el trade-off real: A2 simplifica coordinación, pero su fallo degrada todo el frente pedagógico.
