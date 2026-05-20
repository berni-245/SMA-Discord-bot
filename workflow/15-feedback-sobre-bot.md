# 15 — Feedback Sobre el Bot (separado)

## Descripción

Feedback sobre el bot mismo (calidad de respuestas, utilidad, problemas técnicos), separado del feedback de cursada para no confundirlo con evaluación de la materia ni de los docentes.

## Postura SMA

**Sin agente propio.** Es recolección sencilla en un store separado y, opcionalmente, podría reutilizar las capacidades de moderación de **A10 — Feedback Agent**. No requiere deliberación autónoma específica; modelarlo como agente nuevo sumaría duplicación.

Se documenta como **infraestructura** que **opcionalmente** delega moderación al A10 existente.

## Componentes

- **Discord Gateway** — recoge `/feedback-bot` o reacciones de calificación.
- **Bot Feedback Service** — endpoint mínimo de recolección.
- **Feedback Store - Bot** — store separado del de cursada.

## Reutilización (opcional)

- **A10 — Feedback Agent** — puede ejecutar moderación si el contenido del feedback es ofensivo.

## Referencias salientes

- **14** — convive con (pero separado de) feedback de cursada.

## Referencias entrantes

- Ninguna estructural.

## Diagrama C4 Container

```mermaid
C4Container
    title 15 - Feedback sobre el Bot (sin agente propio)
    Person(student, "Estudiante", "Evalua al bot")
    Person_Ext(maintainer, "Equipo del Bot", "Mejora producto")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(svc, "Bot Feedback Service", "Infraestructura", "Recolecta opinion sobre el bot")
        ContainerDb(fbbot, "Feedback Store - Bot", "Datos", "Separado de cursada [ver 14]")
        Container(feedback, "A10 - Feedback Agent (opcional)", "Agente reactivo + social", "Solo si se delega moderacion")
    }

    Rel(student, gw, "1. /feedback-bot o reaccion")
    Rel(gw, svc, "2. Recoge feedback")
    Rel(svc, feedback, "3. (Opcional) modera contenido ofensivo")
    Rel(svc, fbbot, "4. Persiste separado")
    Rel(maintainer, fbbot, "5. Analiza para mejorar el bot")
```
