# DAO Template

File path: `app/dao/{entity-kebab-case}-mongo.js`

DAO method mapping:

- `create` -> `super.insertOne(uuObject)`
- `get` -> `super.findOne({ id, awid })`
- `update` -> `super.findOneAndUpdate(filter, uuObject, "NONE")`
- `delete` -> `super.deleteOne({ awid, id })`
- `list` -> `super.find(filter, pageInfo, sort)`

The `{ awid: 1, _id: 1 }` index in `createSchema()` is mandatory and must always be present as-is. Add additional indexes for frequently queried attributes.

```javascript
"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class {EntityPascalCase}Mongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, criteria = {}, sortBy, order, pageInfo) {
    let filter = { awid, ...criteria };
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    }
    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = {EntityPascalCase}Mongo;
```
