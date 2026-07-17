# 🚀 Cretip: Decentralized Creator Tipping on Stellar

**Cretip** is an open-source, decentralized tipping platform built on the Stellar blockchain. It empowers fans to send direct Stellar USDC payments to their favorite creators in seconds, with zero intermediaries and minimal fees.

## 🏗️ Architecture Overview

Cretip is a full-stack monorepo built with:

- **🔗 Smart Contract**: Soroban (Rust) contract for secure, on-chain tipping logic
- **⚙️ Backend**: Node.js + Express API for creator profiles and tip history
- **🎨 Frontend**: Next.js + Tailwind CSS for a modern, high-converting user interface

## 📦 Project Structure

```
cretip-app/
├── contract/          # Soroban Rust smart contract
├── backend/           # Node.js Express API server
├── frontend/          # Next.js + Tailwind CSS UI
├── .gitignore         # Monorepo-wide ignore rules
├── LICENSE            # MIT License
└── README.md          # This file
```

## 🌐 Core Features

* **👑 Creator Profiles:** Public profiles displaying custom bios, links, and public wallet addresses.
* **💸 Direct Tipping:** Send Stellar USDC tokens directly to creators with near-zero network fees.
* **🕒 Tip History:** A real-time chronological feed of recent verified on-chain tips received.
* **💳 Wallet Integration:** Browser-injected Freighter Wallet authentication for direct transaction signing.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Rust & Cargo** (for Soroban contract development)
- **Soroban CLI** (install with `cargo install soroban-cli`)
- **Git**

### Installation & Setup

#### 1. Clone and navigate to the monorepo

```bash
cd cretip-app
```

#### 2. Quick Start (recommended)

Install dependencies for the root, backend, and frontend, then boot both the API and UI servers with a single command:

```bash
npm run setup
npm run dev:all
```

The API server will start on `http://localhost:3001` and the Next.js dev server on `http://localhost:3000`.

#### 3. Backend Setup (manual, alternative)

```bash
cd backend
npm install
npm run dev
```

The API server will start on `http://localhost:3001`

#### 4. Frontend Setup (manual, alternative)

```bash
cd ../frontend
npm install
npm run dev
```

The Next.js dev server will start on `http://localhost:3000`

#### 5. Smart Contract Setup

```bash
cd ../contract
cargo build --target wasm32-unknown-unknown --release
```

To test the contract locally:

```bash
soroban contract invoke \
  --network testnet \
  --source [YOUR_ACCOUNT] \
  -- tip_creator \
  --shares 100000000 \
  --creator_address [CREATOR_WALLET]
```

## 🔒 Local Prototype Workflow

1. **Navigate to the creator profile** (e.g., `http://localhost:3000/alice`)
2. **Click "Connect Wallet to Tip"** (mocked locally)
3. **Select a tip amount** ($2, $5, $10) or enter custom
4. **Confirm the transaction** in the mock wallet
5. **Observe the tip appear** in the live activity feed
6. **Check the backend** at `GET http://localhost:3001/api/tips/:creator_id`

## 📡 API Endpoints

### GET `/api/creators/:username`
Fetch creator profile and wallet address.

**Response:**
```json
{
  "id": "creator_1",
  "username": "alice",
  "display_name": "Alice Creator",
  "stellar_wallet_address": "GAXYZ...",
  "bio": "Digital artist & musician"
}
```

### POST `/api/tips`
Log a tip event after on-chain transfer.

**Body:**
```json
{
  "tx_hash": "abc123def456...",
  "amount": 10,
  "sender": "Anonymous",
  "creator_id": "creator_1",
  "timestamp": "2026-07-01T12:30:00Z"
}
```

### GET `/api/tips/:creator_id`
Fetch recent tip history for a creator.

**Response:**
```json
[
  {
    "id": "tip_1",
    "tx_hash": "abc123...",
    "amount": 10,
    "sender": "Anonymous",
    "timestamp": "2026-07-01T12:30:00Z"
  }
]
```

## 🎨 Design System

### Color Palette

- **Deep Dark Background**: `#0F172A`
- **Electric Cyan**: `#00F0FF`
- **Neon Purple**: `#9D4EDD`
- **Bright Emerald**: `#10B981` (success/money actions)

### Emoji Icons

- 💳 Wallet
- 💸 Tipping / Money
- 👑 Creator Profiles
- 🕒 History / Timestamps
- 🚀 Launch / Action
- ✅ Success
- ⚠️ Warnings

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run lint      # Run ESLint
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
```

### Frontend Development

```bash
cd frontend
npm run lint      # Run ESLint
npm run dev       # Start Next.js dev server
npm run build     # Build for production
npm run start     # Start production server
```

### Smart Contract Development

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
soroban contract build
```

## 📝 Smart Contract Functions

### `tip_creator`

**Arguments:**
- `env`: Soroban Environment
- `shares`: Amount of Stellar USDC tokens to transfer (as an integer, using the token's decimal precision)
- `creator_address`: Stellar wallet address (Address type)

**Logic:**
- Safely transfers Stellar USDC tokens from caller to creator
- Validates recipient address
- Returns transaction result or error

## 🔐 Security Notes

- Smart contract uses Soroban's native balance checking
- Backend validates all incoming tip payloads
- Frontend mocks wallet signing (not production-ready)
- All environment variables (.env) are git-ignored

## 📄 License

This project is open-source under the MIT License. See [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 💬 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Built with ❤️ on Stellar**
