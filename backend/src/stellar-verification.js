/**
 * Stellar Transaction Verification Module
 * Handles on-chain verification of Stellar USDC transactions with fallback mode
 */

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const USDC_ISSUER = process.env.STELLAR_USDC_ISSUER || 'GBBD47UZQ2YPFQ2YIVWUTF6RCMTAAS2JDQZBV6KLPWMBTXG63NSTQ5EZ';
const FALLBACK_MODE = !process.env.STELLAR_HORIZON_URL; // Enable fallback if URL not set

/**
 * Fetch transaction details from Stellar Testnet
 * @param {string} txHash - Transaction hash to verify
 * @returns {Promise<Object|null>} Transaction object or null if not found
 */
async function fetchStellarTransaction(txHash) {
  try {
    const response = await fetch(`${HORIZON_URL}/transactions/${txHash}`, {
      timeout: 5000,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Transaction not found
      }
      throw new Error(`Horizon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch transaction from Stellar: ${error.message}`);
  }
}

/**
 * Extract payment operations from transaction
 * @param {Object} tx - Transaction object from Horizon
 * @returns {Array} Array of payment operations
 */
function extractPaymentOperations(tx) {
  if (!tx._embedded || !tx._embedded.operations) {
    return [];
  }

  return tx._embedded.operations.filter(op => op.type === 'payment');
}

/**
 * Verify a Stellar USDC transaction
 * @param {string} txHash - Transaction hash
 * @param {string} senderAddress - Expected sender address
 * @param {string} receiverAddress - Expected receiver address
 * @param {number} amount - Expected amount in USDC
 * @returns {Promise<Object>} { isValid: boolean, error?: string }
 */
async function verifyStellarTransaction(txHash, senderAddress, receiverAddress, amount) {
  // Validate inputs
  if (!txHash || typeof txHash !== 'string') {
    return { isValid: false, error: 'Invalid transaction hash' };
  }

  if (!senderAddress || typeof senderAddress !== 'string') {
    return { isValid: false, error: 'Invalid sender address' };
  }

  if (!receiverAddress || typeof receiverAddress !== 'string') {
    return { isValid: false, error: 'Invalid receiver address' };
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return { isValid: false, error: 'Invalid amount' };
  }

  // Fallback mode for contributors without network access
  if (FALLBACK_MODE) {
    console.warn(
      '[FALLBACK MODE] Stellar verification disabled. Set STELLAR_HORIZON_URL to enable on-chain verification.',
      { txHash, senderAddress, receiverAddress, amount }
    );
    return { isValid: true, fallbackMode: true };
  }

  try {
    const tx = await fetchStellarTransaction(txHash);

    if (!tx) {
      return { isValid: false, error: 'Transaction not found on Stellar Testnet' };
    }

    // Verify transaction source account (sender)
    if (tx.source_account !== senderAddress) {
      return {
        isValid: false,
        error: `Sender mismatch. Expected ${senderAddress}, got ${tx.source_account}`,
      };
    }

    // Extract and verify payment operations
    const paymentOps = extractPaymentOperations(tx);

    if (paymentOps.length === 0) {
      return { isValid: false, error: 'No payment operations found in transaction' };
    }

    // Find matching payment to receiver
    const matchingPayment = paymentOps.find(
      op =>
        op.to === receiverAddress &&
        (op.asset_type === 'credit_alphanum12' || op.asset_type === 'credit_alphanum4') &&
        op.asset_issuer === USDC_ISSUER &&
        parseFloat(op.amount) === amount
    );

    if (!matchingPayment) {
      return {
        isValid: false,
        error: `No matching USDC payment found. Expected ${amount} USDC to ${receiverAddress}`,
      };
    }

    // Verify transaction was successful
    if (tx.result_code !== 'tx_success') {
      return { isValid: false, error: `Transaction failed with result code: ${tx.result_code}` };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Verification failed: ${error.message}` };
  }
}

/**
 * Check if tx_hash already exists in database
 * @param {string} txHash - Transaction hash to check
 * @param {Array} tipsDatabase - Tips array from database
 * @returns {boolean} True if tx_hash exists
 */
function isTransactionDuplicate(txHash, tipsDatabase) {
  return tipsDatabase.some(tip => tip.tx_hash === txHash);
}

export {
  verifyStellarTransaction,
  isTransactionDuplicate,
  FALLBACK_MODE,
  HORIZON_URL,
  USDC_ISSUER,
};
