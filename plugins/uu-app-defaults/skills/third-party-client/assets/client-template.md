# Client Template

File path: `app/components/clients/{service-kebab-case}-client.js`

Conventions:

- Constructor reads `baseUri` from deploy config via `Config.get()` using a constant key
- Validates that `baseUri` is configured, throws dedicated error if not
- Each method wraps a single API call in try/catch, throwing a specific error
- `useCaseMap` is a local constant object mapping use case keys to endpoint paths
- GET for reads, POST for writes

```javascript
"use strict";

const { AppClient } = require("uu_appg01_server");
const { Config } = require("uu_appg01_server").Utils;
const { ThirdPartyConstants } = require("../../constants");
const { {ServiceName}: Errors } = require("../../api/errors/third-party-error");

const useCaseMap = {
  // {USE_CASE_KEY}: "{endpointPath}",
};

class {ServicePascalCase}Client {
  constructor(session) {
    this.baseUri = Config.get(ThirdPartyConstants.{ServiceName}.CONFIG_KEYS.{BASE_URI_CONFIG_KEY});
    if (!this.baseUri) {
      throw new Errors.{BaseUriNotConfiguredError}();
    }
    this.appClient = new AppClient({ baseUri: this.baseUri, session });
  }

  // --- GET without dtoIn ---
  async {methodName}() {
    try {
      return await this.appClient.get(useCaseMap.{USE_CASE_KEY}, {});
    } catch (error) {
      throw new Errors.{MethodErrorClass}({ baseUri: this.baseUri }, error);
    }
  }

  // --- GET with dtoIn ---
  async {methodName}(dtoIn) {
    try {
      return await this.appClient.get(useCaseMap.{USE_CASE_KEY}, dtoIn);
    } catch (error) {
      throw new Errors.{MethodErrorClass}({ baseUri: this.baseUri, dtoIn }, error);
    }
  }

  // --- POST with dtoIn ---
  async {methodName}(dtoIn) {
    try {
      return await this.appClient.post(useCaseMap.{USE_CASE_KEY}, dtoIn);
    } catch (error) {
      throw new Errors.{MethodErrorClass}({ baseUri: this.baseUri, dtoIn }, error);
    }
  }
}

module.exports = {ServicePascalCase}Client;
```
