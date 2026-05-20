# 10 — Bloqueo de Instancias Evaluativas

## Descripción

El sistema no resuelve instancias evaluativas. Cuando la consulta del alumno cae sobre una evaluativa **declarada activa por el docente** (ver [03](03-configuracion-docente.md)), responde con guía procedimental sin dar la solución.

## Postura SMA

Agente dedicado: **A5 — Evaluative Guard Agent** (reactivo).

Razón de ser agente y no un check determinista: la **detección** de si una consulta cae sobre una evaluativa no es trivial (consigna puede estar parafraseada, fragmentos del enunciado pueden aparecer como código, etc.). Necesita beliefs sobre evaluativas activas y deliberación sobre el match. Su carácter es claramente **reactivo**: actúa cuando otro agente le pregunta.

## Agentes participantes

- **A5 — Evaluative Guard Agent** (reactivo).

## Infraestructura / Herramientas

- **Config Store** por materia ([ver 03](03-configuracion-docente.md)) — fuente de evaluativas activas.
- **LLM** — para evaluar similitud semántica entre consulta y evaluativa.

## Referencias salientes

- **03, 08, 09**.

## Referencias entrantes

- **04, 05, 09** — invocado como guard previo al especialista.

## Diagrama C4 Container

```mermaid
C4Container
    title 10 - Bloqueo de Evaluativas
    Person(student, "Estudiante", "Pide ayuda en una evaluativa")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "[ver 04/05]")
        Container(guard, "A5 - Evaluative Guard", "Agente reactivo", "Detecta consulta sobre evaluativa activa")
        ContainerDb(cfgdb, "Config Store por materia", "Datos", "Evaluativas activas [ver 03]")
    }

    System_Ext(llm, "LLM", "Herramienta")

    Rel(frontier, guard, "1. Pre-check de evaluativa")
    Rel(guard, cfgdb, "2. Lee evaluativas vigentes")
    Rel(guard, llm, "3. Evalua match semantico consulta-evaluativa")
    Rel(guard, frontier, "4a. Si NO: continua a [ver 08/09]")
    Rel(guard, llm, "4b. Si SI: redacta guia procedimental SIN solucion")
    Rel(guard, gw, "5. Entrega respuesta orientadora con aclaracion de politica")
    Rel(gw, student, "6. Recibe guia, no solucion")
```
