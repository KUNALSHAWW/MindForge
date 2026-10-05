// Syncs the Prisma schema during deploys when a database is configured.
// Without DATABASE_URL the app runs in demo mode, so there is nothing to sync.
// Non-destructive: `db push` refuses changes that would drop data.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not set: skipping schema sync (demo mode).");
} else {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
}
