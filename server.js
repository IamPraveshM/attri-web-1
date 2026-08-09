import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = resolve(__dirname, "dist/hostinger/server.js");

if (!existsSync(serverPath)) {
  throw new Error(
    "Hostinger server artifact not found. Run `npm run build:hostinger` before starting the app."
  );
}

await import(serverPath);
