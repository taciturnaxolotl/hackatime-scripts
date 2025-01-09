import Bottleneck from "bottleneck";

export interface User {
  ok: boolean;
  profile?: Profile;
  error?: string;
}
export interface Profile {
  title: string;
  phone: string;
  skype: string;
  real_name: string;
  real_name_normalized: string;
  display_name: string;
  display_name_normalized: string;
  fields: null;
  status_text: string;
  status_emoji: string;
  status_emoji_display_info: any[];
  status_expiration: number;
  avatar_hash: string;
  image_original: string;
  is_custom_image: boolean;
  email: string;
  pronouns: string;
  huddle_state: string;
  huddle_state_expiration_ts: number;
  first_name: string;
  last_name: string;
  image_24: string;
  image_32: string;
  image_48: string;
  image_72: string;
  image_192: string;
  image_512: string;
  image_1024: string;
  status_text_canonical: string;
  team: string;
}

const useCachet = process.argv.includes("-f");
console.log("useCachet:", useCachet);

import { Client } from "pg";

let prodClient = new Client(process.env.DATABASE_URL);

const connectWithRetry = async () => {
  try {
    await prodClient.connect();
  } catch (err) {
    console.error("Failed to connect to DB, retrying in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await connectWithRetry();
  }
};

await connectWithRetry();
let usersToPopulate: string[] = [];

// Helper function for console output
const updateProgress = (i: number, total: number, name: string) => {
  if (
    typeof process.stdout.clearLine === "function" &&
    typeof process.stdout.cursorTo === "function"
  ) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${i}/${total} at ${useCachet ? "200" : Math.round((50 / 60) * 10) / 10} per sec; finished in ${Math.round((total - i) * (useCachet ? 1 / 200 : 50 / 60))}s; name=${name}`,
    );
  } else {
    // Fallback to regular console.log for environments without these functions
    console.log(
      `${i}/${total} at ${useCachet ? "200" : Math.round((50 / 60) * 10) / 10} per sec; finished in ${Math.round((total - i) * (useCachet ? 1 / 200 : 50 / 60))}s; name=${name}`,
    );
  }
};

try {
  let res;
  try {
    res = await prodClient.query(
      "SELECT id FROM users WHERE name = '' OR name = 'undefined';",
    );
  } catch (err) {
    console.log("DB connection lost, reconnecting...");
    prodClient.end();
    prodClient = new Client(process.env.DATABASE_URL);
    await connectWithRetry();
    res = await prodClient.query(
      "SELECT id FROM users WHERE name = '' OR name = 'undefined';",
    );
  }

  usersToPopulate = res.rows.map((row) => row.id);

  console.log(usersToPopulate.length, "users have empty names");

  // filter to not include users with id starting with $high-seas-provisional-
  usersToPopulate = usersToPopulate.filter(
    (id) => !id.startsWith("$high-seas-provisional-"),
  );

  const problemIDs = usersToPopulate.filter(
    (id) => !id.match(/^U[0-9A-Z]{10}$/),
  );

  usersToPopulate = usersToPopulate.filter((id) => id.match(/^U[0-9A-Z]{10}$/));

  console.log(
    usersToPopulate.length,
    "users have empty names and are not provisional accounts",
  );

  // Create a rate limiter with a maximum of 10 requests per second
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: useCachet ? 1000 / 200 : (50 / 60) * 1000, // Use 200/s for cachet, otherwise 50/min
  });

  const names: { id: string; name: string }[] = [];

  let i = 0;
  for (const user of usersToPopulate) {
    await limiter.schedule(async () => {
      let userData: { name: string; image: string; id: string; ok: boolean };

      if (useCachet) {
        const res: {
          ok: boolean;
          displayName: string;
          image: string;
          user: string;
          error?: string;
        } = await fetch(`https://cachet.dunkirk.sh/users/${user}`).then((res) =>
          res.json(),
        );

        if (res.error !== undefined || res.displayName === "") {
          problemIDs.push(user);
        }

        userData = {
          name: res.displayName,
          image: res.image,
          id: res.user,
          ok: res.error === undefined && res.displayName !== "",
        };
      } else {
        const res: User = await fetch(
          `https://slack.com/api/users.profile.get?user=${user}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
            },
            body: `user=${user}`,
          },
        ).then((res) => res.json());

        if (
          !res.ok ||
          res.profile === undefined ||
          res.profile.display_name_normalized === ""
        ) {
          problemIDs.push(user);
        }

        userData = {
          name: res.profile?.display_name_normalized ?? "",
          image: res.profile?.image_192 ?? "",
          id: user,
          ok:
            res.ok &&
            res.profile !== undefined &&
            res.profile.display_name_normalized !== "",
        };
      }

      updateProgress(i, usersToPopulate.length, userData.name);

      if (userData.ok) {
        names.push({
          id: user,
          name: userData.name,
        });
      }
      i++;
    });
  }

  console.log("\nSuccessfully got the names of", names.length, "users");

  const queryText = `
				UPDATE users
				SET name = $1
				WHERE id = $2;`;

  try {
    const updatePromises = names.map((name) =>
      prodClient.query(queryText, [name.name, name.id]),
    );

    await Promise.all(updatePromises);
  } catch (err) {
    console.log("DB connection lost during updates, reconnecting...");
    prodClient.end();
    prodClient = new Client(process.env.DATABASE_URL);
    await connectWithRetry();

    const updatePromises = names.map((name) =>
      prodClient.query(queryText, [name.name, name.id]),
    );

    await Promise.all(updatePromises);
  }

  console.log("Successfully updated the names of", names.length, "users");

  console.log("problemIDs:", problemIDs);
} catch (error) {
  console.error("Error fetching user by email:", error);
} finally {
  prodClient.end();
}
