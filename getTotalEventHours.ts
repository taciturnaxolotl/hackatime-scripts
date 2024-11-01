import { Client } from "pg";

const client = new Client(process.env.DATABASE_URL);

export interface Summary {
	user_id: string;
	from: Date;
	to: Date;
	projects: Category[];
	languages: Category[];
	editors: Category[];
	operating_systems: Category[];
	machines: Category[];
	labels: Category[];
	branches: null;
	entities: null;
	categories: Category[];
}

export interface Category {
	key: string;
	total: number;
}

async function getSummary(user: string): Promise<Summary> {
	return await fetch(
		`https://waka.hackclub.com/api/summary?from=2024-10-03&to=2024-10-15&user=${user}`,
		{
			headers: {
				Authorization: "Bearer blahaji_rulz_da_world",
			},
		},
	).then((res) => res.json());
}

function printProgress(text: string) {
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(text);
}

const eventDate = new Date("2024-10-03 17:00:00-05:00");

(async () => {
	try {
		await client.connect();
		const users: {
			id: string;
			created_at: Date;
			has_data: boolean;
		}[] = await client
			.query("SELECT id, created_at, has_data FROM users")
			.then((res) => res.rows);

		console.log(`Found ${users.length} users`);
		// list number of usrs with and without data
		const usersWithData = users.filter((user) => user.has_data);
		console.log(
			`Users with data: ${usersWithData.length} (${
				Math.round((usersWithData.length / users.length) * 1000) / 10
			}% of all users)`,
		);

		const usersSinceEventStart = users.filter(
			(user) => user.created_at >= eventDate,
		).length;

		console.log(
			`Users since event start: ${usersSinceEventStart} (${
				Math.round((usersSinceEventStart / users.length) * 1000) / 10
			}% of all users)`,
		);

		// users with data since event start
		const usersWithDataSinceEventStart = users.filter(
			(user) => user.has_data && user.created_at >= eventDate,
		).length;

		console.log(
			`Users with data since event start: ${usersWithDataSinceEventStart} (${
				Math.round((usersWithDataSinceEventStart / users.length) * 1000) / 10
			}% of all users created since the event started)`,
		);

		let totalTimeInCategories: { [key: string]: number } = {};
		let i = 0;
		for (const user of usersWithData) {
			printProgress(
				`${i}/${usersWithData.length} Getting summary for user ${user.id}`,
			);
			const summary = await getSummary(user.id);
			for (const category of summary.categories) {
				totalTimeInCategories[category.key] =
					(totalTimeInCategories[category.key] || 0) + category.total;
			}
			i++;
		}

		console.log();

		let formatedTimeInCategories: { [key: string]: string } = {};

		for (const category in totalTimeInCategories) {
			const totalTime = totalTimeInCategories[category];
			const hours = Math.floor(totalTime / 3600);
			const minutes = Math.floor((totalTime % 3600) / 60);
			const seconds = totalTime % 60;
			//   don't display a value if it doesn't exist
			formatedTimeInCategories[category] = `${hours ? hours + "h " : ""}${
				minutes ? minutes + "m " : ""
			}${seconds ? seconds + "s " : ""}`;
		}

		console.log(formatedTimeInCategories);
		// total time formated
		let total = 0;
		for (const category in totalTimeInCategories) {
			total += totalTimeInCategories[category];
		}

		const hours = Math.floor(total / 3600);
		const minutes = Math.floor((total % 3600) / 60);
		const seconds = total % 60;

		console.log(
			`Total time: ${hours ? hours + "h " : ""}${
				minutes ? minutes + "m " : ""
			}${seconds ? seconds + "s " : ""}`,
		);
	} catch (error) {
		console.error(error);
	} finally {
		await client.end();
	}
})();
