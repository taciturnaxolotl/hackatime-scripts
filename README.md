# hackatime-scripts [![Merge Prov Users](https://github.com/kcoderhtml/hackatime-scripts/actions/workflows/merge.yaml/badge.svg)](https://github.com/kcoderhtml/hackatime-scripts/actions/workflows/merge.yaml)

A collection of scripts to help with common hackatime problems

## Usage

To install dependencies:

```bash
bun install
```

Env:

```bash
DATABASE_URL="postgresql://users:password@hackatime.xxx.aws-us-east-1.cockroachlabs.cloud:port/hackatime?sslmode=verify-full"
BACKUP_DATABASE_URL="same as above except the server is the backup cluster"
SLACK_BOT_TOKEN="a bot token with read email perms"
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
