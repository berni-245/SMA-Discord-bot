---
name: audit-assignment-requirements
description: "Audita consignas, enunciados o rubricas contra propuestas, especificaciones o entregables; extrae requisitos atomicos, verifica evidencia y consistencia, y genera un checklist Markdown con faltantes y pendientes marcados. Usar cuando se pida revisar cumplimiento completo, detectar omisiones, comprobar que una entrega cumple todo lo pedido o volver a validar despues de cambios."
---

# Auditor De Consignas

## Objetivo

Comprobar cumplimiento exhaustivo de una consigna contra sus entregables sin asumir que una afirmacion de cobertura es evidencia. Generar siempre un checklist trazable que deje visibles los requisitos no satisfechos.

## Flujo Obligatorio

### 1. Fijar Alcance

1. Identificar el archivo o texto fuente de requisitos y los entregables a revisar.
2. Leer la consigna completa antes de evaluar archivos parciales.
3. Descubrir los artefactos relevantes del proyecto si el usuario no los enumera.
4. Preguntar solo si no se puede determinar la consigna o el conjunto de entregables sin riesgo de auditar lo equivocado.

Si el usuario pide correcciones ademas de la auditoria, realizar primero una pasada diagnostica, corregir los entregables y volver a ejecutar el checklist completo.

### 2. Extraer Requisitos Atomicos

Antes de dictaminar, descomponer la consigna en items verificables y asignar identificadores estables:

- `REQ-*`: funcionalidades y entregables obligatorios.
- `LIM-*`: restricciones, prohibiciones y limites no negociables.
- `FMT-*`: formato, diagramas, archivos o evidencias exigidas.
- `DEC-*`: preguntas abiertas sobre las que la entrega debe tomar postura.
- `CAL-*`: criterios de calidad o consistencia evaluables.

Separar requisitos compuestos. Por ejemplo, "diagrama con usuario, agente y ambiente" debe controlar cada actor requerido y la coherencia temporal, no marcarse completo por encontrar la palabra "diagrama".

### 3. Crear El Checklist

Crear o actualizar un archivo Markdown de auditoria. Usar el nombre indicado por el usuario; si no indica uno, usar `checklist-cumplimiento-consigna.md` en la raiz del trabajo auditado.

Leer y adaptar [references/checklist-template.md](references/checklist-template.md). Crear el checklist **antes** de concluir la auditoria y completarlo durante la revision.

### 4. Verificar Evidencia

Para cada item:

1. Buscar evidencia en los artefactos reales, no solo en reportes o resúmenes.
2. Registrar archivo y seccion, o linea si resulta util.
3. Comprobar que la evidencia satisface el sentido completo del requisito.
4. Cruzar documentos, tablas, diagramas, nombres y flujos para detectar contradicciones.
5. Verificar supuestos externos relevantes cuando el cumplimiento dependa de una plataforma, norma o API; usar fuentes primarias/oficiales y citar el enlace.

Revisar como minimo:

- Cobertura de todas las funcionalidades y entregables obligatorios.
- Restricciones y limites eticos/no negociables.
- Consistencia de arquitectura, roles, numeracion, contratos y diagramas.
- Trazabilidad entre requisito, decision y evidencia.
- Factibilidad de supuestos sobre plataformas o integraciones, si aplica.
- Preguntas abiertas que exigen una decision justificada.

### 5. Marcar Estado Sin Falsos Positivos

Usar exclusivamente estas marcas en las tablas del checklist:

- `[x] CUMPLE`: existe evidencia directa, suficiente y consistente.
- `[ ] PARCIAL`: hay tratamiento, pero falta una parte exigida o la justificacion es insuficiente.
- `[ ] PENDIENTE`: no existe evidencia, se contradice con otro artefacto o no pudo verificarse.
- `[x] NO APLICA`: la consigna no exige el item para este alcance; justificarlo.

No marcar `CUMPLE` porque la solucion podria implementarlo despues. Un requisito de diseño solo cumple cuando esta explicado en los artefactos; una decision abierta solo cumple cuando se toma postura y esa postura es coherente en todo el documento.

### 6. Corregir Y Reauditar Cuando Corresponda

Si el usuario pidio solucionar faltantes:

1. Corregir los artefactos necesarios con cambios acotados.
2. Mantener intactos requisitos que ya cumplen.
3. Ejecutar nuevamente la revision completa, incluidos cruces y diagramas.
4. Actualizar el mismo checklist con el estado final. No borrar pendientes que sigan vigentes.

Si el usuario pidio solamente revision, no modificar los entregables: producir el checklist y el informe de pendientes.

### 7. Entregar Resultado

Al terminar:

1. Indicar la ruta del checklist generado.
2. Informar el dictamen general: `Cumple`, `Cumple con pendientes` o `No cumple`.
3. Enumerar primero los items `[ ] PENDIENTE` y `[ ] PARCIAL`, con ubicacion y accion requerida.
4. Declarar explicitamente si no quedaron pendientes.
5. Mencionar validaciones efectuadas y cualquier limite de la auditoria.

## Reglas De Rigor

- No omitir un requisito porque parezca redundante o dificil.
- No sustituir evidencia por interpretacion benevola.
- No reducir funcionalidad pedida para simplificar la propuesta sin marcar incumplimiento.
- Tratar inconsistencias internas como pendiente hasta resolverlas.
- Mantener identificadores de requisito estables entre pasadas para que el checklist muestre avance real.
- Distinguir el documento vigente de reportes historicos o borradores anteriores.

## Recurso

- [references/checklist-template.md](references/checklist-template.md): estructura base obligatoria del checklist de cumplimiento.
