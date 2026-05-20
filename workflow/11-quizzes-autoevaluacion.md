# 11 — Autoevaluaciones / Quizzes

## Descripción

Quizzes cortos, preguntas para verificar comprensión y feedback orientativo (no calificaciones oficiales).

## Postura SMA

Agente dedicado: **A7 — Quiz Agent** (reactivo).

Es agente porque tiene beliefs sobre el **desempeño previo** del alumno y desires de adaptar la dificultad. Sus intentions: generar el quiz, evaluar respuestas y registrar el desempeño.

Convive con **A8 — Memory Agent** (persiste avance) y aporta a **A10 — Feedback Agent** la métrica de "se resolvió / no se resolvió".

## Agentes participantes

- **A7 — Quiz Agent** (reactivo)
- **A8 — Memory Agent** (reactivo)
- **A10 — Feedback Agent** (reactivo + social) — consume métrica de resolución

## Herramientas

- **RAG retrieval** y **LLM** sobre la KB.

## Referencias salientes

- **02, 14, 16**.

## Referencias entrantes

- **04, 05** — dispatch desde A1.

## Diagrama C4 Container

```mermaid
C4Container
    title 11 - Quizzes y Autoevaluaciones
    Person(student, "Estudiante", "Solicita quiz")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "[ver 04/05]")
        Container(quiz, "A7 - Quiz Agent", "Agente reactivo", "Genera y evalua quizzes")
        Container(memory, "A8 - Memory Agent", "Agente reactivo", "Avance del alumno [ver 16]")
        Container(feedback, "A10 - Feedback Agent", "Agente reactivo + social", "Metrica de resolucion [ver 14]")
        ContainerDb(kb, "KB Store por materia", "Datos", "[ver 02]")
    }

    System_Ext(llm, "LLM", "Herramienta")
    System_Ext(rag, "RAG Retrieval", "Sobre KB")

    Rel(student, gw, "1. /quiz o pide autoevaluacion")
    Rel(gw, frontier, "2. Dispatch")
    Rel(frontier, quiz, "3. Handoff a Quiz Agent")
    Rel(quiz, memory, "4. Lee desempeño previo")
    Rel(quiz, rag, "5. Toma conceptos de KB")
    Rel(rag, kb, "6. Recupera")
    Rel(quiz, llm, "7. Genera pregunta corta")
    Rel(quiz, gw, "8. Envia pregunta")
    Rel(student, gw, "9. Responde")
    Rel(gw, quiz, "10. Pasa respuesta")
    Rel(quiz, llm, "11. Evalua y arma feedback orientativo")
    Rel(quiz, memory, "12. Persiste desempeño")
    Rel(quiz, feedback, "13. Aporta metrica de resolucion [ver 14]")
    Rel(quiz, gw, "14. Devuelve feedback al alumno")
```
