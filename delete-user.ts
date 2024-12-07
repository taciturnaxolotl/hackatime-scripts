import { Client } from "pg";
import type { User } from "./types";
import { intro, log, text, confirm, spinner, outro } from "@clack/prompts";
import humanize from "humanize-plus";

const client = new Client(process.env.DATABASE_URL);

intro("Hackatime Account Deletion Tool");
log.info("This tool will delete user information from the database.");

// check if -u or --user flag with a user id is passed
const args = process.argv.slice(2);
let userId = args
	.find((arg) => arg.match(/^--user=U[0-9A-Z]{10}$/) !== null)
	?.split("=")[1]
	.trim();

// if not then ask for one
if (!userId) {
	const userIdPrompt = await text({
		message: "Enter the user id",
	}).then((res) => res.toString().trim());

	if (userIdPrompt === "") {
		console.error("Invalid user id");
		outro("Bye! 👋");
		process.exit(1);
	}

	userId = userIdPrompt;
}

log.step("Fetching data from the db");

try {
	client.connect();

	const users: User[] = await client
		.query("SELECT * FROM users WHERE id = $1;", [userId])
		.then((res) => res.rows);

	if (users.length === 0) {
		log.error("User not found");
		outro("Bye! 👋");
		process.exit(1);
	}

	const heartbeatCount = await client
		.query("SELECT COUNT(*) FROM heartbeats WHERE user_id = $1;", [userId])
		.then((res) => res.rows[0].count);

	console.log(users);

	// confirm this is the user
	const user = users[0];

	const proceed = await confirm({
		message: "Is this the user you want to delete?",
		initialValue: false,
	});

	if (!proceed) {
		outro("Not exporting user data");
		client.end();
		process.exit(1);
	}

	// are you sure

	const sure = await confirm({
		message: `Are you sure you want to delete ${user.name} (${user.email})? This will delete ${humanize.intComma(heartbeatCount)} heartbeats.`,
		initialValue: false,
	});

	if (!sure) {
		outro("Not exporting user data");
		client.end();
		process.exit(1);
	}

	const spin = spinner();

	spin.start("Deleting user record");

	await client
		.query("DELETE FROM users WHERE id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user record");

	await Bun.sleep(1000);

	spin.message("Deleting user from leaderboard");

	await client
		.query("DELETE FROM leaderboard_items WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user from leaderboard");

	await Bun.sleep(1000);

	spin.message("Deleting user aliases");

	await client
		.query("DELETE FROM aliases WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user aliases");

	await Bun.sleep(1000);

	spin.message("Deleting user summaries");

	await client
		.query("DELETE FROM summaries WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user summaries");

	await Bun.sleep(1000);

	spin.message("Deleting user language mappings");

	await client
		.query("DELETE FROM language_mappings WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user language mappings");

	await Bun.sleep(1000);

	spin.message("Deleting user project labels");

	await client
		.query("DELETE FROM project_labels WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.message("Deleted user project labels");

	await Bun.sleep(1000);

	spin.message("Deleting user heartbeats");

	const deleteHeartbeatsInChunks = async (
		userId: string,
		chunkSize: number,
	) => {
		let deletedCount = 0;

		while (true) {
			const result = await client.query(
				"DELETE FROM heartbeats WHERE user_id = $1 LIMIT $2 RETURNING *;",
				[userId, chunkSize],
			);

			const rowsDeleted = result.rowCount ?? 0;
			deletedCount += rowsDeleted;

			if (rowsDeleted < chunkSize) {
				break;
			}
		}

		return deletedCount;
	};

	const chunkSize = 1000; // Adjust the chunk size as needed
	const totalDeleted = await deleteHeartbeatsInChunks(userId, chunkSize);

	spin.message(`Deleted ${totalDeleted} user heartbeats`);

	await Bun.sleep(1000);

	spin.stop("Data Deleted");

	outro("Bye! 👋");
} catch (error) {
	console.error(error);
} finally {
	client.end();
}
