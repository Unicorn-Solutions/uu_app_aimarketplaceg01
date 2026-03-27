# Errors Template

File path: `app/api/errors/third-party-error.js`

If the file does not exist, create it with the full scaffold below. If it already exists, append the new service group and add it to the existing `module.exports`.
Include one `BaseUriNotConfigured` error and one error per generated client method.

```javascript
"use strict";

const { {AppBaseError} } = require("{baseErrorRequirePath}");

const {ServiceName} = {
  {BaseUriNotConfiguredError}: class extends {AppBaseError} {
    constructor(paramMap = {}, cause = null) {
      super("{baseUriNotConfiguredCode}", "Missing required configuration: {config_key_value}.", paramMap, cause);
    }
  },

  // --- repeat per client method ---
  {MethodErrorClass}: class extends {AppBaseError} {
    constructor(paramMap = {}, cause = null) {
      super("{methodErrorCode}", "{Method error message}.", paramMap, cause);
    }
  },
};

module.exports = {
  {ServiceName},
};
```
