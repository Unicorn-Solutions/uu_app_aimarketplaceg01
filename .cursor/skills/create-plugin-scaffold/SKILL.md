---
name: create-plugin-scaffold
description: Create a new Cursor plugin scaffold with a valid manifest, component directories, and marketplace wiring. Use when starting a new plugin or adding a plugin to a multi-plugin repository.
---

# Create plugin scaffold

## Trigger

You need to create a new Cursor plugin from scratch and make it ready for local use or marketplace submission.

## Required Inputs

- Plugin name (lowercase kebab-case, alphanumerics and hyphens, starts/ends with alphanumeric)
- Plugin purpose and target users
- Component set to include (`rules`, `skills`, `agents`, `commands`, `hooks`, `mcpServers`)
- Repository style (`single-plugin` or `multi-plugin marketplace`)

## Output Location

By default, create the plugin inside the user's local plugin directory:

```
~/.cursor/plugins/local/<plugin-name>/
```

This path makes the plugin immediately available to Cursor without any install step. If the user explicitly asks to create the plugin elsewhere (e.g. inside an existing repo or a specific directory), respect that choice instead.

## Workflow

1. Validate plugin name format: lowercase kebab-case, starts and ends with an alphanumeric character.
2. Determine the target directory:
   - Default: `~/.cursor/plugins/local/<plugin-name>/`
   - Override: use the path the user specifies, if any.
   - For multi-plugin repos: `<repo-root>/<pluginRoot>/<plugin-name>/` (e.g. `plugins/my-plugin/`).
   - Create the directory (and parents) if it does not exist.
3. Create base files inside the target directory:
   - `.cursor-plugin/plugin.json`
   - `README.md`
   - `LICENSE`
   - optional `CHANGELOG.md`
4. Populate `plugin.json`:
   - Required: `name`
   - Recommended: `version`, `description`, `author`, `license`, `keywords`
   - `author` must be an object: `{ "name": "...", "email": "..." }` — never a plain string.
   - Add explicit component paths only when non-default discovery is needed.
   - Optional: `logo` (relative path to image in repo), `homepage`, `repository`.
5. Create component files with valid frontmatter:
   - Rules: `.mdc` in `rules/` with `description`, `alwaysApply`, optional `globs`
   - Skills: `skills/<skill-name>/SKILL.md` with `name`, `description`
   - Agents: `agents/*.md` with `name`, `description`
   - Commands: `commands/*.(md|txt)` with `name`, `description`
   - MCP: `mcp.json` at the plugin root with `mcpServers` key (auto-discovered; only use `mcpServers` in `plugin.json` to override)
   - Hooks: `hooks/hooks.json` with hook event definitions
6. If repository uses `.cursor-plugin/marketplace.json`, add plugin entry:
   - `name` (required, must match plugin.json name)
   - `source` — directory name only, relative to `pluginRoot` (e.g. `"my-plugin"`, not `"./plugins/my-plugin"`)
   - `description`
   - Optional: `keywords`, `category`, `tags`, `logo`
7. If creating marketplace.json for the first time:
   - `name` (required, kebab-case marketplace identifier)
   - `owner` with at least `name` field (required)
   - `metadata.pluginRoot` to set the shared plugin directory (e.g. `"plugins"`)
   - `plugins` array with entries per step 6
8. Ensure all manifest paths are relative, valid, and do not use absolute paths or parent traversal.

## Guardrails

- Keep the plugin focused on one use case.
- Prefer concise, actionable skill and rule text over long prose.
- Do not reference files that do not exist.
- Use folder discovery defaults unless custom paths are required.
- Always save to `~/.cursor/plugins/local/<plugin-name>/` unless the user provides a different path.
- Never use a plain string for `author` in `plugin.json`.
- In marketplace `source`, use the directory name only — `pluginRoot` is automatically prepended.

## Output

- Created file tree for the plugin (with full path to the output directory)
- Final `plugin.json`
- Marketplace entry (if applicable)
- Short validation report of required fields and component metadata
- Confirmation that the plugin is saved under `~/.cursor/plugins/local/` and ready for use
