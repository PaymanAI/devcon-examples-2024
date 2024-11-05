# Activation Agent

This is a prototype of an agentic system to create tweet texts to help promote Payman on twitter. The tweet texts will be created for a user based on the user's twitter personality.

## Installation

Requires:

- bun

To install dependencies:

```bash
bun install
```

To run the service locally:

Create a `.env` file with the following data:

```typescript
PAYMAN_API_SECRET = "your Payman Agent secret"
PAYMAN_API_BASE = "https://agent.payman.dev/api"; //switch this to use a different environment
OPENAI_API_KEY = "your OPEN AI key"
TWITTER_APP_BEARER_TOKEN= "twitter app bearer token"
```

Then start the server:

```bash
bun dev
```

Then open a browser to http://localhost:3000 to view the interface 
