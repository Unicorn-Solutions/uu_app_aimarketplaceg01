# ABL Template - Update

File path: `app/abl/{entity-kebab-case}/update-abl.js`

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async update(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}UpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn,
    );

    // HDS 2.
    const {entityCamelCase} = await this.dao.get(awid, dtoIn.id);
    if (!{entityCamelCase}) {
      throw new Errors.Update.{EntityPascalCase}DoesNotExist({ uuAppErrorMap }, { {entityCamelCase}Id: dtoIn.id });
    }

    // HDS 3. (Optional domain/business validations)
    // Example: check state transition rules, cross-field constraints, uniqueness in scope.
    // If validation fails, throw dedicated domain error from Errors.Update.*

    // HDS 4.
    const toUpdate = { ...dtoIn, awid };
    let updated{EntityPascalCase};
    try {
      updated{EntityPascalCase} = await this.dao.update(toUpdate);
    } catch (e) {
      throw new Errors.Update.{EntityPascalCase}DaoUpdateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5.
    return { ...updated{EntityPascalCase}, uuAppErrorMap };
  }
}

module.exports = new UpdateAbl();
```
