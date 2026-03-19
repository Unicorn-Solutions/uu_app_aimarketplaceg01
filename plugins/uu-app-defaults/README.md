# uu-app-defaults

Default rules, skills, and MCP configuration for uuApp Framework (UAF) projects.

## Components

### MCP Servers

- **BusinessChatTerri** — connects to the uuAiChat knowledge-base service via `uu_aichat_mcputilityg01`.

### Rules

| Rule | Applies to | Description |
|---|---|---|
| `abl-files` | `**/app/abl/**/*-abl.js` | Conventions for ABL use-case files |
| `error-files` | `**/app/api/errors/*-error.js` | Conventions for error definition files |
| `validation-types` | `**/app/api/validation_types/*-types.js` | Validation type naming, modifiers, and available types |

### Skills

| Skill | Description |
|---|---|
| `uu-cmd` | Generate complete uuCmd endpoint implementations (ABL, DAO, controller, errors, warnings, validation types, config, tests) |
| `uu-script` | Generate uuScript files for `*-uuscriptlib` projects |
| `third-party-client` | Generate AppClient wrappers for calling external services |
| `bookkit-download-skill` | Download binary files from a BookKit instance with interactive Plus4U authentication |

## Installation

This plugin is installed locally at `~/.cursor/plugins/local/uu-app-defaults/` and is automatically available in Cursor.
