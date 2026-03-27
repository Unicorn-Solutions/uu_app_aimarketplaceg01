# Validation Types Template

File path: `app/api/validation_types/{entity-kebab-case}-types.js`

**Important**: Use basic data types for validation as much as possible. Do not use `uu5String()` unless the attribute specifically needs to hold UU5 rich-text content. For plain text attributes like `name`, `description`, `code`, etc., always use `string()`.

```javascript
/* eslint-disable no-undef, no-unused-vars */
// --- create ---
const {entityCamelCase}CreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  // add entity-specific attributes here
});

// --- get ---
const {entityCamelCase}GetDtoInType = shape({
  id: id().isRequired(),
});

// --- update ---
const {entityCamelCase}UpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1, 255),
  // add entity-specific updatable attributes here
});

// --- delete ---
const {entityCamelCase}DeleteDtoInType = shape({
  id: id().isRequired(),
});

// --- list ---
const {entityCamelCase}ListDtoInType = shape({
  sortBy: oneOf(["name"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

// --- generic use case example ---
const {entityCamelCase}{UseCase}DtoInType = shape({
  id: id().isRequired(),
  // add use-case-specific attributes here
});

// DO NOT ADD module.exports HERE.
// UAF loads these variables into the global validation scope automatically.
```
