# Puntos debiles y mitigaciones del diseno

## Resumen ejecutivo

El proyecto cumple la consigna, pero si el diseno se llevara a una implementacion real aparecerian riesgos practicos en cuatro frentes: restricciones de Discord, comportamiento estudiantil, operacion docente y gobierno de datos. Ninguno invalida la arquitectura; conviene tratarlos como decisiones de hardening antes de construir.

| Prioridad | Area | Punto debil | Mitigacion principal |
|---|---|---|---|
| Alta | Discord | Respuestas multiagente pueden tardar mas que la ventana de interaccion de Discord. | Responder/deferir rapido y procesar asincronicamente con follow-up. |
| Alta | Discord | Rate limits y errores repetidos pueden bloquear la operacion. | Cliente unico de Discord con colas, `Retry-After`, backoff, idempotencia y metricas. |
| Alta | Discord | Dependencia accidental de `MESSAGE_CONTENT` o lectura pasiva. | Mantener slash commands, DMs, menciones, message commands y adjuntos explicitos. |
| Alta | Privacidad | Estudiantes pueden pegar codigo o datos sensibles en canales publicos. | Nudges fuertes hacia DM, aviso contextual y modo "republicar" solo con consentimiento trazado. |
| Alta | Pedagogia | El limite "no resolver entregables" puede ser inconsistente entre respuestas. | Rubrica de salida para `OutputPolicy`, ejemplos de respuestas permitidas/prohibidas y auditoria docente. |
| Media | Docentes | Canal de actualizacion puede quedar desordenado o mal usado. | Formularios/comandos estructurados, validacion previa y panel de pendientes de A6. |
| Media | Estudiantes | Baja adopcion de DM/opt-out/confianza por seguimiento default. | Onboarding claro, recordatorio no intrusivo, transparencia de historial y control visible. |
| Media | Escala | Una materia por servidor simplifica aislamiento pero complica operacion masiva. | Plantillas de servidor, automatizacion de alta y tablero multi-materia. |
| Media | Calidad | KB/Config pueden quedar obsoletos aunque el pipeline exista. | Revalidacion periodica, duenos por materia, fechas de vigencia y alertas a docentes. |
| Media | Abuso | Feedback puede usarse para hostigar o manipular digests. | Muestra minima, moderacion, escalamiento humano y separacion de critica vs ataque. |

## Riesgos y formas de resolverlos

### 1. Ventana corta para responder interacciones

**Problema.** Si el sistema usa slash commands o componentes, Discord exige una respuesta inicial rapida. Un flujo con A1, A2/A3, `OutputPolicy`, busqueda en KB y generacion puede exceder esa ventana.

**Impacto.** El usuario ve error o "la aplicacion no respondio", aunque el backend despues tenga una respuesta correcta.

**Solucion.**

- Agregar al diseno una regla operativa: todo comando responde primero con un acuse breve o deferido.
- Procesar agentes en segundo plano y publicar follow-up dentro del token de interaccion.
- Definir presupuesto de tiempo: A1 + validaciones deterministas deben terminar en menos de 1 segundo; lo pesado queda asincronico.
- Si el procesamiento excede el tiempo util, enviar "lo estoy preparando" y permitir que el usuario retome por DM o hilo.

### 2. Rate limits, invalid requests y picos de cursada

**Problema.** En semanas de parcial o entrega, muchas consultas, DMs de seguimiento, digests e ingestas docentes pueden concentrarse. Ademas, permisos mal calculados o DMs fallidos repetidos pueden producir muchos 403/429.

**Impacto.** El bot puede quedar lento, perder respuestas o ser temporalmente restringido por errores repetidos.

**Solucion.**

- `OutboundDispatcher` debe ser un cliente unico con cola por `channel_id`, `guild_id` y ruta.
- Respetar headers de rate limit y `Retry-After`; nunca hardcodear limites.
- Dedupe/idempotencia: no reenviar dos veces el mismo follow-up, digest o confirmacion.
- Cortar retries de DMs fallidos: si falla una vez, marcar `dm_contactable=false` y no insistir hasta accion del usuario.
- Medir 401/403/429 por minuto y activar degradacion si suben.

### 3. Dependencia accidental de privileged intents

**Problema.** El diseno dice que no hay lectura pasiva, pero algunas UX tentadoras la reintroducen: leer todo `#consultas`, resumir hilos completos, reaccionar sin mencion, tomar codigo de mensajes previos o recolectar actividad para feedback.

**Impacto.** Se puede necesitar `MESSAGE_CONTENT`, aumentar superficie de privacidad y complejizar aprobaciones de Discord.

**Solucion.**

- Mantener regla fuerte: solo comandos, menciones, DM, adjuntos del mensaje actual o message context command explicitamente invocado.
- Si se quiere "analizar este mensaje anterior", usar comando contextual de mensaje, no lectura de historial general.
- Documentar una prueba de arquitectura: cada feature nueva debe indicar si requiere intent privilegiado; si requiere, se rechaza o se justifica aparte.
- Evitar que A5 infiera feedback desde mensajes, quizzes o actividad.

### 4. DMs no entregables y seguimiento que no llega

**Problema.** El proyecto ya contempla `dm_contactable`, pero operativamente muchos estudiantes bloquean DMs, nunca abren privado o no entienden por que el bot no los contacta.

**Impacto.** La funcionalidad 7 queda cumplida conceptualmente, pero con baja efectividad real.

**Solucion.**

- En el primer uso publico, mostrar una sola invitacion clara a ejecutar `/activar-dm`.
- Agregar estado visible en `/mi-historial`: "seguimiento habilitado, DM no activado".
- No hacer fallback publico, pero permitir que el estudiante pida manualmente "retomar dudas" desde canal o DM.
- Medir tasa de `dm_contactable=true` por materia para decidir si la catedra necesita mejor onboarding.

### 5. Publicacion accidental de codigo o dudas sensibles

**Problema.** El estudiante puede creer que un canal restringido por rol es "privado" y pegar codigo, datos personales o dudas sensibles. El diseno lo clasifica bien como `publico`, pero la expectativa humana puede diferir.

**Impacto.** Riesgo de exposicion, verguenza, conflictos con docentes o reclamos de privacidad.

**Solucion.**

- Al detectar bloque de codigo en canal publico, responder primero con advertencia corta: "este canal es visible para sus lectores; para codigo sensible usa DM".
- Permitir continuar en publico solo si el estudiante confirma.
- Poner nombres de canales que no prometan privacidad: `#consultas-publicas`, `#ayuda-compartida`.
- En transferencia consentida desde DM, mostrar vista previa exacta del fragmento a publicar.

### 6. Limite pedagogico dificil de aplicar consistentemente

**Problema.** `guided_only` y `refuse_solution` son buenos, pero en implementacion real la frontera entre pista util y solucion completa puede variar por docente, tema o tipo de TP.

**Impacto.** Algunos estudiantes podrian obtener demasiado; otros podrian recibir negativas excesivas.

**Solucion.**

- Crear una rubrica por materia para `OutputPolicy`: ejemplos de permitido, limitado y rechazado.
- Incluir "plantillas de respuesta" para cada modo.
- Guardar muestras anonimizadas de respuestas clasificadas, no para vigilar estudiantes sino para ajustar politica.
- Permitir override docente por evaluativa: nivel de ayuda `alto`, `medio`, `bajo`.

### 7. Actualizacion docente mal usada o incompleta

**Problema.** Si docentes publican fechas con `/incorporar-material` en vez de `/actualizar-catedra`, A6 sugiere el comando correcto pero A3 no usara esa fecha como oficial.

**Impacto.** El bot podria responder con una fecha vieja, aunque el aviso exista en KB como contenido.

**Solucion.**

- Para textos administrativos detectados en pipeline `content`, crear una tarea visible "pendiente de estructurar" para docentes.
- En el canal docente, responder con boton o comando rapido: "Convertir a Config".
- Panel semanal de A6: cambios detectados, pendientes de confirmacion, versiones obsoletas.
- Definir responsable real por materia para cerrar pendientes de Config.

### 8. Obsolescencia silenciosa de KB/Config

**Problema.** El versionado existe, pero no garantiza que alguien actualice material viejo o contradicciones que no pasan por A6.

**Impacto.** Respuestas formalmente citadas pero pedagogicamente desactualizadas.

**Solucion.**

- Cada fuente debe tener `vigente_desde`, `revisar_antes_de`, `owner_docente` y estado.
- A6 genera alertas periodicas: "material sin revisar hace N semanas".
- A2/A3 deben decir "no consta una version vigente" si la fuente expiro.
- Antes de parciales, ejecutar checklist docente de Config: fechas, evaluativas activas, reglas de recuperatorio.

### 9. Escalabilidad operativa del modelo "una materia = un servidor"

**Problema.** Aisla muy bien, pero multiplicar servidores puede volver pesada la administracion de roles, canales, comandos, permisos, plantillas y alta de docentes.

**Impacto.** Inconsistencias entre materias: comandos distintos, permisos mal copiados, canales faltantes.

**Solucion.**

- Crear plantilla oficial de servidor con roles, canales y permisos.
- Script o checklist de provisionamiento: registrar `subject_id`, validar canales, instalar comandos, probar DM.
- Tablero central: materias activas, version de plantilla, errores de permisos, estado de stores.
- Auditoria periodica de drift: comparar cada servidor contra plantilla base.

### 10. Sobrecarga o dependencia estudiantil

**Problema.** Aunque el bot no reemplaza docentes, puede convertirse en primer y unico recurso para estudiantes con baja confianza o poco habito de consulta humana.

**Impacto.** Menos participacion en clase, dudas que no llegan al docente, falsa sensacion de suficiencia.

**Solucion.**

- A2 debe incluir nudges pedagogicos: "si esto sigue trabado, llevalo al horario de consulta".
- A4 no debe perseguir todas las dudas: solo oportunidades de alto valor y bajo volumen.
- Digest docente puede incluir "temas mas consultados" de forma agregada, sin identificar estudiantes, para que la catedra intervenga en clase.
- Definir umbral: si muchos estudiantes preguntan lo mismo, se recomienda aclaracion docente publica.

### 11. Feedback sesgado, malicioso o poco representativo

**Problema.** El feedback voluntario suele venir de extremos: estudiantes muy conformes o muy molestos. Ademas puede haber ataques personales.

**Impacto.** Docentes pueden interpretar el digest como representativo cuando no lo es.

**Solucion.**

- Todo digest debe mostrar `N`, periodo, porcentaje estimado de participacion si se conoce y advertencia de voluntariedad.
- No emitir digest si no hay muestra minima.
- Separar "comentarios accionables" de "incidentes de moderacion".
- Para temas sensibles, derivar a canal humano y no resumir en digest ordinario.

### 12. Confusion entre informacion general y caso personal

**Problema.** Preguntas tipo "me enferme, puedo recuperar?" son frecuentes. Aunque A3 derive, el usuario puede interpretar una regla general como aprobacion de su caso.

**Impacto.** Reclamos por decisiones que el bot nunca debio tomar.

**Solucion.**

- Respuestas administrativas deben tener estructura fija: "Regla general", "Lo que no puedo determinar", "A donde consultar".
- Evitar frases tipo "podes recuperar" y preferir "la regla publicada indica que existe recuperatorio bajo condiciones".
- Citar siempre fuente y canal humano.
- En canal publico, no pedir ni aceptar certificados/datos medicos.

### 13. Seguridad de adjuntos y codigo

**Problema.** Archivos de codigo pueden incluir secretos, datos personales, binarios disfrazados o tamanos excesivos. El diseno valida texto, pero falta una politica operacional mas fina.

**Impacto.** Exposicion de credenciales, costos altos, fallos de parseo o retencion accidental.

**Solucion.**

- Validar MIME, extension, encoding y tamano antes de pasar a A2.
- Rechazar binarios, capturas y archivos comprimidos en flujo base.
- Escanear patrones de secretos y advertir al estudiante sin republicarlos.
- Normalizar codigo a un buffer efimero; persistir solo metadatos pedagogicos.

### 14. Una caida de A2 degrada demasiado

**Problema.** El propio diseno reconoce que A2 concentra teoria, practica, codigo, quiz y orientacion.

**Impacto.** Si A2 falla, gran parte del valor estudiantil desaparece.

**Solucion.**

- Separar degradacion minima: A1 puede devolver fuentes relevantes de KB sin generar explicacion nueva.
- Cachear respuestas frecuentes aprobadas por docentes para teoria basica.
- Mantener A3, A5 y A6 independientes como ya esta definido.
- Definir health checks por agente y mensaje claro al usuario.

### 15. Trazabilidad insuficiente para investigar incidentes

**Problema.** Minimizar datos es correcto, pero si se guarda demasiado poco puede ser dificil investigar "el bot publico algo privado" o "respondio una fecha vieja".

**Impacto.** No se puede reconstruir la causa sin violar privacidad.

**Solucion.**

- Logs de auditoria sin contenido crudo: `event_id`, `subject_id`, `user_hash`, visibilidad, agentes invocados, fuentes/versiones, `assistance_mode`, destino, estado de entrega.
- Para transferencias consentidas, guardar hash del fragmento publicado y consentimiento.
- Retencion corta para logs operativos; retencion separada para LTM pedagogica.
- Acceso de auditoria restringido y revisable.

## Cambios recomendados al documento

Estos puntos no son obligatorios para aprobar la consigna, pero fortalecerian el diseno:

1. Agregar una seccion "Riesgos operativos de Discord" en `spec/07-riesgos-supuestos-y-limites-eticos.md`.
2. En `spec/05-conexion-con-discord.md`, incorporar la regla de respuesta inicial/defer para slash commands y una politica explicita de rate limits.
3. En `spec/04-memoria-entre-sesiones-y-seguimiento.md`, agregar metricas de efectividad: tasa de DM contactable, opt-out y fallos de entrega.
4. En `spec/02-interaccion-y-coordinacion.md`, sumar una rubrica breve de `OutputPolicy` por materia/evaluativa.
5. En `spec/agents/06-knowledge-curator-agent.md`, agregar el estado "pendiente de estructurar" cuando A6 detecta una fecha/regla publicada por el pipeline de contenido.

## Referencias oficiales utiles

- Discord - Privileged intents y alternativas: https://docs.discord.com/developers/gateway/you-might-not-need-a-privileged-intent
- Discord - Revision de privileged intents: https://docs.discord.com/developers/gateway/getting-started-with-privileged-intent-review
- Discord - Receiving and responding to interactions: https://docs.discord.com/developers/interactions/receiving-and-responding
- Discord - Rate limits: https://docs.discord.com/developers/topics/rate-limits
- Discord - Application commands: https://docs.discord.com/developers/interactions/application-commands
- Discord - Message resource: https://docs.discord.com/developers/resources/message
