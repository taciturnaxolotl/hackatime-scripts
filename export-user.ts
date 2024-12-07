import { Client } from "pg";
import type { User } from "./types";
import { intro, log, text, confirm, spinner, outro } from "@clack/prompts";
import humanize from "humanize-plus";

const client = new Client(process.env.DATABASE_URL);

intro("Hackatime Account Export Tool");
log.info(
	"This tool will export user information as a tgz of a csv heartbeats file and a json user data file.",
);

// check if -u or --user flag with a user id is passed
const args = process.argv.slice(2);
let userId = args[0] === "-u" || args[0] === "--user" ? args[1] : undefined;

if (userId) {
	userId = userId.trim();
}

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

	console.log(users);

	// confirm this is the user
	const user = users[0];

	const proceed = await confirm({
		message: "Is this the user you want to export?",
	});

	if (!proceed) {
		outro("Not exporting user data");
		client.end();
		process.exit(1);
	}

	const spin = spinner();

	spin.start("Exporting data");

	// fetch heartbeats
	const heartbeats = await client
		.query("SELECT * FROM heartbeats WHERE user_id = $1;", [userId])
		.then((res) => res.rows);

	spin.stop("Data fetched");

	// export data with bun
	await Bun.write("out/user.json", JSON.stringify(user));

	const csvHeader = Object.keys(heartbeats[0]).join(",");
	const csv = [csvHeader]
		.concat(heartbeats.map((hb) => Object.values(hb).join(",")))
		.join("\n");

	await Bun.write("out/heartbeats.csv", csv);

	const beforeSize =
		Bun.file("out/user.json").size + Bun.file("out/heartbeats.csv").size;

	log.success(
		`Exported user ${user.id} to user.json and heartbeats.csv at a total size of ${humanize.fileSize(beforeSize)} and a total of ${humanize.compactInteger(heartbeats.length)} heartbeats.`,
	);

	const compress = await confirm({ message: "Compress files?" });

	if (compress) {
		await Bun.$`tar -czf out/user.tgz out/user.json out/heartbeats.csv`;

		const afterSize = Bun.file("out/user.tgz").size;

		log.success(
			`Compressed files to user.tgz with a total size of ${humanize.fileSize(afterSize)} and a overall compression ratio of ${Math.round((beforeSize / afterSize) * 1000) / 10}%`,
		);
	} else {
		log.warn("Not compressing files");
	}

	outro("Bye! 👋");
} catch (error) {
	console.error(error);
} finally {
	client.end();
}
