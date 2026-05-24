# Workflow del Bot — Vista de Agentes

Diseño conceptual del sistema multiagente para soporte a la cursada en Discord, alineado al enunciado del TP. Cada archivo contiene un feature funcional con un diagrama C4 Container en mermaid (agnóstico de stack), marcando explícitamente qué componentes son **agentes** y cuáles son **infraestructura**.

## Supuestos generales

- La materia y los canales Discord ya están dados de alta por un admin externo.
- El docente solo aporta KB ([02](02-aporte-conocimiento-docente.md)), configura reglas/evaluativas ([03](03-configuracion-docente.md)) y consume feedback ([14](14-feedback-estudiante-docente.md)).
- Todo store está particionado por materia (multi-tenant, ver [18](18-multi-materia.md)).
- **Discord** es el **ambiente** (no UI): canales, permisos y roles son sensores/actuadores del sistema.
- **LLM** y **RAG** son herramientas que los agentes invocan, no agentes.

## Postura SMA aplicada

Modelamos como agente solo lo que tiene **beliefs / desires / intentions** o aporta deliberación. Lo determinista queda como infraestructura. Ver [00-inventario-agentes.md](00-inventario-agentes.md).

| Agente | Carácter | Features donde participa |
|---|---|---|
| A1 — Frontier Agent | reactivo + social | [04](04-consulta-canal-publico.md), [05](05-consulta-canal-privado.md), [07](07-fuera-de-dominio.md), [13](13-derivacion-humanos.md), entrada de 08/09/10/11/12 |
| A2 — Theory Agent | reactivo | [08](08-apoyo-teorico.md) |
| A3 — Practice Agent | reactivo + social | [09](09-apoyo-practico.md) |
| A4 — Scaffolding Agent | social | [09](09-apoyo-practico.md) |
| A5 — Evaluative Guard | reactivo | [09](09-apoyo-practico.md), [10](10-bloqueo-evaluativas.md) |
| A6 — Admin Info | reactivo (contraste con A9) | [12](12-informacion-administrativa.md) |
| A7 — Quiz Agent | reactivo | [11](11-quizzes-autoevaluacion.md) |
| A8 — Memory Agent | reactivo | [16](16-memoria-seguimiento.md) y consumido por 04/05/08/09/11/14/17; control de memoria por usuario en [16](16-memoria-seguimiento.md) |
| A9 — Follow-up Agent | **proactivo** (contraste con A6) | [17](17-contacto-proactivo.md), [19](19-acompanamiento.md) (recordatorios de hitos) |
| A10 — Feedback Agent | reactivo + social | [14](14-feedback-estudiante-docente.md), [11](11-quizzes-autoevaluacion.md), opcional en [15](15-feedback-sobre-bot.md) |
| A11 — KB Curator | reactivo + algo proactivo | [02](02-aporte-conocimiento-docente.md) |

## Features con coordinación multi-agente sin agente nuevo

- **[19 Acompañamiento](19-acompanamiento.md)**: funcionalidad 5 cubierta por coordinación A1 + A6 + A2 + A8; A9 extendido para recordatorios proactivos de hitos.

## Features sin agentes (justificados)

- **[01 Autenticación](01-autenticacion.md)**: identidad determinista.
- **[03 Configuración docente](03-configuracion-docente.md)**: ABM administrativo.
- **[06 Ingreso de código](06-ingreso-codigo.md)**: pipeline determinista de extracción.
- **[15 Feedback sobre el bot](15-feedback-sobre-bot.md)**: recolección simple; opcionalmente delega moderación a A10.

## Índice

| # | Feature | Archivo | Agentes |
|---|---|---|---|
| 00 | Inventario de Agentes y Postura SMA | [00-inventario-agentes.md](00-inventario-agentes.md) | — |
| 01 | Autenticación de Usuario | [01-autenticacion.md](01-autenticacion.md) | sin agente |
| 02 | Aporte de Conocimiento del Docente | [02-aporte-conocimiento-docente.md](02-aporte-conocimiento-docente.md) | A11 |
| 03 | Configuración del Docente | [03-configuracion-docente.md](03-configuracion-docente.md) | sin agente |
| 04 | Consulta en Canal Público (@mención) | [04-consulta-canal-publico.md](04-consulta-canal-publico.md) | A1, A8 |
| 05 | Consulta Privada / DM | [05-consulta-canal-privado.md](05-consulta-canal-privado.md) | A1, A8 |
| 06 | Ingreso de Código | [06-ingreso-codigo.md](06-ingreso-codigo.md) | sin agente |
| 07 | Consultas Fuera de Dominio | [07-fuera-de-dominio.md](07-fuera-de-dominio.md) | A1 |
| 08 | Apoyo Teórico | [08-apoyo-teorico.md](08-apoyo-teorico.md) | A2, A8 |
| 09 | Apoyo Práctico | [09-apoyo-practico.md](09-apoyo-practico.md) | A3, A4, A5, A8 |
| 10 | Bloqueo de Evaluativas | [10-bloqueo-evaluativas.md](10-bloqueo-evaluativas.md) | A5 |
| 11 | Autoevaluaciones / Quizzes | [11-quizzes-autoevaluacion.md](11-quizzes-autoevaluacion.md) | A7, A8, A10 |
| 12 | Información Administrativa | [12-informacion-administrativa.md](12-informacion-administrativa.md) | A6 |
| 13 | Derivación a Humanos | [13-derivacion-humanos.md](13-derivacion-humanos.md) | A1 |
| 14 | Feedback Estudiante → Docente | [14-feedback-estudiante-docente.md](14-feedback-estudiante-docente.md) | A10 |
| 15 | Feedback sobre el Bot | [15-feedback-sobre-bot.md](15-feedback-sobre-bot.md) | A10 (opcional) |
| 16 | Memoria entre Sesiones | [16-memoria-seguimiento.md](16-memoria-seguimiento.md) | A8 |
| 17 | Contacto Proactivo | [17-contacto-proactivo.md](17-contacto-proactivo.md) | A9 |
| 18 | Soporte Multi-Materia | [18-multi-materia.md](18-multi-materia.md) | A1..A11 parametrizados |
| 19 | Acompañamiento y Orientación | [19-acompanamiento.md](19-acompanamiento.md) | A1, A2, A6, A8, A9 |
