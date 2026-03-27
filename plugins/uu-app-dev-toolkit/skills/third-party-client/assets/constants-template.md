# Constants Template

File path: `app/constants/third-party-constants.js`

If the file does not exist, create it with the full scaffold below and register `ThirdPartyConstants` in `app/constants/index.js`. If it already exists, insert the new service group into the existing `ThirdPartyConstants` object.

Conventions:

- Each service gets its own key inside `ThirdPartyConstants` (e.g., `MyTerritory`)
- `CONFIG_KEYS` holds deploy config key references used in `Config.get()`
- Add other service-specific constant groups as needed (e.g., enums, static values, use case maps)

```javascript
"use strict";

const ThirdPartyConstants = {
  {ServiceName}: {
    CONFIG_KEYS: {
      {BASE_URI_CONFIG_KEY}: "{config_key_value}",
    },
  },
};

module.exports = ThirdPartyConstants;
```
