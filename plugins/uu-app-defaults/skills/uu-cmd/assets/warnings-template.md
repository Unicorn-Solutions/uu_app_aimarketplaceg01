# Warning Templates

File path: `app/api/warnings/{entity-kebab-case}-warning.js`

Each use case group must have at least `UnsupportedKeys`. Include only the groups for use cases being generated. Add custom warnings as needed (e.g., `CategoryDoesNotExist` with both `code` and `message`).

```javascript
const Errors = require("../errors/{entity-kebab-case}-error.js");

const Warnings = {
  // --- create ---
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },
  },
  // --- get ---
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },
  // --- update ---
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
  },
  // --- delete ---
  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    },
  },
  // --- list ---
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
  // --- generic use case example ---
  {UseCase}: {
    UnsupportedKeys: {
      code: `${Errors.{UseCase}.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
```
