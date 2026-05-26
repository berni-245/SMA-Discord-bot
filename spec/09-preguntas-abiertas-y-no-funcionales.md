# Entregable 9 — Registro de decisiones y no funcionales

## 1. Decisiones cerradas

| Pregunta | Decisión |
|---|---|
| ¿Cuántos agentes? | Seis agentes lógicos; políticas y stores son infraestructura |
| ¿Cómo se determina la materia? | Un servidor por materia; en DM A1 solicita selección si es ambigua |
| ¿Cómo entra contenido docente? | `/incorporar-material` o mención explícita en canal docente |
| ¿Dónde quedan fechas/reglas? | A6 las versiona en Config Store, no solo en KB |
| ¿Cómo entra código? | Bloque o adjunto textual del mensaje actual dirigido al bot |
| ¿Se aceptan links a mensajes previos? | No en el flujo base |
| ¿Cómo se limita una evaluativa? | `OutputPolicy` usa `normal`, `guided_only`, `refuse_solution` por salida |
| ¿Se vigilan cadenas de consultas? | No |
| ¿Cómo se inicia seguimiento? | `/seguimiento activar`; A4 envía solo DM |
| ¿Qué pasa si falla un DM? | Se registra fallo; no se publica fallback |
| ¿Cómo llega feedback a docentes? | A5 agrega únicamente aportes voluntarios |
| ¿Quién publica en Discord? | `OutboundDispatcher` bajo una única identidad de bot |

## 2. Requisitos no funcionales

| Dimensión | Requisito conceptual |
|---|---|
| Privacidad | No exponer DM, memoria ni feedback identificable en público |
| Aislamiento | Toda lectura/escritura incluye `subject_id`; memoria además incluye usuario |
| Trazabilidad | Versionar fuentes; citar respuesta; registrar envíos/fallos sin contenido excesivo |
| Minimización | No persistir código ni transcripciones crudas por defecto |
| Control usuario | Historial, borrado y consentimiento de seguimiento disponibles |
| Moderación | Conservar crítica legítima y escalar abuso o riesgo humano |
| Fallo cerrado | Si no se puede aplicar OutputPolicy o verificar fuente, no publicar respuesta sustantiva |
| Plataforma | Interacciones por evento explícito; evitar lectura pasiva e historial innecesario |

## 3. Parámetros a definir por implementación/cátedra

- Tiempo de inactividad que cierra una sesión.
- Tamaño máximo de bloques o adjuntos de código.
- Retención exacta si difiere del default de cursada + 6 meses.
- Frecuencia máxima y horarios de silencio para A4.
- Muestra mínima y periodicidad del digest de A5.
- Canal humano concreto de derivación por materia.

## 4. Estado de cobertura

La propuesta cubre teoría, práctica/código, autoevaluación, administración, acompañamiento, feedback y memoria/seguimiento; define actualización docente, privacidad, fuera de dominio, escenarios, Discord como ambiente y autoevaluación de la arquitectura. Los parámetros abiertos no impiden implementar el diseño: son configuraciones institucionales o operativas.
