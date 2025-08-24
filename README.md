# nexAI Monorepo
### [Presentation Link] ([Presentation Link](https://www.canva.com/design/DAGw9L71g1Q/qxfd018QAgpYiuQsENpgyA/edit)) 
<div align="center">
  <h1>nexAI</h1>
  <p><strong>AI Agent for On‑Chain Finance:</strong> multi‑chain token swaps, lending / borrowing (Echelon ecosystem), DeFi data insights, and cross‑chain <em>atomic swap</em> flows between Aptos and Ethereum.</p>
</div>

## 🚀 Overview

nexAI is an AI‑driven autonomous assistant that:

- Executes or prepares token swaps on supported DEX / router backends.
- Interacts with lending & borrowing protocols (Echelon — deposits, positions data, markets info).
- Retrieves structured on‑chain & DeFi analytics (prices, TVL, protocol stats, coin metadata).
- Orchestrates cross‑chain atomic swap intent flows between Aptos and Ethereum (in progress: finalization logic / relayer layer).
- Explains actions before broadcasting transactions for transparency.

## ✨ Core Features

| Domain                  | Capability                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| Swaps                   | Discover + construct token swap transactions.                                |
| Lending / Borrowing     | Query markets, health, balances (Echelon), prepare deposit/withdraw actions. |
| DeFi Data               | Fetch token info, prices, protocol TVL, formatting utilities.                |
| Cross‑Chain Atomic Swap | Initiate Aptos ↔ Ethereum atomic swap flow (hash‑time / intent model WIP).  |
| AI Reasoning            | LangChain + OpenAI planning with tool invocation and streamed responses.     |

## 🧠 How It Works (High Level)

1. User prompts the AI (chat interface).
2. Model plans which on‑chain tools to invoke (price, market, balances, etc.).
3. Tools return structured JSON; AI synthesizes human‑readable explanation + proposed transaction steps.
4. For swaps / lending the agent can output prepared transaction payloads (Aptos Move or EVM calldata) pending user signing.
5. For cross‑chain atomic swaps it initiates a two‑leg flow (lock / commit on origin, claim / finalize on destination) — relayer / proof infra under active development.

## 🛠️ Tech Snapshot

- Runtime: Next.js (frontend) + API route for streaming AI responses.
- AI: LangChain, OpenAI Chat (streaming / tool calls).
- Chains: Aptos (`@aptos-labs/ts-sdk`) & Ethereum testnet (Sepolia) (EVM integration layer & ABIs to be finalized).
- Internal SDK: `@nexai/echelon-sdk` for Echelon protocol primitives.
- Monorepo: Yarn 4 workspaces + Turborepo.

## 🔑 Environment

Create `packages/frontend/.env.local`:

```
OPENAI_API_KEY=sk-...
```

Add any RPC keys (Infura / custom) as you extend Ethereum interactions.

## ▶️ Quick Start

```bash
# Install
yarn install

# Dev (frontend + builds dependencies automatically)
yarn workspace @nexai/frontend dev

# Build production
yarn workspace @nexai/frontend build

# Run production
yarn workspace @nexai/frontend start
```

## 🧩 Extending the Agent

Add a new tool:

1. Create a file under `packages/frontend/src/tools/` exporting a LangChain `DynamicTool`.
2. Import and append it to the tools list in `pages/api/chat.ts`.
3. Reference it naturally in a prompt; the model can now select it.

## 🔄 Cross‑Chain Atomic Swap (Aptos ↔ Ethereum)

Current scope:

- Address registry & contract addresses defined (`contract.ts`).
- Atomic swap conceptual flow (hash‑time / conditional release) under implementation.
- UI simply reflects direction & amount (execution layer intentionally minimal until final relayer spec is merged).

Planned next steps:

1. Minimal ABIs (EVM) & Move entry function catalog.
2. HTLC / intent commit on origin chain.
3. Event listener + relayer service -> destination finalize call.
4. Safety checks (expiry, refund path) surfaced in AI explanations.

## 📍 Roadmap (Condensed)

- EVM calldata builder for swaps & atomic swap leg.
- Echelon advanced lending actions (liquidation risk analysis, leverage suggestions — advisory only).
- Transaction simulation + risk scoring.
- Persistent conversation + action audit trail.
- Relayer / oracle for atomic swap finalization.
- Test suite (unit + integration) with mock chain state.



