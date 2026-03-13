# ABL Template - Create

File path: `app/abl/{entity-kebab-case}/create-abl.js`

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async create(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}CreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn,
    );

    // HDS 2. (Optional domain/business validations)
    // Example: verify referenced entities, check state transitions, enforce uniqueness.
    // If validation fails, throw dedicated domain error from Errors.Create.*

    // HDS 3.
    const uuObject = {
      ...dtoIn,
      awid,
    };

    // HDS 4.
    let {entityCamelCase};
    try {
      {entityCamelCase} = await this.dao.create(uuObject);
    } catch (e) {
      throw new Errors.Create.{EntityPascalCase}DaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5.
    return { ...{entityCamelCase}, uuAppErrorMap };
  }
}

module.exports = new CreateAbl();
```
