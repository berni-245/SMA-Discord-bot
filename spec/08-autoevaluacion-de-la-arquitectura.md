# Entregable 8 — Autoevaluación de la arquitectura

## 1. Síntesis de la decisión

La arquitectura usa **6 agentes** más infraestructura determinista. Concentrar las invariantes en componentes deterministas mantiene acotados los contratos internos y los puntos de desacuerdo sin eliminar ningún bloque funcional de la consigna.

## 2. Escalabilidad multi-materia

**Evaluación: alta a nivel conceptual.** Los agentes reciben `subject_id` y no se replican. Agregar materias incrementa:

- servidores, roles y permisos administrados;
- particiones de KB, Config, Memory y Feedback;
- costo de indexación para A6 y de digests para A5;
- oportunidades de seguimiento que Scheduler evalúa para A4 (ventana 2–5 días post-sesión y `dm_contactable` por estudiante).

**Límite honesto:** el límite real no es el número de agentes sino la operación de múltiples servidores y stores: alta de permisos, indexación y auditoría pueden convertirse en cuello de botella.

## 3. Robustez y degradación

| Falla                     | Se degrada                                                    | Sigue disponible                                               |
| ------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| A2 Tutor                  | Teoría, práctica, quiz y orientación pedagógica               | Admin, feedback, curator y seguimiento previamente configurado |
| A3 Admin                  | Fechas/reglas conversacionales                                | Tutor, feedback y seguimiento                                  |
| A4 Follow-up              | Contacto proactivo                                            | Atención reactiva completa                                     |
| A5 Feedback               | Digests                                                       | Atención y memoria                                             |
| A6 Curator                | Actualizaciones nuevas; se conserva última versión confirmada | Atención con fuentes vigentes existentes                       |
| MemoryStore               | Personalización y seguimiento                                 | Consultas sin memoria                                          |
| OutputPolicy o Dispatcher | Publicación segura                                            | Debe fallar cerrado: no se publica                             |
| SafetyClassifier o CrisisEscalationProtocol | Escalamiento automático de crisis              | Debe fallar cerrado: no tratar como tutoría; avisar por canal docente alternativo si está configurado |

**Trade-off honesto:** integrar teoría, práctica y quiz en A2 amplía el impacto de su caída. A cambio, evita handoffs entre especialistas pedagógicos y mantiene las políticas como infraestructura; una respuesta normal resulta más consistente y la implementación, más simple.

Si A2 no está disponible, A1 informa al estudiante que temporalmente no puede atender explicación, código ni quiz y puede seguir derivando consultas administrativas a A3 o recibir feedback por A5. No promete una ayuda pedagógica degradada sin el agente responsable.

Si A2 está disponible pero detecta una crisis durante una continuidad, no intenta resolverla: devuelve control a A1/protocolo. Esto reduce el riesgo de que el ruteo por último agente esconda una señal de seguridad humana.

## 4. Flexibilidad

Para incorporar, por ejemplo, un agente de bienestar estudiantil:

1. A1 incorpora la intención de derivación segura.
2. Se define su acceso mínimo a datos y su canal permitido, previsiblemente DM.
3. OutputPolicy impide publicaciones sensibles.
4. La matriz Discord agrega su fila.

No requiere modificar A2, A3, A5 o A6 ni el modelo multi-materia. Las reglas deterministas transversales continúan en infraestructura.

**Evaluación: alta con integración acotada. Límite honesto:** el nuevo agente exigiría definir política de datos sensibles, derivación humana y canal permitido; no basta con agregarlo al catálogo de A1.

## 5. Métricas de evaluación

| Dimensión                   | Evaluación | Fundamento                                                         |
| --------------------------- | ---------- | ------------------------------------------------------------------ |
| Complejidad de coordinación | Baja       | Seis agentes; políticas/stores fuera del SMA                       |
| Privacidad                  | Alta       | Origen, consentimiento, publicación única y feedback agregado      |
| Trazabilidad                | Alta       | Versionado KB/Config, citas, modos de salida, logs mínimos y casos de crisis auditados |
| Robustez                    | Media/alta | Pocos handoffs; A2 concentra capacidades pedagógicas               |
| Compatibilidad Discord      | Alta       | Eventos explícitos, permisos acotados, DMs fallables y contactabilidad previa contemplados |

## 6. Mejoras futuras

- Precisar formato de auditoría y retención configurable.
- Fijar tamaño máximo de adjuntos y latencia objetivo.
- Definir política de muestra mínima del digest por cátedra.
- Medir cuántos flujos alcanzan `refuse_solution` para revisar la política sin perfilar estudiantes.

## 7. Síntesis

La arquitectura reserva el concepto de agente para comportamientos con objetivos propios y deja las invariantes en servicios auditables. El costo aceptado es que A2 se vuelve un punto de degradación pedagógica más amplio, explícitamente reconocido.
