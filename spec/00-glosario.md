# Entregable 0 — Glosario

## 1. Términos transversales

- **Conversación**: secuencia coherente de turnos alrededor de una intención, dentro de un canal o hilo.
- **Sesión**: intervalo de uso continuo de un usuario en una materia. Se cierra por **inactividad** (p. ej. 30–60 min sin mensajes, configurable) o por **cierre de jornada** (fin del día calendario local de la cursada). **No** equivale al cierre del cuatrimestre. Puede contener varias conversaciones.
- **Turno**: mensaje del usuario y ciclo de respuesta del sistema.
- **Materia en contexto**: única cursada a la que pertenece una interacción, identificada por `subject_id`.
- **Memoria intra-sesión (STM)**: contexto volátil usado durante una sesión; se descarta al cerrarla.
- **Persistencia entre sesiones (LTM)**: hechos pedagógicos mínimos que sobreviven entre días y habilitan seguimiento.
- **Visibilidad de origen**: etiqueta `publico` o `dm`. `publico` cubre canales e hilos legibles por más de una persona además del bot (incluidos canales restringidos por rol). `dm` es la interacción privada 1:1 estudiante–bot.

La STM coordina el intercambio actual; la LTM permite continuidad y seguimiento. No se usan con el mismo propósito ni con la misma retención.

## 2. Ambiente Discord

- **Canal público**: espacio legible por más personas que el estudiante y el bot; se etiqueta `publico`.
- **DM**: interacción privada 1:1 entre estudiante y bot; se etiqueta `dm`.
- **Canal docente especializado**: canal por materia (p. ej. `#material-catedra`) donde docentes escriben con `/incorporar-material` (contenido → KB) o `/actualizar-catedra` (datos oficiales → Config); estudiantes pueden leer.
- **Canal docente de crisis**: canal privado por materia (p. ej. `#alertas-bienestar-catedra`) visible solo para docentes de la cátedra, donde el bot crea o actualiza un hilo por caso ante señales de autolesión, ideación suicida u otro riesgo humano urgente.
- **Hilo**: hereda la visibilidad del canal padre (`publico`), salvo configuración más restrictiva acordada por la cátedra.
- **Rol de usuario**: `estudiante`, `docente` o `ayudante`, previamente autorizado.
- **Discord Gateway**: sensor conceptual por el que llegan eventos dirigidos al bot.
- **OutboundDispatcher**: único actuador que escribe mensajes en Discord bajo la identidad del bot.
- **DM contactable**: estado operativo que indica que el estudiante ya abrió o permitió el canal privado con el bot, por ejemplo enviándole un primer mensaje o habilitando DMs desde el servidor. Si la plataforma exigiera un mecanismo equivalente, como solicitud de contacto o amistad, se trata como requisito de contactabilidad previo al seguimiento, no como dato pedagógico.
- **Transferencia consentida**: publicación trazada de contenido nacido en `dm` hacia un canal `publico`, solicitada explícitamente por el estudiante.
- **Evento de crisis o bienestar**: mensaje del estudiante que sugiere autolesión, ideación suicida, riesgo inmediato para sí o para terceros, o una situación de seguridad humana que excede el rol pedagógico del asistente.
- **Nivel de crisis (`crisis_level`)**: clasificación `none`, `distress`, `self_harm_ambiguous`, `self_harm_explicit` o `imminent_risk`. `distress` habilita contención, orientación y pausa temporal de seguimiento automático; los tres niveles de autolesión/riesgo abren o actualizan caso.
- **Pausa de seguridad (`safety_hold_until`)**: marca temporal por usuario+materia que bloquea contactos proactivos de A4 tras señales de malestar intenso que no abren caso de crisis.
- **Caso de crisis**: registro único por `user_id + subject_id` mientras está activo. Sus estados son `open`, `acknowledged`, `escalated_to_psychology` y `closed`.
- **Paquete de crisis**: evidencia para docentes de la cátedra: usuario, materia, canal de origen, timestamps, nivel detectado, mensaje detonante, respuesta de contención del bot y transcripción completa de la conversación disponible con ese estudiante en esa materia. Se usa para elevar el caso al área de psicología/bienestar de la facultad, no para evaluación académica.

## 3. Agentes vigentes

- **A1 Frontier / Coordinador**: punto de entrada lógico del estudiante; clasifica, deriva, ensambla y reconduce a humanos.
- **A2 Tutor**: especialista pedagógico que explica teoría, guía práctica, analiza código, genera quizzes y ofrece orientación.
- **A3 Admin**: especialista reactivo en información administrativa publicada y derivación de casos particulares.
- **A4 Follow-up**: agente proactivo que retoma dudas por DM; seguimiento habilitado por defecto con opt-out disponible y entrega condicionada a `dm_contactable`.
- **A5 Feedback**: recibe feedback voluntario, modera, escala abuso a autoridad designada y entrega digests agregados a docentes.
- **A6 Knowledge Curator**: procesa aportes docentes por pipeline `content` o `config` y mantiene vigentes KB Store y Config Store.

## 4. Infraestructura no agente

- **SubjectRouter**: resuelve `subject_id` por servidor; en DM solicita selección si falta contexto.
- **Auth/Role Check**: verifica autorización y rol antes de invocar agentes.
- **MemoryStore**: persiste STM, LTM y preferencias, por usuario+materia, aplicando retención y visibilidad.
- **Conversation owner (`conversation_owner_agent`)**: agente que venía atendiendo la conversación en STM. A1 lo usa como dato de continuidad, pero vuelve a decidir intención en cada turno antes de derivar.
- **InputExtractor**: extrae código desde bloque o adjunto textual del mensaje dirigido al bot.
- **OutputPolicy**: calcula `assistance_mode`, valida restricción pedagógica y reglas de privacidad (impide republicar en `publico` datos nacidos en `dm`) antes de publicar.
- **Scheduler**: evalúa a A4 entre **2 y 5 días** post-cierre de sesión, si el seguimiento sigue habilitado, el DM es contactable y la oportunidad es pertinente.
- **SafetyClassifier**: política de frontera usada por A1, y como segunda barrera por A2 si ya estaba atendiendo una continuidad, para asignar `crisis_level`.
- **CrisisCaseStore**: registro separado de la memoria pedagógica que guarda `crisis_case_id`, `thread_id`, estado, primer/último mensaje detectado, `max_crisis_level`, contador de mensajes y auditoría de acceso.
- **CrisisEscalationProtocol**: infraestructura de seguridad humana que, ante un evento de crisis detectado por A1, A2 o A5, crea o actualiza un hilo privado en el canal docente de crisis, adjunta el paquete de crisis y orienta la derivación al área institucional definida (p. ej. psicología/bienestar estudiantil).

Estos componentes aplican reglas deterministas; convertirlos en agentes sumaría coordinación sin aportar autonomía.

## 5. Conocimiento y multi-materia

- **Aislamiento por materia**: KB, configuración, feedback y memoria se particionan por `subject_id`.
- **KB Store**: material pedagógico versionado y vigente de una materia.
- **Config Store**: fechas, modalidad, reglas y evaluativas activas versionadas (solo vía `/actualizar-catedra`).
- **Aporte docente (contenido)**: enviado con `/incorporar-material` o `@bot incorporar`; siempre ingresa a KB Store, aunque mencione fechas.
- **Aporte de cátedra (config)**: enviado con `/actualizar-catedra`; ingresa a Config Store con parseo estructurado.
- **Vigencia**: estado `vigente`, `obsoleto` o `pendiente_confirmacion`.
- **Versionado**: toda actualización preserva la versión anterior para auditoría.
- **Cita de fuente**: referencia legible al material vigente usado en una respuesta.
- **`defer_to_teacher`**: decisión de A6 de no resolver una contradicción ambigua sin confirmación docente.

## 6. Aprendizaje y política de salida

- **Consigna**: enunciado que A2 puede interpretar sin oficializar; ante ambigüedad deriva a docente.
- **Ingreso de código**: bloque o adjunto textual incluido en el mensaje actual dirigido al bot.
- **Quiz**: autoevaluación breve con devolución orientativa; no es calificación oficial.
- **Evaluativa activa**: entrega o evaluación declarada vigente en Config Store.
- **`assistance_mode`**: decisión de `OutputPolicy` para una respuesta práctica: `normal`, `guided_only` o `refuse_solution`.
- **Restricción pedagógica**: nunca entregar una solución evaluable completa lista para entregar en un solo mensaje.
- **Cadena incremental**: sucesión de consultas parciales que el diseño no vigila ni bloquea.

## 7. Memoria, seguimiento y feedback

- **Seguimiento habilitado (default)**: activo al primer contacto pedagógico en la materia; el bot informa brevemente cómo desactivarlo.
- **Seguimiento entregable**: seguimiento habilitado y usuario `dm_contactable=true`; si el DM no es entregable, se registra el fallo y no hay reemplazo por canal público.
- **Opt-out**: retiro explícito con `/seguimiento desactivar`; A4 deja de contactar hasta un nuevo `/seguimiento activar`.
- **Oportunidad de seguimiento**: duda abierta, quiz a retomar o hito próximo registrado mínimamente.
- **Ítems de feedback**: tres ejes — **cursada** (claridad, ritmo, dificultad), **material** (apuntes, ejemplos, consignas) y **asistente** (utilidad del bot); elegidos por ser accionables por la cátedra sin duplicar evaluaciones oficiales.
- **Digest**: resumen agregado de feedback voluntariamente aportado por estudiantes.
- **Anonimato**: política `anonimo`, `pseudonimo` o `identificado_con_consentimiento`.
- **Moderación**: conserva crítica honesta; ante odio o ataques personales **escala a autoridad designada** (p. ej. `#moderacion-catedra`) sin almacenar el contenido como feedback.
- **Reconducción a docentes**: orientación a un canal humano ante fuera de dominio, falta de fuentes o decisiones oficiales.
- **Escalamiento de crisis**: excepción de privacidad por seguridad humana; no es feedback, no es digest y no se publica en canales estudiantiles. El acceso queda limitado a docentes de la cátedra y al canal institucional de ayuda.
