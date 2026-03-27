# ABL Template - Generic

File path: `app/abl/{entity-kebab-case}/{useCase}-abl.js`

Use this template for non-CRUD commands (e.g., `assign`, `approve`, `close`, `setState`). Implement use-case-specific business logic after validation.

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

class {UseCase}Abl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async {useCase}(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}{UseCase}DtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.{UseCase}.UnsupportedKeys.code,
      Errors.{UseCase}.InvalidDtoIn,
    );

    // HDS 2. (Optional domain/business validations)
    // Implement optional domain checks confirmed by user (references, state, uniqueness, cross-field rules).
    // If validation fails, throw dedicated domain error from Errors.{UseCase}.*

    // HDS 3. - Implement remaining use-case-specific business logic

    // HDS 4.
    return { uuAppErrorMap };
  }
}

module.exports = new {UseCase}Abl();
```
