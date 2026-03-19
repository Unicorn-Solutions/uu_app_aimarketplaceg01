---
name: review-plugin-submission
description: Audit a Cursor plugin for marketplace readiness. Use when validating manifests, component metadata, discovery paths, and submission quality before publishing.
---

# Review plugin submission

## Trigger

A plugin is implemented and needs a final quality check before submission or release.

## Workflow

1. Verify manifest validity:
   - `.cursor-plugin/plugin.json` exists and parses as valid JSON
   - `name` is valid lowercase kebab-case (alphanumerics and hyphens, starts/ends with alphanumeric)
   - `author` is an object with at least `name` (never a plain string)
   - Other metadata fields are coherent (`description`, `version`, `license`, `keywords`)
2. Verify component discoverability:
   - Skills in `skills/*/SKILL.md`
   - Rules in `rules/` as `.mdc` or markdown variants
   - Agents in `agents/` markdown files
   - Commands in `commands/` markdown or text files
   - Hooks in `hooks/hooks.json`
   - MCP config in `mcp.json` at plugin root (or via `mcpServers` override in `plugin.json`)
3. Verify component metadata:
   - Skills include `name` and `description` frontmatter
   - Rules include `description`, `alwaysApply`, and optional `globs` frontmatter
   - Agents and commands include `name` and `description` frontmatter
4. Verify repository integration (multi-plugin marketplace repos):
   - `.cursor-plugin/marketplace.json` exists at the repo root
   - `owner` has at least a `name` field
   - Each plugin entry has `name`, `source`, and `description`
   - `source` is relative to `pluginRoot` — use the directory name only (e.g. `"my-plugin"`), not the full path (e.g. not `"./plugins/my-plugin"`)
   - Each `source` resolves to a real directory containing `.cursor-plugin/plugin.json`
   - Plugin names are unique across all entries
5. Verify documentation quality:
   - `README.md` states purpose, installation, and component coverage
   - Optional logo path is valid and repository-hosted

## Checklist

- Manifest exists and parses as valid JSON
- `author` is an object, not a string
- All declared paths exist and are relative
- No broken file references (including internal skill references/templates)
- No missing frontmatter on skills/rules/agents/commands
- Plugin scope is clear and focused
- Marketplace `source` uses directory name only (relative to `pluginRoot`), not full path
- Marketplace `owner.name` is present
- Marketplace registration complete (if multi-plugin repo)

## Output

- Pass/fail report by section
- Prioritized fix list
- Final submission recommendation
