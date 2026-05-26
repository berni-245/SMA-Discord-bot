# Plantilla De Checklist De Cumplimiento

Copiar esta estructura al archivo de auditoria y adaptarla a la consigna revisada. Conservar una fila por requisito atomico, incluso si varios se verifican en la misma evidencia.

```markdown
# Checklist de cumplimiento: <entrega o proyecto>

## Alcance

| Elemento | Valor |
|---|---|
| Consigna auditada | `<ruta o referencia>` |
| Entregables revisados | `<rutas>` |
| Fecha de revision | `<fecha>` |
| Modo | `solo auditoria` / `auditoria y correccion` |

## Leyenda

- `[x] CUMPLE`: evidencia suficiente y consistente.
- `[ ] PARCIAL`: cobertura incompleta o justificacion insuficiente.
- `[ ] PENDIENTE`: ausente, contradictorio o no verificable.
- `[x] NO APLICA`: excluido justificadamente por alcance.

## Resumen

| Estado | Cantidad |
|---|---:|
| Cumple | 0 |
| Parcial | 0 |
| Pendiente | 0 |
| No aplica | 0 |

**Dictamen:** `<Cumple / Cumple con pendientes / No cumple>`.

## Requisitos Obligatorios

| Estado | ID | Requisito atomico | Evidencia verificada | Pendiente o accion |
|---|---|---|---|---|
| `[ ] PENDIENTE` | REQ-001 | `<requisito>` | `<archivo/seccion o sin evidencia>` | `<accion concreta>` |

## Limites Y Restricciones

| Estado | ID | Restriccion | Evidencia verificada | Pendiente o accion |
|---|---|---|---|---|
| `[ ] PENDIENTE` | LIM-001 | `<limite>` | `<evidencia>` | `<accion>` |

## Formato Y Artefactos Exigidos

| Estado | ID | Artefacto o formato | Evidencia verificada | Pendiente o accion |
|---|---|---|---|---|
| `[ ] PENDIENTE` | FMT-001 | `<formato>` | `<evidencia>` | `<accion>` |

## Decisiones Abiertas Que La Entrega Debe Cerrar

| Estado | ID | Decision requerida | Postura encontrada | Pendiente o accion |
|---|---|---|---|---|
| `[ ] PENDIENTE` | DEC-001 | `<pregunta>` | `<postura o ausente>` | `<accion>` |

## Consistencia Y Factibilidad

| Estado | ID | Control | Evidencia o conflicto | Pendiente o accion |
|---|---|---|---|---|
| `[ ] PENDIENTE` | CAL-001 | `<control cruzado>` | `<hallazgo>` | `<accion>` |

## Pendientes Priorizados

| Prioridad | IDs | Cambio requerido | Donde corregir |
|---|---|---|---|
| Alta | `<IDs>` | `<accion>` | `<archivo/seccion>` |

## Conclusion

<Dictamen breve, riesgos residuales y validaciones realizadas. Si no hay pendientes, decirlo explicitamente.>
```
