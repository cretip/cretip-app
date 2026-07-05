# 📡 Cretip API Reference

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### 🏥 Health Check

**GET** `/health`

Health check endpoint to verify the backend is running.

**Response**
```json
{
  "status": "ok",
  "service": "cretip-backend"
}
```

**Example**
```bash
curl http://localhost:3001/api/health
```

---

### 🔐 Authentication

#### Register

**POST** `/auth/register`

Create a new fan account.

**Request Body**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | string | yes | Unique username |
| password | string | yes | Password (plain text for testing) |

**Response (201 Created)**

```json
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "username": "newuser",
    "is_creator": false,
    "balance": 100.00
  }
}
```

---

#### Login

**POST** `/auth/login`

Authenticate and receive user data.

**Request Body**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | string | yes | Username |
| password | string | yes | Password |

**Response (200 OK)**

```json
{
  "success": true,
  "user": {
    "id": "user_1",
    "username": "alice",
    "is_creator": true,
    "creator_profile": { ... },
    "stellar_wallet_address": "GBXYZ...",
    "balance": 1000.00
  }
}
```

---

### 👤 User Management

#### Get User

**GET** `/user/:user_id`

Fetch user profile including balance.

**Response (200 OK)**

```json
{
  "id": "user_1",
  "username": "alice",
  "is_creator": true,
  "creator_profile": { ... },
  "stellar_wallet_address": "GBXYZ...",
  "balance": 1000.00
}
```

---

#### Activate Creator

**POST** `/user/activate-creator`

Convert a fan account to a creator account.

**Request Body**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| user_id | string | yes | User ID |
| url_slug | string | yes | Public profile URL |
| display_name | string | yes | Creator name |
| stellar_wallet_address | string | no | Wallet for receiving tips |
| bio | string | no | Creator bio |
| social_links | object | no | Social media links |
| category | string | no | Creator category |

**Response (200 OK)**

```json
{
  "success": true,
  "user": {
    "id": "user_2",
    "username": "bob",
    "is_creator": true,
    "creator_profile": { ... },
    "balance": 500.00
  }
}
```

---

### 👑 Get Creator Profile

**GET** `/creator/:url_slug`

Fetch a creator's public profile including their Stellar wallet address.

**Parameters**

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| url_slug | string | path | yes | Creator's URL slug (e.g., "alice") |

**Response (200 OK)**

```json
{
  "id": "user_1",
  "username": "alice",
  "creator_profile": {
    "url_slug": "alice",
    "display_name": "Alice Creator",
    "bio": "Digital artist & musician",
    "social_links": { ... },
    "category": "art"
  },
  "stellar_wallet_address": "GBXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890AB"
}
```

**Response (404 Not Found)**

```json
{
  "error": "Creator not found"
}
```

---

### 💸 Send a Tip

**POST** `/tips`

Send a tip from one user to a creator. **Automatically deducts from sender's balance and credits to creator's balance.**

**Request Body**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| tx_hash | string | yes | Transaction hash |
| amount | number | yes | Tip amount (must be > 0) |
| sender | string | yes | Sender user ID |
| creator_id | string | yes | Creator user ID |
| timestamp | string | no | ISO 8601 timestamp |

**Response (201 Created)**

```json
{
  "success": true,
  "tip": {
    "id": "tip_uuid",
    "tx_hash": "mock_tx_...",
    "amount": 10.00,
    "sender": "user_2",
    "creator_id": "user_1",
    "timestamp": "2026-07-01T12:30:00Z"
  },
  "senderBalance": 490.00,
  "creatorBalance": 1010.00
}
```

**Response (400 Bad Request)**

```json
{
  "error": "Insufficient balance. You have $490.00, but are trying to send $500.00"
}
```

or

```json
{
  "error": "Tip amount must be greater than 0"
}
```

**Response (404 Not Found)**

```json
{
  "error": "Sender not found"
}
```

---

### 🕒 Get Tip History

#### Tips Sent by User

**GET** `/tips/sent/:user_id`

Fetch all tips sent by a specific user, sorted by most recent first.

**Response (200 OK)**

```json
[
  {
    "id": "tip_1",
    "tx_hash": "mock_tx_...",
    "amount": 10.00,
    "sender": "user_2",
    "creator_id": "user_1",
    "timestamp": "2026-07-01T12:30:00Z"
  }
]
```

---

#### Tips Received by Creator

**GET** `/tips/received/:creator_id`

Fetch all tips received by a creator, sorted by most recent first.

**Response (200 OK)**

```json
[
  {
    "id": "tip_1",
    "tx_hash": "mock_tx_...",
    "amount": 10.00,
    "sender": "user_2",
    "creator_id": "user_1",
    "timestamp": "2026-07-01T12:30:00Z"
  }
]
```

---

## Default Test Accounts

| ID | Username | Role | Password | Starting Balance | Wallet |
|-------|----------|------|----------|-------------------|--------|
| `user_1` | alice | Creator | `password123` | $1,000.00 | `GBXYZ...` |
| `user_2` | bob | Fan | `password123` | $500.00 | N/A (not set) |

New registered accounts start with $100.00 balance.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Missing required fields | Request body incomplete |
| 404 | Creator not found | Creator doesn't exist |
| 500 | Internal server error | Server error |

---

## Testing the API

### Using curl

```bash
# 1. Check health
curl http://localhost:3001/api/health

# 2. Get creator
curl http://localhost:3001/api/creators/alice

# 3. Send a tip
curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "test_tx_'$(date +%s)'",
    "amount": 5,
    "creator_id": "creator_1"
  }'

# 4. View tip history
curl http://localhost:3001/api/tips/creator_1 | jq
```

### Using JavaScript/Node.js

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// Get creator
const creator = await axios.get(`${API_BASE}/creators/alice`);
console.log(creator.data);

// Send tip
const response = await axios.post(`${API_BASE}/tips`, {
  tx_hash: 'mock_tx_' + Date.now(),
  amount: 10,
  sender: 'John',
  creator_id: 'creator_1'
});
console.log(response.data);

// Get tips
const tips = await axios.get(`${API_BASE}/tips/creator_1`);
console.log(tips.data);
```

### Using Python

```python
import requests
import time

API_BASE = "http://localhost:3001/api"

# Get creator
creator = requests.get(f"{API_BASE}/creators/alice").json()
print(creator)

# Send tip
tip = {
    "tx_hash": f"mock_tx_{int(time.time())}",
    "amount": 10,
    "sender": "John",
    "creator_id": "creator_1"
}
response = requests.post(f"{API_BASE}/tips", json=tip)
print(response.json())

# Get tips
tips = requests.get(f"{API_BASE}/tips/creator_1").json()
print(tips)
```

---

## Rate Limiting

Currently not implemented (development mode). Production deployments should implement rate limiting.

## CORS

CORS is enabled for `http://localhost:3000` (the frontend).

## Authentication

Not required for this prototype. Production deployments should implement Stellar wallet authentication.

---

For more information, see [SETUP.md](./SETUP.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)


---

## Creator Search

**GET** `/creators/search`

Search for creators by username or display name. Returns up to 10 results.

**Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| query | string | yes | Search term (username or display name) |

**Response (200 OK)**

```json
[
  {
    "id": "user_1",
    "username": "alice",
    "display_name": "Alice Creator",
    "url_slug": "alice",
    "category": "art"
  }
]
```

**Response (200 OK - No Results)**

```json
[]
```

**Example**

```bash
# Search for creators named alice
curl "http://localhost:3001/api/creators/search?query=alice"

# Search by display name
curl "http://localhost:3001/api/creators/search?query=Artist"

# JavaScript
const response = await axios.get(`${API_BASE}/creators/search`, {
  params: { query: 'alice' }
});
```

