---
name: third-party-client
description: Generate AppClient wrapper for calling third-party or external service use cases. Creates the client class, error definitions, and constants. Use when the user wants to call use cases from another uuApp, consume an external API, integrate with a remote service, or create an API client in components/clients.
---

# Third-Party Client Generator

Generate client components for communicating with third-party services, following the established project pattern.

## Mandatory Rule (No Exceptions)

When this skill is triggered, never implement third-party calls directly in ABL files.

- Allowed in ABL: client import, client instantiation, client method call, domain-level mapping/validation.
- Forbidden in ABL: building third-party URI, `AppClient.get/post` calls to third-party service, base-uri config reads, third-party transport errors.
- If the user explicitly asks to bypass the client layer, ask for confirmation once before proceeding.
- Base URI config naming must include service name in both constant and deploy key.
  - Good: `UU_BEM_BASE_URI` / `uu_bem_base_uri`
  - Bad: `BASE_URI` / `service_base_uri` / `person_card_base_uri`

## Placeholders

| Placeholder                   | Convention   | Example (MyTerritory)     | Source                           |
| ----------------------------- | ------------ | ------------------------- | -------------------------------- |
| `{ServiceName}`               | PascalCase   | `MyTerritory`             | User input (service name)        |
| `{ServicePascalCase}`         | PascalCase   | `Mt`                      | User input (class name prefix)   |
| `{service-kebab-case}`        | kebab-case   | `mt`                      | User input (file name)           |
| `{BASE_URI_CONFIG_KEY}`       | UPPER_SNAKE  | `MT_BASE_URI`             | User input (config key constant) |
| `{config_key_value}`          | snake_case   | `mt_base_uri`             | User input (deploy config key)   |
| `{BaseUriNotConfiguredError}` | PascalCase   | `MtBaseUriNotConfigured`  | Derived from service name        |
| `{baseUriNotConfiguredCode}`  | camelCase    | `mtBaseUriNotConfigured`  | Derived from service name        |
| `{USE_CASE_KEY}`              | UPPER_SNAKE  | `LOAD_WORKSPACE`          | User input (per method)          |
| `{methodName}`                | camelCase    | `loadWorkspace`           | User input (per method)          |
| `{endpointPath}`              | path         | `sys/uuAppWorkspace/load` | User input (per method)          |
| `{MethodErrorClass}`          | PascalCase   | `LoadAppWorkspaceFailed`  | Derived from method name         |
| `{methodErrorCode}`           | camelCase    | `loadAppWorkspaceFailed`  | Derived from method name         |
| `{AppBaseError}`              | PascalCase   | `JokesMainError`          | Project (base error class name)  |
| `{baseErrorRequirePath}`      | require path | `./jokes-main-error`      | Project (relative require path)  |

## Workflow

### 1. Gather Requirements

Collect the following from the user (ask if not provided):

- **Service name** -- PascalCase group name used in constants and errors (e.g., `MyTerritory`)
- **Client class prefix** -- short PascalCase prefix for the class name and file (e.g., `Mt` -> `MtClient`, `mt-client.js`)
- **Deploy config key** -- the snake_case key used in `Config.get()` for the service base URI (e.g., `mt_base_uri`)
  - Must include service name prefix (e.g., `uu_bem_base_uri`, `mt_base_uri`)
- **API methods** -- for each method provide:
  - Method name (camelCase, e.g., `loadWorkspace`)
  - Endpoint path (e.g., `sys/uuAppWorkspace/load`)
  - HTTP verb: `GET` or `POST`
  - Whether the method accepts `dtoIn`

Confirm the full list with the user before generating.

### 1.5 Pre-Flight Checklist (Must Pass Before Coding)

Before changing any implementation code, verify and keep this checklist:

- [ ] Third-party integration will be implemented in `app/components/clients/*-client.js`.
- [ ] Constants will be placed in `app/constants/third-party-constants.js` (and exported from `app/constants/index.js` if needed).
- [ ] Third-party transport/config errors will be placed in `app/api/errors/third-party-error.js`.
- [ ] ABL will not contain direct third-party `AppClient` calls.
- [ ] User approved any missing requirements (service name, config key, endpoint list).

If any checkbox cannot be satisfied, stop and ask the user what to do.

### 2. Load Project Context

Before generating any files, read the following project files to extract naming conventions and existing structure. The server root is the `-server/` directory containing `app/` and `test/`.

| File to read                                                              | What to extract                                                                                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `app/api/errors/` -- find the file that **exports a class** (not objects) | `{AppBaseError}` (class name, e.g., `JokesMainError`), `{baseErrorRequirePath}` (relative require path for use in `third-party-error.js`) |
| `app/constants/index.js`                                                  | Whether `ThirdPartyConstants` is already exported                                                                                         |
| `app/api/errors/third-party-error.js` (if exists)                         | Existing service groups and base error import (to append, not overwrite)                                                                  |
| `app/constants/third-party-constants.js` (if exists)                      | Existing service groups (to append, not overwrite)                                                                                        |

If any required file is missing or the server root cannot be determined, ask the user for the project path.

### 3. Add Constants

Check if `app/constants/third-party-constants.js` exists.

Load [assets/constants-template.md](assets/constants-template.md) and fill placeholders. If the file exists, insert the new service group into the existing `ThirdPartyConstants` object. If the file does not exist, create it with the full scaffold (including `module.exports`) and register `ThirdPartyConstants` in `app/constants/index.js`.

### 4. Add Error Definitions

Check if `app/api/errors/third-party-error.js` exists.

Load [assets/errors-template.md](assets/errors-template.md) and fill placeholders using `{AppBaseError}` and `{baseErrorRequirePath}` discovered in Step 2. If the file exists, append the new error group and add it to the existing `module.exports`. If the file does not exist, create it using the full file scaffold from the template.

### 5. Create Client Class

Load [assets/client-template.md](assets/client-template.md), fill all placeholders, and create the file at `app/components/clients/{service-kebab-case}-client.js`.

Include only the method variants that match the user's requirements (GET without dtoIn, GET with dtoIn, POST with dtoIn).

## Key Conventions

- `AppClient.get(useCase, dtoIn)` for read operations, `AppClient.post(useCase, dtoIn)` for write operations.
- Error constructor signature is always `(paramMap = {}, cause = null)` calling `super(code, message, paramMap, cause)`.
- Error codes are camelCase, error class names are PascalCase.
- Methods without `dtoIn` pass an empty object `{}` to `AppClient.get`.
- The `error` param in catch blocks is always forwarded as `cause` to the error constructor.
- The client class is exported directly: `module.exports = {ServicePascalCase}Client`.
- In ABLs, the client is imported and instantiated with a `session` object:

```javascript
const {ServicePascalCase}Client = require("../../components/clients/{service-kebab-case}-client");
const client = new {ServicePascalCase}Client(session);
const result = await client.{methodName}();
```

## Final Self-Check (Before Finishing)

- [ ] No direct third-party call logic exists in ABL files.
- [ ] New/updated constants, errors, and client files exist in expected locations.
- [ ] ABL only orchestrates business logic and consumes client output.
- [ ] Error boundaries are consistent: transport/config in third-party error file, domain errors in use-case error file.
