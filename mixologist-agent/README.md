# Feedback Agent

This is an example of an agentic system to create and order drinks for a user.

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
PAYMAN_API_SECRET = "your Payman Agent secret";
PAYMAN_API_BASE = "https://agent-sandbox.payman.ai/api"; //switch this to use a different environment
TIP_WALLET = "your wallet ID"; //the payman wallet where you'd like the tips to end up
OPENAI_API_KEY = "your OPEN AI key";
```

Then start the server:

```bash
bun dev
```

Then open a browser to http://localhost:3000 to view the chat interface and http://localhost:3000/bartender to view the bartender order fulfilment view
