# Trusted Components Reference

Components listed here are **trusted** -- skip `brickSearch` and `brickDefinitionGet` for them.
Use ONLY properties documented below. For any component NOT listed here, run the full discovery workflow.

Snippets below are **pre-validated** against ECC -- use them as syntax reference and starting points, not as the only allowed patterns. You have full freedom to combine any documented properties to match the task; snippets just show you the correct quoting, prefixing, and nesting so you get it right on the first validation pass.

Parent skills can provide their own `components.md` to extend this trusted set.

---

## Uu5RichTextBricks.Block

Library: `uu5RichTextBricks`

Block-type component for text editing. Use it to wrap all inline HTML content (`<p>`, `<span>`, `<strong>`, `<ul>`, `<li>`, `<br/>`). HTML tags go inside the `uu5String` prop, never standalone at top level.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `uu5String` | string | yes | `""` | Editor content in uu5String. Prefix with `<uu5string/>`. |
| `placeholder` | string | no | `""` | Text shown inside an empty editor. |
| `readOnly` | bool | no | `false` | Makes the editor non-editable. |
| `significance` | string | no | | Visual significance (`"common"`, etc.). |

**Snippet 1 -- Simple paragraph with inline formatting:**

```
<Uu5RichTextBricks.Block uu5String="<uu5string/><p>Simple paragraph with <strong>bold</strong> and <em>italic</em> text.</p>"/>
```

**Snippet 2 -- Bulleted list:**

```
<Uu5RichTextBricks.Block uu5String="<uu5string/><ul><li>First item</li><li>Second item with <strong>bold</strong></li><li>Third item</li></ul>"/>
```

**Snippet 3 -- Heading + paragraph + link + line break:**

```
<Uu5RichTextBricks.Block uu5String="<uu5string/><h2>Heading level 2</h2><p>Paragraph after heading with <a href='https://example.com'>a link</a>.</p><br/><p>Second paragraph after line break.</p>"/>
```

**Snippet 4 -- Read-only block with significance:**

```
<Uu5RichTextBricks.Block significance="common" readOnly=true uu5String="<uu5string/><p>Read-only block with <strong>common</strong> significance.</p>"/>
```

---

## Uu5Bricks.Section

Library: `uu5Bricks` (since 1.7.0)

Standard layout component with header, actions, and content.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `header` | node | no | | Header content (text or uu5string). |
| `headerType` | `"title"` / `"heading"` | no | | Header style mode. `"heading"` uses level approach. |
| `level` | number | no | | Heading level (only with `headerType="heading"`). |
| `headerSeparator` | bool | no | `false` | Show separator between header and content. |
| `headerSeparatorColorScheme` | colorScheme | no | `"grey"` | Color of header separator. |
| `headerHorizontalAlignment` | `"start"` / `"center"` / `"end"` | no | `"start"` | Header horizontal alignment. |
| `actionList` | object[] | no | `[]` | Actions rendered in header (same format as ActionGroup `itemList`). |
| `baseUri` | string | no | | If defined, renders IdentificationBlock. |
| `info` | node | no | | Description of the component (can contain links). |
| `collapsible` | bool | no | `false` | Whether content is collapsible. |
| `initialCollapsed` | bool | no | `false` | If `true`, content starts collapsed. |
| `horizontalAlignment` | `"start"` / `"center"` / `"end"` | no | `"start"` | Content horizontal alignment. |
| `verticalAlignment` | `"start"` / `"middle"` / `"end"` | no | `"start"` | Content vertical alignment. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `contentPadding` | sizeOf(space) | no | `"d"` | Space around children. |
| `maxWidth` | unit | no | | Maximum width (px, %, em). |
| `height` | unit | no | | Fixed height. `"auto"` for parent-driven sizing. |
| `minHeight` | unit | no | | Minimum height. |
| `maxHeight` | unit | no | | Maximum height. |
| `size` | `"xs"` / `"s"` / `"m"` / `"l"` | no | `"m"` | Visual size of the box. |

**Snippet 1 -- Basic section with text content:**

```
<Uu5Bricks.Section header="Section Title"><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Content inside a section.</p>"/></Uu5Bricks.Section>
```

**Snippet 2 -- Collapsible section (initially collapsed):**

```
<Uu5Bricks.Section header="Collapsible Section" collapsible=true initialCollapsed=true><Uu5RichTextBricks.Block uu5String="<uu5string/><p>This content is initially hidden.</p>"/></Uu5Bricks.Section>
```

**Snippet 3 -- Heading-style header with separator:**

```
<Uu5Bricks.Section header="With Separator" headerSeparator=true headerType="heading" level=2><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Section with heading-style header and separator.</p>"/></Uu5Bricks.Section>
```

---

## Uu5TilesBricks.Table

Library: `uu5TilesBricks` (since 2.18.0)

Editing table with copy/paste, sorting, and data formatting.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `data` | array / object | no | | Row data. Array of arrays `[["a","b"],...]` or objects with `value`/`style`/`headerCells`. |
| `columnList` | object[] | no | | Column settings. Each object: `{ header, footer, maxWidth, ... }`. |
| `theme` | see values | no | `"grid-a"` | Visual theme. Values: `horizontal-a/b/c`, `alternative-a/b/c`, `grid-a/b/c`, `clean-a/b/c`. |
| `colorScheme` | colorScheme | no | `"building"` | Color of the whole table. |
| `significance` | `"common"` / `"subdued"` / `"distinct"` / `"highlighted"` | no | | Visual significance. |
| `height` | number | no | | Fixed height (px). |
| `maxHeight` | number | no | | Maximum height (px). |
| `hideHeader` | bool | no | `false` | Hide the header row. |
| `hideFooter` | bool | no | `false` | Hide the footer row. |
| `stripedRows` | bool | no | | Alternating row colors (theme-dependent default). |
| `sortable` | bool | no | `true` | Enable column sorting. |
| `stickyHeader` | bool | no | `true` | Sticky header on scroll. |
| `stickyFooter` | bool | no | `false` | Sticky footer on scroll. |
| `tileBreakpoint` | `"none"` / `"xs"` / `"s"` / `"m"` / `"l"` / `"xl"` | no | `"s"` | Screen size threshold for tile (mobile) view. |
| `virtualization` | `"none"` / `"row"` / `"table"` | no | auto (>100 rows) | Virtualization mode. |
| `exportTypeList` | string[] | no | `["json","xls","csv"]` | Allowed export formats. |
| `spacing` | sizeOf(space) | no | `"c"` | Cell padding. |
| `padding` | sizeOf(space) | no | | Left/right row padding. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `headerStyle` | object | no | | Styles for header cells (`colorScheme`, `bold`, `fontSize`, ...). |
| `footerStyle` | object | no | | Styles for footer cells. |
| `borderColorScheme` | object | no | | Border colors by type (`horizontal`, `vertical`, `outside`, `header`, `footer`). |
| `borderWidth` | object | no | | Border widths by type (`none`, `thin`, `strong`). |
| `borderRadius` | borderRadius | no | | Rounded corners (theme-dependent default). |

**Snippet 1 -- Simple data table (grid theme):**

```
<Uu5TilesBricks.Table data='<uu5json/>[["Alice",30,"Engineer"],["Bob",25,"Designer"]]' columnList='<uu5json/>[{"header":"Name"},{"header":"Age"},{"header":"Role"}]' theme="grid-a"/>
```

**Snippet 2 -- Striped table, no sorting:**

```
<Uu5TilesBricks.Table data='<uu5json/>[["GET /api/users","List users","200"],["POST /api/users","Create user","201"],["DELETE /api/users/:id","Delete user","204"]]' columnList='<uu5json/>[{"header":"Endpoint"},{"header":"Description"},{"header":"Status"}]' theme="horizontal-a" stripedRows=true sortable=false/>
```

---

## Uu5Bricks.Layout

Library: `uu5Bricks` (since 1.3.0)

Grid layout component. Children should be `Uu5Bricks.Layout.Item`.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `"tiles"` / `"columns"` / `"area"` | no | `"tiles"` | Layout behavior. `tiles` = same-width items; `columns` = different-width items; `area` = fixed named areas. |
| `columnCount` | number | no | `12` | Total columns (only for `type="columns"`). |
| `minTileWidth` | sizeOf(unit) | no | `320` | Minimum tile width (only for `type="tiles"`). |
| `tileLastRowJustify` | string | no | | Last row alignment for tiles: `"start"`, `"end"`, `"center"`, `"stretch"`. |
| `area` | sizeOf(string) | no | | Named grid areas (only for `type="area"`). |
| `rowGap` | sizeOf(unit) | no | | Gap between rows. Adaptive: `"a"`, `"b"`, `"c"`, `"d"`. |
| `columnGap` | sizeOf(unit) | no | | Gap between columns. Adaptive: `"a"`, `"b"`, `"c"`, `"d"`. |
| `justifyItems` | sizeOf(string) | no | | Horizontal alignment of items: `start`, `end`, `center`, `stretch`. |
| `alignItems` | sizeOf(string) | no | | Vertical alignment of items: `start`, `end`, `center`, `stretch`, `baseline`. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `padding` | sizeOf(space) | no | | Space around children. |
| `textAlign` | `"start"` / `"center"` / `"end"` | no | | Horizontal content alignment. |
| `sizePolicy` | `"content"` / `"screen"` | no | `"content"` | Whether sizeOf values resolve via ContentSizeProvider or ScreenSizeProvider. |

**Snippet 1 -- Two-column layout (equal halves):**

```
<Uu5Bricks.Layout><Uu5Bricks.Layout.Item colSpan=6><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Left column</p>"/></Uu5Bricks.Layout.Item><Uu5Bricks.Layout.Item colSpan=6><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Right column</p>"/></Uu5Bricks.Layout.Item></Uu5Bricks.Layout>
```

**Snippet 2 -- Three-column layout with gaps:**

```
<Uu5Bricks.Layout type="columns" columnCount=12 rowGap="c" columnGap="c"><Uu5Bricks.Layout.Item colSpan=4><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Column 1 of 3</p>"/></Uu5Bricks.Layout.Item><Uu5Bricks.Layout.Item colSpan=4><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Column 2 of 3</p>"/></Uu5Bricks.Layout.Item><Uu5Bricks.Layout.Item colSpan=4><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Column 3 of 3</p>"/></Uu5Bricks.Layout.Item></Uu5Bricks.Layout>
```

**Snippet 3 -- Responsive layout (main + sidebar):**

```
<Uu5Bricks.Layout type="columns" columnCount=12><Uu5Bricks.Layout.Item colSpan="xs: 12; m: 8"><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Main content (wide on desktop, full on mobile)</p>"/></Uu5Bricks.Layout.Item><Uu5Bricks.Layout.Item colSpan="xs: 12; m: 4"><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Sidebar (narrow on desktop, full on mobile)</p>"/></Uu5Bricks.Layout.Item></Uu5Bricks.Layout>
```

---

## Uu5Bricks.Layout.Item

Library: `uu5Bricks` (since 1.3.0)

Child of `Uu5Bricks.Layout`. Defines item placement in the grid.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `colSpan` | sizeOf(number) | no | | Number of columns the item spans. Responsive: `colSpan="xs: 12; m: 6"`. |
| `rowSpan` | sizeOf(number) | no | | Number of rows the item spans. |
| `area` | string | no | | Named area identifier (for `Layout` type `"area"`). |
| `justifySelf` | sizeOf(string) | no | | Horizontal alignment: `start`, `end`, `center`, `stretch`. |
| `alignSelf` | sizeOf(string) | no | | Vertical alignment: `start`, `end`, `center`, `stretch`. |
| `textAlign` | `"start"` / `"center"` / `"end"` | no | | Horizontal content alignment. |

---

## Uu5ImagingBricks.Image

Library: `uu5ImagingBricks` (since 2.4.0)

Image or thumbnail display component.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `src` | string | no | | Image source URL. |
| `thumbnailSrc` | string | no | | Thumbnail URL (full image shown in lightbox). |
| `alt` | string / object | no | | Alt text for accessibility and fallback. |
| `width` | number / string | no | | Image width. |
| `height` | number / string | no | | Image height. |
| `aspectRatio` | string | no | | Aspect ratio (defined values from AspectRatio). |
| `fit` | `"cover"` / `"contain"` / `"contain-background"` / `"fill"` | no | `"cover"` | Image scaling. Requires `width` and `height`. |
| `effect` | string | no | `"none"` | Hover effect: `none`, `zoom`, `grayscale`, `blur`, `invert`, `tilt`, `morph`, `sepia`. |
| `lightbox` | bool / string | no | `true` | Lightbox registration. String = local lightbox ID. |
| `lightboxTrigger` | `"image"` / `"button"` | no | `"image"` | How to open lightbox. |
| `tooltip` | lsi / node | no | | Tooltip content. |
| `margin` | unit | no | | Space around the component. |
| `borderRadius` | borderRadius | no | `"moderate"` | Rounded corners. |
| `href` | string | no | | Link URL (absolute, fragment, mailto, tel). |
| `target` | string | no | | Link target: `_blank`, `_self`, `_parent`, `_top`, or custom tab name. |
| `thumbnailVariant` | `"small"` / `"original"` | no | auto | Which image size to display by default. |

**Snippet 1 -- Simple image:**

```
<Uu5ImagingBricks.Image src="https://cdn.example.com/photo.jpg" alt="Photo description" width=600 borderRadius="moderate"/>
```

**Snippet 2 -- Thumbnail with lightbox, cover fit, hover zoom:**

```
<Uu5ImagingBricks.Image src="https://cdn.example.com/thumb.jpg" thumbnailSrc="https://cdn.example.com/thumb-small.jpg" alt="Thumbnail with lightbox" width=300 height=200 fit="cover" effect="zoom" lightbox=true/>
```

---

## Uu5CodeKitBricks.Code

Library: `uu5CodeKitBricks` (since 2.5.0)

Source code display with syntax highlighting, line numbers, and themes.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `value` | string | no | | Code content to display. |
| `codeStyle` | string | no | `"text"` | Language for syntax highlighting: `javascript`, `json`, `css`, `html`, `python`, `java`, `sql`, `xml`, `yaml`, `markdown`, `typescript`, `c_cpp`, `go`, `ruby`, `rust`, `shell`, `bash`, etc. |
| `theme` | string | no | `"chrome"` | Editor theme. Light: `chrome`, `github`, `eclipse`, `tomorrow`, `xcode`. Dark: `monokai`, `cobalt`, `terminal`, `tomorrow_night`, `vibrant_ink`. |
| `fontSize` | number / string | no | `13` | Font size (px). |
| `displayGutter` | bool | no | `true` | Show line numbers and code folding arrows. |
| `borderRadius` | borderRadius | no | `"none"` | Rounded corners (`"none"`, `"moderate"`, `"expressive"`, etc.). |
| `wrapEnabled` | bool | no | `false` | Wrap long lines. |
| `minRows` | number | no | `1` | Minimum visible rows. |
| `maxRows` | number | no | `1000` | Maximum visible rows. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `disabled` | bool | no | `false` | Disabled mode. |
| `indent` | number | no | `2` | Spaces per indent level. |

**Snippet 1 -- JavaScript code with GitHub theme:**

```
<Uu5CodeKitBricks.Code codeStyle="javascript" value="const greeting = 'Hello, world!';\nconsole.log(greeting);" theme="github"/>
```

**Snippet 2 -- JSON code, no line numbers, dark theme:**

```
<Uu5CodeKitBricks.Code codeStyle="json" value='{"name":"Project","version":"1.0.0","dependencies":{"express":"^4.18.0"}}' theme="monokai" displayGutter=false borderRadius="moderate"/>
```

**Snippet 3 -- SQL with wrapping:**

```
<Uu5CodeKitBricks.Code codeStyle="sql" value="SELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.name\nORDER BY order_count DESC;" theme="chrome" minRows=5 wrapEnabled=true/>
```

---

## Uu5Bricks.Separator

Library: `uu5Bricks` (since 1.5.0)

Horizontal line or SVG separator. Replaces `<hr/>`.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `colorScheme` | colorScheme | no | | Line color. Semantic or basic color values. |
| `significance` | string | no | | Line style: `"common"`, `"highlighted"`, `"distinct"`, `"subdued"`. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `src` | string | no | | URL of an SVG to display instead of a line. |
| `rotate` | number | no | | Rotation in degrees. |

**Snippet 1 -- Basic separator:**

```
<Uu5Bricks.Separator/>
```

**Snippet 2 -- Colored highlighted separator:**

```
<Uu5Bricks.Separator colorScheme="primary" significance="highlighted"/>
```

---

## Uu5Bricks.Code

Library: `uu5Bricks` (since 1.22.0)

Simple inline code display. For syntax-highlighted code blocks, use `Uu5CodeKitBricks.Code` instead.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `colorScheme` | string | no | `"dim"` | Color scheme for the code display. |

Content goes between opening and closing tags (not a `value` prop).

**Snippet 1 -- Inline code standalone:**

```
<Uu5Bricks.Code>const x = 42;</Uu5Bricks.Code>
```

**Snippet 2 -- Inline code inside a text block:**

```
<Uu5RichTextBricks.Block uu5String="<uu5string/><p>Run <Uu5Bricks.Code>npm install</Uu5Bricks.Code> to install dependencies.</p>"/>
```

---

## Uu5Bricks.Card

Library: `uu5Bricks` (since 1.7.0)

Card layout component with header, content, optional footer and actions.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `header` | node | no | | Header content (text or uu5string). |
| `footer` | node | no | | Footer content. |
| `card` | string | no | `"full"` | Card type: `"full"` (shadow around all), `"content"` (shadow around content only), `"none"`. |
| `colorScheme` | colorScheme | no | `"building"` | Color of the card. |
| `significance` | string | no | `"common"` | Visual significance: `"common"`, `"highlighted"`, `"distinct"`, `"subdued"`. |
| `actionList` | object[] | no | `[]` | Actions in header (same format as ActionGroup `itemList`). |
| `headerSeparator` | bool | no | `false` | Show separator between header and content. |
| `footerSeparator` | bool | no | `false` | Show separator between content and footer. |
| `collapsible` | bool | no | `false` | Whether content is collapsible. |
| `initialCollapsed` | bool | no | `false` | If `true`, content starts collapsed. |
| `borderRadius` | borderRadius | no | `"moderate"` | Rounded corners. |
| `size` | `"xs"` / `"s"` / `"m"` / `"l"` | no | `"m"` | Visual size. |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |
| `contentPadding` | sizeOf(space) | no | `"d"` | Space around children. |
| `maxWidth` | unit | no | | Maximum width. |
| `height` | unit | no | | Fixed height. `"auto"` for parent-driven sizing. |
| `contentMaxHeight` | string / number | no | | Max height of content before scrollbar. |

**Snippet 1 -- Basic card with content:**

```
<Uu5Bricks.Card header="Card Title"><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Card content goes here.</p>"/></Uu5Bricks.Card>
```

**Snippet 2 -- Card with actions, color, and separator:**

```
<Uu5Bricks.Card header="Actions Demo" colorScheme="primary" significance="distinct" headerSeparator=true actionList='<uu5json/>[{"icon":"uugds-pencil","tooltip":"Edit"},{"icon":"uugds-delete","tooltip":"Delete"}]'><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Card with actions and colored header.</p>"/></Uu5Bricks.Card>
```

---

## Uu5Bricks.Link

Library: `uu5Bricks` (since 1.2.0)

Link or button that opens a URL or routes within the app.

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `href` | string | no | | URL (absolute, fragment, mailto, tel). |
| `target` | string | no | | Where to open: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`, or custom tab name. |
| `children` | node | no | | Link content (text or components). |
| `type` | string | no | `"link"` | Display type: `"link"`, `"button"`, `"touchLink"`, `"boxLink"`. |
| `colorScheme` | colorScheme | no | `"blue"` (link) / `"building"` (other) | Color scheme. |
| `significance` | string | no | `"common"` | Visual significance: `"common"`, `"highlighted"`, `"distinct"`, `"subdued"`. |
| `icon` | icon | no | | Icon name (e.g., `"uugds-link"`). Displayed on the left. |
| `size` | string | no | `"m"` | Visual size: `"xxs"`, `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"`. |
| `tooltip` | lsi | no | | Tooltip on hover. |
| `borderRadius` | borderRadius | no | `"moderate"` | Rounded corners (for button types). |
| `margin` | sizeOf(space) | no | `"b 0"` | Space around the component. |

**Snippet 1 -- Simple text link:**

```
<Uu5Bricks.Link href="https://example.com">Visit Example</Uu5Bricks.Link>
```

**Snippet 2 -- Button-style link with icon, opening in new tab:**

```
<Uu5Bricks.Link href="https://docs.example.com" target="_blank" type="button" colorScheme="primary" significance="highlighted" icon="uugds-link">Open Documentation</Uu5Bricks.Link>
```

---

## Uu5Bricks.PageBreak

Library: `uu5Bricks` (since 1.7.0)

Creates a page break before the element (for printing/PDF export). No properties.

**Snippet 1 -- Page break:**

```
<Uu5Bricks.PageBreak/>
```

---

## Composite Snippet -- Section with text, table, and code

This pre-validated snippet combines multiple trusted components into a documentation section pattern:

```
<Uu5Bricks.Section header="API Documentation"><Uu5RichTextBricks.Block uu5String="<uu5string/><p>The following table lists all available endpoints.</p>"/><Uu5TilesBricks.Table data='<uu5json/>[["GET /users","List users","200"],["POST /users","Create user","201"]]' columnList='<uu5json/>[{"header":"Endpoint"},{"header":"Description"},{"header":"Status"}]' theme="grid-a"/><Uu5RichTextBricks.Block uu5String="<uu5string/><h3>Example Request</h3>"/><Uu5CodeKitBricks.Code codeStyle="javascript" value="fetch('/api/users', { method: 'GET' })\n  .then(res => res.json())\n  .then(data => console.log(data));" theme="github"/></Uu5Bricks.Section>
```

## Composite Snippet -- Card with link, separator, and page break

This pre-validated snippet combines the newly added trusted components:

```
<Uu5Bricks.Card header="Resources" colorScheme="primary" headerSeparator=true><Uu5RichTextBricks.Block uu5String="<uu5string/><p>Visit the <Uu5Bricks.Link href='https://docs.example.com' target='_blank'>official documentation</Uu5Bricks.Link> for more details.</p>"/><Uu5Bricks.Separator/><Uu5RichTextBricks.Block uu5String="<uu5string/><p>For printable version, content after this point starts on a new page.</p>"/><Uu5Bricks.PageBreak/><Uu5RichTextBricks.Block uu5String="<uu5string/><p>This content appears on the next printed page.</p>"/></Uu5Bricks.Card>
```
