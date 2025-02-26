import { Client } from "pg";
import type { User } from "./types";

const client = new Client(process.env.DATABASE_URL);

if (process.argv.length < 3) {
  console.log("Please provide a user ID");
  process.exit(1);
}

const userId = process.argv[2];

console.log("Hackatime Account Removal Tool");
console.log(
  `This tool will remove the account with the id: ${userId} from the database`,
);

try {
  await client.connect();

  await client.query("BEGIN;");

  await client.query("DELETE FROM users WHERE id = $1;", [userId]);
  await client.query("DELETE FROM aliases WHERE user_id = $1;", [userId]);
  await client.query("DELETE FROM heartbeats WHERE user_id = $1;", [userId]);
  await client.query("DELETE FROM summaries WHERE user_id = $1;", [userId]);
  await client.query("DELETE FROM language_mappings WHERE user_id = $1;", [
    userId,
  ]);
  await client.query("DELETE FROM project_labels WHERE user_id = $1;", [
    userId,
  ]);
  await client.query("DELETE FROM leaderboard_items WHERE user_id = $1;", [
    userId,
  ]);

  await client.query("COMMIT;");

  console.log(`Successfully removed user ${userId} and all associated data`);
} catch (error) {
  await client.query("ROLLBACK;");
  console.log("Stopping because of an error");
  console.error(error);
} finally {
  client.end();
}

console.log("Bye! 👋");
