# **Proyecto: diseño de un sistema multiagente para soporte a la cursada en Discord (estudiantes y docentes)**

## **Alcance del trabajo**

**Este trabajo es exclusivamente de diseño y modelado conceptual.** No se implementa código, no se integra con la API de Discord ni con modelos de lenguaje reales. El resultado esperado es un documento (y artefactos de diseño que definan a continuación) que describa _cómo_ funcionaría el sistema en términos de agentes, roles, coordinación y límites.

## **Contexto**

En el dictado de asignaturas suele usarse Discord como canal de comunicación con los estudiantes (a veces compartido entre varias cursadas en un mismo servidor). Hoy ese canal se usa principalmente para mensajes y respuestas manuales.

El acceso al servidor de Discord y a los espacios asociados a cada materia debe requerir autorización previa. De esta forma, el diseño parte del supuesto de que los usuarios que interactúan con el sistema son usuarios habilitados, con roles asignados —por ejemplo, estudiante, docente o ayudante— y con permisos acordes al contexto de cada materia.

Los **usuarios** del sistema son **estudiantes** y **docentes** (en el marco de cada materia en contexto). Se desea pensar Discord como punto de entrada a un **asistente inteligente** que ayude en varios aspectos de la cursada, **sin reemplazar a los docentes** ni a los canales institucionales formales.

Los docentes deben poder **obtener feedback de los estudiantes** a través del diseño (p. ej. opiniones sobre claridad, ritmo, materiales o utilidad del asistente): no reemplaza evaluaciones oficiales de la cátedra ni encuestas institucionales obligatorias, pero sí cierra el circuito pedagógico entre quien cursa y quien conduce la materia.

El asistente a diseñar se modela como un **sistema multiagente**: varios agentes especializados colaboran para cubrir distintos tipos de necesidades en Discord.

En un SMA, el **ambiente** tiene el mismo peso conceptual que los agentes: no se trata solo de una “interfaz” gráfica. **Discord** se modela como **entorno** con reglas propias —permisos, roles de usuario, tipos de canal, visibilidad— que acotan qué puede **percibirse** y qué puede **alterarse** desde el sistema. Esa visión encaja con la idea de **sensores y actuadores** en un entorno digital (qué entra al sistema, qué sale y dónde).

**Alcance multi-materia (requisito del diseño):** el sistema **no** está pensado para una única asignatura. El diseño debe contemplar **varias materias en paralelo** (p. ej. distintas cátedras o cursadas, cada una con su único servidor o infraestructura de Discord). Debe quedar claro **cómo** se delimita el dominio de conocimiento y las reglas administrativas **por materia**, cómo se evita mezclar contenidos entre cursadas y qué supuestos se hacen sobre la organización en Discord (sin implementar). No alcanza con elegir “una materia de ejemplo” como único universo del sistema: esa materia puede ilustrar escenarios, pero el **modelo** debe soportar **más de una**.

## **Objetivo del proyecto**

Diseñar conceptualmente un sistema multiagente que opere en Discord, identificando al menos:

- Los agentes necesarios y por qué existen (y por qué no otros).
- Roles y responsabilidades de cada agente.
- Capacidades que diferencian a cada agente.
- Recursos que cada agente necesita (conocimiento, datos, herramientas conceptuales, etc.).
- Cómo interactúan entre sí: quién actúa primero, cuándo se deriva, qué información se comparte?
- ¿Cómo se gestionan los **distintos roles de usuario** (estudiante vs docente), en coherencia con la funcionalidad de feedback?
- ¿Cómo el sistema **persiste y reutiliza** información de actividad de los usuarios **entre sesiones** (días u otros intervalos) para el **seguimiento** **proactivo**, sin confundirlo con el estado volátil compartido entre agentes dentro de una misma conversación?
- ¿Cómo el **ambiente Discord** (canales, permisos, roles) condiciona percepción/acción del sistema y se relaciona y afecta con la coordinación entre agentes?

Las decisiones deben **justificarse** desde conceptos de sistemas multiagentes (p. ej. especialización, coordinación, descomposición del problema, límites de autonomía, relación **agente–ambiente**, evitar solapamientos o vacíos).

## **Funcionalidades deseadas en Discord**

El diseño del sistema debe contemplar **al menos** las siguientes capacidades vistas desde el usuario (**estudiante** o **docente**, según corresponda), **para cada materia habilitada en el sistema** (el detalle de _cómo_ las cumplen los agentes es parte del trabajo de diseño). Referencias a “la materia” significan **la materia cuyo contexto aplica** a esa interacción, no un despliegue monolítico de una sola asignatura en todo el servidor.

### **Privacidad de las consultas según el canal en Discord (requisito)**

Se debe **respetar la privacidad** de las preguntas y material que envían los estudiantes **de acuerdo con el medio** en Discord:

- **Canales públicos** (o cualquier canal donde los mensajes sean visibles para más allá del estudiante y el bot): la consulta y las respuestas del asistente en ese lugar se consideran **públicas** para quienes tengan acceso a ese canal. Código, autoevaluaciones o explicaciones allí **no** deben tratarse en el diseño como si fueran confidenciales respecto del resto de quienes leen el canal.
- **Mensajes directos (DM)** entre el estudiante y el bot (o el mecanismo privado equivalente que defina el grupo): las consultas y respuestas se consideran **privadas** respecto de los demás miembros del servidor; el flujo multiagente, la memoria, el feedback a docentes y cualquier digest **no** deben **republicar** ese contenido en canales públicos ni identificar al estudiante con el detalle de sus DM, salvo que el propio diseño incorpore **transferencias explícitas, consentidas y trazadas** (p. ej. el estudiante pulsa “compartir en el canal de consultas”).

Si el diseño contempla **casos intermedios que no sean claramente públicos o privados** (p. ej. hilos en canal de ayuda, canales restringidos por rol, grupos pequeños ), el documento debe indicar cómo se tratarán. Para cada caso, se debe definir si el contenido y : etiquetar si equivalen a “público” o “privado” según esta lógica y justificarlo.

### **Actualización del conocimiento durante la cursada (requisito)**

Los **docentes** pueden **aportar nuevo contenido** (mensajes, archivos adjuntos, enlaces, correcciones al programa, avisos de fechas, etc.) a través de un **canal de Discord especializado** por **materia en contexto** (p. ej. `#material-cátedra`, `#apuntes-oficiales` o el nombre que el grupo defina), con permisos acotados a **roles de docencia** para **escribir** y, si aplica, lectura diferenciada para estudiantes.

El diseño debe trazar **cómo** ese contenido se incorpora al **conocimiento que consumen los agentes** a lo largo de la cursada (p. ej. ingesta periódica, disparador manual, versionado o etiqueta de vigencia, convivencia con material previo). **No** alcanza con hablar solo de “documentos estáticos” sin este **canal de actualización docente** explícito: la pregunta “quién actualiza y desde dónde” queda **cerrada** en la consigna (los docentes, vía ese canal); siguen **abiertos** para el grupo el pipeline detallado, prioridad frente a otras fuentes y reglas de obsolescencia.

### **Consultas fuera de dominio y reconducción a docentes (requisito)**

Ante preguntas **evidentemente fuera del dominio** del asistente de la cursada (p. ej. debates genéricos sobre modelos de IA, temas ajenos a la materia en contexto, curiosidades sin vínculo pedagógico con la asignatura), el sistema debe responder de manera **educada** aclarando que ese conocimiento o tema **está fuera del dominio del agente** (del asistente de esa materia).

Para los **problemas** que el asistente **no** corresponde encarar dentro de su rol —incluidos los casos fuera de dominio, los que exceden las fuentes o límites definidos en el diseño, y en general cuando no pueda ayudar de forma adecuada sin inventar o extrapolar— la salida debe **orientar al estudiante a consultar a los docentes** (o al **canal o instancia humana** que la cátedra designe para consultas: p. ej. foro, horario de consultas, hilo fijado). **No** sustituye la consulta al docente con opiniones del bot sobre asuntos ajenos a la cursada. Esto **no** anula las funcionalidades 1–7 cuando la consulta **sí** está en dominio: allí el sistema actúa con normalidad dentro de sus límites ya definidos (p. ej. no solución completa de evaluable de un solo mensaje).

### **1\. Apoyo al aprendizaje teórico**

- Responder preguntas sobre la teoría **de la materia en contexto** (la cursada correcta según el aislamiento multi-materia que defina el diseño).
- Explicar conceptos con distinto nivel de profundidad.
- Dar ejemplos simples.
- Realizar resúmenes de temas.

### **2\. Apoyo en la parte práctica**

- Interpretar consignas;
- Explicar procedimientos;
- Revisar avances enviados por el estudiante;
- Detectar errores conceptuales o metodológicos;
- Señalar inconsistencias en una resolución;
- Ayudar a destrabar un problema;
- Sugerir próximos pasos;
- Explicar ejemplos parciales;
- Orientar sobre cómo mejorar una entrega.

### **Escenario: Materias de programación**

- Analizar código enviado por un estudiante.
- Indicar errores comunes o conceptuales.
- Explicar qué hace un fragmento de código.
- Ayudar a destrabar un problema de programación.

**Restricción:** no debe resolver tareas evaluables completas ni entregar soluciones finales listas para entregar.

**Alcance de esa restricción (explícito):** regula la **postura** de cada respuesta del asistente (p. ej. no devolver en un solo mensaje el trabajo listo para entregar, orientar al aprendizaje). **No** forma parte de los requisitos de este diseño **detectar, bloquear, cortar conversación ni penalizar** a un estudiante que avanza por **varios mensajes en cadena** (p. ej. “¿qué hace esta función?” → “¿qué debería hacer para completarla?” → “¿así está bien?”). Esa táctica **no se bloquea** en el modelo: el límite real entre ayuda y fraude evaluable sigue recayendo en **criterio docente** y en el diseño de evaluación de la cursada, no en un mecanismo obligatorio de vigilancia multi-turno en el asistente.

**Requisito de diseño (obligatorio):** como la ayuda con programación incluye _analizar código enviado por un estudiante_, el documento de diseño debe **explicitar y justificar al menos un mecanismo concreto** por el cual ese código llega al sistema desde Discord (p. ej. mensaje con bloque de código, adjunto de archivo de texto, enlace a mensaje previo en un hilo, combinación de varios). Elegir _sólo_ “interacción por texto plano” sin explicar cómo se transporta el código **no alcanza** para cumplir este punto: el flujo “estudiante aporta código → agente(s) lo interpretan” debe quedar trazado.

### **3\. Autoevaluación del estudiante**

- Quizzes cortos.
- Preguntas para que el estudiante verifique comprensión.
- Feedback orientativo (no calificaciones oficiales).

### **4\. Información y orientación administrativa (cursada e institución)**

Un solo bloque funcional que cubre lo **público y general** sobre **la cursada en contexto** y la orientación hacia instancias humanas o canales oficiales cuando hace falta criterio sobre un caso particular.

- **Cursada:** fechas importantes, modalidad, reglas de evaluación **tal como estén publicadas** para **esa** materia (según el contexto multi-materia), organización general de la cursada.
- **Consultas que mezclan situación personal y reglas** (p. ej. enfermedad, ausencias, trámites): usar solo información **genérica** (p. ej. recordar qué dice el programa sobre recuperatorios o licencias, si consta en el material de referencia del diseño) y **orientar** al estudiante sobre **a qué tipo de área, rol o canal** (docente, bedelía, secretaría académica, etc.) debe acudir para su caso concreto.

**Ejemplo límite (frontera del sistema):** ante _«¿puedo recuperar el parcial si me enfermé?»_, el sistema puede explicar **las reglas generales** de **la materia en contexto** que estén en su fuente de diseño para esa cursada (p. ej. existencia de recuperatorio, ventanas de tiempo) pero **no** afirmar si _ese_ estudiante califica, **no** tramitar la licencia ni validar certificados, y debe dejar explícita la derivación al canal humano que resuelve el caso.

**Restricciones:** no brindar datos institucionales **específicos del caso** del estudiante; no gestionar trámites; no reemplazar la respuesta oficial de la universidad o del cuerpo docente.

### **5\. Acompañamiento y organización**

- Recordatorios generales, checklists de cursada, mensajes de orientación cuando el estudiante se siente perdido.

### **6\. Feedback de estudiantes para docentes**

Aplica **por materia en contexto** (aislado de otras cursadas en el modelo multi-materia).

- Los **estudiantes** pueden aportar **retroalimentación** sobre aspectos de la cursada relevantes para mejorar la enseñanza o el acompañamiento (p. ej. dificultad percibida, claridad de temas, sugerencias, percepción de utilidad del asistente): el **tipo** de ítems y la granularidad los define el grupo dentro de límites razonables y con **justificación**.
- Los **docentes** deben poder **acceder a ese feedback** de forma explícita en el diseño (p. ej. resumen periódico, canal o hilo privado de cátedra, panel conceptual, digest generado por un agente): debe quedar trazado **qué ven**, **con qué periodicidad o disparador** y **si hay agregación o anonimato**, sin confundir esto con calificación ni con trámites administrativos.

**Restricciones:** no sustituye **evaluaciones oficiales** de la materia ni encuestas institucionales de la universidad; no expone datos sensibles del estudiante que el sistema no deba manejar; el diseño debe prever **abuso o feedback malicioso** (p. ej. moderación, reporte a humanos).

### **7\. Memoria entre sesiones y seguimiento pedagógico**

El sistema **debe** poder **recordar actividades** de los usuarios (en particular de **estudiantes**: temas consultados, tipo de ayuda pedida, hilos relevantes según el modelo) **entre sesiones** —es decir, más allá del cierre de una conversación puntual— para **colaborar en el seguimiento** de la cursada.

- **Persistencia orientada al seguimiento:** conservar el mínimo necesario para continuidad (p. ej. qué unidades o dudas motivaron interacciones previas), **por usuario y por materia en contexto**, sin mezclar cursadas.
- **Contacto proactivo:** el diseño debe incluir **cómo** el sistema puede **volver a contactar** al usuario en Discord (o el mecanismo conceptual acordado) para **verificar si aún tiene dudas** sobre temas sobre los que ya había preguntado o recibido ayuda, y ofrecer continuidad razonable (p. ej. recordatorio suave, repregunta pedagógica).
- **Diferencia explícita:** separar en el documento la **memoria transitoria intra-sesión** (estado compartido entre agentes durante un intercambio) de la **memoria o registro entre días** que habilita el seguimiento; ambas pueden coexistir, pero el rol de cada una debe quedar definido.

**Restricciones y límites de diseño:** frecuencia y tono del contacto proactivo acotados para evitar **spam** o sensación de vigilancia indebida; prever **opt-out** u otra forma de **consentimiento / control del usuario** sobre el seguimiento; no sustituir comunicaciones oficiales de la cátedra ni decisiones del docente. La memoria y el contacto proactivo deben **respetar la visibilidad** acordada en el apartado de privacidad por canal (p. ej. no “filtrar” a público el detalle de interacciones nacidas en **DM**).

### **Límites globales del sistema (no negociables en el diseño)**

El sistema **no** debe:

- Corregir oficialmente trabajos o exámenes.
- Poner notas ni aprobar/desaprobar.
- Reemplazar al docente.
- Dar información institucional sensible.
- Gestionar trámites formales de la universidad.
- Tomar decisiones académicas oficiales.
- Usar el canal de feedback como **única** fuente obligatoria de evaluación docente o institucional (es complementario al criterio humano y a los instrumentos formales que corresponda).
- **Acosar** al usuario con mensajes proactivos o explotar la memoria entre sesiones de forma que reemplace el criterio del estudiante o del docente sobre cuándo pedir ayuda.
- **Exponer** el contenido de consultas **privadas** (DM u equivalente según el diseño) en **canales públicos** o ante otros estudiantes, salvo las **transferencias explícitas y consentidas** que el propio diseño defina y trace.

## **Trabajo a realizar (entregables de diseño)**

A partir de las funcionalidades anteriores, el grupo debe:

**Glosario al inicio del entregable (obligatorio):** en las **primeras páginas** del documento principal (o en una sección temprana de definiciones), el grupo debe **fijar brevemente** qué entiende por **sesión** frente a **conversación** (p. ej. si “sesión” acota un intervalo de uso, un día, un hilo activo, etc., y qué cuenta como “conversación” frente a otra unidad de interacción). Esas definiciones deben **cuadrar** con lo que el informe describe como **memoria intra-sesión** vs **persistencia entre días / entre sesiones** (funcionalidad 7 y entregable 4\) y usarse **con el mismo significado** en todo el texto, para unificar criterios entre lectores y correctores.

1. **Inventario y justificación de agentes**
   - Decidir cuántos agentes hacen falta y con qué granularidad (pocos agentes muy generales vs. muchos muy especializados), justificando el trade-off.
   - Por cada agente: rol, responsabilidades, capacidades distintivas, recursos necesarios, qué aporta al sistema global y qué queda **fuera** de su alcance.
   - **Carácter del agente (reactivo / proactivo / social y BDI):** identificar si cada agente se modela principalmente como **reactivo** (responde a estímulos del entorno), **proactivo** (inicia acciones u objetivos propios) o con fuerte dimensión **social** (negociación, comunicación explícita con otros agentes o con usuarios como pares). Cuando ayude a la claridad, enlazar con el esquema conceptual **BDI** (_Beliefs_, _Desires_, _Intentions_): qué “cree” el agente, qué busca y qué planes o intenciones materializa. **Justificar** con al menos un contraste alineado a esta consigna: por qué un agente de **información u orientación administrativa** (funcionalidad 4\) podría ser **más reactivo**, mientras que uno vinculado al **seguimiento pedagógico** o al **contacto proactivo** (funcionalidad 7\) requiere **proactividad** en el diseño.
2. **Interacción y coordinación**
   - Qué agente interviene primero ante un mensaje típico (y ante casos límite).
   - Cómo se produce la salida ante consultas **fuera de dominio** o **no atendibles** dentro del rol del asistente, alineada al requisito de **respuesta educada \+ consultar a docentes** (qué agente la emite y si hay paso previo de clasificación).
   - Criterios de derivación entre agentes.
   - Qué información se comparte entre agentes (y qué no, por privacidad, consistencia o costo).
   - Si proponen algún mecanismo de coordinación (p. ej. supervisor, negociación, contrato, cola de tareas), describirlo a nivel conceptual.
   - **Roles de usuario:** cómo el diseño distingue interacciones de **estudiante** vs **docente** en Discord (roles, permisos, canales, comandos, etc.) y **cómo el feedback aportado por estudiantes llega o se materializa para los docentes** (agentes involucrados, agregación, filtros, visibilidad).
3. **Multi-materia (obligatorio)**
   - Cómo el sistema **resuelve o recibe** el contexto de materia (p. ej. canal o categoría por cursada, rol, comando explícito, servidor separado, combinación): debe ser **explícito y justificado**.
   - Cómo se **aislan** bases de conocimiento teórico-administrativo y políticas (p. ej. evaluación) entre materias —incluido el **canal de aporte docente** y su contenido—; qué ocurre ante ambigüedad (“¿de qué materia hablamos?”).
   - Pueden usar **dos materias ficticias** solo como ilustración en escenarios; el diseño debe aplicar igualmente a _N_ materias en el modelo conceptual.
4. **Memoria entre sesiones y seguimiento (obligatorio)**
   - **Qué** actividades o hechos del usuario se conservan entre sesiones (y **qué** se descarta) para el seguimiento pedagógico y el contacto sobre dudas previas.
   - **Dónde vive** esa memoria en el modelo (p. ej. agente dedicado, repositorio conceptual, política de otro agente) y cómo los agentes la **leen y actualizan**.
   - **Cómo** se dispara el **contacto proactivo** (eventos, periodicidad máxima razonable, reglas de silencio), cómo se relaciona con Discord (DM, canal, hilo) y cómo se implementa el **control del usuario** (p. ej. opt-out).
   - Un **ejemplo breve** (puede ser un subpaso dentro de un escenario A/B/C o un mini-escenario aparte) que muestre: interacción día 1 → tiempo después → mensaje de seguimiento sobre el **mismo tema** sin contradecir límites globales.
5. **Conexión con Discord (solo a nivel de diseño)**
   - Cómo se representa el sistema en Discord: un solo bot, varios, roles, canales, hilos, etc. (a elección del grupo, pero debe estar **explicitado y justificado**), incluyendo la convivencia **estudiantes / docentes** donde aplique (p. ej. canales públicos vs de cátedra).
   - **Matriz de interacción agente–ambiente (obligatoria):** una tabla o matriz que, para cada **agente** (o rol lógico de agente) del diseño, indique en qué **canales o tipos de canal** puede **percibir** información (leer, suscribirse conceptualmente a eventos, recibir menciones, etc.) y en cuáles puede **actuar** —en particular **escribir** o publicar— incluyendo canales **solo docentes** o de cátedra si el modelo los usa. Debe quedar explícito si algún agente **no** puede leer ni escribir en ciertos lugares por diseño (p. ej. privacidad, separación estudiante/docente). Esta matriz refuerza el encuadre de **sensores y actuadores** del entorno digital.
   - **Canal especializado de aporte docente:** descripción del canal (o conjunto de canales) donde **solo la cátedra** publica material y actualizaciones, visibilidad para estudiantes, y vínculo conceptual con la **base de conocimiento** de los agentes y el versionado durante la cursada.
   - Cómo un usuario dispara una interacción y cómo recibe respuestas (sin implementación).
   - **Privacidad pública vs DM:** cómo el diseño aplica el requisito “**público en canal público / privado en DM**” a las respuestas del bot, a la **memoria entre sesiones**, al **feedback a docentes** y a los **agentes** (p. ej. qué metadatos cruzan fronteras, si hay canales sugeridos para código sensible).
   - **Ingreso de código para la funcionalidad 2:** describir el camino acordado (formatos admitidos, límites razonables p. ej. tamaño o tipo de adjunto, qué hace el sistema si falta código o está ilegible). Esto es parte del entregable, no opcional.
6. **Escenarios y trazabilidad**
   - Al menos **tres escenarios obligatorios**, cada uno centrado en un **área de tensión** distinta del diseño (no alcanza con tres variantes “fáciles” del mismo tipo). Cada escenario va **paso a paso**: qué agente actúa, qué hace, si hay delegación, qué información circula.
   - **Diagrama de secuencia (obligatorio):** al menos **un** diagrama de **secuencia** (UML de secuencia o notación equivalente con **orden temporal** explícito de mensajes o pasos) que cubra el flujo de **uno** de los escenarios **A, B o C**, incluyendo usuario, agentes relevantes y, si aplica, el **ambiente** (p. ej. bot/canal de Discord). Los diagramas solo de **bloques o componentes** suelen ocultar fallas de **coordinación** que el de secuencia hace visibles; por eso este requisito es acumulativo al relato textual y debe ser **coherente** con el paso a paso del escenario elegido.
   - **Escenario A — Programación y restricción pedagógica:** consulta de ayuda con código donde, en **al menos un turno**, queda claro un pedido de **solución entregable** de algo evaluable (basta con modelar la respuesta del sistema en ese punto; **no** es obligatorio incluir detección ni bloqueo de **cadenas incrementales** de mensajes). El relato debe mostrar **cómo** el sistema da ayuda sin entregar de golpe la solución completa en ese intercambio, alineado al alcance de la restricción descrito en la funcionalidad 2\.
   - **Sugerencia de modelado (opcional):** patrón habitual en arquitecturas de agentes con **control de políticas**: un **agente de andamiaje (_scaffolding_)** o de **política pedagógica** cuyo rol principal **no** sea aportar la solución del evaluable, sino **supervisar o acotar** borradores de otros agentes para que la salida al usuario no incluya **demasiada información** ni el trabajo listo para entregar en **un** solo mensaje (p. ej. revisión antes de publicar). **No** es obligatorio: el grupo puede cumplir la restricción con otro mecanismo; en todos los casos el escenario A debe dejar **quién** evita la sobre-entrega en ese intercambio.
   - **Escenario B — Administrativo y límite institucional:** consulta en el ámbito de la funcionalidad 4 (reglas públicas \+ orientación) donde aparece **límite de caso particular** o riesgo de **dato institucional específico** (p. ej. licencia, recuperatorio, trámite). Debe quedar trazada la **frontera** (qué dice el sistema vs. qué deriva) y a dónde deriva.
   - **Escenario C — Consulta mixta o ambigua:** un mismo mensaje o hilo que **mezcla** al menos dos grandes frentes (p. ej. teoría \+ código, o aprendizaje \+ administrativo). Debe mostrarse **orden de tratamiento**, descomposición o re-pregunta, y cómo evita respuestas contradictorias.
   - Pueden agregar **escenarios adicionales** (p. ej. solo teoría, solo autoevaluación) si ayudan, pero los tres anteriores son **mínimo obligatorio**.
7. **Riesgos, supuestos y límites éticos de diseño**
   - Cómo el diseño evita alucinaciones; cuando no hay base fiable en las fuentes de la materia, cómo se alinea a la **reconducción a docentes** (sin inventar).
   - Cómo se implementa la política **fijada** para consultas **irrelevantes o fuera de dominio obvio** (respuesta educada \+ fuera del dominio del agente \+ **consultar a docentes** / canal humano) y cómo se tratan las **ambiguas o maliciosas** sin contradecir esa política.
   - Riesgos de **filtrado público** de código o dudas que el estudiante creyó privadas (p. ej. errores de enrutado, resúmenes para docentes demasiado detallados) y mitigaciones alineadas al apartado de privacidad por canal.
8. **Auto-evaluación de la arquitectura (obligatorio)**
   - Sección dedicada en la que el grupo **evalúa su propio diseño** con criterios de SMA, evitando que la entrega sea solo “completa” pero poco reflexiva. Para **cada** una de las tres métricas siguientes: **juicio** (p. ej. bajo / medio / alto o una escala definida por el grupo), **argumento** con referencia concreta al diseño entregado y **límite honesto** (qué quedaría frágil o sin cerrar).
   - **Escalabilidad:** ¿qué ocurre en el modelo si el número de **materias en paralelo** crece fuerte (p. ej. de pocas a muchas en el mismo servidor o ecosistema Discord)? ¿Dónde aparecen cuellos de botella conceptuales (orquestación, memoria, aislamiento, costo de coordinación)?
   - **Robustez / degradación:** si el agente o componente encargado de **ayuda con programación** (funcionalidad 2\) **no está disponible** o falla, ¿el resto del sistema puede seguir atendiendo con razonable normalidad otras frentes (p. ej. **administrativo**, teoría, autoevaluación)? Describir **qué** se degrada, **qué** se mantiene y **cómo** se comunica al usuario si aplica.
   - **Flexibilidad / extensibilidad:** ¿qué tan acotado sería —en el modelo propuesto— incorporar un **nuevo** agente o capacidad no pedida en esta consigna, por ejemplo un **“agente de bienestar estudiantil”** (orientación a recursos de apoyo, ánimo, derivación a servicios humanos), **sin rediseñar por completo** la arquitectura? Indicar qué interfaces, orquestación o políticas habría que tocar como mínimo.

**Formato y diagramas:** documento principal en Markdown. Además del **glosario inicial** (sesión vs conversación) y del **diagrama de secuencia** obligatorio del entregable 6, pueden incluir **otros** diagramas (componentes, despliegue, etc.) si ayudan. No hay obligación de herramienta concreta de modelado; lo importante es la **claridad** y la **coherencia** entre texto, tablas (p. ej. matriz agente–ambiente) y diagramas.

## **Preguntas abiertas (no resueltas en la consigna — el grupo debe tomar postura)**

Las siguientes cuestiones **no están definidas** a propósito. El diseño debe **elegir** una opción razonable (o combinarlas) y **argumentarla**. Pueden agregar más preguntas propias si surgen del diseño.

### **Arquitectura multiagente**

- **Fuera de dominio irrelevante:** la consigna **fija** la salida (mensaje educado \+ “fuera del dominio del agente” \+ **consultar a docentes** / instancia humana). Lo abierto es **quién** detecta o clasifica esa situación (orquestador, agente de frontera, heurística, etc.) y el texto concreto.
- ¿Un único “orquestador” que enruta todo, o coordinación peer-to-peer entre especialistas?
- ¿Hace falta un agente “guardián” o de **políticas / andamiaje (_scaffolding_)** que valide salidas (p. ej. tono, **densidad de ayuda** o riesgo de **resolver de más en un solo mensaje**) antes de mostrarlas al usuario? Para la **funcionalidad 2** y el **escenario A**, un subtipo útil es el agente cuyo foco **no** es “saber la respuesta” del ejercicio sino **revisar o recortar** borradores de agentes especialistas (control de políticas pedagógicas). La consigna **no** exige guardián ni agente de andamiaje ni ningún mecanismo para **bloquear cadenas incrementales** de preguntas; si se propone, debe **justificarse** (p. ej. frente al costo de coordinación) y alinearse a esos límites.
- ¿Se modela el “usuario” o el “contexto de Discord” como agente, o solo como entorno?

### **Discord y experiencia de usuario**

- **Público vs DM:** la regla base “canal público \= público, DM \= privado” está **fijada** en la consigna. Lo abierto es el _resto_: ¿cómo se **nudgea** al estudiante hacia DM para código o datos sensibles?, ¿cómo se etiquetan canales “solo rol estudiante” respecto de público/privado?, ¿comandos slash que fuerzan un modo u otro?
- **Ingreso de código:** no es una pregunta abierta “si/no”: debe resolverse como en el requisito obligatorio de la sección 2 (al menos un mecanismo justificado). Lo abierto aquí es el _resto_ de la UX: ¿también comandos slash, reacciones, hilos obligatorios para ciertos tipos de consulta, otros adjuntos no código, etc.?
- ¿Una sola personalidad conversacional para todo el sistema o “voces” distintas por tipo de ayuda?
- ¿Cómo se manejan conversaciones largas y referencias a mensajes anteriores?

### **Estudiantes, docentes y feedback**

- ¿El feedback es **identificado**, **pseudónimo** o **agregado de forma anónima** hacia el docente?
- ¿Quién “posee” la moderación del feedback antes de que lo vea la cátedra: un agente, un humano, o ambos?
- ¿El docente interactúa con los **mismos** agentes que el estudiante o con **capacidades** separadas (p. ej. solo lectura de digest)?

### **Datos y conocimiento**

- **Origen de actualización:** la consigna **fija** que los docentes aportan y actualizan material mediante un **canal de Discord especializado** (ver requisito arriba). Lo abierto es el **resto** del ecosistema: ¿otras fuentes iniciales (importación masiva, PDF legacy)? ¿orden de prioridad si hay conflicto entre mensajes del canal y otra fuente?
- ¿Cómo se **versiona** o marca vigencia lo publicado en ese canal cuando cambia el programa (p. ej. hilos por unidad, fecha en nombre, agente catalogador)?
- ¿Quién en el mundo real **valida** antes de que un agente use un post (solo confianza en docentes, doble revisión, bot que marca “pendiente de incorporación”)?
- ¿Los agentes de programación tienen “lenguajes permitidos” o stack fijo en el diseño, y eso es global o configurable por materia?
- **Multi-materia (detalle abierto):** ¿un mismo agente “genérico” parametrizado por contexto, agentes por materia, o mix?

### **Coordinación y conflictos**

- Si dos agentes podrían responder lo mismo, ¿quién tiene prioridad?
- Si un agente detecta que la consulta es mezcla (teoría \+ código \+ admin), ¿orden fijo de tratamiento o paralelo?
- ¿Hay estado compartido entre agentes **durante una misma sesión** de intercambio y quién lo controla?
- **Memoria entre sesiones:** la consigna **exige** persistencia y seguimiento con posible contacto proactivo (funcionalidad 7). Siguen **abiertos** para el grupo: duración de retención, granularidad (resumen vs. detalle), quién “posee” el registro longitudinal, cómo se audita y cómo se alinea el proactivo con **privacidad** y **opt-out** (deben fijarse y justificarse en el diseño).

### **Autoevaluación y límites pedagógicos**

- ¿Quién genera las preguntas de quiz y con qué criterio de dificultad?
- ¿Cómo se distingue en el diseño entre “ayuda para aprender” y “ayuda que equivale a hacer la tarea” **en cada respuesta**, sin pretender **robustez anti-fraude** por conversaciones largas o incrementales? (Esa robustez **no** es requisito: queda documentado el límite honesto del sistema.)

### **Privacidad, seguridad y abuso**

- ¿Se almacenan conversaciones o código enviado por estudiantes en el diseño? ¿Con qué finalidad y retención?
- ¿Cómo se clasifica y aísla el almacenamiento según **origen público vs DM** (etiquetas, políticas de lectura por agente, digest para docentes sin contenido identificable de DM salvo reglas explícitas)?
- ¿Cómo se separa o integra esa retención con la **memoria entre sesiones** de la funcionalidad 7 (mismo almacén vs. capas distintas, minimización de datos)?
- ¿Qué ocurre con el **feedback** hacia docentes (retención, visibilidad, si entrena o alimenta otros agentes)?
- ¿Cómo se reduce riesgo de filtrado de datos entre usuarios y **entre materias** (requisito explícito del alcance multi-materia)?

### **No funcionales (a nivel conceptual)**

- Latencia esperada y degradación: ¿qué hace el sistema si un “paso” de agente falla o tarda demasiado?
- Idioma, tono y accesibilidad: ¿un solo idioma o varios en el diseño?

### **Evaluación del propio diseño**

- La consigna **exige** el apartado de **auto-evaluación de la arquitectura** (entregable 8\) con escalabilidad, robustez y flexibilidad. Siguen **abiertos** para el grupo: la **escala** numérica o cualitativa exacta, métricas **adicionales** propias y cómo priorizarían mejoras si tuvieran otra iteración de diseño.

## **Criterios orientativos de calidad del diseño**

Los criterios se organizan por entregable para facilitar la revisión cruzada con el “Trabajo a realizar”.

### **Agentes (entregable 1\)**

- Explicitar el carácter **reactivo / proactivo / social** por agente, con el contraste **administrativo vs. seguimiento proactivo** cuando aplique al diseño.
- Evitar solapamiento confuso de responsabilidades entre agentes o justificarlo explícitamente.

### **Coordinación y roles (entregable 2\)**

- Mostrar coherencia entre límites éticos/pedagógicos y el flujo de coordinación.
- Dejar claro el **flujo estudiante → feedback → docente** y la distinción de **roles de usuario** en Discord, alineado con la funcionalidad 6 y el entregable 2\.
- **Fuera de dominio:** la política de respuesta educada \+ reconducción a docentes coherente con el requisito explícito y con el entregable de riesgos (7), incluido el papel del orquestador o agente de frontera si existe.

### **Multi-materia (entregable 3\)**

- **Multi-materia:** contexto de cursada acotado, aislamiento de conocimiento y prevención de cruces entre materias coherentes con el apartado obligatorio 3\.

### **Memoria y seguimiento (entregable 4\)**

- **Glosario sesión / conversación:** definiciones al inicio del informe **alineadas** con memoria intra-sesión, persistencia entre días y el lenguaje usado en el resto del documento (sin mezclar criterios).
- **Memoria entre sesiones y seguimiento:** coherente con la funcionalidad 7 y el entregable obligatorio 4 (incluida la distinción intra-sesión vs entre días y un ejemplo de contacto proactivo).

### **Discord como entorno (entregable 5\)**

- Tratar **Discord como ambiente** (no solo como capa de UI): la **matriz agente–ambiente** del entregable 5 coherente con permisos, privacidad pública/DM y roles de usuario.
- **Privacidad por canal:** coherencia entre el apartado “público vs DM”, el entregable de Discord (5) y la memoria/feedback, sin contradicciones que expongan DM en público.
- **Privacidad y datos:** coherencia explícita entre retención, memoria entre sesiones, feedback a docentes, multi-materia y la regla **público vs DM**; supuestos claros cuando haya datos personales o sensibles.
- **Conocimiento vivo:** el canal docente especializado y su relación con la base de conocimiento de los agentes coherentes con el requisito de actualización y con el entregable de Discord (5).
- Trazar el flujo de **ingreso de código** desde Discord hasta el/los agente(s) que analizan programación (coherente con el escenario A).

### **Escenarios (entregable 6\)**

- Cubrir los **siete** bloques funcionales sin ignorar los conflictos entre ellos (p. ej. política de ayuda con código **sin** prometer bloqueo incremental; feedback vs. límites de evaluación formal; memoria longitudinal vs. privacidad y opt-out).
- Que los escenarios **A, B y C** cubran explícitamente las tensiones pedagógica-código, administrativo-institucional y multi-dominio, sin sustituirlos por casos triviales.
- **Diagrama de secuencia (entregable 6):** al menos uno que refleje **orden temporal** y coordinación en dos de los escenarios elegidos (A, B o C), no sustituido solo por diagramas de bloques que oculten intercambios entre agentes.
- **Escenario A:** la restricción “no solución evaluable de un solo mensaje” **trazada** (agente de programación solo, orquestador, **agente de andamiaje/política** u otro mecanismo); si hay agente de andamiaje, su rol debe ser coherente con el hecho de que **no** se exige bloqueo de cadenas incrementales.

### **Riesgos, ética y abuso (entregable 7\)**

- Que el apartado no sea un relleno genérico: identificar **riesgos creíbles** (p. ej. filtrado de datos entre usuarios o entre materias, uso malicioso del bot, prompts que buscan datos ajenos, proactivo molesto, feedback ofensivo, dependencia excesiva del asistente) y describir **mitigaciones o salvaguardas** alineadas con el resto del diseño (agentes, canales, políticas, límites globales). Debe quedar evaluable si el diseño **enfrenta** esos riesgos con seriedad, no solo si los nombra.

### **Auto-evaluación de la arquitectura (entregable 8\)**

- Las tres métricas (escalabilidad multi-materia, robustez ante fallo del frente de programación, flexibilidad para un agente nuevo tipo bienestar) con **argumentos anclados** al diseño y **límites** reconocidos, no solo adjetivos.

### **Transversal**

- Ser explícito sobre supuestos y sobre las **preguntas abiertas** que el grupo decidió cerrar con su propuesta.

## **Recordatorio final**

**No se programa.** Entrega \= diseño argumentado \+ modelado de agentes e interacciones \+ **auto-evaluación de la arquitectura** (entregable 8). Cualquier referencia a tecnología concreta (LLM, framework, hosting) es opcional y solo como ilustración, no como requisito de implementación.
