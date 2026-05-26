# Reporte de revision de la propuesta `spec/`

> **Estado del reporte:** documento de diagnóstico previo a la corrección. Sus hallazgos fueron aplicados en la especificación vigente: la arquitectura final usa **6 agentes lógicos** y componentes deterministas, según [`spec/README.md`](spec/README.md), [`spec/01-inventario-y-justificacion-de-agentes.md`](spec/01-inventario-y-justificacion-de-agentes.md) y [`resumen-cambios-spec.md`](resumen-cambios-spec.md). Las referencias de este reporte a la versión de 11 agentes describen el estado auditado original, no la propuesta final.

## 1. Dictamen ejecutivo

La propuesta esta muy bien cubierta documentalmente: identifica agentes, define memoria entre sesiones, aisla materias, modela Discord como ambiente, incluye matriz agente-ambiente, ingreso de codigo, escenarios A/B/C con diagramas, riesgos y autoevaluacion. No hay un bloque grande de la consigna completamente ausente.

Sin embargo, **no la implementaria tal como esta**. Hay cuatro problemas que conviene corregir antes de entregar o implementar:

1. La arquitectura de **11 agentes** agrega complejidad innecesaria para una consigna conceptual y para una futura implementacion. Varias piezas son politicas o servicios deterministas, no agentes autonomos.
2. El flujo de practica aplica una restriccion **mas fuerte que la consigna**: si una consulta toca un evaluable activo, impide que A3 ayude incluso con debugging parcial permitido.
3. Hay inconsistencias internas sobre DM, memoria, fuera de dominio y actualizacion administrativa.
4. Algunas decisiones asumen capacidades de Discord que requieren permisos/intents o son desaconsejadas para bots, en especial la lectura pasiva del canal docente y el DM proactivo sin consentimiento previo.

**Recomendacion:** mantener el modelo general (un bot, aislamiento por materia, memoria minima, feedback agregado), pero reducirlo a **6 agentes logicos** y convertir ruteo de tenant, privacidad, extraccion de codigo, persistencia y control de postura en infraestructura/politicas simples.

## 2. Cobertura de la consigna

| Requisito obligatorio | Estado | Evidencia / observacion |
|---|---|---|
| Glosario temprano: sesion vs conversacion | Cumple | `spec/00-glosario.md`, seccion 1; alineado con STM/LTM en `spec/04-*`. |
| Inventario, rol, recursos, fuera de alcance y justificacion de agentes | Cumple, sobredimensionado | `spec/01-*` y `spec/agents/`; la cobertura es alta, pero 11 agentes elevan el costo. |
| Reactivo/proactivo/social y contraste administrativo-seguimiento | Cumple | A6 reactivo vs A9 proactivo en `spec/01-*` y fichas. |
| Coordinacion, ruteo, roles de usuario y circuito de feedback | Cumple con ajustes | `spec/02-*`; deben corregirse telemetria privada y la salida fuera de dominio de una ficha. |
| Multi-materia y aislamiento | Cumple | `spec/03-*`: una materia = un servidor + stores particionados. Es una opcion valida y simple. |
| Memoria entre sesiones, seguimiento, opt-out y ejemplo dia 1/dia N | Cumple conceptualmente; ajustar Discord | `spec/04-*`; debe pasar de opt-out posterior a **opt-in previo** para DM proactivo. |
| Discord como ambiente y matriz agente-ambiente | Cumple con inconsistencias | `spec/05-*`; la matriz mezcla quien redacta con quien publica realmente. |
| Canal docente de actualizacion durante la cursada | Parcial | Existe `#material-catedra` y A11, pero avisos/fechas pueden no llegar al `Config Store` que consulta A6. |
| Privacidad publica/DM y casos intermedios | Cumple, con riesgo evitable | Buen etiquetado; no conviene habilitar seguimiento publico aunque sea configurable. |
| Ingreso de codigo desde Discord | Cumple | Bloque, adjunto o link en `spec/05-*`; conviene reducir a bloque/adjunto del mensaje disparador. |
| Fuera de dominio + reconduccion a docentes | Parcial por inconsistencia | La regla general cumple; el ejemplo de A1 no reconduce a docentes. |
| Escenarios A/B/C y diagrama de secuencia | Cumple, con error en A | `spec/06-*`; el escenario A afirma que un DM tiene materia resuelta por servidor. |
| Riesgos y limites eticos | Cumple, incompleto respecto de plataforma | `spec/07-*`; faltan `MESSAGE_CONTENT`, fallos de DM y permisos de lectura/escritura. |
| Autoevaluacion: escala, robustez y flexibilidad | Cumple | `spec/08-*`; la calificacion de robustez es optimista para tantos puntos compartidos. |

## 3. Hallazgos y pendientes

### Criticos antes de implementar o entregar

#### H1. El canal docente no actualiza de forma confiable la informacion administrativa

La consigna exige que mensajes, correcciones y **avisos de fechas** aportados por docentes mediante el canal especializado se incorporen al conocimiento consumido por los agentes. La propuesta divide la verdad:

- A11 procesa el canal y la KB: `spec/05-conexion-con-discord.md:75-80`.
- A6 y A5 consumen `Config Store`: `spec/03-multi-materia.md:44-49`.
- Ante un aviso administrativo, A11 solo propone sincronizar configuracion: `spec/agents/11-kb-curator-agent.md:45-48` y `:70`.

Por lo tanto, una fecha corregida en el canal puede quedar visible en KB pero **no** ser la fecha que A6 informa.

**Cambio minimo:** hacer que el mismo flujo de incorporacion docente escriba segun tipo en una unica fuente logica: `material` a KB; `fecha/regla/evaluable` a Config Store versionado; `correccion` obsoleta la version anterior. Si hace falta confirmacion docente, el dato queda `pendiente` y ningun agente lo presenta como vigente hasta confirmar.

#### H2. La politica de evaluables bloquea ayuda que la consigna permite

La consigna solo prohíbe entregar una solucion final completa en un mensaje; permite analizar codigo, detectar errores y sugerir pasos aun en trabajos practicos. En cambio la propuesta establece que `is_evaluative=true` implica no derivar nunca a A3:

- `spec/02-interaccion-y-coordinacion.md:94-100`.
- `spec/agents/01-frontier-agent.md:38-40`.
- `spec/06-escenarios-y-trazabilidad.md:28-34`.

Esto incumple funcionalidad por exceso: ante "este recorrido del TP me falla, en que concepto me estoy equivocando?" deberia poder orientar sin resolver.

**Cambio minimo:** reemplazar `is_evaluative` como puerta cerrada por `assistance_mode`:

| Modo | Ejemplo | Salida permitida |
|---|---|---|
| `normal` | ejercicio de practica no entregable | Explicacion, diagnostico y pistas. |
| `guided_only` | codigo de TP activo con pedido de ayuda parcial | Diagnostico conceptual y proximo paso, sin codigo final. |
| `refuse_solution` | "pasame resuelto el TP" | Rechazar solucion completa y ofrecer guia conceptual/parcial. |

Asi A3/Tutor sigue atendiendo el frente practico; una politica de salida revisa la densidad antes de publicar.

#### H3. Hay vigilancia multi-turno no necesaria y contradictoria

La propuesta afirma que A5 no mira memoria (`spec/04-memoria-entre-sesiones-y-seguimiento.md:46-59`; `spec/agents/05-evaluative-guard-agent.md:56-62`), pero su entrada incluye `recent_turn_signals` provenientes de STM (`spec/agents/05-evaluative-guard-agent.md:216-230`) y el escenario A permite `pattern_flag` al docente (`spec/06-escenarios-y-trazabilidad.md:32`).

Esto agrega una vigilancia que la consigna expresamente no exige, tensiona privacidad y contradice la supuesta independencia del dictamen.

**Cambio minimo:** eliminar `recent_turn_signals`, `pattern_flag` y toda notificacion docente por secuencia de consultas. Evaluar solamente el mensaje actual y la politica de respuesta actual.

#### H4. Inconsistencia de materia en DM

El modelo multi-materia dice correctamente que un DM no trae servidor y puede requerir aclarar materia (`spec/03-multi-materia.md:20-35`, `:57-68`). Sin embargo, el escenario A declara DM y luego resuelve Programacion II "por el servidor" (`spec/06-escenarios-y-trazabilidad.md:21-27`, diagrama `:46-49`).

**Cambio minimo:** en el escenario A indicar que la materia ya habia sido seleccionada en la sesion DM o agregar el intercambio de desambiguacion `A1 -> Estudiante -> A1`.

### Importantes

#### H5. La salida operativa de fuera de dominio omite la reconduccion obligatoria

La regla conceptual de A1 es correcta (`spec/02-interaccion-y-coordinacion.md:106-121`), pero el ejemplo operativo para una consulta sobre ChatGPT responde "te conviene otro espacio" y no orienta a docentes/canal humano (`spec/agents/01-frontier-agent.md:145-166`).

**Cambio minimo:** cambiar ese ejemplo para incluir: "Este tema esta fuera del dominio de Sistemas Operativos; si necesitas confirmar si se relaciona con la cursada, consulta al equipo docente en `#consultas-catedra`."

#### H6. El feedback mezcla opinion voluntaria con telemetria pedagogica

La consigna pide que estudiantes puedan aportar feedback a docentes. La propuesta envia encuestas automaticamente y agrega tasa de resolucion/temas de friccion (`spec/agents/10-feedback-agent.md:26-46`; `spec/06-escenarios-y-trazabilidad.md:163-166`). Eso convierte desempeno o actividad privada en analitica docente, aunque este agregado.

No esta estrictamente prohibido si es agregado, consentido y con muestra minima, pero incrementa privacidad y complejidad sin ser necesario para cumplir.

**Cambio minimo:** A10 recibe `/feedback` voluntario o un boton opcional "Dar feedback"; el digest agrega solo respuestas efectivamente aportadas. Los resultados de quiz quedan en memoria del estudiante para seguimiento, no en el digest docente, salvo consentimiento explicito separado.

#### H7. La matriz agente-ambiente confunde salida logica con accion sobre Discord

Se declara un solo bot y A1 como integrador, pero la matriz marca que A2, A3, A4, A6 y A7 actuan/publican directamente (`spec/05-conexion-con-discord.md:9-17`, `:45-73`), mientras en escenarios A1 ensambla antes del Gateway (`spec/06-escenarios-y-trazabilidad.md:118-121`).

**Cambio minimo:** distinguir dos columnas: `produce borrador interno` y `publica por Gateway`. Para respuestas al estudiante, solo `Outbound Dispatcher/Gateway` publica tras aplicar Privacy Filter; los agentes no escriben directamente al canal.

## 4. Compatibilidad con Discord

### Lo que si es viable

- Un solo bot instalado en varios servidores y con roles/canales separados es viable.
- Responder en canales cuando el usuario `@menciona` al bot es viable y reduce lectura innecesaria.
- Recibir DM enviados al bot, y leer codigo en el texto o adjunto de ese DM, es viable.
- Enviar mensajes a un canal de Discord o DM es una capacidad de la API, sujeta a permisos, acceso y errores.

### Lo que debe ajustarse

| Diseno actual | Restriccion de Discord | Cambio recomendado |
|---|---|---|
| A11 detecta cualquier publicacion en `#material-catedra` | Sin `MESSAGE_CONTENT`, los campos `content`, `attachments`, `embeds` y `components` llegan vacios para mensajes ordinarios no dirigidos a la app. | Usar `/incorporar-material` o exigir `@bot incorporar` en el canal docente. Evita depender del intent privilegiado. |
| Analizar codigo en un mensaje publico cualquiera | La propuesta ya exige `@mencion`; en ese caso el contenido es accesible. | Mantener `@bot` o usar comando; documentarlo como condicion del flujo. |
| Extraer codigo desde enlace a mensaje previo | Para obtener el mensaje en canal de servidor hacen falta `VIEW_CHANNEL` y `READ_MESSAGE_HISTORY`; ademas complica privacidad e intent de contenido. | Para el MVP aceptar solo bloque o adjunto textual en el mensaje que dispara la consulta. |
| A9 envia DM proactivo por defecto y ofrece opt-out despues | Discord documenta que los DM deberian generalmente iniciarse por accion del usuario y que aperturas masivas pueden limitarse/bloquearse; el envio tambien puede fallar (`50007`). | Exigir `/seguimiento activar` o boton de consentimiento antes del primer DM; registrar fallo y no publicar fallback. |
| `mention_publico` para seguimiento | Aunque configurable, revela publicamente que el alumno interactuo con seguimiento; es superficie de filtrado innecesaria. | Eliminarlo del alcance inicial; seguimiento solo por DM opt-in. |
| Hilos y canales restringidos | El bot solo puede leer/escribir donde sus permisos lo permitan. | Explicitar permisos minimos: `VIEW_CHANNEL`, `SEND_MESSAGES`; `READ_MESSAGE_HISTORY` solo si se conservan links/replies/hilos. |

**Fuentes oficiales consultadas:**

- Discord, Message Resource: <https://docs.discord.com/developers/resources/message>
- Discord, Upgrading Apps to Use Application Commands: <https://docs.discord.com/developers/tutorials/upgrading-to-application-commands>
- Discord, User Resource - Create DM: <https://docs.discord.com/developers/resources/user>
- Discord, Opcodes and Status Codes (`50007`): <https://docs.discord.com/developers/topics/opcodes-and-status-codes>

## 5. Arquitectura simplificada recomendada

La consigna requiere un **sistema multiagente**, no once prompts independientes ni que cada politica sea un agente. Una propuesta mas implementable mantiene especializacion donde hay comportamiento distinto y deja las invariantes deterministas fuera del SMA.

### Seis agentes logicos

| Agente propuesto | Absorbe | Responsabilidad |
|---|---|---|
| A1 Frontier / Coordinador | A1 | Resuelve intencion, pide materia en DM, deriva, ensambla respuesta y reconduce a humanos/fuera de dominio. |
| A2 Tutor | A2 + A3 + A7 y orientacion de A1 | Teoria, practica/codigo, quiz y checklist pedagogico, parametrizado por modo. |
| A3 Admin | A6 | Reglas y fechas publicadas; caso particular siempre se deriva. Reactivo. |
| A4 Follow-up | A9 | Seguimiento proactivo solo por DM con opt-in, leyendo hechos minimos de memoria. Proactivo. |
| A5 Feedback | A10 | Recepcion voluntaria, moderacion y digest agregado a docentes. |
| A6 Knowledge Curator | A11 | Incorpora aportes docentes versionados a KB o Config segun su tipo. |

### Infraestructura, no agentes

| Pieza | Reemplaza / concentra | Motivo |
|---|---|---|
| `SubjectRouter` + tenant stores | modelo existente | Lookup y particion son deterministas. |
| `Auth/Role Check` | modelo existente | Permisos/autorizacion, no deliberacion. |
| `MemoryStore` + reglas de acceso | A8 como agente | Guardar, expirar, borrar y filtrar por etiquetas es una politica de datos; A4 lo consulta. |
| `InputExtractor` | Code Extractor/Validator | Acepta bloque o adjunto textual del mensaje disparador. |
| `OutputPolicy` | A4 + A5 | Marca `normal/guided_only/refuse_solution`, aplica privacidad y nunca publica solucion completa. |
| `Scheduler` | disparador de A9 | Solo despierta al Follow-up si existe consentimiento. |
| `OutboundDispatcher` | publicacion dispersa | Unico actuador del bot; aplica visibilidad y maneja fallos Discord. |

### Por que conserva funcionalidad y robustez

- Conserva especialistas diferenciables: tutor, administracion, seguimiento, feedback y curacion docente.
- Mantiene el contraste requerido: Admin es reactivo y Follow-up es proactivo.
- Evita que politicas deterministas agreguen handoffs y contradicciones.
- La politica de practica permite ayuda parcial incluso sobre evaluables y frena solamente la sobre-entrega.
- El fallo del Tutor degrada teoria/practica/quiz, pero Admin, Follow-up, Feedback y Curator siguen aislados; esta degradacion debe declararse honestamente en la autoevaluacion.

## 6. Cambios por documento

| Archivo | Cambio recomendado |
|---|---|
| `spec/README.md` | Sustituir listado de 11 agentes por la arquitectura reducida y declarar comandos de Discord/DM opt-in. |
| `spec/00-glosario.md` | Agregar `opt-in de seguimiento`, `OutputPolicy` y distinguir agente que redacta de dispatcher que publica. |
| `spec/01-inventario-y-justificacion-de-agentes.md` | Reducir a 6 agentes; justificar que stores/politicas/ruteo determinista son infraestructura. |
| `spec/02-interaccion-y-coordinacion.md` | Reemplazar `A5 -> A3 -> A4` por `OutputPolicy -> Tutor`; remover vigilancia multi-turno; corregir feedback voluntario. |
| `spec/03-multi-materia.md` | Mantener una materia = un servidor; explicitar contexto elegido en DM dentro de una sesion. |
| `spec/04-memoria-entre-sesiones-y-seguimiento.md` | Memory como store gobernado; seguimiento solo con opt-in previo y DM; eliminar mencion publica. |
| `spec/05-conexion-con-discord.md` | Ingesta docente mediante `/incorporar-material` o mencion; Config versionado en el mismo flujo; matriz con publicador unico; permisos/intents/errores. |
| `spec/06-escenarios-y-trazabilidad.md` | Corregir DM del escenario A; demostrar ayuda `guided_only` en TP activo; actualizar actores reducidos. |
| `spec/07-riesgos-supuestos-y-limites-eticos.md` | Agregar riesgos de intent, fallo de DM, permisos y analitica no consentida. |
| `spec/08-autoevaluacion-de-la-arquitectura.md` | Recalificar robustez considerando que Tutor agrupa contenido; argumentar menor complejidad y menos fallos de coordinacion. |
| `spec/09-preguntas-abiertas-y-no-funcionales.md` | Registrar decisiones: slash para ingesta, DM opt-in, feedback voluntario, sin link a mensajes en MVP. |
| `spec/agents/` | Reemplazar fichas por seis specs, o conservar solo como anexo de la version anterior si no se reescribe aun. |

## 7. Prioridad de correccion

1. Corregir H1-H5 porque afectan cumplimiento o coherencia directa de la consigna.
2. Ajustar el modelo a capacidades de Discord: ingesta explicita y seguimiento DM con opt-in.
3. Reducir agentes y flujos internos antes de convertir la especificacion en plan de implementacion.
4. Simplificar feedback y entrada de codigo para achicar superficie de privacidad y permisos.

## Conclusion

La propuesta actual es **completa como entrega conceptual**, pero **demasiado compleja y con varias aristas no implementables sin decisiones adicionales**. Con los cambios propuestos se conserva todo lo obligatorio de la consigna, se respeta mejor la plataforma Discord y se obtiene un SMA mas defendible: menos agentes, menos datos sensibles circulando y politicas mas faciles de verificar.
