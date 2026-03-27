# Uri and UriBuilder

Use uuApp URI utilities instead of manual URL concatenation.

## Import

```javascript
const { Uri, UriBuilder } = require("uu_appg01_server").Uri;
```

## Uri

Use `Uri` for parsing/reading existing URIs:

- `Uri.parse(uriString)`
- `uri.getBaseUri()`
- `uri.getUseCase()`
- `uri.getParameters()`
- `uri.toString()`

## UriBuilder

Use `UriBuilder` for constructing URIs:

- `UriBuilder.parse(uri)`
- `builder.setUseCase("some/useCase")`
- `builder.setParameter("key", "value")`
- `builder.setParameters({ key: "value" })`
- `builder.toUri().toString()`

## Example

```javascript
const baseUri = Uri.parse(dtoIn.baseUri).getBaseUri();
const uri = baseUri
  .getBuilder()
  .setUseCase("joke/list")
  .setParameters({ pageInfo: "1,50" })
  .toUri()
  .toString();
```

## Rule

When generating scripts that call uuCommands, prefer `Uri` / `UriBuilder` for URI handling.
