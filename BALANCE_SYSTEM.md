# Balance System & Tip Logic

## Overview

Cretip implements a balance system where users have account balances that are deducted when they send tips and credited when they receive tips. The logic lives entirely on the **backend** in the current implementation.

## Architecture

### Backend (Node.js/Express)
- Validates tip sender has sufficient balance
- Deducts amount from sender's balance
- Credits amount to creator's balance
- Returns updated balances in response

### Contract (Future Stellar Integration)
- Handles on-chain settlement (actual XLM transfers)
- Acts as source of truth for on-chain balances
- Enables withdrawals to real Stellar wallets

## Test Accounts

| Username | Password | Starting Balance | Type |
|----------|----------|-------------------|------|
| `alice` | `password123` | $1,000.00 | Creator |
| `bob` | `password123` | $500.00 | Fan |

New registered accounts start with **$100.00**.

## Balance Flow

### Sending a Tip

1. Fan selects creator and enters tip amount
2. Frontend sends POST `/api/tips` with sender ID, creator ID, and amount
3. Backend validates:
   - Sender exists
   - Creator exists and has `is_creator: true`
   - Amount > 0
   - **Sender balance >= tip amount** ✅
4. If valid:
   - Deduct `amount` from sender's balance
   - Add `amount` to creator's balance
   - Record tip in history
   - Return `senderBalance` and `creatorBalance` in response
5. Frontend updates user balance in localStorage
6. Header balance display reflects new amount

### Receiving a Tip

- Creator's balance automatically increases
- Next time creator logs in, they see updated balance
- Total amount raised = sum of all tips received

## Balance Display

### Header (All Pages)
- Shows current balance when logged in
- Can be hidden/shown with toggle button
- Persists in localStorage

### Dashboard (Fan View)
- Shows current balance in tip form label
- Updates immediately after sending tip

### API Responses

All authenticated endpoints return updated `balance`:

```json
{
  "success": true,
  "user": {
    "id": "user_2",
    "username": "bob",
    "balance": 490.00
  }
}
```

Tip endpoint returns both balances:

```json
{
  "success": true,
  "tip": { ... },
  "senderBalance": 490.00,
  "creatorBalance": 1010.00
}
```

## Error Handling

### Insufficient Balance
```json
{
  "error": "Insufficient balance. You have $490.00, but are trying to send $500.00"
}
```

### Invalid Amount
```json
{
  "error": "Tip amount must be greater than 0"
}
```

## Testing the Balance System

### Test Scenario 1: Valid Tip
```bash
# 1. Login as bob (fan with $500)
# Expected: balance = 500.00

# 2. Send $50 tip to alice
# Expected: 
#   - Bob's balance = 450.00
#   - Alice's balance = 1050.00

# 3. Send another $50 tip
# Expected:
#   - Bob's balance = 400.00
#   - Alice's balance = 1100.00
```

### Test Scenario 2: Insufficient Balance
```bash
# 1. Login as bob (balance = $400)

# 2. Try to send $500 tip
# Expected error: "Insufficient balance. You have $400.00..."
# Bob's balance remains $400.00
```

### Test Scenario 3: Creator Becomes Fan Again
```bash
# If a creator sends tips:
# 1. Their balance decreases when they send tips
# 2. Their balance increases when they receive tips
# Balance can go negative if they spend more than they have
```

## Current Limitations

- Balances are **in-memory** and reset on backend restart
- No persistence to database (use production database to persist)
- No on-chain settlement yet (Stellar contract integration coming)
- No withdrawal mechanism yet
- Admins can't adjust balances

## Future Enhancements

1. **Persistent Storage**: Save balances to database
2. **Stellar Integration**: Link real wallets and perform on-chain transfers
3. **Withdrawal System**: Allow creators to withdraw accumulated tips
4. **Transaction Fees**: Implement optional platform fees
5. **Dispute Resolution**: Handle failed transactions and refunds
6. **Rate Limiting**: Prevent rapid-fire tips
7. **Admin Panel**: Manage user balances and accounts

## Code References

### Backend Balance Logic
- `cretip-app/backend/src/server.js` - POST `/api/tips` endpoint (lines ~175-210)

### Frontend Balance Display
- `cretip-app/frontend/app/layout.js` - Header balance display (lines ~40-50)
- `cretip-app/frontend/app/dashboard/page.js` - Fan view balance display (lines ~205)

### API Documentation
- `cretip-app/API.md` - Complete endpoint reference with balance examples
