// global-setup.ts
import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
module.exports = async () => {
  console.log(
    "🔁 [globalSetup] Resetting sqlite test database once before all test suites..."
  );

  execSync("npx prisma generate --schema=prisma/test/schema.test.prisma", {
    stdio: "inherit",
    env: process.env,
  });

  execSync(
    "npx prisma db push --force-reset --schema=prisma/test/schema.test.prisma",
    {
      stdio: "inherit",
      env: process.env,
    }
  );
};
