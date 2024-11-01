const names: string[] = [
  "AamirA",
  "AdamTheGreat",
  "Bartosz",
  "Cyao",
  "Devarsh",
  "EXELVI",
  "Eny",
  "Evan-Gan",
  "Game11454",
  "KittyCat",
  "Larry",
  "Lazyllama",
  "Luna5379",
  "M1raclemax",
  "MMK21",
  "Parking_Turkeys",
  "PonderSlime",
  "Sajeg",
  "Ssmidge",
  "TheScientist101",
  "TheTridentGuy",
  "V205",
  "Ventengo",
  "abdullahkhan",
  "ajhalili2006",
  "alaninnovates",
  "apringle",
  "aram",
  "averse",
  "bettatested",
  "cytronicoder",
  "devramsean0",
  "dillan",
  "dld",
  "dzban",
  "fayd",
  "felixgao",
  "kestrel",
  "khang200923",
  "krn",
  "lolas",
  "m",
  "manitej",
  "marios",
  "miyander",
  "msw",
  "nathant",
  "neon",
  "northeastprince",
  "omr",
  "phthallo",
  "polypixeldev",
  "pratyushV1",
  "qcoral",
  "recursiveforte",
  "ruckusmatter",
  "saumil707",
  "skyfall",
  "stoopidity",
  "uniquepersun",
  "v1peridae",
  "valeriuv",
  "zrl",
];

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

const over10Hours: { name: string; hours: number }[] = [];
const over5Hours: { name: string; hours: number }[] = [];
const under5Hours: { name: string; hours: number }[] = [];

let i = 0;
for (const name of names) {
  const hours = await getSummary(name).then((summary) => {
    return (
      Math.round(
        summary.projects.reduce((total, project) => total + project.total, 0) /
          360
      ) / 10
    );
  });

  if (hours >= 10) {
    over10Hours.push({ name, hours });
  } else if (hours >= 5) {
    over5Hours.push({ name, hours });
  } else {
    under5Hours.push({ name, hours });
  }

  process.stdout.write(`\rCompleted ${i} of ${names.length}`);
  i++;
}

over10Hours.sort((a, b) => b.hours - a.hours);
over5Hours.sort((a, b) => b.hours - a.hours);
under5Hours.sort((a, b) => b.hours - a.hours);

console.log("Users with over 10 hours:", over10Hours);
console.log("Users with over 5 hours:", over5Hours);
console.log("Users with under 5 hours:", under5Hours);
