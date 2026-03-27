# uu-app-essentials

Essential skills for working with uuApp applications. Designed for all uuApp users -- analysts, managers, architects, and developers alike.

## Components

### MCP Servers

- **uuComponentCatalogue** -- uu5 component and icon search via `uu_aichat_mcputilityg01`.
- **uuManagementKitEcc** -- ECC document operations (read, create, edit, restructure) via `uu_aichat_mcputilityg01`.

### Skills

| Skill | Description |
|---|---|
| `uu-managementkit-ecc` | Read, create, edit, and restructure content in uuManagementKit ECC documents (also requests, keyTasks, portals, emails, meetings, statusAssessments) using uu5String and uu5Bricks components |

## Installation

This plugin is installed locally at `~/.cursor/plugins/local/uu-app-essentials/` and is automatically available in Cursor.

## Usage

The `uu-managementkit-ecc` skill activates automatically when the agent detects you are working with ECC content. Typical scenarios:

- **Read a document**: "Summarize the content of document [URL]"
- **Edit a section**: "Rewrite section XY in document [URL]"
- **Create content**: "Add a new section with a table to [URL]"
- **Manage pages**: "Create a new page in document [URL]"
- **Version history**: "Show the change history of section XY"
- **Generate documentation**: "Generate documentation for the source code and write it to [URL]"

When a document URL is provided, the agent automatically extracts the AWID and targets the correct ManagementKit instance.
