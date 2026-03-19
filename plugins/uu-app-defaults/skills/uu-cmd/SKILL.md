---
name: uu-cmd
description: Generate uuCmd endpoint implementations with all required configuration in the UAF (uuApp Framework). Creates ABL, DAO, controller, error, warning, validation type files and updates mappings, persistence, and profiles configs. Use when the user wants to create a new uuCmd, add a CRUD endpoint, scaffold a use case, or implement a new entity command in a uuApp server project.
---

# uuCmd Generator

Generate complete uuCmd endpoint implementations for UAF (uuApp Framework) server projects, including all required files and configuration updates.

## Workflow

### 1. Gather Requirements

Collect the following from the user (ask if not provided):

- **Entity name** (e.g., `joke`, `category`) - the uuObject being operated on
- **Use case type(s)** - which operations to generate: standard CRUD (`create`, `get`, `list`, `update`, `delete`) or generic commands (e.g., `assign`, `approve`, `close`, `setState`). Do not assume all.
- **Entity attributes** - the DtoIn properties for create/update (name, type, required/optional)
- **Optional domain validations** - business rules to validate inside ABL (e.g., referenced object exists, state allows operation, uniqueness in scope, cross-field rules). These are optional and can be skipped.
- **HTTP method** - for generic (non-CRUD) commands, ask whether it is `GET` or `POST`. CRUD commands have fixed methods (GET for get/list, POST for create/update/delete).
- **Profile rules** - which profiles can access each operation (defaults: create/update/delete = Authorities+Executives, get/list = Authorities+Executives+Readers)

**Before generating, always confirm with the user:**

1. **Entity attributes** - Present the list of attributes with their validation types and required/optional status. Ask the user to confirm or adjust before proceeding.
2. **Use cases to generate** - Confirm which operations to generate: all CRUD (`create`, `get`, `list`, `update`, `delete`), a subset, or generic commands.
3. **Optional domain validations** - Ask whether to include business/domain checks. If yes, confirm each rule with:
   - validation name and target use case(s)
   - condition (what is being checked)
   - source of truth (which DAO/service call provides data)
   - failure behavior (error code + message)
4. **HTTP method** - For each generic command, confirm whether it is `GET` or `POST`.

Do NOT proceed to file generation until the user confirms all of the above. Domain validations are optional - continue with scaffolding-only flow if user explicitly says none.

### 2. Load Project Context

Before generating any files, read the following project files to extract naming conventions and existing structure. The server root is the `-server/` directory containing `app/` and `test/`.

| File to read                                                             | What to extract                                                                                                                      |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `app/api/errors/` - find the file that **exports a class** (not objects) | `{AppPascalCase}` (class name, e.g., `JokesMain`), `{app-key}` (ERROR_PREFIX, e.g., `uu-jokes-main`), require path for entity errors |
| `app/abl/constants.js`                                                   | Existing `Schemas` object (to append new schema), `Profiles` object                                                                  |
| `app/config/mappings.json`                                               | Existing `useCaseMap` entries (to append, not overwrite)                                                                             |
| `app/config/persistence.json`                                            | Existing `schemaMap` entries (to append, not overwrite)                                                                              |
| `app/config/profiles.json`                                               | Existing profile structure and `useCaseMap` (to append, not overwrite)                                                               |

If any of these files are missing, ask the user for the project path.

If external integration is part of the requested uuCmd, also inspect:

| File to read                                         | What to extract                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `app/components/clients/`                            | Existing client naming and location                                |
| `app/constants/third-party-constants.js` (if exists) | Existing `{SERVICE}_BASE_URI` constant patterns                    |
| `env/*.json`                                         | Existing deploy key naming (`snake_case` with service name prefix) |

### 3. Create Scaffolding Implementation

Load the specific template file for each file type being generated.

If optional domain validations were confirmed, extend generated files with those checks (do not skip standard scaffolding steps).

Replace all placeholders with actual values:

| Placeholder                 | Case Convention  | Example         | Source                                 |
| --------------------------- | ---------------- | --------------- | -------------------------------------- |
| `{EntityPascalCase}`        | PascalCase       | `Joke`          | User input (entity name)               |
| `{entityCamelCase}`         | camelCase        | `joke`          | User input (entity name)               |
| `{entity-kebab-case}`       | kebab-case       | `joke`          | User input (entity name)               |
| `{ENTITY_UPPER_SNAKE_CASE}` | UPPER_SNAKE_CASE | `JOKE`          | User input (entity name)               |
| `{useCase}`                 | camelCase        | `assign`        | User input (operation name)            |
| `{UseCase}`                 | PascalCase       | `Assign`        | User input (operation name)            |
| `{AppPascalCase}`           | PascalCase       | `JokesMain`     | Project (base error class name)        |
| `{app-key}`                 | kebab-case       | `uu-jokes-main` | Project (ERROR_PREFIX from base error) |
| `{Schema}`                  | camelCase        | `joke`          | Same as `{entityCamelCase}`            |

**Do not assume full CRUD.** Only generate files for the confirmed use cases. When generating a single use case (or a subset), only create the relevant ABL, test, and error/warning entries - not the full set.

### 3.1 Apply Optional Domain Validations (When Provided)

When user provides business/domain validations, implement them directly in the generated ABL(s):

1. **Add required DAO dependencies** to ABL constructor (e.g., `this.jokeDao = DaoFactory.getDao("joke")`).
2. **Insert validation HDS steps after dtoIn validation** and before write operation.
3. **Throw explicit domain errors** from entity error file (e.g., `JokeDoesNotExist`, `InvalidState`, `CodeAlreadyExists`).
4. **Keep order deterministic**: dtoIn validation -> domain validations -> persistence call -> dtoOut.
5. **Do not invent validations** not confirmed by user. If uncertain, ask.

For reference checks (like `categoryId`), use DAO `get/findOne` and throw domain error when not found.

For non-reference business rules (state/uniqueness/cross-field), implement rule-specific condition and dedicated domain error.

#### Files to create (one per use case):

| File | Path                                           | Template                                                                                                                                                                                                                                     |
| ---- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ABL  | `app/abl/{entity-kebab-case}/{useCase}-abl.js` | [create](assets/abl/create-template.md), [get](assets/abl/get-template.md), [list](assets/abl/list-template.md), [update](assets/abl/update-template.md), [delete](assets/abl/delete-template.md), [generic](assets/abl/generic-template.md) |

#### Files to create or append to (may already exist):

All files below are shared across use cases. **Always check if they already exist first.** If they do, append the new use case entries instead of overwriting.

| File                          | Path                                                    | Template                                                         |
| ----------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| DAO                           | `app/dao/{entity-kebab-case}-mongo.js`                  | [assets/dao-template.md](assets/dao-template.md)                 |
| Controller                    | `app/api/controllers/{entity-kebab-case}-controller.js` | [assets/controller-template.md](assets/controller-template.md)   |
| Errors                        | `app/api/errors/{entity-kebab-case}-error.js`           | [assets/errors-template.md](assets/errors-template.md)           |
| Warnings                      | `app/api/warnings/{entity-kebab-case}-warning.js`       | [assets/warnings-template.md](assets/warnings-template.md)       |
| Validation Types              | `app/api/validation_types/{entity-kebab-case}-types.js` | [assets/types-template.md](assets/types-template.md)             |
| `app/config/mappings.json`    | Use case entries in `useCaseMap`                        | [assets/mappings-template.md](assets/mappings-template.md)       |
| `app/config/persistence.json` | Schema entry in `schemaMap`                             | [assets/persistence-template.md](assets/persistence-template.md) |
| `app/config/profiles.json`    | Profile entries in `useCaseMap` under `"*"`             | [assets/profiles-template.md](assets/profiles-template.md)       |
| `app/abl/constants.js`        | Schema constant in `Schemas` object                     | Add `{ENTITY_UPPER_SNAKE_CASE}: "{Schema}"` to `Schemas` object  |

### 4. Create Tests

**MANDATORY: You MUST create test files for EVERY use case generated in Step 3.**

For each use case, create a test file at:

`test/{entity-kebab-case}/{entity-kebab-case}-{useCase}.test.js`

Use the templates from [assets/tests-template.md](assets/tests-template.md):

- **create** → Create Test template
- **get** → Get Test template
- **list** → List Test template
- **update** → Update Test template
- **delete** → Delete Test template
- **generic** → Generic Test template (for non-CRUD commands)

Each test file must include:

- `beforeAll` / `afterAll` setup with proper initialization
- HDS (Happy Day Scenario) test case - the successful path
- At least 1-2 alternative scenarios (A1, A2, etc.) for error/edge cases
- Proper assertions using `expect()` and `expect.assertions(n)` for error cases
- If optional domain validations are implemented, add at least one alternative test per validation rule (e.g., A3 `jokeDoesNotExist`, A4 `invalidState`, A5 `codeAlreadyExists`)

Replace all placeholders following the same conventions as Step 3:

- `{EntityPascalCase}`, `{entityCamelCase}`, `{entity-kebab-case}`
- `{app-key}` from the project's error prefix
- Command names must match the controller endpoints

### 5. Run Tests

**MANDATORY: Execute the generated tests to verify the implementation works.**

1. Navigate to the server project root (the `-server/` directory)

2. Run the tests for the entity:

   ```bash
   npm test -- test/{entity-kebab-case}
   ```

3. Verify all tests pass:
   - All HDS tests should pass (200 status, expected data returned)
   - All alternative scenarios should pass (errors thrown with correct codes)
   - No unexpected errors or warnings in `uuAppErrorMap`

**If any test fails:**

- Read the error message carefully
- Fix the implementation (ABL, DAO, controller, validation types, etc.)
- Re-run the tests: `npm test -- test/{entity-kebab-case}`
- Repeat until all tests pass

**Always output the test results to the user** so they can see the verification.

Once all tests pass, the skill is complete.

## Key Conventions

- ABL files export a singleton instance: `module.exports = new CreateAbl();`
- Controller methods are `static` and receive `ucEnv`
- Every ABL method starts with DtoIn validation
- Every ABL method returns `{ ...result, uuAppErrorMap }`
- Error classes extend the app's base error class (which extends `UseCaseError`)
- Warnings reference error `UC_CODE` for consistent code prefixes
- Validation types use the UAF DSL: `shape()`, `id()`, `string()`, `uu5String()`, `integer()`, `boolean()`, `array()`, `oneOf()`, `binary()`, `datetime()`, `float()`
- Use basic data types (`string()`, `integer()`, `boolean()`, etc.) for validation as much as possible. Do not use `uu5String()` unless the attribute specifically needs to hold UU5 rich-text content.
- Validation Types: NEVER use `module.exports` or `export` in validation type files. Define them as `const` variables; the framework handles the rest.
- DAO methods: `create` → `insertOne`, `get` → `findOne`, `update` → `findOneAndUpdate`, `delete` → `deleteOne`, `list` → `find`
- HTTP methods: `GET` for reads (get, list), `POST` for writes (create, update, delete). Generic commands use the HTTP method confirmed by the user.
- Tests follow the pattern: HDS (happy day scenario), A1, A2... (alternatives/error cases)
- `mappings.json` `realization` always uses `api/controllers/{EntityPascalCase}Controller.{useCase}` (PascalCase class), never `api/controllers/{entity-kebab-case}-{suffix}.{useCase}`.
