# 13 — Derivación a Humanos (consultas mixtas o sensibles)

## Descripción

Cuando la consulta mezcla **situación personal y reglas**, el sistema no decide: usa información genérica y orienta al estudiante hacia el área/rol/canal que corresponde (docente, bedelía, secretaría académica, etc.). No tramita ni valida certificados.

## Postura SMA

Quien actúa es **A1 — Frontier Agent**. Es coherente con su rol: detectar casos límite y derivar es parte de su responsabilidad social.

No agregamos un agente "Sensitive Case Classifier" separado porque sería duplicar deliberación con A1, que ya tiene el contexto y la habilidad de redactar respuestas cordiales con derivación.

Si el caso amerita aviso explícito al docente, A1 escribe en el canal docente o lo etiqueta para que lo lea.

## Agentes participantes

- **A1 — Frontier Agent** (social).

## Herramientas

- **LLM** para redactar respuesta genérica + sugerencia.

## Referencias salientes

- **04, 05, 07, 09, 12**.

## Referencias entrantes

- **07** — out-of-domain.
- **09** — Practice Agent ante ambigüedad de consigna.
- **12** — Admin Info ante caso particular.

## Diagrama C4 Container

```mermaid
C4Container
    title 13 - Derivacion a Canales Humanos
    Person(student, "Estudiante", "Caso personal + reglas")
    Person_Ext(teacher, "Docente / Rol humano", "Recibe derivacion")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "")
        Container(humanchan, "Canal humano (docente/bedelia)", "Ambiente Discord", "Hilos, canal de catedra, etc.")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(frontier, "A1 - Frontier Agent", "Agente reactivo + social", "Detecta caso sensible, redacta generico y deriva")
    }

    System_Ext(llm, "LLM", "Herramienta")

    Rel(student, gw, "1. Consulta mixta [ver 04/05]")
    Rel(gw, frontier, "2. Mensaje + contexto")
    Rel(frontier, llm, "3. Redacta respuesta generica + orientacion al canal humano")
    Rel(frontier, gw, "4. Responde al estudiante")
    Rel(frontier, humanchan, "5. Si amerita: notifica al canal humano")
    Rel(humanchan, teacher, "6. El humano toma el caso")
    Rel(gw, student, "7. Recibe respuesta + a quien acudir")
```
