# third-party-tools

Curated collection of general-purpose skills, rules, agents, commands, and integrations from the broader Cursor and developer community.

## Components

| Type | Directory | Description |
|------|-----------|-------------|
| Rules | `rules/` | Coding conventions and best practices for popular frameworks |
| Skills | `skills/` | Guided workflows for working with third-party tools |
| Agents | `agents/` | Specialized agent personas for specific domains |
| Commands | `commands/` | Reusable prompt templates |
| MCP | `mcp.json` | Tool integrations for external services |
| Hooks | `hooks/` | Automated triggers on file/event changes |

## Included Skills

### skill-creator

A skill for creating new Cursor skills and iteratively improving them through evaluation loops. Ported from the [Anthropic skill-creator](https://github.com/anthropics/courses) under the Apache 2.0 license.

**What it does:**
- Guides you through drafting a new skill (SKILL.md with frontmatter)
- Creates test prompts and runs them with/without the skill
- Launches an eval viewer for qualitative review
- Iterates on the skill based on feedback
- Optimizes the skill description for better triggering accuracy
- Packages the skill as a distributable `.skill` file

## Adding New Components

Drop files into the appropriate directory following the conventions:

- **Rules:** `.mdc` files in `rules/` with YAML frontmatter (`description`, `alwaysApply`, optional `globs`)
- **Skills:** `skills/<skill-name>/SKILL.md` with YAML frontmatter (`name`, `description`)
- **Agents:** Markdown files in `agents/` with YAML frontmatter (`name`, `description`)
- **Commands:** Markdown or text files in `commands/` with YAML frontmatter (`name`, `description`)
- **MCP:** Add server entries to `mcp.json` under the `mcpServers` key
- **Hooks:** Define hook events in `hooks/hooks.json`

## License

Apache 2.0 — see [LICENSE](LICENSE).
