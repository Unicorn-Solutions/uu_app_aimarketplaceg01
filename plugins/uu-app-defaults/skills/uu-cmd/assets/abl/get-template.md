# ABL Template - Get

File path: `app/abl/{entity-kebab-case}/get-abl.js`

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async get(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}GetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn,
    );

    // HDS 2. (Optional domain/business validations)
    // Example: enforce visibility/ownership/state rules before read.
    // If validation fails, throw dedicated domain error from Errors.Get.*

    // HDS 3.
    const {entityCamelCase} = await this.dao.get(awid, dtoIn.id);
    if (!{entityCamelCase}) {
      throw new Errors.Get.{EntityPascalCase}DoesNotExist(uuAppErrorMap, { {entityCamelCase}Id: dtoIn.id });
    }

    // HDS 4.
    return { ...{entityCamelCase}, uuAppErrorMap };
  }
}

module.exports = new GetAbl();
```
