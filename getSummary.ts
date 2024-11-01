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
    "https://waka.hackclub.com/api/summary?from=2024-09-19&to=2024-09-29&user=" +
      user,
    {
      headers: {
        Authorization: `Bearer blahaji_rulz_da_world`,
      },
    }
  ).then((res) => res.json());
}

// read a user from stin
const prompt = "Enter the hackatime user to get summary for: ";
const line = await new Promise<string>((resolve) => {
  process.stdout.write(prompt);
  process.stdin.once("data", (data) => {
    const input = data.toString().trim().replace(/@/g, "");
    resolve(input);
  });
});

console.log("You entered: " + line);

console.log("Fetching user...");

console.log(await getSummary(line));

process.exit(0);
