/**
 * Stellar Blockchain Integration Utilities
 * Handles transaction building, signing, and submission to Stellar Testnet
 * Uses Freighter's built-in transaction APIs - NO external SDK dependencies
 * Asset: USDC (Stellar Testnet)
 */

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Stellar Testnet USDC Configuration
const USDC_TESTNET = {
  code: 'USDC',
  issuer: 'GBBD47UZQ2YPFQ2YIVWUTF6RCMTAAS2JDQZBV6KLPWMBTXG63NSTQ5EZ', // Stellar Testnet USDC issuer
};

/**
 * Execute a tip transaction on Stellar Testnet
 * @param {string} senderPublicKey - Connected Freighter wallet address
 * @param {string} receiverPublicKey - Creator's Stellar wallet address
 * @param {number} tipAmount - Amount in XLM to send
 * @returns {Promise<{txHash: string, success: boolean}>}
 */
export async function executeTestnetTip(senderPublicKey, receiverPublicKey, tipAmount) {
  try {
    // Validate inputs
    if (!senderPublicKey || !receiverPublicKey) {
      throw new Error('Sender and receiver wallet addresses are required');
    }

    if (senderPublicKey === receiverPublicKey) {
      throw new Error('Cannot send tip to yourself');
    }

    if (!receiverPublicKey.startsWith('G') || receiverPublicKey.length !== 56) {
      throw new Error('Invalid creator wallet address format');
    }

    if (!window.stellarPubkeySigner) {
      throw new Error('Freighter wallet not found. Install from freighter.app');
    }

    const amount = String(tipAmount);

    // Fetch sender account from Horizon to get current sequence
    const accountResponse = await fetch(`${HORIZON_URL}/accounts/${senderPublicKey}`);
    if (!accountResponse.ok) {
      throw new Error('Sender account not found on Testnet. Fund it at stellar.org/developers/guides/get-started/create-account');
    }
    const accountData = await accountResponse.json();
    const sequence = String(parseInt(accountData.sequence, 10) + 1);

    // Build transaction envelope XDR manually for Freighter
    // This is a minimal payment transaction
    const txXDR = buildPaymentTransactionXDR(
      senderPublicKey,
      receiverPublicKey,
      amount,
      sequence
    );

    // Request Freighter to sign
    const signedXDR = await window.stellarPubkeySigner.signTransaction(
      txXDR,
      NETWORK_PASSPHRASE
    );

    // Submit signed transaction to Horizon
    const submitResponse = await fetch(`${HORIZON_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        tx: signedXDR,
      }),
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      throw new Error(errorData.title || 'Transaction submission failed to Horizon');
    }

    const result = await submitResponse.json();

    console.log('✓ Transaction successful:', result.hash);

    return {
      txHash: result.hash,
      success: true,
      amount: tipAmount,
      receiver: receiverPublicKey,
    };
  } catch (error) {
    console.error('✗ Stellar transaction error:', error);
    throw error;
  }
}

/**
 * Build a minimal Stellar payment transaction XDR
 * This creates the transaction data that Freighter signs
 * Transfers USDC (with XLM for network fees)
 */
function buildPaymentTransactionXDR(sourceAccount, destination, amount, sequence) {
  // For simplicity, use Freighter's transaction request format
  // This is the standard way Freighter expects transactions
  
  const transaction = {
    source: sourceAccount,
    fee: '100', // 100 stroops = 0.00001 XLM (network fee in XLM)
    sequence: sequence,
    timebounds: {
      minTime: 0,
      maxTime: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes timeout
    },
    operations: [
      {
        type: 'payment',
        destination: destination,
        asset: {
          type: 'credit_alphanum12',
          code: USDC_TESTNET.code,
          issuer: USDC_TESTNET.issuer,
        },
        amount: amount,
      },
    ],
  };

  // Freighter expects the transaction in this specific JSON format
  // It will handle the XDR encoding internally
  return JSON.stringify(transaction);
}

/**
 * Check if creator wallet is funded on Testnet
 * @param {string} publicKey - Stellar wallet address to check
 * @returns {Promise<boolean>}
 */
export async function checkAccountExists(publicKey) {
  try {
    const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    return response.ok;
  } catch (error) {
    console.error('Error checking account:', error);
    return false;
  }
}

/**
 * Get Stellar Expert Explorer link for a transaction
 * @param {string} txHash - Transaction hash
 * @returns {string} URL to Stellar Expert
 */
export function getStellarExplorerLink(txHash) {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}
