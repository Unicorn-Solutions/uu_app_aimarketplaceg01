# Test Templates

File path: `test/{entity-kebab-case}/{entity-kebab-case}-{useCase}.test.js`

Test conventions:

- `HDS` = Happy Day Scenario (successful path)
- `A1`, `A2`, ... = Alternative scenarios (error/edge cases)
- `executePostCommand` for write operations (create, update, delete)
- `executeGetCommand` for read operations (get, list)
- Error test cases: use `expect.assertions(n)` and put all `expect()` calls inside the `catch` block

## Create Test

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful create", async () => {
  await TestHelper.login("Authorities");

  let dtoIn = {
    name: "Test {EntityPascalCase}",
  };
  let result = await TestHelper.executePostCommand("{entityCamelCase}/create", dtoIn);
  expect(result.status).toEqual(200);
  expect(result.name).toEqual(dtoIn.name);
  expect(result.uuAppErrorMap).toEqual({});
});

test("A1 - unsupported keys in dtoIn", async () => {
  await TestHelper.login("Authorities");

  let result = await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Test",
    extra: "value",
  });
  expect(result.status).toEqual(200);
  let warning = result.uuAppErrorMap["{app-key}/{entityCamelCase}/create/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand("{entityCamelCase}/create", {});
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/create/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});
```

## Get Test

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful get", async () => {
  await TestHelper.login("Authorities");

  let created = await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Test {EntityPascalCase}",
  });
  let result = await TestHelper.executeGetCommand("{entityCamelCase}/get", { id: created.id });
  expect(result.status).toEqual(200);
  expect(result.name).toEqual("Test {EntityPascalCase}");
  expect(result.uuAppErrorMap).toEqual({});
});

test("A1 - {entityCamelCase} does not exist", async () => {
  expect.assertions(1);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executeGetCommand("{entityCamelCase}/get", { id: "012345678910111213141516" });
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/get/{entityCamelCase}DoesNotExist");
  }
});
```

## List Test

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful list", async () => {
  await TestHelper.login("Authorities");

  await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Test {EntityPascalCase}",
  });
  let result = await TestHelper.executeGetCommand("{entityCamelCase}/list", {});
  expect(result.status).toEqual(200);
  expect(result.itemList.length).toEqual(1);
  expect(result.pageInfo).toBeTruthy();
  expect(result.uuAppErrorMap).toEqual({});
});
```

## Update Test

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful update", async () => {
  await TestHelper.login("Authorities");

  let created = await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Original",
  });
  let result = await TestHelper.executePostCommand("{entityCamelCase}/update", {
    id: created.id,
    name: "Updated",
  });
  expect(result.status).toEqual(200);
  expect(result.name).toEqual("Updated");
  expect(result.uuAppErrorMap).toEqual({});
});

test("A1 - {entityCamelCase} does not exist", async () => {
  expect.assertions(1);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand("{entityCamelCase}/update", {
      id: "012345678910111213141516",
      name: "Updated",
    });
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/update/{entityCamelCase}DoesNotExist");
  }
});
```

## Delete Test

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful delete", async () => {
  await TestHelper.login("Authorities");

  let created = await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Test {EntityPascalCase}",
  });
  let result = await TestHelper.executePostCommand("{entityCamelCase}/delete", { id: created.id });
  expect(result.status).toEqual(200);
  expect(result.uuAppErrorMap).toEqual({});
});

test("A1 - {entityCamelCase} does not exist", async () => {
  expect.assertions(1);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand("{entityCamelCase}/delete", {
      id: "012345678910111213141516",
    });
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/delete/{entityCamelCase}DoesNotExist");
  }
});
```

## Generic Test

Use this template for non-CRUD commands. Adapt the DtoIn, assertions, and error codes to the specific use case. Use `executePostCommand` or `executeGetCommand` based on the HTTP method confirmed by the user.

```javascript
const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

test("HDS - successful {useCase}", async () => {
  await TestHelper.login("Authorities");

  let created = await TestHelper.executePostCommand("{entityCamelCase}/create", {
    name: "Test {EntityPascalCase}",
  });
  let result = await TestHelper.executePostCommand("{entityCamelCase}/{useCase}", {
    id: created.id,
    // add use-case-specific dtoIn attributes here
  });
  expect(result.status).toEqual(200);
  expect(result.uuAppErrorMap).toEqual({});
});

test("A1 - {entityCamelCase} does not exist", async () => {
  expect.assertions(1);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand("{entityCamelCase}/{useCase}", {
      id: "012345678910111213141516",
    });
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/{useCase}/{entityCamelCase}DoesNotExist");
  }
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand("{entityCamelCase}/{useCase}", {});
  } catch (e) {
    expect(e.code).toEqual("{app-key}/{entityCamelCase}/{useCase}/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});
```
