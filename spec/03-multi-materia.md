# Entregable 3 — Multi-materia

## 1. Decisión

Se adopta **una materia = un servidor de Discord**. El mismo bot está instalado en cada servidor habilitado; los seis agentes son genéricos y reciben `subject_id`, no se clonan por materia.

Esta elección evita inferir la materia dentro de canales compartidos y refuerza el aislamiento con dos límites: la frontera de permisos del servidor y la partición lógica de stores.

## 2. Resolución de materia

`SubjectRouter` es infraestructura determinista:

- En un canal o hilo de servidor, resuelve `guild_id → subject_id`.
- En un DM, si el estudiante participa en una sola materia la selecciona; si participa en varias, A1 pregunta cuál corresponde.
- Una vez resuelta en DM, STM conserva la elección durante la sesión para no preguntar en cada turno.
- Ningún agente puede modificar el `subject_id` recibido.

## 3. Stores aislados

| Store          | Partición         | Contenido                              | Escritor/lector principal                        |
| -------------- | ----------------- | -------------------------------------- | ------------------------------------------------ |
| KB Store       | materia           | Material pedagógico vigente            | A6 escribe; A2 lee                               |
| Config Store   | materia           | Fechas, reglas, modalidad, evaluativas | A6 escribe; A3, A4 y OutputPolicy leen           |
| Memory Store   | usuario + materia | STM, LTM y preferencias                | Infraestructura; A1/A2/A4 consumen según permiso |
| Feedback Store | materia           | Aportes voluntarios y digests          | A5                                               |

Un aporte docente en el servidor de Álgebra II nunca modifica la KB o Config de Programación II. Un estudiante en dos materias posee dos particiones de memoria independientes.

## 4. Aporte docente en contexto

El canal docente pertenece al servidor de una materia. Un docente autorizado usa **`/incorporar-material`** (o `@bot incorporar`) para contenido pedagógico, o **`/actualizar-catedra`** para fechas, modalidad, reglas y evaluativas. `Auth/Role Check` y `SubjectRouter` fijan el tenant; A6 enruta por comando:

- **Default** — `/incorporar-material` → pipeline `content` → KB Store (siempre incorpora; puede sugerir `/actualizar-catedra` si detecta intención administrativa);
- **Config** — `/actualizar-catedra` → pipeline `config` → Config Store (parseo y validación estructurados);
- contradicción ambigua en config → `pendiente_confirmacion`, sin convertirse en fuente vigente.

## 5. Casos límite

- **DM sin materia resoluble:** A1 solicita selección o indica cómo habilitar el acceso; no deriva a especialistas.
- **Pregunta sobre otra materia dentro de un servidor:** A1 orienta a usar el servidor correcto; no cruza stores.
- **Docente con acceso a varias materias:** cada incorporación queda atada al servidor donde se ejecutó el comando.

## 6. Escalabilidad

Agregar una cursada exige registrar servidor, permisos y particiones, pero no agregar agentes. El costo crece en almacenamiento, indexación, moderación y operación de servidores, no en cantidad de roles lógicos.

## 7. Síntesis

El tenant se resuelve por infraestructura simple y acompaña todo el flujo. La arquitectura conserva el requisito multi-materia sin multiplicar prompts ni abrir lecturas cruzadas.
