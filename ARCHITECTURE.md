# 🏗️ Cretip Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│                  (http://localhost:3000)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
┌──────────────────┐        ┌──────────────────┐
│   FRONTEND       │        │    BACKEND       │
│  (Next.js)       │        │  (Express)       │
│  Port: 3000      │        │  Port: 3001      │
├──────────────────┤        ├──────────────────┤
│• Creator pages   │        │• Creator DB      │
│• Tip UI          │        │• Tip logs        │
│• Activity feed   │        │• API handlers    │
│• Wallet mock     │        │• CORS enabled    │
└──────────────────┘        └──────────────────┘
                                     │
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
            ┌──────────────────┐         ┌──────────────────┐
            │  IN-MEMORY DB    │         │   STELLAR        │
            │  (Arrays/JSON)   │         │  TESTNET         │
            ├──────────────────┤         │  (Future)        │
            │• creators[]      │         ├──────────────────┤
            │• tips[]          │         │• Mainnet: XLM    │
            │• Persists        │         │• Signed txs      │
            │  in process      │         │• Native assets   │
            └──────────────────┘         └──────────────────┘
                                                │
                                                │
                                                ▼
                                        ┌──────────────────┐
                                        │  SOROBAN         │
                                        │  CONTRACT        │
                                        │  (Rust)          │
                                        ├──────────────────┤
                                        │• tip_creator()   │
                                        │• XLM transfers   │
                                        │• Balance checks  │
                                        └──────────────────┘
```

## 📁 Project Structure

```
cretip-app/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   └── server.js          # Main Express server
│   ├── package.json           # Backend dependencies
│   ├── .eslintrc.json         # Linting config
│   └── .env.example           # Environment template
│
├── frontend/                   # Next.js React UI
│   ├── app/
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Homepage
│   │   ├── globals.css        # Global styles
│   │   └── [username]/        # Dynamic creator routes
│   │       └── page.js        # Creator profile page
│   ├── components/
│   │   ├── TipCard.js         # Tipping interface
│   │   └── ActivityFeed.js    # Recent tips display
│   ├── tailwind.config.js     # Tailwind theming
│   ├── next.config.js         # Next.js config
│   ├── postcss.config.js      # PostCSS for Tailwind
│   ├── package.json           # Frontend dependencies
│   ├── .eslintrc.json         # Linting config
│   └── .env.example           # Environment template
│
├── contract/                   # Soroban Rust Contract
│   ├── src/
│   │   └── lib.rs             # Smart contract code
│   ├── Cargo.toml             # Rust dependencies
│   └── target/                # Build output (ignored)
│
├── package.json               # Monorepo root scripts
├── README.md                  # Project overview
├── SETUP.md                   # Detailed setup guide
├── ARCHITECTURE.md            # This file
├── QUICKSTART.sh              # Linux/Mac setup script
├── QUICKSTART.bat             # Windows setup script
├── .gitignore                 # Monorepo ignore rules
└── LICENSE                    # MIT License
```

## 🔄 Data Flow

### 1. Creator Profile Load

```
User visits /alice
    ↓
Frontend queries GET /api/creators/alice
    ↓
Backend looks up creator in creators[]
    ↓
Returns creator object with wallet address
    ↓
Frontend displays profile + bio
```

### 2. Tip Process

```
User clicks "Send Tip"
    ↓
User selects amount ($2, $5, $10, or custom)
    ↓
Frontend generates mock transaction hash
    ↓
Frontend POSTs to POST /api/tips with:
  - tx_hash (mock)
  - amount
  - sender (optional)
  - creator_id
  - timestamp
    ↓
Backend validates creator exists
    ↓
Backend creates tip record in tips[]
    ↓
Frontend receives success response
    ↓
Frontend updates activity feed in real-time
    ↓
User sees tip appear in activity feed
```

### 3. Activity Feed Update

```
User views creator profile
    ↓
Frontend queries GET /api/tips/creator_1
    ↓
Backend filters tips[] by creator_id
    ↓
Returns sorted by timestamp (newest first)
    ↓
Frontend renders tip cards with:
  - Sender name
  - Amount
  - Time ago
  - Transaction hash (first 16 chars)
    ↓
On new tip, feed auto-refreshes
```

## 🎨 UI/UX Architecture

### Design System

- **Color Palette:**
  - Dark Background: `#0F172A`
  - Electric Cyan: `#00F0FF`
  - Neon Purple: `#9D4EDD`
  - Bright Emerald: `#10B981` (success)

- **Components:**
  - Cards with subtle glow effects
  - Emoji-based iconography (no extra libraries)
  - Responsive grid layout (mobile → desktop)
  - Dark mode by default

### Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.js` | Homepage with creator showcase |
| `/[username]` | `app/[username]/page.js` | Creator profile + tipping |
| N/A | `TipCard.js` | Tipping interface (sticky) |
| N/A | `ActivityFeed.js` | Recent tips display |

## 🔌 API Endpoints

### REST API (http://localhost:3001/api)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/creators/:username` | Fetch creator profile |
| POST | `/tips` | Log a tip event |
| GET | `/tips/:creator_id` | Fetch tip history |

### Request/Response Examples

**GET /creators/:username**
```json
Response 200:
{
  "id": "creator_1",
  "username": "alice",
  "display_name": "Alice Creator",
  "stellar_wallet_address": "GBXYZ...",
  "bio": "Digital artist & musician 🎨🎵"
}
```

**POST /tips**
```json
Request:
{
  "tx_hash": "mock_tx_abc123def456",
  "amount": 10,
  "sender": "Fan Name",
  "creator_id": "creator_1",
  "timestamp": "2026-07-01T12:30:00Z"
}

Response 201:
{
  "success": true,
  "tip": {
    "id": "tip_1",
    "tx_hash": "mock_tx_abc123def456",
    "amount": 10,
    "sender": "Fan Name",
    "creator_id": "creator_1",
    "timestamp": "2026-07-01T12:30:00Z"
  }
}
```

**GET /tips/:creator_id**
```json
Response 200:
[
  {
    "id": "tip_1",
    "tx_hash": "mock_tx_...",
    "amount": 10,
    "sender": "Fan Name",
    "creator_id": "creator_1",
    "timestamp": "2026-07-01T12:30:00Z"
  }
]
```

## 🧠 State Management

### Frontend State

- **Local State:** React `useState` for form inputs, loading states
- **Server State:** Creator profile and tips fetched via axios
- **Mock Wallet:** Simple boolean flag (`walletConnected`)

### Backend State

- **In-Memory Database:**
  - `creators[]`: Hardcoded creator profiles
  - `tips[]`: Tip records (persists in process memory)
  - Resets on server restart

## 🔒 Security Considerations

### Current (Prototype)

- ✅ CORS enabled for local development
- ✅ Mock wallet signing (non-production)
- ✅ No authentication required
- ✅ No database persistence

### Future (Production)

- 🔲 Stellar wallet authentication
- 🔲 JWT or session tokens
- 🔲 Database persistence (PostgreSQL)
- 🔲 Rate limiting
- 🔲 Input validation & sanitization
- 🔲 Real smart contract integration

## 🚀 Deployment Targets

### Local Development

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Contract: None (CLI only)

### Stellar Testnet (Future)

- Deploy contract to testnet
- Connect Freighter wallet
- Real XLM transfers
- Public API hosting

### Mainnet (Later)

- Production-grade backend
- Database persistence
- Stellar mainnet deployment
- Monitoring & logging

## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js, React 18, Tailwind CSS | UI/UX |
| Backend | Node.js, Express, axios | API |
| Contract | Soroban (Rust), wasm32 | Smart contract |
| Database | In-memory (soon: PostgreSQL) | Data persistence |
| Network | Stellar Testnet | Blockchain |

## 🔗 External Dependencies

### Frontend
- `react`: UI library
- `next`: React framework
- `axios`: HTTP client
- `tailwindcss`: CSS framework

### Backend
- `express`: Web framework
- `cors`: CORS middleware
- `uuid`: ID generation

### Contract
- `soroban-sdk`: Smart contract library
- `cargo`: Rust package manager

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)
