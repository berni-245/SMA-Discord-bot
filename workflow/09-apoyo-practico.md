# 09 — Apoyo al Trabajo Práctico (incluye análisis de código)

## Descripción

Interpretar consignas sin oficializarlas, explicar procedimientos, revisar avances, detectar errores conceptuales o metodológicos, señalar inconsistencias, ayudar a destrabar y sugerir mejoras. En materias de programación incluye analizar el código del estudiante.

**Restricción del enunciado**: la respuesta del bot **no** debe equivaler a la solución entregable en un solo mensaje. El enunciado **no exige** detectar cadenas incrementales: la postura se regula respuesta a respuesta.

## Postura SMA

Este es el feature donde el SMA muestra más valor. Concurren varios agentes con responsabilidades distintas:

- **A3 — Practice Agent** (reactivo + social): genera el borrador de ayuda.
- **A4 — Scaffolding Agent** (social, política pedagógica): **antes de publicar**, revisa el borrador y lo recorta si entrega demasiado en un solo mensaje. Es el patrón de "agente de andamiaje" sugerido por el enunciado.
- **A5 — Evaluative Guard Agent** (reactivo): si la consulta cae sobre una evaluativa activa, redirige a [10](10-bloqueo-evaluativas.md) **antes** de invocar Practice.

El código llega a A3 vía el pipeline determinista de [06](06-ingreso-codigo.md).

## Agentes participantes

- **A3 — Practice Agent**
- **A4 — Scaffolding Agent**
- **A5 — Evaluative Guard Agent**
- **A8 — Memory Agent** (registra avance/duda)

## Herramientas

- **RAG retrieval** sobre KB.
- **LLM** para análisis y redacción.

## Referencias salientes

- **02, 06, 10, 13, 16**.

## Referencias entrantes

- **04, 05** — dispatch desde el Frontier Agent.

## Diagrama C4 Container

```mermaid
C4Container
    title 09 - Apoyo Practico con Scaffolding
    Person(student, "Estudiante", "Consulta sobre TP / codigo / consigna")
    Person_Ext(teacher, "Docente", "Consultado ante ambiguedad")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "[ver 04/05]")
        Container(guard, "A5 - Evaluative Guard", "Agente reactivo", "Chequea evaluativas activas [ver 10]")
        Container(practice, "A3 - Practice Agent", "Agente reactivo + social", "Interpreta consigna, analiza codigo, detecta errores")
        Container(scaff, "A4 - Scaffolding Agent", "Agente social - politica pedagogica", "Revisa borrador y evita sobre-entrega en un mensaje")
        Container(memory, "A8 - Memory Agent", "Agente reactivo", "[ver 16]")
        ContainerDb(kb, "KB Store por materia", "Datos", "[ver 02]")
    }

    System_Ext(llm, "LLM", "Herramienta")
    System_Ext(rag, "RAG Retrieval", "Sobre KB")

    Rel(frontier, guard, "1. Pre-check evaluativa")
    Rel(guard, practice, "2a. Si NO es evaluativa: continua")
    Rel(guard, frontier, "2b. Si SI: redirige a [ver 10]")
    Rel(practice, memory, "3. Trae historial")
    Rel(practice, rag, "4. Busca patrones / teoria asociada")
    Rel(rag, kb, "5. Recupera")
    Rel(practice, llm, "6. Analiza codigo y arma borrador")
    Rel(practice, teacher, "7. Si la consigna es ambigua: consulta docente [ver 13]")
    Rel(practice, scaff, "8. Borrador para revision pedagogica")
    Rel(scaff, llm, "9. Recorta / reformula para no entregar solucion")
    Rel(scaff, gw, "10. Publica respuesta orientadora")
    Rel(practice, memory, "11. Registra avance/duda [ver 16]")
    Rel(gw, student, "12. Recibe ayuda")
```
