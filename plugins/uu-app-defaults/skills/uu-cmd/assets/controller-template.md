# Controller Template

File path: `app/api/controllers/{entity-kebab-case}-controller.js`

Controller conventions:

- Each method receives `ucEnv` and delegates to the corresponding ABL
- `ucEnv.getUri().getAwid()` - workspace ID
- `ucEnv.getDtoIn()` - DtoIn
- Include only the methods for use cases being generated

```javascript
"use strict";
// --- include only imports for generated use cases ---
const CreateAbl = require("../../abl/{entity-kebab-case}/create-abl");
const GetAbl = require("../../abl/{entity-kebab-case}/get-abl");
const UpdateAbl = require("../../abl/{entity-kebab-case}/update-abl");
const DeleteAbl = require("../../abl/{entity-kebab-case}/delete-abl");
const ListAbl = require("../../abl/{entity-kebab-case}/list-abl");
// --- generic use case example ---
const {UseCase}Abl = require("../../abl/{entity-kebab-case}/{useCase}-abl");

class {EntityPascalCase}Controller {
  // --- create ---
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  // --- get ---
  get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  // --- update ---
  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  // --- delete ---
  delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  // --- list ---
  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  // --- generic use case example ---
  {useCase}(ucEnv) {
    return {UseCase}Abl.{useCase}(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new {EntityPascalCase}Controller();
```
