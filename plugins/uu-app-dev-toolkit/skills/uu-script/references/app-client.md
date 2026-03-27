# AppClient

`AppClient` from `uu_appg01_server` is the standard way to call uuApp endpoints from scripts.

## Import

```javascript
const { AppClient } = require("uu_appg01_server");
```

## Methods

- `cmdGet(useCaseOrUri, dtoIn, options?)`
- `cmdPost(useCaseOrUri, dtoIn, options?)`

Use GET for reads and POST for writes.

## Instance usage (recommended in scripts)

```javascript
const client = new AppClient({ baseUri: dtoIn.baseUri, session });
const dtoOut = await client.cmdGet("some/useCase", { id: dtoIn.id });
```

## Static usage

```javascript
const dtoOut = await AppClient.cmdPost("https://host/product/awid/some/useCase", { x: 1 }, { session });
```

## Important options

- `baseUri` - for calling use cases relatively
- `session` - forwards current user token
- `headers` - custom headers

## Rules

- Always use `AppClient`, do not create custom HTTP clients.
- Prefer `cmdGet` / `cmdPost`.
- Pass current `session` in script calls.
- Handle failures with named `UseCaseError` classes.
