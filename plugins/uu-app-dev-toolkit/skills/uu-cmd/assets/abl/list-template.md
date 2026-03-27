# ABL Template - List

File path: `app/abl/{entity-kebab-case}/list-abl.js`

```javascript
"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/{entity-kebab-case}-error");
const Warnings = require("../../api/warnings/{entity-kebab-case}-warning");

const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("{entityCamelCase}");
    // Optional domain validation DAOs/services:
    // this.relatedEntityDao = DaoFactory.getDao("relatedEntity");
  }

  async list(awid, dtoIn) {
    let uuAppErrorMap = {};

    // HDS 1.
    const validationResult = this.validator.validate("{entityCamelCase}ListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn,
    );

    // HDS 1.4.
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    // HDS 2. (Optional domain/business validations)
    // Example: validate allowed filter/sort combinations, tenant/state visibility rules.
    // If validation fails, throw dedicated domain error from Errors.List.*

    // HDS 3.
    const list = await this.dao.list(awid, {}, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);

    // HDS 4.
    return { ...list, uuAppErrorMap };
  }
}

module.exports = new ListAbl();
```
