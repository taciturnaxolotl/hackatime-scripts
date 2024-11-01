import { Client } from "pg";

const client = new Client(process.env.DATABASE_URL);

const users: { old: string; new: string }[] = [
  // { old: "krn", new: "U062UG485EE" },
  // { old: "Ssmidge", new: "U079A6KNYB1" },
  // { old: "TheTridentGuy", new: "U06FG6G6SNL" },
  // { old: "ajhalili2006", new: "U07CAPBB9B5" },
  // { old: "arsoninstigator", new: "U07BBK4KHUK" },
  // { old: "Bartosz", new: "U079VBNLTPD" },
  // { old: "Cyao", new: "U07EQJY9YDD" },
  // { old: "dld", new: "U07E6TW9DL0" },
  // { old: "dillan", new: "U054VC2KM9P" },
  // { old: "Evan-Gan", new: "U05D1G4H754" },
  // { old: "felixgao", new: "U07BU2HS17Z" },
  // { old: "bettatested", new: "U07EB2Y76DP" },
  // { old: "kestrel", new: "U07346379NY" },
  // { old: "skyfall", new: "U059VC0UDEU" },
  // { old: "PonderSlime", new: "U07AD6RKUBW" },
  // { old: "neon", new: "U07L45W79E1" },
  // { old: "apringle", new: "U07960MD940" },
  // { old: "stoopidity", new: "U07JJL30HPA" },
  // { old: "saumil707", new: "U078K08NN2Y" },
  // { old: "Luna5379", new: "U06M89VS2SD" },
  // { old: "TheScientist101", new: "U04J9A6NUAW" },
  // { old: "manitej", new: "U04QD71QWS0" },
  // { old: "CaitPrough", new: "U04R8NX6770" },
  // { old: "recursiveforte", new: "U02UYFZQ0G0" },
  // { old: "AdamTheGreat", new: "U07F66JC92P" },
  // { old: "Eny", new: "U078VGCHXSP" },
  // { old: "somebody-else", new: "U053MDGNY75" },
  // { old: "EXELVI", new: "U07958LE5S4" },
  // { old: "fayd", new: "U014ND5P1N2" },
  // { old: "craig", new: "U07FBU5MM8U" },
  // { old: "Devarsh", new: "U079QLTJZ7H" },
  // { old: "bobbytables", new: "U07P38TJYBS" },
  // { old: "Mitang", new: "U07EX8L557Y" },
  // { old: "M1raclemax", new: "U04BG2HB5UK" },
  // { old: "nathant", new: "U07FW15CG7J" },
  // { old: "ari", new: "U06MCHA590E" },
  // { old: "z0d1ac", new: "U04AQNZRJQ5" },
  // { old: "Sajeg", new: "U078K7KAGSY" },
  // { old: "EmperorNumerius", new: "U070B8A2BTR" },
  // { old: "krishnans2006", new: "U020W4X61AR" },
  // { old: "Larry", new: "U079D8NSXV1" },
  // { old: "leowilkin", new: "U07BLJ1MBEE" },
  // { old: "KittyCat", new: "U07AZFQLPQ8" },
  // { old: "v1peridae", new: "U06EMBJH71S" },
  // { old: "lolas", new: "U078JCFHQ3D" },
  // { old: "arn", new: "U057VG1TFQC" },
  // { old: "northeastprince", new: "U04KP6JF9NH" },
  // { old: "maxsrobotics", new: "U06CRF4DLSU" },
  // { old: "aram", new: "U0616280E6P" },
  // { old: "Lazyllama", new: "U07F2QA059B" },
  // { old: "m", new: "U05PRRU5GSJ" },
  // { old: "ruckusmatter", new: "U06TZK6EKU6" },
  // { old: "hex4", new: "U071JHBEJ7R" },
  // { old: "Nikhil", new: "U07AQ54K2DN" },
  // { old: "cytronicoder", new: "U04RFLH2QP2" },
  // { old: "opott", new: "U078VEJRBR7" },
  // { old: "omr", new: "U076TKN35RC" },
  // { old: "devramsean0", new: "U04FATFRE6T" },
  // { old: "polypixeldev", new: "U04G40QKAAD" },
  // { old: "pratyushV1", new: "U078M1GLR34" },
  // { old: "Parking_Turkeys", new: "U073SGM5Y5C" },
  // { old: "Parking_turkeys", new: "U073SGM5Y5C" },
  // { old: "shibam", new: "U07972SC7A9" },
  // { old: "soleimani", new: "U07DRREAQUS" },
  // { old: "abdullahkhan", new: "U05GB7BN5KK" },
  // { old: "Scott", new: "U0325L71XQR" },
  // { old: "Codershayan", new: "U079SP4HVML" },
  // { old: "dzban", new: "U06U0TXDGNA" },
  // { old: "Game11454", new: "U07J2RTT77H" },
  // { old: "valeriuv", new: "U07AWNQTA30" },
  // { old: "yancheng", new: "U056EAXHA9L" },
  // { old: "Ye", new: "U079YD69XMF" },
  // { old: "zrl", new: "U0266FRGP" },
  // { old: "smashmaster", new: "U05Q3GJCFL6" },
  // { old: "cwalker", new: "UDK5M9Y13" },
  // { old: "Firepup650", new: "U06JLP2R8JV" },
  // { old: "yc", new: "U050RGDU8NN" },
  // { old: "khang200923", new: "U07N24APCA3" },
  // { old: "marios", new: "U04FMKCVASJ" },
  // { old: "msw", new: "U0C7B14Q3" },
  // { old: "EerierGosling", new: "U056J6JURFF" },
  // { old: "vic", new: "U072PTA5BNG" },
  // { old: "Cyclic", new: "U07B9NMJ6TY" },
  // { old: "MMK21", new: "U073M5L9U13" },
  // { old: "Jayx2u", new: "U079ZKY1CTU" },
  // { old: "muirrum", new: "U015MCCBXBP" },
  // { old: "dominic", new: "U05JX2BHANT" },
  // // { old: "bobb08618", new: "U078K08NN2Y" },
  // { old: "Craig", new: "U07FBU5MM8U" },
  { old: "phthallo", new: "U078J6H1XL3" },
];

function printProgress(text: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(text);
}

async function updateUserId(
  oldUserId: string,
  newUserId: string,
  userNumber: number
) {
  const queries = [
    `
        UPDATE users
        SET id = '${newUserId}'
        WHERE id = '${oldUserId}';
        `,
    `
        UPDATE aliases
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE heartbeats
        SET user_id = ''
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE leaderboard_items
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE project_labels
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE summaries
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
  ];

  try {
    let i = 0;
    for (const query of queries) {
      const result = await client.query(query);
      const table = query.match(/UPDATE (\w+)/)![1];
      printProgress(
        `Query ${i}/6/${userNumber}/${users.length}: Updated ${result.rowCount} rows in table ${table} for user ID \x1b[31m${oldUserId}\x1b[0m to \x1b[32m${newUserId}\x1b[0m`
      );
      i++;
    }
  } catch (error) {
    console.error("Error updating user IDs:", error);
  }
}

async function checkIfUserExists(userId: string) {
  const query = `
    SELECT *
    FROM users
    WHERE id = '${userId}';
    `;

  try {
    const result = await client.query(query);
    return result.rowCount! > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error);
  }
}

const checkDups = false;

(async () => {
  try {
    await client.connect();
    let i = 0;
    for (const user of users) {
      if (checkDups) {
        const userExists = await checkIfUserExists(user.new);
        const userExistsOld = await checkIfUserExists(user.old);
        if (userExists && userExistsOld) {
          console.log(`User ${user.old} and ${user.new} exists.`);
          continue;
        }
      } else {
        await updateUserId(user.old, user.new, i);
      }
      i++;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
})();
