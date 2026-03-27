# persistence.json Template

File path: `app/config/persistence.json`

Add entry to `uuSubAppDataStore.primary.schemaMap`:

- `{Schema}` must match the constant in `app/abl/constants.js` `Schemas` object
- `realization` points to the DAO class file (without `.js` extension)
- `maxNoi` is the maximum number of instances (adjust based on expected volume)

```json
"{Schema}": {
  "realization": "dao/{EntityPascalCase}Mongo",
  "maxNoi": 1000
}
```
