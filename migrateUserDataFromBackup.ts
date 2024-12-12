import { Client } from "pg";

const backupClient = new Client(process.env.BACKUP_DATABASE_URL);
const prodClient = new Client(process.env.DATABASE_URL);

const oldUserID = "Ssmidge";
const newUserID = "U079A6KNYB1";

// select all the data from the old db and save it temporily then upload to the prod with the new user id
backupClient.connect();
prodClient.connect();

export interface Heartbeat {
	id: string;
	user_id: string;
	entity: string;
	type: string;
	category: string;
	project: string;
	branch: string;
	language: string;
	is_write: boolean;
	editor: string;
	operating_system: string;
	machine: string;
	user_agent: string;
	time: Date;
	hash: string;
	origin: string;
	origin_id: string;
	created_at: Date;
	lines: number;
}

const BATCH_SIZE = 1000;

try {
	console.log("Querying data from the backup database...");

	const res = await backupClient.query(
		"SELECT * FROM heartbeats WHERE user_id = $1;",
		[oldUserID],
	);
	const rows = res.rows as Heartbeat[];
	console.log("backup rows:", rows.length);

	for (let i = 0; i < rows.length; i += BATCH_SIZE) {
		const batch = rows.slice(i, i + BATCH_SIZE);
		const updateQueries = batch
			.map(
				(row) => `
      UPDATE heartbeats
      SET user_id = '${newUserID}'
      WHERE hash = '${row.hash}';
    `,
			)
			.join("\n");

		await prodClient.query(updateQueries);
		console.log(
			`Updated user_id for batch starting with hash: ${batch[0].hash}`,
		);
	}
} catch (error) {
	console.error(error);
} finally {
	backupClient.end();
	prodClient.end();
}
