# Error Templates

File path: `app/api/errors/{entity-kebab-case}-error.js`

## Entity Errors

Each use case group has `InvalidDtoIn` plus use-case-specific errors. Include only the groups for use cases being generated.

```javascript
"use strict";
const {AppPascalCase}Error = require("./{app-key}-error");
const {ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX = `${{AppPascalCase}Error.ERROR_PREFIX}{entityCamelCase}/`;

// --- create ---
const Create = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}create/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  {EntityPascalCase}DaoCreateFailed: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}{entityCamelCase}DaoCreateFailed`;
      this.message = "Create {entityCamelCase} by {entityCamelCase} DAO create failed.";
    }
  },
};

// --- get ---
const Get = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}get/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  {EntityPascalCase}DoesNotExist: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}{entityCamelCase}DoesNotExist`;
      this.message = "{EntityPascalCase} does not exist.";
    }
  },
};

// --- update ---
const Update = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}update/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  {EntityPascalCase}DoesNotExist: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}{entityCamelCase}DoesNotExist`;
      this.message = "{EntityPascalCase} does not exist.";
    }
  },
  {EntityPascalCase}DaoUpdateFailed: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}{entityCamelCase}DaoUpdateFailed`;
      this.message = "Update {entityCamelCase} by {entityCamelCase} DAO update failed.";
    }
  },
};

// --- delete ---
const Delete = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}delete/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  {EntityPascalCase}DoesNotExist: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}{entityCamelCase}DoesNotExist`;
      this.message = "{EntityPascalCase} does not exist.";
    }
  },
};

// --- list ---
const List = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}list/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

// --- generic use case example ---
const {UseCase} = {
  UC_CODE: `${{{ENTITY_UPPER_SNAKE_CASE}_ERROR_PREFIX}}{useCase}/`,
  InvalidDtoIn: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${{UseCase}.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  {EntityPascalCase}DoesNotExist: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${{UseCase}.UC_CODE}{entityCamelCase}DoesNotExist`;
      this.message = "{EntityPascalCase} does not exist.";
    }
  },
  {EntityPascalCase}DaoUpdateFailed: class extends {AppPascalCase}Error {
    constructor() {
      super(...arguments);
      this.code = `${{UseCase}.UC_CODE}{entityCamelCase}DaoUpdateFailed`;
      this.message = "{UseCase} {entityCamelCase} by {entityCamelCase} DAO update failed.";
    }
  },
};

// --- export only the generated groups ---
module.exports = {
  Create,
  Get,
  Update,
  Delete,
  List,
  {UseCase},
};
```
