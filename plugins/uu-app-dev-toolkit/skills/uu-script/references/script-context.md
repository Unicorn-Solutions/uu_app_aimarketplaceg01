# Description

uuScripts have a global `scriptContext` object available in script files and helpers loaded by `uuScriptRequire`.

## scriptContext properties

- `dtoIn` - input object
- `dtoOut` - output object (typically contains `uuAppErrorMap`)
- `console` - script console API
- `session` - current user session
- `scriptRuntime` - runtime metadata

## Recommended destructuring

Use direct destructuring at the top of helper/main area:

```javascript
const { dtoIn, console, session } = scriptContext;
```

## dtoOut usage

Return results through `dtoOut` keys and keep warnings/errors in `uuAppErrorMap`.

```javascript
const dtoOut = { dtoIn, uuAppErrorMap: {} };

async function main() {
  dtoOut.result = "ok";
  return dtoOut;
}
```

## console API

Available methods:

- `log(message)`
- `info(message)`
- `warning(message)`
- `success(message)`
- `error(message)`
- `put(message)`
- `system(message)`

## scriptRuntime highlights

Frequently used methods:

- `getScriptEngineUri()`
- `getScriptConsoleUri()`
- `getScriptLibraryList()`
- `getScriptRunId()`
- `getScriptUri()`
- `getScriptName()`
