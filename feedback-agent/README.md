# Feedback Agent

This is an example of an agentic system to capture, analyze and visualize feedback about an event.

## Installation

Requires:

- bun
- ollama (llama3.1 model)

To install dependencies:

```bash
bun install
```

To run the service locally:

Create a `.env` file with the following data:

```typescript
PAYMAN_API_SECRET = "your Payman Agent secret";
PAYMAN_API_BASE = "https://agent-sandbox.payman.ai/api"; //switch this to use a different environment
HOSTED_URL = "http://localhost:3000"; //this is the URL that the qr code will point to
```

Then start the server:

```bash
bun dev
```

Then open a browser to http://localhost:3000 to view the feedback submission form and http://localhost:3000/analysis to view the analysis dashboard
