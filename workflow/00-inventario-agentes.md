# 00 — Inventario de Agentes y Postura SMA

Este archivo fija el vocabulario que usan los 18 features. Cada feature lo referencia.

## Criterio para decidir "agente" vs "infraestructura"

Modelamos como **agente** un componente que tiene:

- **Beliefs**: conocimiento o estado interno sobre la materia, el alumno o la cursada.
- **Desires**: un objetivo pedagógico, didáctico o de cuidado al usuario.
- **Intentions**: planes que ejecuta autónomamente para alcanzar ese objetivo (incluye decisión de cuándo/cómo actuar).

Modelamos como **infraestructura** (no agente) un componente determinista, sin autonomía ni objetivo propio: parsers, validadores de formato, stores, gateways, servicios de mail, mapping de identidad, lookup de partición por materia, sanitizadores de privacidad. Hacerlos agentes agregaría costo de coordinación sin aportar deliberación.

El **LLM** y el **RAG** son **herramientas** que los agentes invocan, no agentes en sí mismos. **Discord** es el **ambiente**: canales, permisos, roles, visibilidad — sensores y actuadores del sistema.

## Inventario de agentes (11)

| # | Agente | Carácter | Beliefs (resumen) | Desires | Intentions (resumen) |
|---|---|---|---|---|---|
| A1 | **Frontier Agent** | reactivo + social | tipo de canal, autenticación del usuario, intent clasificado, materia activa | atender consultas dentro de dominio, derivar todo lo demás | clasificar intent, sanear según canal, despachar al agente especialista, redactar respuestas cordiales para out-of-domain y derivar a humanos |
| A2 | **Theory Agent** | reactivo | KB teórica de la materia, perfil del alumno | explicar conceptos con didáctica progresiva | recuperar contexto vía RAG, componer explicación, registrar avance en Memory |
| A3 | **Practice Agent** | reactivo + social | KB práctica, consigna, código del alumno | orientar al aprendizaje sin entregar solución | interpretar consigna sin oficializarla, analizar código, detectar errores conceptuales, proponer próximos pasos; consultar al docente ante ambigüedad |
| A4 | **Scaffolding Agent** | social (política pedagógica) | políticas de "no entregar de más" en un mensaje | que la respuesta al alumno no equivalga a la solución entregable | revisar/recortar borradores de Practice Agent antes de que salgan al alumno |
| A5 | **Evaluative Guard Agent** | reactivo | evaluativas activas declaradas por el docente | que el bot no resuelva instancias evaluativas | bloquear ayuda directa cuando la consulta cae en una evaluativa activa y devolver solo guía procedimental |
| A6 | **Admin Info Agent** | reactivo | reglas, fechas y modalidad publicadas para la materia | responder admin **tal como** está publicado, sin extrapolar | recuperar del Config Store, redactar respuesta literal, derivar al humano ante caso particular |
| A7 | **Quiz Agent** | reactivo | KB de la materia, desempeño previo del alumno | que el alumno autoevalúe su comprensión | generar quizzes cortos, evaluar respuestas, dar feedback orientativo, registrar desempeño |
| A8 | **Memory Agent** | reactivo | STM, LTM y perfil pedagógico por usuario+materia | continuidad pedagógica sin mezclar cursadas | leer/escribir memoria a pedido de otros agentes; mantener aislamiento estricto por materia y por visibilidad del canal de origen |
| A9 | **Follow-up Agent** | **proactivo** | dudas no resueltas, hitos pedagógicos, preferencias del usuario | acompañar sin acosar | decidir momento y canal de contacto, respetar opt-out/frecuencia, redactar repreguntas suaves |
| A10 | **Feedback Agent** | reactivo + social | feedback recolectado, metadata (anonimato/fecha/materia) | cerrar el circuito pedagógico estudiante↔docente | encuestar tras consultas/quizzes, agregar digest para el docente, moderar contenido ofensivo o malicioso |
| A11 | **KB Curator Agent** | reactivo + algo proactivo | contenido vigente y obsoleto de la KB de la materia | KB curada, versionada y vigente | recibir aportes del canal docente, normalizar, indexar, etiquetar vigencia, marcar obsolescencia |

### Carácter por contraste (pedido en el enunciado)

- **Admin Info Agent (A6)** es **reactivo**: solo responde lo publicado por el docente, no propone iniciativas.
- **Follow-up Agent (A9)** es **proactivo**: dispara contactos sin que el alumno escriba primero (funcionalidad 7 del enunciado).
- **Scaffolding (A4)** y **Frontier (A1)** son fuertemente **sociales**: negocian/recortan borradores y derivan entre agentes o a humanos.

## Infraestructura (no son agentes)

- **Discord Gateway**: I/O con el ambiente Discord (recibe eventos, envía mensajes).
- **Auth Service**: emite y valida tokens contra el dominio ITBA.
- **Subject Router**: lookup determinista canal/servidor → materia.
- **Privacy Filter**: sanitizador determinista de respuestas en canales públicos.
- **Code Extractor / Format Validator**: pipeline determinista para extraer código de bloque, adjunto o link.
- **Notification Policy**: aplica preferencias y rate-limit al Follow-up Agent.
- **Stores**:
  - `User Mapping Store` (Discord ↔ ITBA)
  - `User Preferences Store` (frecuencia, opt-out, canal preferido)
  - `KB Store` particionado por materia
  - `Config Store` particionado por materia
  - `Memory Store` particionado por usuario+materia (STM, LTM, Perfil)
  - `Feedback Store - Cursada` y `Feedback Store - Bot`
- **Mail Service**: externo.

## Ambiente: Discord

Discord es el ambiente con reglas propias. Tipos de canal relevantes:

- **Canal público**: visible para todos los del servidor. El bot solo responde si lo @mencionan.
- **Canal restringido por rol** (p. ej. solo estudiantes): se trata como público entre quienes pueden leerlo.
- **DM / canal privado 1:1**: privado entre alumno y bot.
- **Canal docente / `#material-cátedra`**: solo escribe el rol docente; alimenta al KB Curator.
- **Hilo dentro de canal público**: hereda visibilidad del canal padre salvo que se diga lo contrario en el diseño.

Los agentes solo perciben/actúan en los canales que la **matriz agente–ambiente** habilita (ver entregable 5 del enunciado).
