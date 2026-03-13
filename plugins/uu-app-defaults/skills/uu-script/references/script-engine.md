# Description

A uuScript is dynamically loaded JavaScript executed by uuScriptEngine.

- It runs asynchronously.
- It runs in a sandboxed Node.js environment.
- It has no filesystem access.
- It is intended for long-running tasks.
- It cannot access a database directly; use `dtoIn` and uuApp calls via `AppClient`.

## Sandbox notes

Examples of disabled Node modules in uuScriptEngine:

```javascript
const DISABLED_LIBS = [
  "fs",
  "child_process",
  "cluster",
  "v8",
  "tty",
  "repl",
  "process",
  "path",
  "perf_hooks",
  "os",
  "inspector",
  "domain",
  "module",
];
```

Examples of commonly allowed external libraries:

```javascript
const ALLOWED_LIBRARIES = [
  "sax@1.2.4",
  "moment@2.30.1",
  "csv@5.1.1",
  "archiver@4.0.1",
  "unzipper@0.10.11",
  "decimal.js@10.2.1",
  "xml-js@1.6.11",
  "exceljs@4.3.0",
  "p-limit@3.1.0",
  "jsonata@1.8.6",
  "uu_excelexporterg01@^3.0.0",
  "uu_i18ng01@^1.0.0",
  "uu5stringg01@^1.3.3",
  "uu_consoleg02-uulib@^1.0.0",
];
```

## Architecture

- uuScriptEngine executes scripts.
- uuScriptRepository stores script files.
- uuConsole shows script output.

## Script section structure

Use these sections in every generated script:

1. `imports`
2. `names`
3. `mockups`
4. `errors`
5. `validateDtoIn`
6. `helpers`
7. `main`

## Minimal template shape

```javascript
/*@@viewOn:imports*/
const { AppClient } = require("uu_appg01_server");
/*@@viewOff:imports*/

/*@@viewOn:names*/
const Names = {
  SCRIPT_LIB_NAME: "uu_jokes_maing01-uuscriptlib",
  SCRIPT_NAME: "RateJokes",
};
/*@@viewOff:names*/

/*@@viewOn:mockups*/
/*@@viewOff:mockups*/

/*@@viewOn:errors*/
/* error classes extending UseCaseError */
/*@@viewOff:errors*/

/*@@viewOn:validateDtoIn*/
const DtoInSchema = `
  const dtoInSchemaType = shape({});
`;
/*@@viewOff:validateDtoIn*/

/*@@viewOn:helpers*/
const { dtoIn, console, session } = scriptContext;
/*@@viewOff:helpers*/

/*@@viewOn:main*/
async function main() {
  return { uuAppErrorMap: {} };
}
/*@@viewOff:main*/

main();
```
