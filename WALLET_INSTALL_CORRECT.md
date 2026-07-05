# Stellar Wallet Installation - Correct Package

## ✅ Correct Package Found

The correct package is: **`@creit-tech/stellar-wallets-kit`**

(Note: It's `creit-tech` with a hyphen, not `stellar`)

## Installation

Run this command in the frontend directory:

```bash
cd cretip-app/frontend
npm install @creit-tech/stellar-wallets-kit
```

## After Installation

1. Restart your dev server:
```bash
npm run dev
```

2. Go to Dashboard (must be logged in)

3. Click "Connect Wallet 💳"

4. Modal should appear with wallet options

5. Select Freighter, xBull, or Albedo

6. Approve in wallet extension

7. Your wallet address appears in the button

## What Gets Installed

This package includes:
- ✅ Wallet selection modal UI
- ✅ Support for Freighter, xBull, Albedo
- ✅ Stellar Testnet and Mainnet support
- ✅ CSS styles for the modal
- ✅ Default modules and utilities

## Testing Requirements

1. **Install wallet extension** (one of):
   - [Freighter](https://www.freighter.app/) (Recommended)
   - [xBull](https://xbull.app/)
   - [Albedo](https://albedo.link/)

2. **Set wallet to Stellar Testnet**
   - Open wallet settings
   - Switch to "Stellar Testnet"

3. **Fund testnet account** (optional)
   - Go to [Friendbot](https://developers.stellar.org/docs/reference/testnet-master-account/)
   - Paste your Stellar address
   - Fund with test XLM

## Features After Installation

✅ **Connect Wallet Button**
- Glowing cyan button: "Connect Wallet 💳"
- Click opens wallet selection modal
- User selects wallet (Freighter, xBull, Albedo)

✅ **Connected State**
- Button shows truncated address: "GBX7...4KL9 🟢"
- Green dot indicates active connection
- Click to disconnect

✅ **Profile Linking**
- Link Wallet section on dashboard
- Link connected wallet to profile
- Wallet saved for receiving tips

## Troubleshooting

### "404 Not Found" Error
**Cause**: Used wrong package name
**Solution**: Use `@creit-tech/stellar-wallets-kit` (with hyphen)

### "Failed to initialize"
**Cause**: Package not installed
**Solution**: Run `npm install @creit-tech/stellar-wallets-kit`

### Modal doesn't appear
**Cause**: Wallet extension not installed
**Solution**: Install Freighter, xBull, or Albedo

### "Network mismatch" error
**Cause**: Wallet set to wrong network
**Solution**: Set wallet to Stellar Testnet in extension settings

## Package Info

**Official Package**: [@creit-tech/stellar-wallets-kit](https://www.npmjs.com/package/@creit-tech/stellar-wallets-kit)

**GitHub**: [Creit-Tech/Stellar-Wallets-Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)

**Documentation**: [Stellar Wallets Kit Docs](https://stellarwalletskit.dev/)

**Supported Wallets**:
- Freighter (by Stellar Development Foundation)
- xBull (community wallet)
- Albedo (community wallet)

## Next Steps

1. ✅ Install: `npm install @creit-tech/stellar-wallets-kit`
2. ✅ Restart: `npm run dev`
3. ✅ Install wallet extension
4. ✅ Set to Testnet
5. ✅ Test "Connect Wallet" button

---

**That's it!** The wallet integration is now ready to use.
