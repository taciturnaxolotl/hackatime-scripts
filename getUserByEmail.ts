import Bottleneck from "bottleneck";

const users2 = [
	{ email: "aamirmazad@gmail.com", id: "AamirA" },
	{ email: "abhay.i0am@gmail.com", id: "uniquepersun" },
	{ email: "abhinov882@gmail.com", id: "Abhinov" },
	{ email: "acon@hackclub.com", id: "acon" },
	{ email: "adityavenugopalm@outlook.com", id: "vipremigini" },
	{ email: "adrian.rubio.punal@gmail.com", id: "pro-grammer" },
	{ email: "afizm2chd@mozmail.com", id: "Kazuala" },
	{ email: "akhilzebra@gmail.com", id: "akhilzebra" },
	{ email: "akshayshah0628@gmail.com", id: "Ventengo" },
	{ email: "alanlichen1@gmail.com", id: "alaninnovates" },
	{ email: "alexren@hackclub.com", id: "qcoral" },
	{ email: "amogh.ggn@gmail.com", id: "amogh" },
	{ email: "andylol.noob@gmail.com", id: "AndyNoob" },
	{ email: "annabelquach13@gmail.com", id: "phthallo" },
	{ email: "arpan@hackclub.com", id: "arpan" },
	{ email: "averse.abfun@gmail.com", id: "averse" },
	{ email: "awesomecatstudio@gmail.com", id: "smashmaster" },
	{ email: "bobb08618@gmail.com", id: "bobb08618" },
	{ email: "boorgumanitej@gmail.com", id: "manitej" },
	{ email: "caitprough@gmail.com", id: "CaitPrough" },
	{ email: "cheru@cheru.dev", id: "recursiveforte" },
	{ email: "contact@adamxu.net", id: "AdamTheGreat" },
	{ email: "cwalker@hackclub.com", id: "cwalker" },
	{ email: "dominic@userexe.me", id: "dominic" },
	{ email: "eny@enymc.dev", id: "Eny" },
	{ email: "ethanfrancis577@gmail.com", id: "somebody-else" },
	{ email: "exelvi@outlook.com", id: "EXELVI" },
	{ email: "faisal.sayed502@gmail.com", id: "fayd" },
	{ email: "farmnitecattleroyale@gmail.com", id: "miyander" },
	{ email: "firepyp650+hc-waka@gmail.com", id: "Firepup650" },
	{ email: "hackatime@youngchief.xyz", id: "yc" },
	{ email: "hc@craigg.dev", id: "craig" },
	{ email: "hello@devarsh.me", id: "Devarsh" },
	{ email: "hellonull54@gmail.com", id: "bobbytables" },
	{ email: "hhoot@gmail.com", id: "Bbooby" },
	{ email: "hindochamitang@gmail.com", id: "Mitang" },
	{ email: "hpscigeek@gmail.com", id: "M1raclemax" },
	{ email: "iamveryerverybadatchess@gmail.com", id: "nathant" },
	{ email: "ikleinari@gmail.com", id: "ari" },
	{ email: "itz.anshkumar@gmail.com", id: "z0d1ac" },
	{ email: "jfx@posteo.de", id: "Sajeg" },
	{ email: "khang200929@duck.com", id: "khang200923" },
	{ email: "krishnamohanmeda@gmail.com", id: "EmperorNumerius" },
	{ email: "krishnans2006@gmail.com", id: "krishnans2006" },
	{ email: "larryle704@gmail.com", id: "Larry" },
	{ email: "leo@wilkin.xyz", id: "leowilkin" },
	{ email: "liliaskydostie@gmail.com", id: "KittyCat" },
	{ email: "louisakavindu@gmail.com", id: "v1peridae" },
	{ email: "lsanchez@gcschool.org", id: "lolas" },
	{ email: "magsnake99@outlook.com", id: "arn" },
	{ email: "marios@hackclub.com", id: "marios" },
	{ email: "matt7@hey.com", id: "northeastprince" },
	{ email: "max@maxwofford.com", id: "msw" },
	{ email: "maxsrobotics@gmail.com", id: "maxsrobotics" },
	{ email: "me@aram.sh", id: "aram" },
	{ email: "me@craigg.dev", id: "Craig" },
	{ email: "me@lazyllama.xyz", id: "Lazyllama" },
	{ email: "me@v205.obl.ong", id: "V205" },
	{ email: "mihir@pidgon.com", id: "m" },
	{ email: "mmk21.spam@gmail.com", id: "MMK21" },
	{ email: "mplauderdale@gmail.com", id: "ruckusmatter" },
	{ email: "nenex54@proton.me", id: "hex4" },
	{ email: "nikhilmansotragg@gmail.com", id: "Nikhil" },
	{ email: "novodoodle@gmail.com", id: "cytronicoder" },
	{ email: "om.potter09@gmail.com", id: "opott" },
	{ email: "omr@rslp.org", id: "omr" },
	{ email: "outramsean0@gmail.com", id: "devramsean0" },
	{ email: "polypixel48@proton.me", id: "polypixeldev" },
	{ email: "pratyushvel_shankar@oakridge.in", id: "pratyushV1" },
	{ email: "roya1060wien@gmail.com", id: "Parking_Turkeys" },
	{ email: "roya1060wien@gmail.com", id: "Parking_turkeys" },
	{ email: "royshibam9826@gmail.com", id: "shibam" },
	{ email: "s1058357@haileybury.com.au", id: "Jayx2u" },
	{ email: "sahand@soleimani.dev", id: "soleimani" },
	{ email: "sapientabdullah@gmail.com", id: "abdullahkhan" },
	{ email: "scottchiang7@gmail.com", id: "Scott" },
	{ email: "sebastianbs@madisoncity.k12.al.us", id: "Cyclic" },
	{ email: "shayan.y.malik@gmail.com", id: "Codershayan" },
	{ email: "sofiaegan@gmail.com", id: "EerierGosling" },
	{ email: "szymon.normalnie@gmail.com", id: "dzban" },
	{ email: "thapat.g11@gmail.com", id: "Game11454" },
	{ email: "valeriucelmare1@gmail.com", id: "valeriuv" },
	{ email: "waka-hackclub@cara.devcara.com", id: "muirrum" },
	{ email: "wakat@nosesisaid.com", id: "vic" },
	{ email: "yanchengzhao2016@gmail.com", id: "yancheng" },
	{ email: "ye.gao@student.tdsb.on.ca", id: "Ye" },
	{ email: "zach@hackclub.com", id: "zrl" },
];

export interface User {
	ok: boolean;
	user?: UserClass;
	error?: string;
}

export interface UserClass {
	id: string;
	team_id: string;
	name: string;
	deleted: boolean;
	color: string;
	real_name: string;
	tz: string;
	tz_label: string;
	tz_offset: number;
	profile: Profile;
	is_admin: boolean;
	is_owner: boolean;
	is_primary_owner: boolean;
	is_restricted: boolean;
	is_ultra_restricted: boolean;
	is_bot: boolean;
	is_app_user: boolean;
	updated: number;
	is_email_confirmed: boolean;
	who_can_share_contact_card: string;
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

// Create a rate limiter with a maximum of 10 requests per second
const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: (50 / 60) * 1000, // 50 req a minute
});

(async () => {
	try {
		let i = 0;
		for (const user of users2) {
			await limiter.schedule(async () => {
				const res: User = await fetch(
					"https://slack.com/api/users.lookupByEmail?email=" + user.email,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
						},
						body: `email=${user.email}`,
					},
				).then((res) => res.json());

				process.stdout.write(
					`\r${JSON.stringify({
						old: user.id,
						new: res.ok ? res.user?.id : res.error,
					})},`,
				);

				process.stdout.write(
					"\n\n" +
						i +
						"/" +
						users2.length +
						" at " +
						Math.round((50 / 60) * 10) / 10 +
						" per sec",
				);
				i++;
			});
		}
	} catch (error) {
		console.error("Error fetching user by email:", error);
	}
})();
