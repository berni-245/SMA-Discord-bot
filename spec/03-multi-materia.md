# Entregable 3 — Multi-materia
> Glosario [00](00-glosario.md); agentes [01](01-inventario-y-justificacion-de-agentes.md); coordinación [02](02-interaccion-y-coordinacion.md).
## 1. Propósito y alcance
**Contexto de materia**, **aislamiento** (KB, config, memoria, feedback) y **ambigüedad**. Modelo *N*; ejemplo **Programación II** / **Álgebra II**.
## 2. Decisión: una materia = un servidor de Discord
Una materia ↔ un servidor (*guild*).
**Justificación:** límite servidor = materia; contexto **determinístico** (§3); stores + permisos separados; cada materia dueña de servidor/stores.
- Disuelve "¿quién posee la verdad si dos materias comparten Discord?" — no comparten.
**Trade-off:** sin multi-materia en un servidor; ambigüedad solo **DM** (§5). *Límite E8:* costo *N* servidores.
## 3. Resolución del contexto de materia
**Subject Router** (infra §7):
- **Canales del servidor:** mapeo servidor → tenant **determinístico** (sin ambigüedad).
- **DM:** sin servidor — una materia en matrícula → inferida; varias → ambigüedad → **A1** (§5).
`subject_id` **inyectado** e **invariante** en handoffs ([E2 §5/§7](02-interaccion-y-coordinacion.md)).
## 4. Aislamiento entre materias
Frontera servidor + tenant:
| Store | Clave de partición | Qué aísla | Consumidores |
|---|---|---|---|
| **KB Store** | materia | Material teórico-práctico curado | A2, A7 (vía RAG); cura A11 |
| **Config Store** | materia | Fechas, modalidad, reglas, **evaluativas activas** | A6, A5 |
| **Memory Store** | **usuario + materia** | Memoria longitudinal del alumno | A8 (custodio) |
| **Feedback Store** | materia | Encuestas y digests | A10 |
**Invariantes:** sin I/O fuera de tenant; **A11** solo cura KB de su servidor; memoria **usuario+materia** = dos universos si cursa dos materias (E4).
Visibilidad por canal (DM no expuesto) es ortogonal al aislamiento por materia.
## 5. Manejo de ambigüedad (solo en DM)
1. Router por **matrícula**.
2. Una materia → tenant resuelto.
3. Varias → `ambiguo`; **A1** pregunta ("¿de qué materia?"); sin derivar hasta respuesta.
4. Resuelta → fija en STM (A8) para la sesión.
> **Ilustración.** Dos servidores → auto; DM *"¿cuándo es el parcial?"* → pregunta cuál (Ej. 5 A1).
## 6. Escala a *N* materias
1. Servidor Discord. 2. Particiones KB/Config/Memory/Feedback. 3. Registro en Subject Router.
**No** se clonan agentes: A1..A11 genéricos con tenant; coordinación **constante** vs *N* (no 30×11). Cuellos E8.
## 7. Componentes de soporte no-agente
Lo determinístico = **infra** (sin deliberación): **Subject Router**; identidad (cuenta institucional ↔ Discord); config docente → Config Store (E5). Registro de materia y roles = precondiciones, no agentes.
## 8. Casos límite
DM sin materias→A1 orienta; cruzada→servidor correcto; docente solo su materia (E2 §9).
## 9. Síntesis
**Una materia = un servidor** + tenant; ambigüedad **DM** (A1); escala sin clonar agentes (E5 registro/identidad).
