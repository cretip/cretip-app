# Cretip Stellar Wallet Setup Guide

## External Package Reference

**Important**: The wallet library we use is an external package published by Creit Tech (not related to Cretip).

**Package Name**: `@creit-tech/stellar-wallets-kit`

This is the official Stellar Wallets Kit available on npm. More info at [stellarwalletskit.dev](https://stellarwalletskit.dev/)

## Installation for Cretip

Run this command in the Cretip frontend directory:

```bash
cd cretip-app/frontend
npm install @creit-tech/stellar-wallets-kit
```

## After Installation

1. Restart your dev server:
```bash
npm run dev
```

2. Log in to your Cretip account and go to Dashboard

3. Click "Connect Wallet 💳" button

4. Modal appears with wallet options

5. Select Freighter, xBull, or Albedo

6. Approve in your wallet extension

7. Your Stellar wallet address appears in the button

## What Gets Installed

The `@creit-tech/stellar-wallets-kit` package includes:
- ✅ Wallet selection modal UI
- ✅ Support for Freighter, xBull, Albedo
- ✅ Stellar Testnet and Mainnet support
- ✅ CSS styles for the modal
- ✅ Default wallet modules

## Testing Requirements

Before testing Cretip wallet integration, set up:

1. **Install a wallet extension** (choose one):
   - [Freighter](https://www.freighter.app/) (Recommended)
   - [xBull](https://xbull.app/)
   - [Albedo](https://albedo.link/)

2. **Configure wallet for Stellar Testnet**
   - Open wallet settings
   - Switch network to "Stellar Testnet"

3. **Fund your testnet account** (optional)
   - Go to [Friendbot](https://developers.stellar.org/docs/reference/testnet-master-account/)
   - Paste your Stellar address
   - Fund with test XLM

## Cretip Features After Installation

✅ **Connect Wallet Button** (Dashboard only)
- Glowing cyan button: "Connect Wallet 💳"
- Click opens wallet selection modal
- Select wallet (Freighter, xBull, Albedo)

✅ **Connected Wallet Display**
- Button shows truncated address: "GBX7...4KL9 🟢"
- Green dot indicates active connection
- Click button to disconnect

✅ **Link Wallet to Profile**
- "Link Wallet" section on Cretip dashboard
- Link your connected wallet to your Cretip profile
- Wallet saved for receiving tips

## Troubleshooting

### "404 Not Found" Error
**Cause**: Wrong package name
**Solution**: Use `@creit-tech/stellar-wallets-kit` (exactly as shown)

### "Failed to initialize"
**Cause**: Package not installed
**Solution**: Run `npm install @creit-tech/stellar-wallets-kit`

### Modal doesn't appear
**Cause**: Wallet extension not installed
**Solution**: Install Freighter, xBull, or Albedo from links above

### "Network mismatch" error
**Cause**: Wallet set to wrong network
**Solution**: Set wallet to Stellar Testnet in extension settings

### Wallet connection rejected
**Cause**: User clicked "Cancel" in wallet
**Solution**: Try again and approve in the wallet extension

## Code References in Cretip

These Cretip files use the wallet library:

- `frontend/context/WalletContext.js` - Wallet state management
- `frontend/components/ConnectWalletButton.js` - Connect/disconnect UI
- `frontend/components/LinkWalletSection.js` - Link wallet to profile
- `frontend/app/dashboard/page.js` - Wallet button in dashboard
- `frontend/app/globals.css` - Wallet modal styles import

All reference: `@creit-tech/stellar-wallets-kit`

## Summary

**Cretip**: Our app for creator tipping on Stellar
**Wallet Library**: `@creit-tech/stellar-wallets-kit` (external package by Creit Tech)

They are separate projects:
- Cretip is your app
- The wallet kit is a third-party library we use in Cretip

## Installation Command (Copy/Paste Ready)

```bash
cd cretip-app/frontend && npm install @creit-tech/stellar-wallets-kit && npm run dev
```

Then log in to Cretip dashboard and test the wallet button!

---

**Note**: `@creit-tech/stellar-wallets-kit` is not related to Cretip - it's an external npm package published by Creit Tech for wallet integration with Stellar.
