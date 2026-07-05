# Cretip - Stellar Blockchain Integration Guide

## Overview
Cretip now supports real on-chain payments using the Stellar Testnet network. Users can connect their Freighter wallet and send actual USDC (Stellar's wrapped USD Coin) to creators, with network fees paid in native XLM.

## Technical Architecture

### Components
- **WalletContext** (`frontend/context/WalletContext.js`) - Manages Freighter wallet connection
- **stellar.js** (`frontend/lib/stellar.js`) - Handles blockchain transactions with USDC asset
- **Dashboard** (`frontend/app/dashboard/page.js`) - Integrates payment flow

### Transaction Flow
1. User connects Freighter wallet → stores public key
2. User selects creator and enters tip amount in USDC
3. App builds Stellar transaction (USDC transfer to creator's wallet)
4. Network fee paid in XLM (0.00001 XLM = 100 stroops)
5. Freighter signs the transaction
6. Transaction submitted to Stellar Testnet Horizon
7. Transaction hash recorded in backend database with "USDC" currency
8. Success message with link to Stellar Expert Explorer

## Setup Instructions

### Prerequisites
1. **Install Freighter** - Download from [freighter.app](https://www.freighter.app/)
2. **Set Freighter to Testnet** 
   - Open Freighter extension
   - Settings → Network → Select "Stellar Testnet"
3. **Fund Your Wallet**
   - Go to [Stellar Friendbot](https://stellar.org/developers/guides/get-started/create-account)
   - Enter your Freighter public key
   - Receive 10,000 test XLM (for network fees and initial balance)

### Creator Setup
Creators must:
1. Activate creator profile from dashboard
2. Connect Freighter wallet
3. Link wallet address to profile via "Link Connected Wallet to Profile" button
4. Fund their wallet with test XLM from Friendbot
5. Add USDC trustline (Freighter will prompt when receiving first USDC tip)

## Testing the Flow

### Test Account Setup
```bash
# Backend test accounts (already pre-seeded)
alice (creator):
  - Username: alice
  - Password: password123
  - Balance: $1000 USDC

bob (fan):
  - Username: bob
  - Password: password123
  - Balance: $500 USDC
```

### Test Scenario
1. **Create Stellar Wallets**
   - Use Freighter to generate 2 test wallets (one for alice, one for bob)
   - Fund both with Friendbot (10,000 test XLM each - for fees and initial balance)
   - Freighter will automatically add USDC trustline when receiving first USDC

2. **Setup Creators**
   - Log in as alice
   - Activate creator profile
   - Connect Freighter (different wallet from bob)
   - Link wallet to profile

3. **Send a Tip in USDC**
   - Log in as bob
   - Go to Dashboard
   - Connect Freighter (bob's wallet)
   - Search for and select "alice"
   - Enter tip amount in USDC (e.g., 5 USDC)
   - Click "Send Tip"
   - Approve transaction in Freighter
   - Network fee automatically deducted in XLM
   - View transaction on Stellar Expert

## API Endpoints

### POST /api/tips
Records a completed tip transaction in USDC

**Request:**
```json
{
  "tx_hash": "abc123...",
  "amount": 5,
  "sender": "user_id_bob",
  "creator_id": "user_id_alice",
  "currency": "USDC",
  "timestamp": "2026-07-05T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "tip": {
    "id": "tip_123",
    "tx_hash": "abc123...",
    "amount": 5,
    "currency": "USDC",
    "sender": "user_id_bob",
    "creator_id": "user_id_alice",
    "timestamp": "2026-07-05T12:00:00Z"
  },
  "senderBalance": 495,
  "creatorBalance": 1005
}
```

## Stellar Network Details

### Testnet Configuration
- **Network**: Stellar Test Network
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Horizon Server**: `https://horizon-testnet.stellar.org`
- **Base Fee**: 100 stroops (0.00001 XLM) - paid for each operation
- **Asset**: USDC (Circle's USD Coin on Stellar)
- **Asset Issuer (Testnet)**: `GBBD47UZQ2YPFQ2YIVWUTF6RCMTAAS2JDQZBV6KLPWMBTXG63NSTQ5EZ`

### Payment Details
- **Payment Asset**: USDC (Credit Alphanum12 token)
- **Amount**: User-specified in USDC (validated on frontend and backend)
- **Destination**: Creator's Stellar wallet address
- **Network Fee**: 0.00001 XLM per operation (automatically deducted in XLM, not USDC)
- **Timeout**: 30 seconds
- **Trustline**: Recipients must have USDC trustline (Freighter handles automatically)

### Explorer Links
- **Stellar Expert**: `https://stellar.expert/explorer/testnet/tx/{tx_hash}`
- **Stellar Dashboard**: `https://stellar.org/developers/dashboard`

## Error Handling

### Common Errors

**"Freighter wallet not found"**
- Solution: Install Freighter extension from freighter.app
- Verify it's enabled in your browser

**"Please set your wallet to Stellar Testnet"**
- Solution: Open Freighter → Settings → Network → Select "Stellar Testnet"

**"Creator wallet is not funded on Stellar Testnet yet"**
- Solution: Creator needs to fund their wallet via Stellar Friendbot
- Go to stellar.org/developers/guides/get-started/create-account
- Enter creator's public key
- Receive 10,000 test XLM

**"Insufficient balance"**
- Solution: Fund wallet with test XLM via Friendbot (for network fees)
- Verify you have USDC balance for the tip amount

**"Invalid creator wallet address"**
- Solution: Creator must link their Freighter wallet to their profile
- Creator goes to dashboard and clicks "Link Connected Wallet to Profile"

**"USDC trustline not found"**
- Solution: Freighter will prompt to add USDC trustline on first transaction
- This is automatic and required for receiving USDC

## Monitoring & Debugging

### Browser Console
Open browser DevTools (F12) and check Console tab for:
- Wallet connection status
- Transaction building status
- Freighter signing requests
- Horizon API responses
- Error messages

### Example Console Output
```javascript
// Successful wallet connection
Wallet connected: GXXX...YYY

// Successful transaction
✓ Transaction successful: abc123xyz789...
```

## Security Notes

⚠️ **Important**: This is Testnet only
- All USDC used are test tokens (no real value)
- All XLM used are test tokens (no real value)
- Never use mainnet without thorough security audit
- Freighter handles key management securely
- Transactions are signed client-side by Freighter
- Network fees are nominal (0.00001 XLM)

## Future Enhancements

- [ ] Mainnet support with security audit
- [ ] Multiple stablecoin support (USDC, EURC, etc.)
- [ ] Transaction history with on-chain verification
- [ ] Gas optimization for lower fees
- [ ] Batch payment processing
- [ ] Escrow/dispute resolution system
- [ ] Real-time exchange rate display

## Resources

- [Stellar Docs](https://developers.stellar.org/)
- [Freighter Docs](https://developers.stellar.org/docs/wallets/freighter)
- [Horizon API Reference](https://developers.stellar.org/api/introduction/index.html)
- [Stellar Expert Explorer](https://stellar.expert/)
- [USDC on Stellar](https://www.circle.com/en/usdc/stellar)
