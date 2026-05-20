# 01 — Autenticación de Usuario (correo ITBA + token)

## Descripción

Mínima autenticación: el usuario informa su correo `@itba.edu.ar`, recibe un token por mail y lo ingresa en Discord. Se persiste el mapping `Discord ↔ cuenta ITBA`.

## Postura SMA

**Sin agentes.** Identidad y verificación por token son determinísticas: no hay deliberación, no hay objetivo pedagógico, no hay autonomía. Modelarlo como agente sumaría costo de coordinación sin aportar nada. Es **infraestructura de identidad** del sistema (ver [00-inventario-agentes.md](00-inventario-agentes.md)).

## Componentes (todos infraestructura)

- **Discord Gateway** — I/O con el ambiente.
- **Auth Service** — emite token, valida dominio @itba, valida token.
- **User Mapping Store** — persiste Discord ID ↔ correo ITBA.
- **Mail Service** (externo) — entrega del token al correo.

## Actores

- **Estudiante / Docente** — usuario de Discord aún no verificado.

## Referencias salientes

- Ninguna (es el punto de partida).

## Referencias entrantes

- **04, 05** — toda consulta del estudiante chequea el mapping antes de invocar agentes.

## Diagrama C4 Container

```mermaid
C4Container
    title 01 - Autenticacion de Usuario (sin agentes)
    Person(user, "Usuario", "Estudiante o docente sin verificar")

    System_Boundary(env, "Ambiente: Discord") {
        Container(gw, "Discord Gateway", "Infraestructura", "I/O Discord")
    }

    System_Boundary(bot, "Sistema del Bot") {
        Container(auth, "Auth Service", "Infraestructura", "Genera/valida tokens; verifica dominio @itba")
        ContainerDb(userdb, "User Mapping Store", "Datos", "Discord ID <-> correo ITBA")
    }

    System_Ext(mail, "Mail Service", "Envia token al correo")
    System_Ext(itba, "Dominio ITBA", "Valida formato/dominio")

    Rel(user, gw, "1. /verificar correo@itba.edu.ar")
    Rel(gw, auth, "2. Solicita verificacion")
    Rel(auth, itba, "3. Valida dominio")
    Rel(auth, mail, "4. Envia token")
    Rel(mail, user, "5. Token (fuera de Discord)")
    Rel(user, gw, "6. Envia token recibido")
    Rel(gw, auth, "7. Valida token")
    Rel(auth, userdb, "8. Persiste mapping")
    Rel(gw, user, "9. Confirma verificacion")
```
