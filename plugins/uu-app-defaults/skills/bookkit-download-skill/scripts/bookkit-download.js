#!/usr/bin/env node

const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { spawn, execSync } = require("node:child_process");
const process = require("node:process");

const Constants = {
  oauth: {
    CODE: "code",
    CLIENT_ID: "client_id",
    CLIENT_SECRET: "client_secret",
    REDIRECT_URI: "redirect_uri",
    RESPONSE_TYPE: "response_type",
    SCOPE: "scope",
    GRANT_TYPE: "grant_type",
    GRANT_TYPE_CODE: "authorization_code",
    SCOPE_OPENID: "openid"
  },
  oidc: {
    WELL_KNOWN_DISCOVERY_PATH: ".well-known/openid-configuration",
    DEFAULT_AUDIENCE: "https://",
    prod: {
      OIDC_URI: "https://uuidentity.plus4u.net/uu-oidc-maing02/bb977a99f4cc4c37a2afce3fd599d0a7/oidc",
      CLIENT_ID: "F64b643R05xQ62696875W1j2",
      CLIENT_SECRET: "2u1q5KU2Z0Bs5SErmYVwM053+zyKDxT7QLU2Q7Rr7nn5t5%Bt80px8mf3$s16FdK"
    },
    dev: {
      OIDC_URI: "https://uuidentity.plus4u.net/uu-oidc-maing02/bb977a99f4cc4c37a2afce3fd599d0a7/oidc",
      CLIENT_ID: "F64b643R05xQ62696875W1j2",
      CLIENT_SECRET: "2u1q5KU2Z0Bs5SErmYVwM053+zyKDxT7QLU2Q7Rr7nn5t5%Bt80px8mf3$s16FdK"
    }
  },
  platform: {
    ANDROID: "android",
    LINUX: "linux",
    DARWIN: "darwin",
    WIN32: "win32",
    LINUX_CMD: "xdg-open",
    DARWIN_CMD: "open",
    WIN32_CMD: "cmd"
  },
  env: {
    DEV_OIDC: "DEV_OIDC",
    SERVER_URL: "SERVER_URL",
    MCP_SERVER_URL: "MCP_SERVER_URL"
  }
};

function getOidcType() {
  return process.env[Constants.env.DEV_OIDC] === "true" ? "dev" : "prod";
}

function getScopeValue() {
  return `${Constants.oauth.SCOPE_OPENID} ${Constants.oidc.DEFAULT_AUDIENCE}`;
}

async function getMetadata() {
  const oidcUri = Constants.oidc[getOidcType()].OIDC_URI;
  const discoveryUri = `${oidcUri}/${Constants.oidc.WELL_KNOWN_DISCOVERY_PATH}`;
  const response = await fetch(discoveryUri);
  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC metadata: ${response.status}`);
  }
  return response.json();
}

function openBrowser(uri) {
  const platform = process.platform;
  let cmd;
  let args;

  switch (platform) {
    case Constants.platform.ANDROID:
    case Constants.platform.LINUX:
      cmd = Constants.platform.LINUX_CMD;
      args = [uri];
      break;
    case Constants.platform.DARWIN:
      cmd = Constants.platform.DARWIN_CMD;
      args = [uri];
      break;
    case Constants.platform.WIN32:
      cmd = Constants.platform.WIN32_CMD;
      args = ["/c", "start", uri.replace(/&/g, "^&")];
      break;
    default:
      throw new Error(`Platform ${platform} is not supported`);
  }

  spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
}

async function getAuthorizationCode() {
  const metadata = await getMetadata();

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        if (!req.url) {
          throw new Error("Request URL is undefined");
        }

        const callbackUrl = new URL(req.url, "http://localhost");
        const code = callbackUrl.searchParams.get(Constants.oauth.CODE);
        const serverAddress = server.address();

        if (!serverAddress || typeof serverAddress === "string") {
          throw new Error("Unable to get server port");
        }

        if (code) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("<html><body><h1>Login successful</h1><p>You can close this window.</p></body></html>", () => {
            server.close();
          });
          resolve([code, serverAddress.port]);
        } else {
          const uuAppErrorMap = callbackUrl.searchParams.get("uuAppErrorMap");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`<html><body><h1>Login failed</h1><p>${uuAppErrorMap || "No code returned."}</p></body></html>`, () => {
            server.close();
          });
          reject(new Error(`Unable to obtain access token code. ${uuAppErrorMap || ""}`));
        }
      } catch (error) {
        server.close();
        reject(error);
      }
    });

    server.listen(0, () => {
      const serverAddress = server.address();
      if (!serverAddress || typeof serverAddress === "string") {
        reject(new Error("Unable to get server port"));
        return;
      }

      const authzUri = new URL(metadata.authorization_endpoint);
      authzUri.searchParams.set(Constants.oauth.CLIENT_ID, Constants.oidc[getOidcType()].CLIENT_ID);
      authzUri.searchParams.set(Constants.oauth.REDIRECT_URI, `http://localhost:${serverAddress.port}`);
      authzUri.searchParams.set(Constants.oauth.RESPONSE_TYPE, Constants.oauth.CODE);
      authzUri.searchParams.set(Constants.oauth.SCOPE, getScopeValue());

      console.log("Opening browser for interactive login...");
      openBrowser(authzUri.toString());
    });
  });
}

async function grantAuthorizationCodeToken(authorizationCode, serverPort) {
  const metadata = await getMetadata();
  const params = {
    [Constants.oauth.GRANT_TYPE]: Constants.oauth.GRANT_TYPE_CODE,
    [Constants.oauth.CODE]: authorizationCode,
    [Constants.oauth.CLIENT_ID]: Constants.oidc[getOidcType()].CLIENT_ID,
    [Constants.oauth.CLIENT_SECRET]: Constants.oidc[getOidcType()].CLIENT_SECRET,
    [Constants.oauth.SCOPE]: getScopeValue(),
    [Constants.oauth.REDIRECT_URI]: `http://localhost:${serverPort}`
  };

  const response = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Authentication failed: ${body}`);
  }

  return response.json();
}

async function interactiveLogin() {
  const [code, serverPort] = await getAuthorizationCode();
  const token = await grantAuthorizationCodeToken(code, serverPort);
  return token.id_token;
}

async function downloadBinaryData(bookkitBaseUri, skillCode, idToken, outputPath) {
  const url = new URL(`${bookkitBaseUri}/getBinaryData`);
  url.searchParams.set("code", skillCode);
  url.searchParams.set("contentDisposition", "attachment");

  console.log(`Downloading from: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/octet-stream"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Download failed (${response.status}): ${body}`);
  }

  const contentDisposition = response.headers.get("content-disposition");
  let filename = outputPath;

  if (!filename) {
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, "");
      }
    }
    if (!filename) {
      filename = `${skillCode}.bin`;
    }
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
  console.log(`Saved to: ${filename} (${buffer.byteLength} bytes)`);
  return filename;
}

function resolveSkillsDir(explicitDir) {
  if (explicitDir) return path.resolve(explicitDir);
  return path.join(process.cwd(), ".cursor", "skills");
}

function unpackSkill(skillFilePath, skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
    console.log(`Created skills directory: ${skillsDir}`);
  }

  console.log(`Unpacking ${skillFilePath} → ${skillsDir}`);

  try {
    execSync(`unzip -o "${skillFilePath}" -d "${skillsDir}"`, { stdio: "inherit" });
    console.log(`Unpacked to: ${skillsDir}`);
    fs.unlinkSync(skillFilePath);
    console.log(`Removed archive: ${skillFilePath}`);
  } catch (err) {
    throw new Error(`Failed to unpack skill: ${err.message}`);
  }
}

async function main() {
  const rawArgs = process.argv.slice(2);

  const noUnpack = rawArgs.includes("--no-unpack");
  const skillsDirIdx = rawArgs.indexOf("--skills-dir");
  const skillsDirArg = skillsDirIdx !== -1 ? rawArgs[skillsDirIdx + 1] : undefined;

  const positional = rawArgs.filter((a, i) => {
    if (a.startsWith("--")) return false;
    if (i > 0 && rawArgs[i - 1] === "--skills-dir") return false;
    return true;
  });

  if (positional.length < 2) {
    console.error("Usage: bookkit-download.js <skillCode> <bookkitBaseUri> [outputPath] [--no-unpack] [--skills-dir <path>]");
    console.error("  skillCode        - The BookKit skill/file code");
    console.error("  bookkitBaseUri   - Base URI of the BookKit instance");
    console.error("  outputPath       - Optional output file path (auto-detected from response if omitted)");
    console.error("  --no-unpack      - Skip unpacking the .skill file");
    console.error("  --skills-dir     - Target directory for unpacking (default: .cursor/skills/)");
    console.error("\nExample:");
    console.error("  bookkit-download.js my-code https://bookkit.example.com/uu-bookkit-maing01/abc123");
    process.exitCode = 1;
    return;
  }

  const [skillCode, bookkitBaseUri, outputPath] = positional;

  try {
    const idToken = await interactiveLogin();
    console.log("Login successful.");
    const savedPath = await downloadBinaryData(bookkitBaseUri, skillCode, idToken, outputPath);
    console.log(`Download complete: ${savedPath}`);

    if (!noUnpack && savedPath.endsWith(".skill")) {
      const skillsDir = resolveSkillsDir(skillsDirArg);
      unpackSkill(savedPath, skillsDir);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
