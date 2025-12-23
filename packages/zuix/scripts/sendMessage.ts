import { WebClient, KnownBlock } from "@slack/web-api"
import { Octokit } from "@octokit/rest"
import path from "path"
import yargs from "yargs"
const pack: { [key: string]: unknown } = require(path.resolve(__dirname, "../package.json"))

const ZUIX_SLACK_CHANNEL_ID = "C9JFDTQ5T" // #zuix 채널
const ALARM_ZUIX_SLACK_CHANNEL_ID = "C01LZE211T6" // #알림_zuix_dev 채널

const argv = yargs(process.argv.slice(2)).options({
	phase: { type: "string" },
	email: { type: "string" },
	commit: { type: "string" },
}).argv

const web = new WebClient(process.env.SLACK_TOKEN)
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const sendMessage = async () => {
	if (argv.phase === "prod") {
		sendToChannel(ZUIX_SLACK_CHANNEL_ID)
	} else if (argv.phase === "preview") {
		sendToChannel(ALARM_ZUIX_SLACK_CHANNEL_ID)
	} else {
		sendDM()
	}
}

const sendToChannel = async (channelId: string) => {
	const userId = await lookupSlackId()
	const res = await web.chat.postMessage({
		channel: channelId,
		username: `[ZUIX2 배포] - ${pack.version}`,
		text: "",
		blocks: getBlock(`Deployer: ${userId ? `<@${userId}>` : argv.email}`),
	})

	if (!res.ts) return
	const prStr = await getGithubPRStr()
	if (!prStr) return
	await web.chat.postMessage({ channel: channelId, thread_ts: res.ts, blocks: getBlock(prStr) })
}

const sendDM = async () => {
	const userId = await lookupSlackId()
	if (!userId) {
		console.log("userId was notfound")
		return
	}
	await web.chat.postMessage({
		channel: userId,
		username: `[ZUIX2 배포] - ${pack.version}`,
		text: "",
		blocks: argv.commit
			? getBlock(`Commit: <https://github.com/zigbang/zuix2/commit/${argv.commit}|${argv.commit}>`)
			: undefined,
	})
}

const lookupSlackId = async () => {
	if (!argv.email) {
		console.log("Email was notfound")
		return
	}
	try {
		const web = new WebClient(process.env.SLACK_TOKEN_FOR_LOOKUP)
		const res = await web.users.lookupByEmail({ email: argv.email })
		return res.ok ? res.user?.id : undefined
	} catch (error) {
		console.log("lookupSlackId error:", error)
		return
	}
}

// Ref: https://github.com/zigbang/fe-infra/blob/db7fe61fe9ad1b4ffc38940fa666a0c8b9ee16f1/packages/notify-build-error/src/sendFailedMessage.ts#L11
async function getGithubPRStr(): Promise<string | undefined> {
	if (!argv.commit) return
	// github api 로 커밋해시를 파라미터로 해당 커밋과 이슈와 PR 등록정보 리스트를 불러옴.
	// https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
	const pr = (await octokit.rest.search.issuesAndPullRequests({ q: argv.commit }))?.data?.items[0]?.url
	if (!pr) return // url 정보가 없을 경우 단순 커밋이므로 pr 정보가 없으므로 return
	const prInfo = pr.split("/")
	if (prInfo.length != 8) return
	return `PR: <https://github.com/zigbang/${prInfo[5]}/pull/${prInfo[7]}|GitHub PR ${prInfo[5]}/${prInfo[7]}>`
}

const getBlock = (body: string): KnownBlock[] => {
	return [{ type: "section", text: { type: "mrkdwn", text: body } }]
}

sendMessage()
