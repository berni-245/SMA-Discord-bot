# Entregable 0 — Glosario

## 1. Términos transversales

- **Conversación**: secuencia coherente de turnos alrededor de una intención, dentro de un canal o hilo.
- **Sesión**: intervalo de uso continuo de un usuario en una materia, delimitado por inactividad o cierre de jornada. Puede contener varias conversaciones.
- **Turno**: mensaje del usuario y ciclo de respuesta del sistema.
- **Materia en contexto**: única cursada a la que pertenece una interacción, identificada por `subject_id`.
- **Memoria intra-sesión (STM)**: contexto volátil usado durante una sesión; se descarta al cerrarla.
- **Persistencia entre sesiones (LTM)**: hechos pedagógicos mínimos que sobreviven entre días y habilitan seguimiento.
- **Visibilidad de origen**: etiqueta `publico`, `privado` o `dm` que limita reutilización y publicación de datos.

La STM coordina el intercambio actual; la LTM permite continuidad y seguimiento. No se usan con el mismo propósito ni con la misma retención.

## 2. Ambiente Discord

- **Canal público**: espacio legible por más personas que el estudiante y el bot; toda respuesta allí se considera pública.
- **DM**: interacción privada 1:1 entre estudiante y bot.
- **Canal docente especializado**: canal por materia donde docentes o ayudantes autorizados dirigen al bot aportes mediante `/incorporar-material` o `@bot incorporar`.
- **Hilo**: hereda la visibilidad de su canal padre, salvo configuración explícita más restrictiva.
- **Rol de usuario**: `estudiante`, `docente` o `ayudante`, previamente autorizado.
- **Discord Gateway**: sensor conceptual por el que llegan eventos dirigidos al bot.
- **OutboundDispatcher**: único actuador que escribe mensajes en Discord bajo la identidad del bot.
- **PrivacyFilter**: política de salida que impide publicar en espacios públicos datos nacidos en DM.
- **Transferencia consentida**: publicación trazada de contenido privado solicitada explícitamente por el estudiante.

## 3. Agentes vigentes

- **A1 Frontier / Coordinador**: punto de entrada lógico del estudiante; clasifica, deriva, ensambla y reconduce a humanos.
- **A2 Tutor**: especialista pedagógico que explica teoría, guía práctica, analiza código, genera quizzes y ofrece orientación.
- **A3 Admin**: especialista reactivo en información administrativa pública y derivación de casos particulares.
- **A4 Follow-up**: agente proactivo que retoma dudas por DM, solo con consentimiento previo.
- **A5 Feedback**: recibe feedback voluntario, lo modera y entrega digests agregados a docentes.
- **A6 Knowledge Curator**: procesa aportes docentes y mantiene vigentes KB Store y Config Store.

## 4. Infraestructura no agente

- **SubjectRouter**: resuelve `subject_id` por servidor; en DM solicita selección si falta contexto.
- **Auth/Role Check**: verifica autorización y rol antes de invocar agentes.
- **MemoryStore**: persiste STM, LTM y preferencias, por usuario+materia, aplicando retención y visibilidad.
- **InputExtractor**: extrae código desde bloque o adjunto textual del mensaje dirigido al bot.
- **OutputPolicy**: para práctica, calcula `assistance_mode` antes de que A2 redacte; luego valida la restricción pedagógica y el PrivacyFilter antes de publicar.
- **Scheduler**: despierta a A4 únicamente para usuarios con opt-in.

Estos componentes aplican reglas deterministas; convertirlos en agentes sumaría coordinación sin aportar autonomía.

## 5. Conocimiento y multi-materia

- **Aislamiento por materia**: KB, configuración, feedback y memoria se particionan por `subject_id`.
- **KB Store**: material pedagógico versionado y vigente de una materia.
- **Config Store**: fechas, modalidad, reglas y evaluativas activas versionadas.
- **Aporte docente**: texto, adjunto, enlace, corrección o aviso enviado explícitamente al bot en el canal docente.
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

- **Opt-in de seguimiento**: consentimiento mediante `/seguimiento activar` requerido antes de un contacto proactivo.
- **Opt-out**: retiro de consentimiento mediante `/seguimiento desactivar`.
- **Oportunidad de seguimiento**: duda abierta, quiz a retomar o hito próximo registrado mínimamente.
- **Digest**: resumen agregado de feedback voluntariamente aportado por estudiantes.
- **Anonimato**: política `anonimo`, `pseudonimo` o `identificado_con_consentimiento`.
- **Moderación**: filtrado de ataques personales o discurso de odio sin suprimir críticas honestas.
- **Reconducción a docentes**: orientación a un canal humano ante fuera de dominio, falta de fuentes o decisiones oficiales.
