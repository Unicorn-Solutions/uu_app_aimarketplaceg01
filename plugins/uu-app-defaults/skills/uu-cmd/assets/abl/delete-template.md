# ABL Template - Delete

File path: `app/abl/{entity-kebab-case}/delete-abl.js`

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async delete(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}DeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn,
    );

    // HDS 2.
    const {entityCamelCase} = await this.dao.get(awid, dtoIn.id);
    if (!{entityCamelCase}) {
      throw new Errors.Delete.{EntityPascalCase}DoesNotExist({ uuAppErrorMap }, { {entityCamelCase}Id: dtoIn.id });
    }

    // HDS 3. (Optional domain/business validations)
    // Example: prevent delete in forbidden states, ensure no dependent records exist.
    // If validation fails, throw dedicated domain error from Errors.Delete.*

    // HDS 4.
    await this.dao.delete(awid, dtoIn.id);

    // HDS 5.
    return { uuAppErrorMap };
  }
}

module.exports = new DeleteAbl();
```
