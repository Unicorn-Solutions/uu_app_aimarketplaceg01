# Validation Types

Validation schema in uuScripts uses the same core functions as uuApp validation schemas.

## Basic types

- `string()`, `string(n)`, `string(n0, n1)`, `string(/regExp/)`
- `number()`, `number(n)`, `number(n0, n1)`
- `integer()`, `integer(i)`, `integer(i0, i1)`
- `float()`, `float(d)`
- `boolean()`
- `date()`, `date(format)`
- `time()`
- `datetime()`

## Structured types

- `array()`, `array(type)`, `array(type, max)`
- `shape({ key: type })`
- `map(keyType, valueType)`

## uuApp-specific types

- `uri()`, `uri(true)`
- `base64()`
- `uu5String()`, `uu5String(n)`, `uu5String(n, m)`
- `uu5Json()`, `uu5Json(n)`
- `uuIdentity()`
- `id()`
- `code()`
- `objectCode()`
- `dataKey()`
- `searchKey()`
- `hexa32Code()`
- `hexa64Code()`
- `binary()`
- `gps()`

## Modifiers and combinators

- `isRequired()`
- `isRequired(["alternativeKey1", "alternativeKey2"])`
- `oneOf([typeOrValueA, typeOrValueB])`
- `stringSetOf(["a", "b"])`
- `stringSetOf(["a", "b"], delimiter)`

## Example schema string

```javascript
const DtoInSchema = `
  const dtoInSchemaType = shape({
    baseUri: uri().isRequired(),
    itemId: id().isRequired(),
    limit: integer(1, 100),
    verbose: boolean(),
  });
`;
```
