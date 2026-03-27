```javascript
/*@@viewOn:imports*/
const { AppClient } = require("uu_appg01_server");
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper, UseCaseError } = require("uu_appg01_server").AppServer;
// const SomeHelper = uuScriptRequire("{scriptLibName}/helpers/some-helper");
/*@@viewOff:imports*/

/*@@viewOn:constants*/
const Constants = {
  SCRIPT_LIB_NAME: "{scriptLibName}",
  SCRIPT_NAME: "{script-name}",
};
/*@@viewOff:constants*/

/*@@viewOn:mockups*/
/*@@viewOff:mockups*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Constants.SCRIPT_LIB_NAME}/script/${Constants.SCRIPT_NAME}/`,

  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap) {
      super({ dtoOut, paramMap, status: 400 });
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },

  ExternalCallFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "External call failed.";
      this.code = `${Errors.ERROR_PREFIX}externalCallFailed`;
    }
  },
};
/*@@viewOff:errors*/

/*@@viewOn:validateDtoIn*/
const DtoInSchema = `
  const dtoInSchemaType = shape({
    // uu{ServiceName}BaseUri: uri().isRequired(),
    // itemId: id().isRequired(),
  });
`;
/*@@viewOff:validateDtoIn*/

/*@@viewOn:helpers*/
const { dtoIn, console, session } = scriptContext;
let dtoOut = { dtoIn, uuAppErrorMap: {} };

function validateDtoIn(dtoInSchema) {
  const validator = new Validator(dtoInSchema);
  const validationResult = validator.validate("dtoInSchemaType", dtoIn);

  return ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    `${Errors.ERROR_PREFIX}unsupportedKeys`,
    Errors.InvalidDtoIn
  );
}

function addWarning(code, message, params = {}) {
  dtoOut.uuAppErrorMap[code] = {
    type: "warning",
    code: `${Errors.ERROR_PREFIX}${code}`,
    message,
    paramMap: params,
  };
  console.warning(`${code}: ${message}`);
}

async function callExternalUseCase(uu{ServiceName}BaseUri, useCase, useCaseDtoIn = {}, method = "get") {
  const client = new AppClient({ baseUri: uu{ServiceName}BaseUri, session });

  try {
    if (method === "post") return await client.cmdPost(useCase, useCaseDtoIn);
    return await client.cmdGet(useCase, useCaseDtoIn);
  } catch (e) {
    throw new Errors.ExternalCallFailed(dtoOut, { baseUri: uu{ServiceName}BaseUri, useCase }, e);
  }
}
/*@@viewOff:helpers*/

/*@@viewOn:main*/
async function main() {
  console.info("HDS1 - Validate dtoIn.");
  dtoOut.uuAppErrorMap = validateDtoIn(DtoInSchema);

  // HDS2+
  // Example:
  // const data = await callExternalUseCase(dtoIn.uu{ServiceName}BaseUri, "some/useCase", { id: dtoIn.itemId }, "get");
  // dtoOut.data = data;
  // addWarning("partialResult", "Some items were skipped.", { skipped: 1 });

  console.info("Finished.");
  return dtoOut;
}
/*@@viewOff:main*/

main();
```
