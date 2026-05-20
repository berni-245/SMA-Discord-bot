# 05 — Consulta de Estudiante en Canal Privado / DM

## Descripción

En DM o canal privado 1:1, el bot puede responder con **memoria completa** del alumno, sin sanear para visibilidad pública. Es el canal recomendado para código sensible o consultas largas.

## Postura SMA

Mismo punto de entrada que [04](04-consulta-canal-publico.md) pero con:

- **A1 — Frontier Agent** no aplica Privacy Filter público.
- **A8 — Memory Agent** entrega la memoria longitudinal completa (siempre acotada a la **misma materia** del canal).

## Agentes participantes

- **A1 — Frontier Agent** (reactivo + social).
- **A8 — Memory Agent** (reactivo) con visibilidad completa de la materia activa.

## Infraestructura

- **Discord Gateway**, **Auth Check**.

## Referencias salientes

- **01, 07, 08, 09, 10, 11, 12, 13, 16**.

## Referencias entrantes

- **06** — el sistema sugiere DM para código sensible.
- **17** — canal preferido por defecto para Follow-up.

## Diagrama C4 Container

```mermaid
C4Container
    title 05 - Consulta en DM o Canal Privado
    Person(student, "Estudiante verificado", "Habla en privado")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "DM / canal privado 1:1")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(authchk, "Auth Check", "Infraestructura", "[ver 01]")
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "Clasifica y despacha; sin filtro publico")
        Container(memory, "A8 - Memory Agent", "Agente reactivo", "Memoria completa de la materia [ver 16]")
    }

    Rel(student, gw, "1. Mensaje en DM/canal privado")
    Rel(gw, authchk, "2. Verifica usuario")
    Rel(gw, frontier, "3. Entrega mensaje + canal=privado")
    Rel(frontier, memory, "4. Pide memoria longitudinal completa")
    Rel(frontier, gw, "5. Respuesta detallada o handoff [ver 07/08/09/10/11/12/13]")
    Rel(gw, student, "6. Entrega 1:1")
```
