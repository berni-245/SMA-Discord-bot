# Entregable 8 — Autoevaluación de la arquitectura

## 1. Síntesis de la decisión

La arquitectura final usa **6 agentes** más infraestructura determinista. Frente a la alternativa de 11, disminuye contratos internos y puntos de desacuerdo sin eliminar ningún bloque funcional de la consigna.

## 2. Escalabilidad multi-materia

**Evaluación: alta a nivel conceptual.** Los agentes reciben `subject_id` y no se replican. Agregar materias incrementa:

- servidores, roles y permisos administrados;
- particiones de KB, Config, Memory y Feedback;
- costo de indexación para A6 y de digests para A5;
- oportunidades consentidas que Scheduler evalúa para A4.

El límite real no es el número de agentes sino la operación de múltiples servidores y stores.

## 3. Robustez y degradación

| Falla | Se degrada | Sigue disponible |
|---|---|---|
| A2 Tutor | Teoría, práctica, quiz y orientación pedagógica | Admin, feedback, curator y seguimiento previamente configurado |
| A3 Admin | Fechas/reglas conversacionales | Tutor, feedback y seguimiento |
| A4 Follow-up | Contacto proactivo | Atención reactiva completa |
| A5 Feedback | Digests | Atención y memoria |
| A6 Curator | Actualizaciones nuevas; se conserva última versión confirmada | Atención con fuentes vigentes existentes |
| MemoryStore | Personalización y seguimiento | Consultas sin memoria |
| OutputPolicy o Dispatcher | Publicación segura | Debe fallar cerrado: no se publica |

**Trade-off honesto:** integrar teoría, práctica y quiz en A2 amplía el impacto de su caída. A cambio, elimina handoffs entre especialistas pedagógicos y políticas presentadas como agentes; la consistencia de una respuesta normal mejora y la implementación se achica.

## 4. Flexibilidad

Para incorporar, por ejemplo, un agente de bienestar estudiantil:

1. A1 incorpora la intención de derivación segura.
2. Se define su acceso mínimo a datos y su canal permitido, previsiblemente DM.
3. OutputPolicy impide publicaciones sensibles.
4. La matriz Discord agrega su fila.

No requiere modificar A2, A3, A5 o A6 ni el modelo multi-materia. Las reglas deterministas transversales continúan en infraestructura.

## 5. Métricas de evaluación

| Dimensión | Evaluación | Fundamento |
|---|---|---|
| Complejidad de coordinación | Mejorada | Seis agentes; políticas/stores fuera del SMA |
| Privacidad | Alta | Origen, consentimiento, publicación única y feedback agregado |
| Trazabilidad | Alta | Versionado KB/Config, citas, modos de salida y logs mínimos |
| Robustez | Media/alta | Menos handoffs; A2 concentra capacidades pedagógicas |
| Compatibilidad Discord | Alta | Eventos explícitos, permisos acotados y DMs fallables contemplados |

## 6. Mejoras futuras

- Precisar formato de auditoría y retención configurable.
- Fijar tamaño máximo de adjuntos y latencia objetivo.
- Definir política de muestra mínima del digest por cátedra.
- Medir cuántos flujos alcanzan `refuse_solution` para revisar la política sin perfilar estudiantes.

## 7. Síntesis

La reducción es un cambio de calidad estructural: reserva el concepto de agente para comportamientos con objetivos propios y deja las invariantes en servicios auditables. El costo aceptado es que A2 se vuelve un punto de degradación pedagógica más amplio, explícitamente reconocido.
