import { execSync } from "child_process";
import * as dotenv from "dotenv";
import path from "path";

// Load .env.test — must happen before Prisma client is imported anywhere
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
  override: true, // override any already-loaded .env values
});

// Ensure DATABASE_URL is pointing at the test DB before migrations run
const url = process.env.DATABASE_URL ?? "";

console.log({ url });
if (!url.includes("kanban-board-test")) {
  console.log("url error");
  throw new Error(
    `Setup aborted: DATABASE_URL doesn't look like the test database.\nGot: ${url}\nExpected it to contain "kanban-board-test".`,
  );
}

// Generate the Prisma client first — ensures the TS client matches the current
// schema before any test file imports it. Safe to run every time; it's a no-op
// if nothing has changed.
execSync("npx prisma generate", {
  stdio: "inherit",
  env: process.env,
});

// Then apply any pending migrations to the test database.
execSync("npx prisma migrate deploy", {
  stdio: "inherit",
  env: process.env,
});
