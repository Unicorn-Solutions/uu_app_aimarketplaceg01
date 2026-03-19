# Description

uuScripts cannot use standard `require()` for repository script files.  
Use `uuScriptRequire()` for script helpers stored in script libraries.

## Basic rule

- Use `require()` for allowed Node/uuApp libraries.
- Use `uuScriptRequire()` for helper scripts from `src/` in script repositories.

## Example

```javascript
const { AppClient } = require("uu_appg01_server");
const MyHelper = uuScriptRequire("uu_jokes_maing01-uuscriptlib/helpers/my-helper");
```

## Path format

`uuScriptRequire("<scriptLibName>/<path-under-src-without-.js>")`

Example:

- Script file in repository: `src/helpers/some-helper.js`
- Require path: `"uu_jokes_maing01-uuscriptlib/helpers/some-helper"`

## How to resolve scriptLibName

Always read `name` from `package.json` in the target `*-uuscriptlib` folder.

## Practical note

`uuScriptRequire()` loads helper code through uuScriptRepository APIs and executes it as a module.
If helper loading fails, verify:

- helper exists in repository,
- script library name is correct,
- import path is correct relative to `src/`.
