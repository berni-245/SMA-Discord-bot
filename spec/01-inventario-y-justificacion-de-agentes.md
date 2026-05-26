# Entregable 1 — Inventario y justificación de agentes

> Sistema multiagente de soporte a la cursada en Discord (estudiantes y docentes), alcance **multi-materia**.

## 1. Propósito y alcance de este documento

Primer entregable. Responde: (1) **cuántos agentes y granularidad** + alternativas; (2) **qué hace cada uno** (rol, responsabilidades, capacidades, recursos, aporte, **fuera de alcance**); (3) **carácter** reactivo/proactivo/social y **BDI**, con contraste A6↔A9.

Capa conceptual. Spec operativa en [`agents/`](agents/), enlazada desde §5.

> **Glosario:** **sesión** vs **conversación**, STM vs persistencia: [00-glosario.md](00-glosario.md). No redefinidas acá.

## 2. Contexto de diseño que condiciona el inventario

- **Discord = ambiente:** permisos, roles, canales, visibilidad → agentes custodian invariantes (privacidad, aislamiento), no solo responden.
- **Multi-materia:** *N* servidores, conocimiento/políticas **aislados** → parametrización (`subject_id`), no agente por cursada.
- **Límites éticos:** no evaluables completos, no reemplazar docente, no exponer privado, no spam proactivo → políticas **auditables** separadas.

## 3. Decisión de granularidad

### 3.1. La decisión

**11 especialistas** + frontera **A1**. Especialistas + orquestación liviana (no pocos generalistas).

| # | Agente | Una línea | Carácter |
|---|---|---|---|
| A1 | [Frontier](agents/01-frontier-agent.md) | Clasifica, rutea, bordes (fuera de dominio, derivación, ambigüedad) | reactivo + social |
| A2 | [Theory](agents/02-theory-agent.md) | Teoría anclada en KB | reactivo |
| A3 | [Practice](agents/03-practice-agent.md) | TP y código sin solución | reactivo + social |
| A4 | [Scaffolding](agents/04-scaffolding-agent.md) | Recorta borrador A3 | social |
| A5 | [Evaluative Guard](agents/05-evaluative-guard-agent.md) | Dictamen evaluativa activa | reactivo |
| A6 | [Admin Info](agents/06-admin-info-agent.md) | Admin pública; deriva particulares | **reactivo** |
| A7 | [Quiz](agents/07-quiz-agent.md) | Quizzes + feedback orientativo | reactivo |
| A8 | [Memory](agents/08-memory-agent.md) | Memoria usuario+materia | reactivo |
| A9 | [Follow-up](agents/09-followup-agent.md) | Seguimiento proactivo | **proactivo** |
| A10 | [Feedback](agents/10-feedback-agent.md) | Feedback, modera, digests | reactivo + social |
| A11 | [KB Curator](agents/11-kb-curator-agent.md) | Aporte docente → KB | reactivo + algo proactivo |

### 3.2. Criterios de descomposición

Cada corte cumple **≥1** criterio SMA: (1) **especialización** (A2/A3/A7); (2) **políticas auditables** (A4/A5 vs A3); (3) **frontera ambiente** (A8/A11); (4) **carácter** (A9 vs reactivos, §6); (5) **autonomía acotada** (A11 difiere, A5 dictamina, A4 recorta).

### 3.3. Por qué no “pocos agentes generales”

Posturas en conflicto; políticas diluidas; reactivo+proactivo ambiguo; punto único de falla (caída A3/A4/A5 no tumba teoría/admin).

### 3.4. Por qué no “muchos más agentes”

Un A8 (no tres por capa memoria); fuera-de-dominio en A1; parametrización (no clonar A2 por materia).

### 3.5. Cobertura: ningún bloque sin dueño

| Necesidad | Agente(s) |
|---|---|
| Teoría | **A2** (+A8, A11) |
| Práctica/código | **A3** (+A5, A4) |
| Quiz | **A7** |
| Admin | **A6** |
| Acompañamiento | **A9**, A1 (orientación compuesta) |
| Feedback | **A10** |
| Memoria/seguimiento | **A8**, **A9** |
| Ruteo/bordes | **A1** |
| Conocimiento vivo | **A11** |
| Privacidad/aislamiento | **A8** (+ todos) |

Fronteras: §7.

## 5. Fichas de agentes

Esquema: Rol · Hace · Recursos · Aporte/Fuera · BDI · Spec.

### A1 — Frontier Agent
Front desk. Auth, materia, `intent`, ruteo simple/compuesto, bordes, sanitizar, jailbreak. Catálogo, privacidad, A8. Entrada única; sin técnico/notas/info inventada. **BDI** reactivo+social: routing sin filtrar privado. [agents/01-frontier-agent.md](agents/01-frontier-agent.md)

### A2 — Theory Agent
Teoría KB (RAG A11), nivel A8. KB, A8, temario. Frente teórico; sin inventar, práctica/admin. **BDI** reactivo. [agents/02-theory-agent.md](agents/02-theory-agent.md)

### A3 — Practice Agent
TP/código sin solución; categorías error; →A4, escalado A5. KB práctica, código, A8, A5. Sin solución/ejecución/tests ocultos. **BDI** reactivo+social. [agents/03-practice-agent.md](agents/03-practice-agent.md)

### A4 — Scaffolding Agent
Editor densidad borrador A3. Política, heurísticas, A8. Auditable vs A3. **BDI** social. [agents/04-scaffolding-agent.md](agents/04-scaffolding-agent.md)

### A5 — Evaluative Guard Agent
Dictamen evaluativa activa; `pattern_flag`. Evaluativas, reloj. Sin redactar ni memoria alumno. **BDI** reactivo. [agents/05-evaluative-guard-agent.md](agents/05-evaluative-guard-agent.md)

### A6 — Admin Info Agent
Config literal; “no consta”; deriva. **Polo reactivo §6.** Sin extrapolar ni tramitar. **BDI** reactivo. [agents/06-admin-info-agent.md](agents/06-admin-info-agent.md)

### A7 — Quiz Agent
Quiz no oficial; A8 tema; default DM. Sin entregables ni A9. **BDI** reactivo. [agents/07-quiz-agent.md](agents/07-quiz-agent.md)

### A8 — Memory Agent
STM/LTM/Profile; visibilidad origen; opt-out. Stores, retención. Custodia privacidad; niega A5. **BDI** reactivo. [agents/08-memory-agent.md](agents/08-memory-agent.md)

### A9 — Follow-up Agent
Proactivo acotado (scheduler, anti-spam, opt-out). **Polo proactivo §6.** Sin técnico/vigilancia. **BDI** proactivo. [agents/09-followup-agent.md](agents/09-followup-agent.md)

### A10 — Feedback Agent
Encuesta, digest, moderación, escalado. Stores, anonimato. Circuito no oficial. **BDI** reactivo+social. [agents/10-feedback-agent.md](agents/10-feedback-agent.md)

### A11 — KB Curator Agent
Aporte docente → KB; versionar; `defer_to_teacher`. KB Store, canal docente. Alimenta A2/A7. **BDI** reactivo+◐. [agents/11-kb-curator-agent.md](agents/11-kb-curator-agent.md)

## 6. Carácter reactivo / proactivo / social y BDI (análisis transversal)

### 6.1. Clasificación

| Agente | Reactivo | Proactivo | Social |
|---|:---:|:---:|:---:|
| A1 Frontier | ● | | ● |
| A2 Theory | ● | | |
| A3 Practice | ● | | ● |
| A4 Scaffolding | | | ● |
| A5 Evaluative Guard | ● | | |
| A6 Admin Info | ● | | |
| A7 Quiz | ● | | |
| A8 Memory | ● | | |
| A9 Follow-up | | ● | |
| A10 Feedback | ● | | ● |
| A11 KB Curator | ● | ◐ | |

(● predominante, ◐ parcial.) Proactividad: A9 (+A11 parcial). Social: A1, A3↔A4, A10.

### 6.2. Contraste obligatorio: A6 (reactivo) vs A9 (proactivo)

**A6:** consulta-respuesta; *intentions* al estímulo, mueren al responder. **A9:** inicia contacto (scheduler); *desire* propio; anti-abuso (opt-out, rate-limit, silencio). Separados: nunca molestar vs nunca solo esperar.

## 7. Fronteras y no-solapamiento

- **A2↔A3:** conceptos vs TP/código; práctico en A2 → *handoff*.
- **A4↔A5:** densidad (A4) vs evaluativa activa (A5); A5 antes, A4 después.
- **A6↔A9:** §6.2.
- **A8↔A11:** privado usuario vs compartido materia.
- **A7↔A3:** autoverificación vs resolución práctico.
- **A1↔especialistas:** rutea/bordes; sin dominio.

Mixtos: A1 clasifica (orientación = A6+A2). Coordinación: E2.

## 8. Supuestos y decisiones de diseño asumidas en este entregable

- Orquestación liviana (A1), no P2P puro (E2).
- Multi-materia por `subject_id` (E3).
- Andamiaje A4 opcional del enunciado, adoptado (auditable; no bloquea cadenas).
- Usuario/Discord = ambiente, no agentes.
- A5 independiente del alumno.
- 11 agentes = trade-off; más materias tensionan coordinación (E8).
