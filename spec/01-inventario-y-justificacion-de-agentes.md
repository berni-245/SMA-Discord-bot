# Entregable 1 — Inventario y justificación de agentes

## 1. Decisión de granularidad

Se modelan **6 agentes lógicos**. La especialización se conserva cuando existe una responsabilidad, audiencia o carácter autónomo distinto; los controles mecánicos pasan a infraestructura.

La versión de once agentes separaba teoría, práctica, quiz, memoria y dos controles de salida. Esa división hacía visibles las políticas, pero exigía demasiados handoffs para implementar una respuesta. La arquitectura reducida conserva los límites mediante `OutputPolicy`, `MemoryStore` y `OutboundDispatcher`, que son verificables y deterministas.

## 2. Inventario

| ID | Agente | Responsabilidad | Carácter |
|---|---|---|---|
| A1 | [Frontier / Coordinador](agents/01-frontier-agent.md) | Entrada, clasificación, coordinación, respuesta fuera de dominio | reactivo + social |
| A2 | [Tutor](agents/02-tutor-agent.md) | Teoría, práctica/código, quiz y orientación | reactivo + social |
| A3 | [Admin](agents/03-admin-agent.md) | Información administrativa publicada y derivación | reactivo |
| A4 | [Follow-up](agents/04-followup-agent.md) | Seguimiento por DM consentido | proactivo |
| A5 | [Feedback](agents/05-feedback-agent.md) | Feedback voluntario y digest docente | reactivo + social |
| A6 | [Knowledge Curator](agents/06-knowledge-curator-agent.md) | Actualización versionada de KB/Config | reactivo + social |

## 3. Infraestructura deliberadamente excluida del inventario

| Componente | Responsabilidad | Por qué no es agente |
|---|---|---|
| `SubjectRouter` | Resuelve y valida `subject_id` | Es lookup/partición determinista |
| `Auth/Role Check` | Valida usuarios y roles | Es control de acceso |
| `MemoryStore` | STM, LTM, preferencias, retención y visibilidad | Aplica reglas de datos, no persigue objetivos |
| `InputExtractor` | Extrae y valida bloque/adjunto de código | Es transformación de formato |
| `OutputPolicy` | `assistance_mode`, privacidad y densidad de ayuda | Es política auditable de publicación |
| `Scheduler` | Dispara seguimiento si hay opt-in | Es temporización |
| `OutboundDispatcher` | Envía a Discord y registra fallos | Es el actuador físico único |

## 4. Cobertura funcional

| Funcionalidad requerida | Responsable |
|---|---|
| Apoyo teórico | A2 Tutor + KB |
| Apoyo práctico y código | A2 Tutor + `InputExtractor` + `OutputPolicy` |
| Autoevaluación | A2 Tutor |
| Información administrativa | A3 Admin + Config Store |
| Acompañamiento y organización | A2 Tutor reactivo; A4 Follow-up proactivo |
| Feedback estudiante → docente | A5 Feedback |
| Memoria y contacto proactivo | `MemoryStore` + A4 Follow-up |
| Conocimiento vivo docente | A6 Knowledge Curator |
| Privacidad y Discord | `OutputPolicy` + `OutboundDispatcher` |

## 5. Fichas de agentes

### A1 — Frontier / Coordinador

- **Rol:** coordinador del intercambio con estudiantes.
- **Responsabilidades:** verificar que existe materia en contexto, inferir intención, derivar a A2/A3/A5, ensamblar respuestas mixtas y emitir la reconducción humana.
- **Capacidades distintivas:** clasificación de intenciones y manejo de bordes: materia ambigua en DM, fuera de dominio y pedidos no atendibles.
- **Recursos:** rol autorizado, `subject_id`, canal/visibilidad, contexto mínimo de `MemoryStore`, catálogo de agentes.
- **Aporte:** mantiene una única puerta lógica de atención al estudiante.
- **Fuera de alcance:** no inventa teoría, reglas administrativas ni feedback; no escribe directamente en Discord.
- **BDI:** cree el contexto saneado y la intención; busca una respuesta correcta y privada; deriva, ensambla o reconduce.

### A2 — Tutor

- **Rol:** tutor pedagógico integrado.
- **Responsabilidades:** explicar teoría, interpretar consignas, analizar código, proponer próximos pasos, generar/evaluar quizzes y armar checklists de estudio.
- **Capacidades distintivas:** cambia de modalidad pedagógica sin cambiar de materia ni audiencia; usa `assistance_mode` para ayudar sin resolver entregables.
- **Recursos:** KB vigente, código validado, memoria pedagógica mínima permitida y resultado de `OutputPolicy`.
- **Aporte:** reduce handoffs entre tareas que forman una misma conversación de aprendizaje.
- **Fuera de alcance:** no responde fechas oficiales, no entrega soluciones completas, no califica y no inicia contactos.
- **BDI:** cree el pedido, fuentes y modo permitido; busca progreso autónomo; explica, guía o autoevalúa.

### A3 — Admin

- **Rol:** orientador administrativo.
- **Responsabilidades:** responder fechas/modalidad/reglas tal como estén publicadas y derivar casos individuales.
- **Capacidades distintivas:** cita Config Store y considera “no consta” una respuesta válida.
- **Recursos:** Config Store vigente y canales humanos designados.
- **Aporte:** separa información oficial general de acompañamiento pedagógico.
- **Fuera de alcance:** no decide si un alumno califica para una excepción, no gestiona trámites ni contacta proactivamente.
- **BDI:** cree la consulta y la configuración vigente; busca exactitud; cita o deriva.

### A4 — Follow-up

- **Rol:** acompañamiento proactivo y acotado.
- **Responsabilidades:** ante un tick del scheduler, seleccionar una oportunidad mínima y redactar un único DM suave.
- **Capacidades distintivas:** iniciativa propia bajo consentimiento y anti-spam.
- **Recursos:** LTM mínima, preferencias `follow_up_optin/optout`, cooldown, horarios de silencio y Config Store.
- **Aporte:** cumple el seguimiento entre sesiones.
- **Fuera de alcance:** no contacta sin opt-in, no usa canales públicos, no enseña ni informa decisiones administrativas.
- **BDI:** cree oportunidades consentidas; busca continuidad no intrusiva; envía o pospone.

### A5 — Feedback

- **Rol:** canal de escucha entre estudiantes y cátedra.
- **Responsabilidades:** recibir `/feedback` o respuestas voluntarias, moderar y armar digest agregado.
- **Capacidades distintivas:** anonimización, mínimo de muestra y separación de crítica honesta frente a abuso.
- **Recursos:** Feedback Store por materia, política de anonimato y destino docente.
- **Aporte:** cierra el circuito pedagógico requerido.
- **Fuera de alcance:** no infiere feedback desde quizzes, no reemplaza evaluaciones oficiales y no publica detalle privado.
- **BDI:** cree aportes voluntarios y política de agregación; busca señales útiles; modera y entrega digest.

### A6 — Knowledge Curator

- **Rol:** curador del conocimiento vivo aportado por la cátedra.
- **Responsabilidades:** validar aportes explícitos docentes, clasificarlos, versionar material en KB o datos administrativos en Config, y diferir conflictos ambiguos.
- **Capacidades distintivas:** trazabilidad y vigencia consistente para contenido y configuración.
- **Recursos:** KB Store, Config Store, política de versionado y rol docente autorizado.
- **Aporte:** asegura que A2 y A3 consuman la última fuente confirmada.
- **Fuera de alcance:** no valida corrección académica, no procesa datos personales ni modifica otra materia.
- **BDI:** cree el aporte y el estado vigente; busca coherencia; versiona o consulta al docente.

## 6. Carácter y contraste obligatorio

| Agente | Reactivo | Proactivo | Social |
|---|:---:|:---:|:---:|
| A1 Frontier | ● | | ● |
| A2 Tutor | ● | | ● |
| A3 Admin | ● | | |
| A4 Follow-up | | ● | |
| A5 Feedback | ● | | ● |
| A6 Knowledge Curator | ● | | ● |

**A3 Admin** es reactivo: solo contesta reglas o fechas cuando recibe una consulta, porque anticipar decisiones administrativas podría confundir comunicaciones oficiales. **A4 Follow-up** es proactivo: el seguimiento exige iniciar contacto después de una sesión, pero únicamente con opt-in, por DM y bajo límites de frecuencia. Mantenerlos separados evita que una función informativa adquiera iniciativa intrusiva.

## 7. Trade-off asumido

Integrar teoría, práctica y quiz en A2 concentra el frente pedagógico: si falla, esas tres capacidades degradan juntas. La ventaja es una implementación menor, una conversación coherente y menos contradicciones entre prompts. Admin, Follow-up, Feedback y Curator siguen aislados por responsabilidad y pueden continuar funcionando independientemente.
