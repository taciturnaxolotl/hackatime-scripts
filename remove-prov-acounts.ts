import { Client } from "pg";
import { intro, outro, log, spinner } from "@clack/prompts";
import type { User } from "./types";

const client = new Client(process.env.DATABASE_URL);

type ExtendedUser = User & { heartbeat_count: number };

intro("Hackatime Provisional Acount Removal Tool");
log.info(
  "This tool will remove provisional accounts from the database and merge existing acounts."
);

const s = spinner();
s.start("Fetching data from the db");

let mergedUsers = 0;
let duplicateUsersCount = 0;

try {
  client.connect();

  const users: ExtendedUser[] = await client
    .query(
      "SELECT (SELECT COUNT(*) FROM heartbeats h WHERE h.user_id = u.id) AS heartbeat_count, u.* FROM users u;"
    )
    .then((res) => res.rows);

  // check number of acounts duplicated by email (lower email)
  const emailMap = new Map<string, ExtendedUser[]>();
  for (const user of users) {
    const email = user.email.toLowerCase();
    if (!emailMap.has(email)) {
      emailMap.set(email, []);
    }
    const userList = emailMap.get(email);
    if (userList) {
      userList.push(user);
    }
  }

  // log number of duplicated users
  const duplicateUsers = Array.from(emailMap.values()).filter(
    (users) => users.length > 1
  );

  duplicateUsersCount = duplicateUsers.length;

  s.message("Processing data");
  log.step(`Number of duplicated accounts: ${duplicateUsers.length}`);

  for (const users of duplicateUsers) {
    // find the user with the most heartbeats
    const activeUser = users.reduce((acc, curr) =>
      acc.heartbeat_count > curr.heartbeat_count ? acc : curr
    );

    // find slack user
    const slackUser = users.find(
      (user) => user.id.match(/^U[0-9A-Z]{10}$/) !== null
    );

    if (slackUser) {
      // if the slack user and active user aren't the same update the slack user to use the apikey of the active user
      if (slackUser.id !== activeUser.id) {
        s.message(
          `Updating slack user ${slackUser.id} to use apikey of active user ${activeUser.id}`
        );

        await client.query(
          `
				    UPDATE users
				    SET api_key = $1
				    WHERE id = $2;
				    `,
          [`${activeUser.api_key}-rm`, activeUser.id]
        );

        await client.query(
          `
				    UPDATE users
				    SET api_key = $1
				    WHERE id = $2;
				    `,
          [activeUser.api_key, slackUser.id]
        );
      }

      // merge heartbeats from other users into the slack user
      const userIds = users
        .map((user) => user.id)
        .filter((id) => id !== slackUser.id);

      s.message(`userids to delete: ${userIds}`);

      await client.query(
        `
			    UPDATE heartbeats
			    SET user_id = $1
			    WHERE user_id = ANY($2::text[]);;
			    `,
        [slackUser.id, userIds]
      );

      // delete remaining users
      await client.query("BEGIN;");

      await client.query("DELETE FROM users WHERE id = ANY($1::text[]);", [
        userIds,
      ]);

      await client.query(
        "DELETE FROM aliases WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query(
        "DELETE FROM heartbeats WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query(
        "DELETE FROM summaries WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query(
        "DELETE FROM language_mappings WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query(
        "DELETE FROM project_labels WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query(
        "DELETE FROM leaderboard_items WHERE user_id = ANY($1::text[]);",
        [userIds]
      );

      await client.query("COMMIT;");

      s.message(
        `Merged ${userIds.length} users into slack user ${slackUser.id}`
      );

      mergedUsers++;
    }
  }
} catch (error) {
  s.stop("Stopping because of an error", 0);
  console.error(error);
} finally {
  client.end();
}

s.stop(
  `Finished processing data for ${mergedUsers} of the ${duplicateUsersCount} found users`
);
outro("Bye! 👋");
