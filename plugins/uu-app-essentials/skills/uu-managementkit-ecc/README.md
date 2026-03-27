# uu-ecc Skill

Cursor skill for reading, creating, editing, and restructuring content in uuManagementKit ECC documents (also requests, keyTasks, portals, emails, meetings, statusAssessments) using uu5String and uu5Bricks components.

## Prerequisites

- [Cursor](https://cursor.sh/) with MCP server support
- Access to uuApp Plus4U (valid login)

## MCP Server Configuration

The skill requires two MCP servers: **uuComponentCatalogue** (uu5 component and icon search) and **uuManagementKitEcc** (ECC operations on documents).

Add the following configuration to `~/.cursor/mcp.json` (or project-level `.cursor/mcp.json`) inside the `"mcpServers"` section:

```json
{
  "mcpServers": {
    "uuComponentCatalogue": {
      "command": "npx",
      "args": ["-y", "uu_aichat_mcputilityg01"],
      "env": {
        "SERVER_URL": "https://uuapp.plus4u.net/uu-aichat-maing01/022f18046aac921de99f2791eb50cf1e/uuAssistant/mcp?instructionSetOid=69aabeda0573463e189f2f74"
      }
    },
    "uuManagementKitEcc": {
      "command": "npx",
      "args": ["-y", "uu_aichat_mcputilityg01"],
      "env": {
        "SERVER_URL": "https://uuapp.plus4u.net/uu-aichat-maing01/022f18046aac921de99f2791eb50cf1e/uuAssistant/mcp?instructionSetOid=69b3dbbb2d1b8c9c5e785021"
      }
    }
  }
}
```

Restart Cursor after saving for the MCP servers to load.

## Verification

After restart, verify that both servers appear as active in the Cursor MCP panel:

- **uuComponentCatalogue** -- provides `brickSearch`, `brickDefinitionGet`, `gdsIconSearch`
- **uuManagementKitEcc** -- provides `eccCmd*` tools (eccCmdPanelGetMainPanel, eccCmdSectionSetContent, ...)

## Usage

The skill activates automatically when the agent detects you are working with ECC content. Typical scenarios:

- **Read a document**: "Summarize the content of document [URL]"
- **Edit a section**: "Rewrite section XY in document [URL]"
- **Create content**: "Add a new section with a table to [URL]"
- **Manage pages**: "Create a new page in document [URL]"
- **Version history**: "Show the change history of section XY"
- **Generate documentation**: "Generate documentation for the source code and write it to [URL]"

When a document URL is provided, the agent automatically extracts the AWID and targets the correct ManagementKit instance.

## Skill Structure

```
.cursor/skills/uu-ecc/
├── SKILL.md         # Main instructions (workflow, rules, tool reference)
├── reference.md     # uu5String syntax, escaping, copy-paste patterns
├── components.md    # Trusted component propertyMaps (skip discovery for these)
└── README.md        # This file
```

## Creating a Parent Skill

A parent skill can build on `uu-ecc` to provide domain-specific content generation (e.g., documentation generator, report builder). Parent skills can optimize performance in two ways:

### 1. Pre-validated templates

Create a `templates.md` file in your skill with ready-made uu5String blocks for common content patterns. Each template should be validated once via `eccCmdSectionSetContent({ validateOnly: true })` before being saved as a template.

When the parent skill instructs the model to use a template, `uu-ecc` can skip the `validateOnly` step -- as long as all components in the final content are from the trusted set. If the model inserts any unknown component into the template, validation still runs, but retry cycles are reduced because the template skeleton is already valid.

Example `templates.md` structure:

```markdown
## Documentation section

\```
<Uu5Bricks.Section header="{{TITLE}}">
  <Uu5RichTextBricks.Block uu5String="<uu5string/><p>{{DESCRIPTION}}</p>"/>
  <Uu5TilesBricks.Table
    data='<uu5json/>{{TABLE_DATA}}'
    columnList='<uu5json/>{{COLUMN_LIST}}'
    theme="grid-a"
  />
</Uu5Bricks.Section>
\```
```

When using a template, the parent skill should instruct the model that the content originates from a pre-validated template.

### 2. Extended trusted components

A parent skill can provide its own `components.md` with additional trusted components specific to its domain. The file follows the same format as `uu-ecc/components.md`.

To create one:

1. Identify which uu5 components your skill uses frequently
2. Fetch their property definitions via `brickDefinitionGet({ tagName: "..." })`
3. Document them in your skill's `components.md` using the same table format

Example for a reporting skill:

```markdown
# Extended Trusted Components

## Uu5ChartsBricks.XyChart

Library: `uu5ChartsBricks`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `height` | string | no | | Chart height. |
| ...      | ...  | ...| ...     | ...         |
```

When `uu-ecc` generates uu5String, it loads both its own `components.md` and the parent skill's `components.md`. Components from either file are treated as trusted (no `brickSearch` / `brickDefinitionGet` needed).

### Minimal parent skill structure

```
.cursor/skills/my-skill/
├── SKILL.md          # Your skill instructions (reference uu-ecc as dependency)
├── components.md     # Extended trusted components (optional)
└── templates.md      # Pre-validated uu5String templates (optional)
```

In your `SKILL.md`, reference the `uu-ecc` skill and point to your extension files:

```markdown
This skill depends on uu-ecc (.cursor/skills/uu-ecc/SKILL.md).
Extended trusted components: see components.md in this directory.
Pre-validated templates: see templates.md in this directory.
```
