# mappings.json Template

File path: `app/config/mappings.json`

Add entries to the `useCaseMap` object. Include only the entries for use cases being generated. HTTP methods: `GET` for reads, `POST` for writes.

**IMPORTANT**: The `realization` field must use the PascalCase class name with the `api/controllers/` prefix: `api/controllers/{EntityPascalCase}Controller.{useCase}` (even though the file name is kebab-case).

`dtoInAuditMap` maps DtoIn fields for audit logging. Use `$.fieldName` syntax. Customize per use case based on relevant DtoIn attributes.

```json
// --- create ---
"{entityCamelCase}/create": {
  "realization": "api/controllers/{EntityPascalCase}Controller.create",
  "httpMethod": "POST",
  "type": "CMD",
  "dtoInAuditMap": { "name": "$.name" }
},
// --- get ---
"{entityCamelCase}/get": {
  "realization": "api/controllers/{EntityPascalCase}Controller.get",
  "httpMethod": "GET",
  "type": "CMD",
  "dtoInAuditMap": { "id": "$.id" }
},
// --- update ---
"{entityCamelCase}/update": {
  "realization": "api/controllers/{EntityPascalCase}Controller.update",
  "httpMethod": "POST",
  "type": "CMD",
  "dtoInAuditMap": { "id": "$.id" }
},
// --- delete ---
"{entityCamelCase}/delete": {
  "realization": "api/controllers/{EntityPascalCase}Controller.delete",
  "httpMethod": "POST",
  "type": "CMD",
  "dtoInAuditMap": { "id": "$.id" }
},
// --- list ---
"{entityCamelCase}/list": {
  "realization": "api/controllers/{EntityPascalCase}Controller.list",
  "httpMethod": "GET",
  "type": "CMD"
},
// --- generic use case example (use GET or POST as confirmed by user) ---
"{entityCamelCase}/{useCase}": {
  "realization": "api/controllers/{EntityPascalCase}Controller.{useCase}",
  "httpMethod": "{httpMethod}",
  "type": "CMD",
  "dtoInAuditMap": { "id": "$.id" }
}
```
