# 🚀 Cretip Setup Guide - Local Development

This guide walks you through bootstrapping the entire cretip-app ecosystem locally.

## Prerequisites

Ensure you have these installed:

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Rust & Cargo** ([rustup.rs](https://rustup.rs))
- **Soroban CLI** (install after Rust): `cargo install soroban-cli`

## Quick Start (3 steps)

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✨ Cretip Backend running on http://localhost:3001
📡 API available at http://localhost:3001/api
🏥 Health check: http://localhost:3001/api/health
```

**Available Endpoints:**
- `GET /api/creators/:username` - Fetch creator profile
- `POST /api/tips` - Log a tip event
- `GET /api/tips/:creator_id` - Fetch tip history
- `GET /api/health` - Health check

### 2. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

The frontend will now be live at `http://localhost:3000`

### 3. Smart Contract Setup (Optional)

Open a new terminal:

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

To test the contract:

```bash
soroban contract build
```

## 🎯 Local Prototype Workflow

1. **Start both servers** (backend on 3001, frontend on 3000)
2. **Visit http://localhost:3000** in your browser
3. **Click on a creator** (e.g., "Alice Creator")
4. **Click "Connect Wallet to Tip"** (mocked locally)
5. **Select a tip amount** ($2, $5, $10) or enter custom amount
6. **Click "Send Tip"** 🚀
7. **Watch the tip appear** in the activity feed in real-time
8. **Verify in the backend** (optional):
   ```bash
   curl http://localhost:3001/api/tips/creator_1
   ```

## 📡 API Testing

### Get a Creator Profile

```bash
curl http://localhost:3001/api/creators/alice
```

Response:
```json
{
  "id": "creator_1",
  "username": "alice",
  "display_name": "Alice Creator",
  "stellar_wallet_address": "GBXYZ...",
  "bio": "Digital artist & musician 🎨🎵"
}
```

### Send a Tip (POST)

```bash
curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "mock_tx_123abc456def",
    "amount": 10,
    "sender": "Fan Name",
    "creator_id": "creator_1",
    "timestamp": "2026-07-01T12:30:00Z"
  }'
```

### Get Tip History

```bash
curl http://localhost:3001/api/tips/creator_1
```

## 🛠️ Development Commands

### Backend

```bash
npm run dev      # Start with hot reload
npm run lint     # Run ESLint
npm start        # Run production server
```

### Frontend

```bash
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

### Smart Contract

```bash
cargo build --target wasm32-unknown-unknown --release
cargo test
soroban contract build
```

## 🔌 Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

Copy from `.env.example` files in each directory and customize as needed.

## 🧪 Testing the Full Flow

### Test Script (Pseudo-code)

1. **Create a creator:**
   ```bash
   curl http://localhost:3001/api/creators/alice
   ```

2. **Send a mock tip:**
   ```bash
   curl -X POST http://localhost:3001/api/tips \
     -H "Content-Type: application/json" \
     -d '{
       "tx_hash": "test_'$(date +%s)'",
       "amount": 5,
       "sender": "Test User",
       "creator_id": "creator_1"
     }'
   ```

3. **Check the activity feed:**
   ```bash
   curl http://localhost:3001/api/tips/creator_1 | jq
   ```

4. **Verify in the UI:**
   - Navigate to http://localhost:3000/alice
   - Refresh the page
   - New tip should appear in the feed

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

**Frontend (change port):**
```bash
PORT=3002 npm run dev
```

**Backend (change port):**
```bash
PORT=3002 npm run dev
```

Then update the `NEXT_PUBLIC_API_BASE` in the frontend.

### CORS Errors

Ensure the backend is running and the `CORS_ORIGIN` is set correctly:

```bash
curl http://localhost:3001/api/health
```

Should return `{ "status": "ok", "service": "cretip-backend" }`

### Module Not Found

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Soroban Issues

Install the latest Soroban CLI:

```bash
cargo install soroban-cli --locked
soroban --version
```

## 📚 Next Steps

1. **Connect real Stellar testnet wallet** (e.g., Freighter)
2. **Implement actual XLM transfer logic** in the contract
3. **Build creator onboarding flow**
4. **Add tip notification system**
5. **Deploy to Stellar testnet**

## 📖 Documentation

- [Stellar Docs](https://developers.stellar.org)
- [Soroban Docs](https://soroban.stellar.org)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com)

---

**Happy tipping! 💸**
