# Entregable 3 — Multi-materia

> Vocabulario en el [glosario (Entregable 0)](00-glosario.md); agentes en el [Entregable 1](01-inventario-y-justificacion-de-agentes.md); coordinación en el [Entregable 2](02-interaccion-y-coordinacion.md).

## 1. Propósito y alcance

Este entregable fija cómo el sistema **resuelve el contexto de materia**, cómo **aísla** conocimiento, configuración, memoria y feedback entre materias, y qué ocurre ante **ambigüedad**. El modelo es conceptual y aplica a *N* materias; para ilustrar uso dos materias ficticias —**Programación II** y **Álgebra II**—, pero el diseño no depende de ese número.

## 2. Decisión: una materia = un servidor de Discord

Cada materia se despliega en **su propio servidor de Discord** (*guild*): una materia ocupa un servidor, y un servidor aloja una sola materia.

**Justificación:**

- **Simplicidad y aislamiento físico.** El límite del servidor es el límite de la materia. No hace falta discriminar materias *dentro* de un mismo espacio compartido.
- **Resolución de contexto trivial y robusta.** El servidor **determina** la materia sin heurística ni inferencia (ver §3).
- **Aislamiento más fuerte.** Conocimiento, configuración, memoria y feedback se particionan por materia y, además, quedan separados por la frontera del servidor (permisos, roles y canales propios de cada uno).
- **Disuelve la pregunta "¿quién posee la verdad si dos materias comparten Discord?".** No comparten: cada materia es dueña de su servidor y de sus stores.

**Trade-off asumido (explícito):**

- Se renuncia a la organización "varias materias en un mismo servidor con categorías". A cambio se gana aislamiento y simplicidad de resolución.
- La **única** situación donde el contexto no es inmediato es el **mensaje directo (DM)**, que no tiene servidor de origen; se resuelve preguntando (§5).
- *Límite honesto para el Entregable 8:* a gran escala, muchos servidores implican costo de operación/gestión por servidor (alta, permisos, despliegue). Se retoma en escalabilidad.

## 3. Resolución del contexto de materia

El **Subject Router** —un componente de **infraestructura**, no un agente (ver §7)— resuelve la materia activa:

- **Mensajes en canales del servidor** (público, privado por rol, hilo, canal docente): el Router mapea **servidor → materia (*tenant*)** de forma **determinística**. No hay ambigüedad posible: el servidor *es* la materia.
- **Mensajes directos (DM):** no hay servidor de origen.
  - Si el usuario está matriculado en **una** sola materia, el Router la infiere de su matrícula.
  - Si está en **más de una**, marca **ambigüedad de materia** y delega la desambiguación a A1 (§5).

El `subject_id` resuelto se **inyecta en el contexto** de cada invocación de agente y viaja como **invariante** en todos los handoffs (coherente con el [Entregable 2, §5 y §7](02-interaccion-y-coordinacion.md)). Ningún salto entre agentes puede cambiarlo.

## 4. Aislamiento entre materias

El aislamiento opera en **dos planos que se refuerzan**:

1. **Frontera de servidor (física).** Canales, roles y permisos de una materia viven en su servidor; nada de otra materia es visible ahí.
2. **Partición por tenant (lógica).** Los cuatro repositorios se particionan por materia:

| Store | Clave de partición | Qué aísla | Consumidores |
|---|---|---|---|
| **KB Store** | materia | Material teórico-práctico curado | A2, A7 (vía RAG); cura A11 |
| **Config Store** | materia | Fechas, modalidad, reglas, **evaluativas activas** | A6, A5 |
| **Memory Store** | **usuario + materia** | Memoria longitudinal del alumno | A8 (custodio) |
| **Feedback Store** | materia | Encuestas y digests | A10 |

**Invariantes de aislamiento:**

- Ningún agente lee o escribe **fuera de su tenant**, aunque el contenido exista y sea temáticamente relevante.
- El **canal docente especializado** pertenece al servidor de su materia; **A11** solo cura la KB de esa materia con lo publicado ahí. El aporte docente de *Álgebra II* no puede entrar a la KB de *Programación II*.
- La memoria está particionada por **usuario + materia**: un mismo alumno en dos materias son **dos universos separados** (lo retoma el Entregable 4). Esto, además, respeta la **visibilidad por canal** (lo nacido en DM no se expone), que es ortogonal al aislamiento por materia.

## 5. Manejo de ambigüedad (solo en DM)

Como el servidor fija la materia, la ambigüedad **solo** puede aparecer en DM. Paso a paso, cuando un alumno escribe por privado:

1. El Subject Router intenta resolver la materia por la **matrícula** del usuario.
2. Si cursa **una** sola materia → tenant resuelto; sigue el flujo normal.
3. Si cursa **varias** → estado `ambiguo`. **A1** hace **una** pregunta ("¿de qué materia?") y **no** deriva a especialistas hasta tener la respuesta.
4. Resuelta la materia, A1 la **fija** para esa conversación/sesión (vía la STM que custodia A8), para no re-preguntar en cada turno.

Esto cumple el requisito "¿de qué materia hablamos?" sin necesidad de servidores compartidos.

> **Ilustración.** Un alumno cursa **Programación II** y **Álgebra II**, cada una en su servidor. En cualquiera de los dos servidores, su consulta queda atada a esa materia automáticamente. Si en cambio le escribe al bot por DM *"¿cuándo es el parcial?"*, el bot le pregunta de cuál de las dos, porque el DM no trae servidor. (Es el caso del Ejemplo 5 de la spec de A1.)

## 6. Escala a *N* materias

Incorporar una materia nueva consiste en:

1. **Levantar un servidor** de Discord para la materia.
2. Crear sus **particiones** (KB, Config, Memory, Feedback).
3. **Registrarla** en el mapeo del Subject Router (servidor → materia).

**No** se agregan ni se clonan agentes: A1..A11 son **genéricos** y reciben el tenant en cada invocación. El número de agentes a coordinar es **constante** respecto del número de materias. Por eso se eligió *agentes parametrizados por contexto* y no *agentes por materia* (que con 30 materias implicaría 30×11 agentes). Los cuellos de botella conceptuales de esta elección se evalúan en el Entregable 8.

## 7. Componentes de soporte no-agente

No todo lo que el sistema necesita es un agente. Lo **determinístico** se modela como **infraestructura**, por el criterio de no pagar costo de coordinación donde no hay deliberación, objetivo pedagógico ni autonomía:

- **Subject Router** — resuelve la materia por servidor y delega la desambiguación en DM a A1. Infraestructura, no agente.
- **Infraestructura de identidad** (verificación del usuario y mapeo cuenta institucional ↔ Discord) e **infraestructura de configuración docente** (alta de fechas, reglas y evaluativas en el Config Store) — también no-agente. Su detalle es materia del Entregable 5 (conexión con Discord); acá importa que **habilitan** la materia y su tenant *antes* de que cualquier agente actúe.

Esto cierra, a nivel de modelo, las historias de "registrar el servidor como materia" y "validar identidad / revisar roles": son **precondiciones de infraestructura**, no flujos de agentes. Modelarlas como agentes sumaría coordinación sin aportar deliberación.

## 8. Casos límite

- **DM de un usuario sin materias** (no verificado o sin matrícula): no hay tenant resoluble; A1 lo orienta a verificarse o a ingresar al servidor de la materia. No se deriva a especialistas.
- **Consulta cruzada dentro de un servidor:** en el servidor de *Programación II* un alumno pregunta algo de *Álgebra II*. El sistema responde en el contexto de *Programación II*; si pide explícitamente otra materia, A1 lo orienta a usar el servidor correspondiente. **Nunca** cruza el tenant.
- **Docente:** opera en el servidor de **su** materia (aporta vía canal docente → A11; lee el digest → A10; configura el Config Store). Un docente de una materia no ve datos de otra (coherente con las superficies separadas del Entregable 2, §9).

## 9. Síntesis

**Una materia = un servidor** convierte la resolución del contexto en un *lookup* determinístico (servidor → materia) y refuerza el aislamiento combinando la **frontera del servidor** con la **partición por tenant** de los cuatro stores. La única ambigüedad real ocurre en **DM** y la resuelve A1 con una sola pregunta. El modelo **escala a *N* materias** agregando servidores y particiones, sin tocar el conjunto de agentes. El **registro de la materia** y la **identidad/roles** son infraestructura de soporte (detallada en el Entregable 5), no agentes.
