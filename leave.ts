import Bottleneck from "bottleneck";

const neck = new Bottleneck({
	maxConcurrent: 1,
	minTime: 60 / 120,
});

async function leaveConversation(token: string, channelId: string) {
	try {
		const response = await fetch("https://slack.com/api/conversations.leave", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ channel: channelId }),
		});

		if (!response.ok) {
			console.error("Failed to leave conversation:", response.statusText);
		}

		const json = await response.json();
		if (!json.ok) {
			console.error("Failed to leave conversation:", json.error);
		} else {
			console.log("Left conversation:", channelId);
		}
	} catch (error) {
		console.error("Request failed:", error);
	}
}

// Example usage
const channelId = "C082XKU7UBZ";

// Check if -q flag was passed
const args = process.argv.slice(2);
const isQuiet = args.includes("-q");

if (!isQuiet) {
	// confirm leave spam
	const sure = prompt("Are you sure you want to leave the conversation? (Y/n)");

	if (sure?.toLowerCase() !== "n") {
		for (let i = 0; i < 120; i++) {
			neck.schedule(() =>
				leaveConversation(process.env.SLACK_USER_TOKEN || "", channelId),
			);
		}
	}
} else {
	leaveConversation(process.env.SLACK_USER_TOKEN || "", channelId);
}
