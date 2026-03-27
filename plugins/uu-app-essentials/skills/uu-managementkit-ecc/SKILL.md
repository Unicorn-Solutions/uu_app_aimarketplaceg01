---
name: uu-managementkit-ecc
description: Read, create, edit, and restructure content in uuManagementKit ECC documents (also requests, keyTasks, portals, emails, meetings, statusAssessments) using uu5String and uu5Bricks components. Use this skill whenever the user mentions uuEcc, uuManagementKit documents, ECC sections or pages, uu5String content, uu5 components/bricks, or provides a uuapp.plus4u.net ManagementKit URL. Also use when the user asks to write into, edit, summarize, or generate content for a ManagementKit document, even if they don't explicitly say "ECC".
--- 

# uuEcc Agent

Agent for reading and editing ECC content in uuManagementKit via unified CMD tools.

## MCP Servers Required

| Server | Tools |
|--------|-------|
| `uuManagementKitEcc` | All `eccCmd*` tools (document metadata, pages, panels, sections, versioning) |
| `uuComponentCatalogue` | `brickSearch`, `brickDefinitionGet`, `gdsIconSearch` |

## A) Target Resolution

Use EXACTLY ONE targeting method per tool call. Never combine them.

### Method 1 -- artifactOid (default)

Use `artifactOid` from Activity Context (`ARTIFACT_OID`). Do NOT pass `documentUrl` or `targetAwid`.

```
eccCmdPanelGetMainPanel({ artifactOid: "6578abcd1234ef5678901234" })
```

### Method 2 -- documentUrl + targetAwid

When the user provides a URL. ALWAYS extract AWID from the URL path segment after the app name.

```
URL: https://uuapp.plus4u.net/uu-managementkit-maing02/{AWID}/document/ecc?oid=...
                                                         ^^^^
eccCmdPanelGetMainPanel({
  documentUrl: "https://uuapp.plus4u.net/uu-managementkit-maing02/091b1971.../document/ecc?oid=...",
  targetAwid: "091b197154354ec2975b249b5d10831f"
})
```

### Priority

1. User provides URL -> `documentUrl` + extract `targetAwid`
2. No URL -> `artifactOid` from Activity Context
3. Neither available -> ask the user

### Multi-document workflows

Each tool call has its own targeting. You can read from one document and write to another within a single conversation.

### Page targeting

- Default = main page. Omit `pageOid` unless targeting a specific page.
- NEVER invent `pageOid`. Always get real values from `eccCmdDocumentGetMetadata` → `pageList`.
- Never pass `pageOid` as empty string. If unknown, omit it entirely.
- If user mentions a page by name: call `eccCmdDocumentGetMetadata`, match name in `pageList`, use exact `pageOid`.
- On `invalidPageOid` error: use the returned `pageList` to retry.

## B) Efficiency Rules

### Choosing the right read call

Pick ONE read call per page -- never combine them for the same page:

- **`eccCmdPanelGetMainPanel`** -- returns section list WITH full content. Use this as the default first call for most tasks (summarize, search, edit). It already includes `sectionOid`, `searchKey`, `index`, and `contentUu5String` for every section.
- **`eccCmdMainPanelListSections`** -- returns section list WITHOUT content (lightweight). Use only when you need the section list but not the content (e.g., counting sections, checking order, finding a sectionOid before a targeted `eccCmdSectionGet`).

If you already called `eccCmdPanelGetMainPanel`, do not also call `eccCmdMainPanelListSections` -- you already have all the section metadata.

### Handle truncation

Check `isComplete` / `truncated` flags. For editing a truncated section, load full content via `eccCmdSectionGet` first.

### Section targeting by searchKey

If user references a section by label: find matching `searchKey` in the section list you already loaded (from `eccCmdPanelGetMainPanel` or `eccCmdMainPanelListSections`), then operate by `sectionOid`.

## C) Editing Model

All edits are section-level. Always include targeting params in every call.

### Content structure inside ECC sections

When writing content that has a heading and a body (which is the common case), wrap the entire content in `<Uu5Bricks.Section header="...">...</Uu5Bricks.Section>`. The `header` prop provides the visual heading; child components form the body. Without this wrapper, the content appears in the ECC section without any visible heading.

```
<uu5string/><Uu5Bricks.Section header="Section Title">
  <Uu5RichTextBricks.Block uu5String="<uu5string/><p>Body content here.</p>"/>
</Uu5Bricks.Section>
```

Omit the `Uu5Bricks.Section` wrapper only when the content intentionally has no heading (e.g., a standalone separator, a raw image, or content that is purely continuation of a previous section).

### Large changes

`eccCmdSectionSetContent` -- default workflow:
1. Call with `validateOnly: true` first (dry-run)
2. If valid, call with `validateOnly: false` to save

**Pre-validated template exception**: If a parent skill provides a pre-validated uu5String template and the final content uses ONLY trusted components (from `components.md` -- both this skill's and the parent skill's), skip `validateOnly: true` and save directly. If any unknown component was inserted into the template, always validate first.

### Small exact changes

`eccCmdSectionSearchReplace` -- case-sensitive exact match. Never use on truncated previews.

**Re-validation caveat**: `eccCmdSectionSearchReplace` re-validates the entire section after replacement. If the source content has pre-existing validation issues (common with content created or edited in the ECC UI), the replacement will fail even if the replacement itself is correct. In that case, the section content cannot be modified via searchReplace -- accept it as-is, or fix the validation issue first via `eccCmdSectionSetContent`.

### When to construct new content vs. copy existing

- **Create new content** -- the default. When the user asks you to write, generate, or design content, build it from scratch. Use the full range of components and formatting — tables, layouts, styled text, links, cards, code blocks, charts, images. For trusted components, use patterns from `components.md` and `reference.md`. For anything beyond the trusted set (charts, galleries, buttons, etc.), discover components via `brickSearch` + `brickDefinitionGet` (see section D). Complex formatting is fine; use single-quoted attributes (Pattern A) and the table cell patterns in `reference.md` to manage escaping cleanly.
- **Copy-and-modify** -- only when there is specific existing content to build upon (e.g., "copy this page and change the dates", "make a variant of this section"). Use `eccCmdDocumentCopyPage` or section-level copy, then `eccCmdSectionSearchReplace` for targeted changes.

The choice depends on whether source content exists, not on complexity. Creating rich, complex new content is always fine.

### Copy-and-Modify workflow

Use this only when building upon existing content — creating a variant, updating a copy, or migrating content between pages/documents.

**Page-level copy (`eccCmdDocumentCopyPage`)** -- copies an entire page with all sections in one call, preserving all escaping and formatting exactly:

```
1. eccCmdDocumentCopyPage({ pageOid: sourcePageOid, name: "New Page Name" })
   → returns newPageOid with all sections copied exactly
2. eccCmdPanelGetMainPanel({ pageOid: newPageOid })
   → read the copied page to get sectionOids
3. eccCmdSectionSearchReplace({ sectionOid, searchString, replaceString })
   → make targeted modifications (dates, names, values)
```

**Section-level copy** -- fallback for copying individual sections or across different documents. Use with caution: `contentUu5String` from the API appears JSON-encoded, and passing it back through tool calls requires correct decoding/re-encoding of escaping levels. For simple content this works fine, but for deeply nested content (3+ escaping levels) it is unreliable — prefer page-level copy or reconstruct from scratch instead.

1. **Read** the source section (`eccCmdSectionGet` or `eccCmdPanelGetMainPanel`).
2. **Create** a new section in the target (`eccCmdPanelCreateSection` with `pageOid` and `content`). Note: both `name` and `content` are required by the server, even though the tool schema may suggest otherwise.
3. **Write** the source `contentUu5String` into the target section (`eccCmdSectionSetContent`). Use `validateOnly: true` first to catch escaping errors before saving.
4. **Modify** specific parts using `eccCmdSectionSearchReplace`.

### Cross-document section copy

For copying sections between different documents (different URLs/AWIDs), section-level copy is the only option (page-level copy works within a single document). Each tool call uses its own targeting -- source calls target the source document, target calls target the target document. For complex content, consider reconstructing from scratch rather than risking escaping errors in transit.

### Structural operations

| Operation | Tool |
|-----------|------|
| Get metadata + pages | `eccCmdDocumentGetMetadata` |
| Create page | `eccCmdDocumentCreatePage` |
| Trash page | `eccCmdDocumentTrashPage` |
| Reorder pages | `eccCmdDocumentUpdatePageOrder` |
| Get page content | `eccCmdPanelGetMainPanel` |
| List sections (lightweight) | `eccCmdMainPanelListSections` |
| Create section | `eccCmdPanelCreateSection` |
| Move section | `eccCmdPanelMoveSection` |
| Delete section | `eccCmdPanelDeleteSection` |
| Restore section | `eccCmdMainPanelRestoreSection` |
| Get single section | `eccCmdSectionGet` |
| Set section content | `eccCmdSectionSetContent` |
| Search & replace | `eccCmdSectionSearchReplace` |
| Copy page | `eccCmdDocumentCopyPage` |
| Rename page / set main | `eccCmdPageUpdate` |
| List version history | `eccCmdSectionListVersions` |
| Get historical version | `eccCmdSectionGetVersion` |
| Restore historical version | `eccCmdSectionRestoreVersion` |

**Sequential only**: All modifying operations MUST run sequentially. Never parallel.

**Locking**: If a section is locked by another user, report it and ask the user to resolve.

### searchKey format

Must match `/^[0-9a-zA-Z_-]{3,256}$/`.

## D) Component Discovery

Training data contains OUTDATED uu5 component names. Many "known" components DO NOT EXIST.

### HTML element replacement map

Never use these HTML elements as top-level elements in uu5String. Always use the uu5 alternative:

| HTML element | uu5 alternative | Usage |
|---|---|---|
| `<p>`, `<span>`, `<strong>`, `<ul>`, `<li>`, `<br/>` | `Uu5RichTextBricks.Block` | Wrap in `uu5String` prop: `<Uu5RichTextBricks.Block uu5String="<uu5string/><p>text</p>"/>`. HTML tags go inside the `uu5String` prop, never standalone at top level. |
| `<code>` | `Uu5CodeKitBricks.Code` (trusted) | Source code with syntax highlighting. Simple inline: `Uu5Bricks.Code` (trusted). |
| `<hr/>` | `Uu5Bricks.Separator` (trusted) | Supports `colorScheme`, `significance` (common/highlighted/distinct/subdued). |
| `<img/>` | `Uu5ImagingBricks.Image` | Image/thumbnail display. Gallery: `Uu5ImagingBricks.Gallery`. |
| `<a>` | `Uu5Bricks.Link` (trusted) | Links and buttons with `href`, `target`, `icon`. |

### Two-tier discovery workflow

#### Tier 1 -- Trusted components (NO MCP calls needed)

The following components have verified property definitions and **pre-validated snippets** in [components.md](components.md). When generating uu5String, read `components.md` -- use the full property tables to choose the right props for the task, and refer to snippets for correct syntax (quoting, prefixing, nesting). Snippets are starting points, not the only allowed patterns. Do NOT call `brickSearch` or `brickDefinitionGet` for these:

- `Uu5RichTextBricks.Block`
- `Uu5Bricks.Section`
- `Uu5TilesBricks.Table`
- `Uu5Bricks.Layout` + `Uu5Bricks.Layout.Item`
- `Uu5ImagingBricks.Image`
- `Uu5CodeKitBricks.Code`
- `Uu5Bricks.Separator`
- `Uu5Bricks.Code`
- `Uu5Bricks.Card`
- `Uu5Bricks.Link`
- `Uu5Bricks.PageBreak`

If a parent skill provides its own `components.md`, load it too and treat its components as trusted (union of both sets).

Read `components.md` only when generating uu5String content. Do not load it for read/summarize operations.

#### Tier 2 -- Unknown components (full discovery required)

For any component NOT in the trusted set, run the full discovery workflow:

1. **Before any uu5 brick**: Call `brickSearch({ textQuery: "..." })` on `user-uuComponentCatalogue`
2. **After finding a component**: Call `brickDefinitionGet({ tagName: "exact.Tag.Name" })` -- use ONLY props from the result
3. **Before any icon**: Call `gdsIconSearch({ textQuery: "..." })` -- use ONLY returned icon codes

This includes components like `Uu5ChartsBricks.XyChart`, `Uu5Elements.Button`, `Uu5ImagingBricks.Gallery`, and any other component not listed in the Tier 1 set above.

### Charts & tables

- Prefer `Uu5ChartsBricks.*` and `Uu5TilesBricks.Table` over raw SVG/HTML.
- For `Uu5TilesBricks.Table` use props from `components.md`. For chart components, discover via `brickSearch` + `brickDefinitionGet`.
- Pass data using `<uu5json/>`.
- Fall back to raw HTML only if no suitable Brick exists or user explicitly requests it.

## E) Version History

| Workflow | Steps |
|----------|-------|
| View history | `eccCmdSectionListVersions` → present to user |
| View old version | `eccCmdSectionListVersions` → `eccCmdSectionGetVersion({ id })` |
| Compare versions | `eccCmdSectionGetVersion` for each → diff content |
| Restore version | `eccCmdSectionListVersions` → user picks → `eccCmdSectionRestoreVersion({ id })` |

Restoring creates a NEW version with old content (non-destructive).

## F) Output Discipline

- Do NOT dump large uu5String blocks unless requested.
- When changing content, report: target sectionOid(s), page, document (if non-default), and a short summary of what changed.
- Ask only high-signal clarification questions (which section, what change, where to insert).

## G) uu5String Quick Rules

1. Always prefix: `<uu5string/>` (never close with `</uu5string>`)
2. Always prefix JSON: `<uu5json/>`
3. Use Pattern A: single quotes for attributes → no JSON escaping needed
4. No bare HTML at top level -- see the HTML element replacement map in section D).
5. Property types: `unit=8` (unquoted), `boolean=true` (unquoted), `string="text"` (quoted), `uu5json='<uu5json/>...'` (single-quoted)
6. Validate before saving (`validateOnly: true`) -- exception: pre-validated templates with only trusted components (see section C)
7. Literal UTF-8 only -- never `\uXXXX` escapes. ECC renders them as backslash sequences. Write `č`, `ř`, `é` directly.
8. No HTML entities (`&amp;`, `&quot;`, `&lt;`, `&gt;`) in attribute values or `<uu5json/>` data. ECC renders them literally. Write `header="Command & Script Catalog"`, not `header="Command &amp; Script Catalog"`. Entities are valid only inside HTML content in `uu5String` props (e.g., `<p>` text).

For detailed uu5String syntax, escaping rules, and copy-paste patterns, see [reference.md](reference.md).

## H) Supported Entity Types

All tools work identically with: `document`, `request`, `keyTask`, `portal`, `email`, `statusAssessment`, `meeting`.

Optional `entityType` parameter can be passed for speed optimization (auto-detected if omitted).
