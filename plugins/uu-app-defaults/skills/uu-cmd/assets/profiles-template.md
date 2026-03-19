# profiles.json Template

File path: `app/config/profiles.json`

Add entries to `useCaseMap` under the `"*"` key. Include only the entries for use cases being generated.

Profile rules:

- `create`, `update`, `delete` - typically `Authorities` + `Executives`
- `get`, `list` - typically `Authorities` + `Executives` + `Readers`
- custom commands - choose based on the operation (write operations typically `Authorities` + `Executives`)

```json
// --- create ---
"{entityCamelCase}/create": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives"]
},
// --- get ---
"{entityCamelCase}/get": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives", "Readers"]
},
// --- update ---
"{entityCamelCase}/update": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives"]
},
// --- delete ---
"{entityCamelCase}/delete": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives"]
},
// --- list ---
"{entityCamelCase}/list": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives", "Readers"]
},
// --- generic use case example ---
"{entityCamelCase}/{useCase}": {
  "sysStateList": ["active"],
  "profileList": ["Authorities", "Executives"]
}
```
