# 12 — Información Administrativa de la Cursada

## Descripción

Responde consultas administrativas públicas sobre la materia: fechas, modalidad, reglas de evaluación tal como están publicadas, organización general. Ante un **caso particular** (enfermedad, ausencia, trámite) no decide: usa información genérica de la materia y deriva al canal humano correspondiente ([ver 13](13-derivacion-humanos.md)).

## Postura SMA

Agente dedicado: **A6 — Admin Info Agent** (reactivo).

Es el contraste explícito que pide el enunciado frente a A9 (proactivo): **A6 nunca toma iniciativa**, solo responde lo publicado y se calla cuando no le consta. Sus beliefs son lo que el docente cargó en Config Store; no extrapola.

## Agentes participantes

- **A6 — Admin Info Agent** (reactivo, contraste con A9 proactivo).

## Herramientas

- **LLM** para redacción literal de lo publicado.

## Infraestructura

- **Config Store** por materia ([ver 03](03-configuracion-docente.md)).

## Referencias salientes

- **03, 04, 05, 13**.

## Referencias entrantes

- **04, 05** — dispatch desde A1.

## Diagrama C4 Container

```mermaid
C4Container
    title 12 - Informacion Administrativa
    Person(student, "Estudiante", "Pregunta por fechas, modalidad, reglas")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "[ver 04/05]")
        Container(admin, "A6 - Admin Info Agent", "Agente reactivo (contraste con A9)", "Responde solo lo publicado por el docente")
        ContainerDb(cfgdb, "Config Store por materia", "Datos", "Fechas, modalidad, reglas [ver 03]")
    }

    System_Ext(llm, "LLM", "Herramienta")

    Rel(frontier, admin, "1. Handoff: consulta administrativa")
    Rel(admin, cfgdb, "2. Recupera publicado")
    Rel(admin, llm, "3. Redacta respuesta literal")
    Rel(admin, frontier, "4a. Si caso particular: pide derivacion [ver 13]")
    Rel(admin, gw, "4b. Si publico generico: responde")
    Rel(gw, student, "5. Recibe respuesta")
```
