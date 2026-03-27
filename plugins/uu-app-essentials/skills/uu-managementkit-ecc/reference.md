# uu5String Reference

## Property Types (Strict)

| Type | Correct | Wrong |
|------|---------|-------|
| **unit** | `margin=8` | `margin={8}` |
| **boolean** | `disabled=true` | `disabled="true"` `disabled={true}` |
| **string** | `header="Title"` | `header=Title` |
| **uu5json** | `data='<uu5json/>...'` | `data={...}` `data="..."` |

## Pattern A: Recommended Quoting

### Component props (single quotes)

```javascript
data='<uu5json/>{ "key": "value", "number": 42 }'
serieList='<uu5json/>[{ "valueKey": "count" }]'
```

Single quotes for attributes = NO JSON escaping needed.

### Nested uu5String (double outer, single inner)

```javascript
uu5String="<uu5string/><span style='<uu5json/>{ \"fontSize\": \"18px\" }'>Text</span>"
```

## Escaping Formula

Level n requires `2^n - 1` backslashes before quotes:

| Level | Backslashes | Example |
|-------|-------------|---------|
| 0 (single quotes) | 0 | `style='<uu5json/>{ "color": "red" }'` |
| 1 (double quotes) | 1 | `style="<uu5json/>{ \"color\": \"red\" }"` |
| 2 (nested double) | 3 | `style=\"<uu5json/>{ \\\"color\\\": \\\"red\\\" }\"` |
| 3 (triple nested) | 7 | (avoid this depth) |

Invalid backslash counts: 2, 4, 5, 6 (must follow 2^n - 1).

Best practice: use single quotes whenever possible to stay at level 0.

## Copy-Paste Patterns

### Simple text block

```javascript
<Uu5RichTextBricks.Block uu5String="<uu5string/><p>Your text here</p>"/>
```

### Styled text

```javascript
<Uu5RichTextBricks.Block uu5String="<uu5string/><p style='<uu5json/>{
  \"fontSize\": \"18px\",
  \"color\": \"#1976D2\"
}'>Styled text</p>"/>
```

### XyChart

```javascript
<Uu5ChartsBricks.XyChart
  height="240px"
  width="100%"
  displayCartesianGrid="dashed"
  legend='<uu5json/>{ "position": "bottom" }'
  labelAxis='<uu5json/>{ "title": "Year", "dataKey": "year" }'
  valueAxis='<uu5json/>{ "title": "Index (0–100)", "domain": [0, 100] }'
  data='<uu5json/>[
    { "year": "2026", "fte": 80, "autonomy": 20 },
    { "year": "2027", "fte": 65, "autonomy": 35 },
    { "year": "2028", "fte": 42, "autonomy": 60 },
    { "year": "2029", "fte": 22, "autonomy": 78 }
  ]'
  serieList='<uu5json/>[
    { "valueKey": "fte", "title": "FTE", "color": "#F87171", "line": true },
    { "valueKey": "autonomy", "title": "Autonomy", "color": "#22D3EE", "line": true }
  ]'
/>
```

XyChart data mapping recipe:
- X axis field → `labelAxis.dataKey` (e.g., `"year"`)
- Each series → `serieList[].valueKey` pointing to a field in `data`
- Each `data` object must contain the X field and all `valueKey` fields

### Table

```javascript
<Uu5TilesBricks.Table
  data='<uu5json/>[
    [ "2026", 80, 20 ],
    [ "2027", 65, 35 ],
    [ "2028", 42, 60 ],
    [ "2029", 22, 78 ]
  ]'
  columnList='<uu5json/>[
    { "header": "Year" },
    { "header": "FTE" },
    { "header": "Autonomy" }
  ]'
  theme="grid-a"
/>
```

### Table cells with rich content

Table cells can contain uu5String content — not just plain text. Prefix the cell value with `<uu5string />` (note the space before `/`). Because the `data` attribute uses single quotes (Pattern A), the JSON inside uses standard `\"` escaping for double quotes — no deeper escaping is needed.

**Plain text cell:**
```json
"Simple text"
```

**Cell with line break:**
```json
"<uu5string />Line one<br/>Line two"
```

**Cell with link (Uu5Bricks.Link):**
```json
"<uu5string />Visit <Uu5Bricks.Link href=\"https://example.com\" target=\"_blank\">Example</Uu5Bricks.Link>"
```

**Cell with bold text:**
```json
"<uu5string /><strong>Bold text</strong> and normal text"
```

**Cell with link (HTML `<a>` — simpler, avoids component escaping):**
```json
"<uu5string />Visit <a href=\"https://example.com\">Example</a>"
```

**Full table example with rich cells:**

```javascript
<Uu5TilesBricks.Table
  data='<uu5json/>[
    { "value": ["09:00 - 10:00", "Snídaně"], "style": {} },
    { "value": ["10:00 - 11:00", "<uu5string />Workshop<br/>(Miloš, Radek)"], "style": {} },
    { "value": ["11:00 - 12:00", "<uu5string />Oběd na <Uu5Bricks.Link href=\"https://example.com\" target=\"_blank\">Moravské boudě</Uu5Bricks.Link>"], "style": {} },
    ["12:00+", "Odjezd"]
  ]'
  columnList='<uu5json/>[
    { "header": "Time", "minWidth": "s" },
    { "header": "Agenda", "minWidth": "s" }
  ]'
  theme="clean-a" colorScheme="blue" hideFooter
/>
```

Note: rows can be either `{ "value": [...], "style": {} }` objects or plain arrays `[...]`. Both work. The object form allows per-row styling.

### Layout with columns

```javascript
<Uu5Bricks.Layout>
  <Uu5Bricks.Layout.Item colSpan=6>
    <Uu5Bricks.Section header="Left">
      <Uu5RichTextBricks.Block uu5String="<uu5string/><p>Left content</p>"/>
    </Uu5Bricks.Section>
  </Uu5Bricks.Layout.Item>
  <Uu5Bricks.Layout.Item colSpan=6>
    <Uu5Bricks.Section header="Right">
      <Uu5RichTextBricks.Block uu5String="<uu5string/><p>Right content</p>"/>
    </Uu5Bricks.Section>
  </Uu5Bricks.Layout.Item>
</Uu5Bricks.Layout>
```

### Separator (replaces `<hr/>`)

```javascript
<Uu5Bricks.Separator colorScheme="primary" significance="highlighted"/>
```

### Image (replaces `<img/>`)

```javascript
<Uu5ImagingBricks.Image src="https://example.com/image.png"/>
```

### Code (replaces `<code>`)

```javascript
<Uu5CodeKitBricks.Code codeStyle="javascript" value="const x = 42;" theme="github"/>
```

### Card with action list

```javascript
<Uu5Bricks.Card
  header="Title"
  colorScheme="primary"
  actionList='<uu5json/>[
    { "icon": "uugds-reload", "tooltip": "Refresh" }
  ]'
>
  <Uu5RichTextBricks.Block uu5String="<uu5string/><p>Card content here</p>"/>
</Uu5Bricks.Card>
```

### Link (replaces `<a>`)

```javascript
<Uu5Bricks.Link href="https://example.com" target="_blank">Visit Example</Uu5Bricks.Link>
```

### Page break (for print/PDF)

```javascript
<Uu5Bricks.PageBreak/>
```

### List inside Uu5RichTextBricks.Block

```javascript
<Uu5RichTextBricks.Block uu5String="<uu5string/><ul>
  <li>First item</li>
  <li>Second item with <strong>bold</strong></li>
  <li>Third item</li>
</ul>"/>
```

### Inline styles (inside Uu5RichTextBricks.Block)

Wrong -- bare `<span>` at top level:

```javascript
<span style='<uu5json/>{ "fontSize": "18px" }'>Text</span>
```

Correct -- wrapped in `Uu5RichTextBricks.Block`:

```javascript
<Uu5RichTextBricks.Block uu5String="<uu5string/><span style='<uu5json/>{
  \"fontSize\": \"18px\",
  \"color\": \"red\"
}'>Styled text</span>"/>
```

## ColorScheme Values

- **Semantic**: primary, secondary, neutral, important, positive, warning, negative
- **Basic**: dark-blue, blue, light-blue, cyan, dark-green, green, light-green, yellow, orange, red, pink, purple, dark-purple, brown, grey, steel

## Special Characters

HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`) are valid ONLY inside HTML content within `uu5String` props (e.g., inside `<p>` text). **Never use HTML entities in component attribute values or `<uu5json/>` data blocks** -- this includes string props like `header="..."`, single-quoted uu5json props, and JSON data. ECC does not decode HTML entities in these positions -- they render literally as visible text (e.g., `header="Command &amp; Script Catalog"` shows as `Command &amp; Script Catalog`). Write the actual characters: `header="Command & Script Catalog"`.

## What to Use When

| Need | Use | Note |
|------|-----|------|
| Plain text, styled text, lists, line breaks | `Uu5RichTextBricks.Block` | `<p>`, `<span>`, `<strong>`, `<ul>`, `<li>`, `<br/>` go inside `uu5String` prop |
| Code / inline code | `Uu5CodeKitBricks.Code` (trusted) | Simple inline: `Uu5Bricks.Code` (trusted) |
| Horizontal line | `Uu5Bricks.Separator` (trusted) | Supports `colorScheme`, `significance` |
| Link | `Uu5Bricks.Link` (trusted) | `href`, `target`, `icon`, button style |
| Card | `Uu5Bricks.Card` (trusted) | Header, actions, collapsible |
| Page break | `Uu5Bricks.PageBreak` (trusted) | For print/PDF layout |
| Image | `Uu5ImagingBricks.Image` | Gallery: `Uu5ImagingBricks.Gallery` |
| Chart | `Uu5ChartsBricks.*` | See XyChart pattern |
| Table | `Uu5TilesBricks.Table` | See Table pattern |
| Layout | `Uu5Bricks.Layout` | See Layout with columns pattern |

## Top 8 Mistakes

1. Unicode escapes in text (`\u010d`, `\u0159`) → ECC renders them literally. Always write `č`, `ř`, `ž`, `é` as direct UTF-8 characters.
2. HTML entities in attribute values or uu5json data (`header="Command &amp; Script Catalog"`, `&quot;` in table data) → ECC renders them literally as visible text. Write actual characters (`&`, `"`, `<`, `>`). HTML entities are only valid inside HTML content within `uu5String` props.
3. Bare HTML at top level (`<p>text</p>`) → wrap in `Uu5RichTextBricks.Block`
4. Bare `<hr/>` → use `Uu5Bricks.Separator`; bare `<img/>` → use `Uu5ImagingBricks.Image`; bare `<code>` → use `Uu5CodeKitBricks.Code`; bare `<a>` → use `Uu5Bricks.Link`
5. Missing `<uu5json/>` prefix on JSON blocks
6. CSS syntax in HTML style → use `<uu5json/>` with camelCase
7. Wrong property type → remove `{}` from unit props, remove quotes from boolean
8. `</uu5string>` closing tag → delete it (only prefix exists)

## Validator Workflow

1. **Discover**: For trusted components (see `components.md`) read props from the file. For unknown components, call `brickSearch` then `brickDefinitionGet`.
2. **Write**: Create uu5String using discovered/loaded definitions.
3. **Validate**: `eccCmdSectionSetContent({ validateOnly: true })` to check syntax.
4. **Fix**: Review errors (position + suggestion), correct.
5. **Save**: `eccCmdSectionSetContent({ validateOnly: false })`.

If a parent skill marks the content as a pre-validated template and the content contains only trusted components, skip step 3 and go directly to step 5. If the template contains any unknown components, always run step 3.

The validator catches: missing/wrong prefixes, invalid JSON, wrong property types, unclosed tags, CSS in inline styles, escaping errors. It provides error location, description, solution, and example.
