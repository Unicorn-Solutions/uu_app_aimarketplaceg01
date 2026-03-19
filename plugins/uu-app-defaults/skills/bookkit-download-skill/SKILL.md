---
name: bookkit-download-skill
description: Download binary files from a BookKit instance using the getBinaryData endpoint. Use when the user wants to download a file, export, or binary asset from a BookKit book by skill code. Requires skillCode and bookkitBaseUri parameters. Performs interactive Plus4U OIDC login automatically.
---

# BookKit Download Skill

Download binary data from a BookKit instance via the `getBinaryData` endpoint with interactive Plus4U authentication.

## Parameters

- `skillCode` - The BookKit file/skill code to download
- `bookkitBaseUri` - Base URI of the BookKit instance (e.g. `https://bookkit.example.com/uu-bookkit-maing01/abc123`)
- `--skills-dir <path>` _(optional)_ - Override the unpack target directory (default: `<project_dir>/.cursor/skills/`)

## Usage

Run the bundled script directly. The script opens a browser for interactive login, so it **must be executed outside the Cursor sandbox** — always use `required_permissions: ["all"]` in the Shell tool call.

```bash
node scripts/bookkit-download.js <skillCode> <bookkitBaseUri> [--skills-dir <path>]
```

Example:

```bash
node scripts/bookkit-download.js my-code https://bookkit.plus4u.net/uu-bookkit-maing01/abc123
```

## Workflow

1. The script opens a browser for interactive Plus4U OIDC login and waits for the authorization callback on a local HTTP server.
2. It exchanges the authorization code for an `id_token`.
3. It calls `GET <bookkitBaseUri>/getBinaryData?code=<skillCode>&contentDisposition=attachment` with `Authorization: Bearer <id_token>` and `Content-Type: application/octet-stream`.
4. The binary response is saved using the filename from the `Content-Disposition` header.
5. If the saved file has a `.skill` extension, it is automatically unpacked with `unzip` into `<project_dir>/.cursor/skills/` (or the path given via `--skills-dir`) and the downloaded `.skill` archive is removed afterwards. Always pass `--skills-dir <project_dir>/.cursor/skills` unless the user specifies otherwise.

## Response Format

After completion, always return a concise response containing:

- `result` - human-readable outcome (what was downloaded/unpacked)
- `status` - command execution status (`success` or `error`)

Example:

```text
result: Downloaded and unpacked to .cursor/skills/uu-cmd; removed archive uu-cmd.skill
status: success
```

## Script Location

`scripts/bookkit-download.js`
