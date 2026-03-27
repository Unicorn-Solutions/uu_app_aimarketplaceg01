---
name: uu-script
description: Generate uuScript files for uuScriptEngine with validation, error handling, AppClient calls, and logging. Use when creating scripts in `*-uuscriptlib` projects, automating tasks via uuScriptEngine, or calling uuApp commands from long-running scripts.
---

# uuScript Generator

Generate uuScript files for `*-uuscriptlib` projects using project conventions and uuScriptEngine constraints.

## Core Rules

- uuScripts are async JavaScript run by uuScriptEngine in a sandboxed environment.
- Scripts are for long-running tasks, cannot access the database, and must rely on `dtoIn` plus uuApp calls via `AppClient`.
- Every script must contain exactly these sections:
  - `imports`
  - `constants`
  - `mockups`
  - `errors`
  - `validateDtoIn`
  - `helpers`
  - `main`
- Every script must expose a single async `main()` and execute it at the bottom.
- Always use the current user session for `AppClient` calls.
- Never create helper scripts without explicit user confirmation.
- Always resolve project context from the relevant `*-uuscriptlib` folder.
- Do not generate test files in this skill version.
- Do not generate or mention generic-script-helper in this skill.

## Workflow

### 1) Gather Requirements (must confirm before generation)

Collect and confirm:

- Script name (kebab-case, e.g. `rate-jokes`)
- dtoIn parameters (name, type, required/optional)
- dtoOut shape (fields beyond `uuAppErrorMap`, including types and when they are populated)
- Happy Day Scenario (ordered implementation steps)
- External uuApp calls:
  - base URI parameter from dtoIn (must be prefixed with service name in camelCase, e.g. `uuBemBaseUri`, `uuJokesBaseUri`)
  - use case path
  - HTTP method
  - command dtoIn / dtoOut expectations

Do not proceed until user confirms these inputs.

### 2) Load Project Context

- Identify the target script library root as the relevant `*-uuscriptlib` folder.
- Read `package.json` in that folder and extract `name` as `scriptLibName`.
- Never use `package.json` from unrelated monorepo roots or nested packages.
- Scan `src/helpers/` and list reusable helpers + their exports before generating new code.

### 3) Create Script File

Generate `src/{script-name}.js` from `assets/script-template.md`.

Fill placeholders:

| Placeholder | Source | Example |
| --- | --- | --- |
| `{scriptLibName}` | `package.json` `name` | `uu_jokes_maing01-uuscriptlib` |
| `{script-name}` | kebab-case script name | `rate-jokes` |
| `{ServiceName}` | PascalCase name of the external service (used for baseUri param) | `Bem`, `Jokes` |

Template requirements:

- `imports` include `AppClient`, `Validator`, `ValidationHelper`, `UseCaseError`, and approved helper imports via `uuScriptRequire`
- `constants` define `SCRIPT_LIB_NAME` and `SCRIPT_NAME` (SCRIPT_NAME is always kebab-case)
- `errors` use `UseCaseError` and `ERROR_PREFIX: ${Constants.SCRIPT_LIB_NAME}/script/${Constants.SCRIPT_NAME}/`
- `validateDtoIn` contains schema string based on confirmed dtoIn
- `helpers` use:
  - `const { dtoIn, console, session } = scriptContext;`
  - `let dtoOut = { dtoIn, uuAppErrorMap: {} };` (use `let`, not `const`)
  - inlined `validateDtoIn()`
  - inlined `addWarning()`
  - API helper functions (baseUri parameters must use service-prefixed names, e.g. `uuBemBaseUri`)
- `main` validates input, executes HDS with progress logging, and returns `dtoOut`

Error class pattern:

```javascript
const { UseCaseError } = require("uu_appg01_server").AppServer;

const Errors = {
  ERROR_PREFIX: `${Constants.SCRIPT_LIB_NAME}/script/${Constants.SCRIPT_NAME}/`,
  SomethingFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Something failed.";
      this.code = `${Errors.ERROR_PREFIX}somethingFailed`;
    }
  },
};
```

### 4) Generate Custom Helpers (only with approval)

If reusable helpers from Step 2 are insufficient:

- Ask for explicit confirmation before creating each new helper.
- Explain helper purpose and planned API.
- Create helper in `src/helpers/{helper-name}.js` only after approval.
- Export via `module.exports`.
- Import via `uuScriptRequire("{scriptLibName}/helpers/{helper-name}")`.

## References

Use bundled files in `references/`:

- `references/script-engine.md`
- `references/script-context.md`
- `references/script-require.md`
- `references/validation.md`
- `references/app-client.md`
- `references/uri.md`
