/**
 * XDR Event Decoder
 * Utilities for decoding Soroban contract events from XDR format
 */

/**
 * Decode a Soroban contract event into readable format
 * @param {Object} event - Raw event from Soroban RPC
 * @returns {Object|null} Decoded event or null if unable to decode
 */
function decodeContractEvent(event) {
  try {
    // Validate event structure
    if (!event || event.type !== 'contract') {
      return null;
    }

    // Extract basic event metadata
    const eventData = {
      ledger: event.ledger,
      txHash: event.txHash,
      contractId: event.contractId,
      eventName: decodeEventName(event.topic),
    };

    // Decode the event payload based on topic
    if (eventData.eventName === 'tip_sent' || eventData.eventName === 'transfer') {
      return decodeTipEvent(event, eventData);
    }

    return null; // Unknown event type
  } catch (error) {
    console.error('[XDR Decoder] Error decoding event:', error);
    return null;
  }
}

/**
 * Decode event name from base64 encoded topic
 * @param {Array} topics - Array of base64 encoded topic strings
 * @returns {string} Decoded event name
 */
function decodeEventName(topics) {
  if (!topics || topics.length === 0) {
    return 'unknown';
  }

  try {
    // First topic typically contains event name as base64
    const decoded = Buffer.from(topics[0], 'base64').toString('utf-8');
    return decoded;
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Decode a tip_sent event from Soroban
 * Event format: [sender: Address, creator: Address, amount: i128]
 * @param {Object} event - Raw event
 * @param {Object} eventData - Basic event data
 * @returns {Object} Decoded tip event
 */
function decodeTipEvent(event, eventData) {
  const { value } = event;

  if (!value || !Array.isArray(value) || value.length < 3) {
    return null; // Invalid event structure
  }

  // Parse addresses and amount from value array
  let sender, creator, amount;

  try {
    // Value[0]: Sender address (Stellar public key)
    sender = extractAddress(value[0]);

    // Value[1]: Creator address (Stellar public key)
    creator = extractAddress(value[1]);

    // Value[2]: Amount (could be i128 or direct number)
    amount = extractAmount(value[2]);

    if (!sender || !creator || !amount) {
      return null;
    }

    return {
      ...eventData,
      sender,
      creator,
      amount,
      timestamp: Math.floor(Date.now() / 1000),
    };
  } catch (error) {
    console.error('[XDR Decoder] Error decoding tip event values:', error);
    return null;
  }
}

/**
 * Extract Stellar address from decoded value
 * @param {*} value - Value from event (could be string, object, or buffer)
 * @returns {string|null} Stellar public key or null
 */
function extractAddress(value) {
  // If already a string and looks like Stellar address
  if (typeof value === 'string' && value.startsWith('G') && value.length === 56) {
    return value;
  }

  // If it's a buffer, convert to hex or base32
  if (Buffer.isBuffer(value)) {
    // Stellar addresses are typically base32 encoded
    // For now, assume it's already decoded to string
    return value.toString('utf-8').trim();
  }

  // If it's an object with a value property
  if (typeof value === 'object' && value.value) {
    return extractAddress(value.value);
  }

  return null;
}

/**
 * Extract amount from decoded value
 * Converts stroops to USDC (divide by 10^7)
 * @param {*} value - Amount value (could be string, number, or object)
 * @returns {number|null} Amount in USDC or null
 */
function extractAmount(value) {
  let amount = null;

  // If it's a direct number
  if (typeof value === 'number') {
    amount = value;
  }
  // If it's a string representation of a number
  else if (typeof value === 'string') {
    amount = parseInt(value, 10);
  }
  // If it's an object (XDR encoded i128)
  else if (typeof value === 'object' && value.value !== undefined) {
    amount = extractAmount(value.value);
  }

  if (amount === null) {
    return null;
  }

  // Convert from stroops to USDC (10^7 stroops = 1 USDC)
  // If amount is already in USDC format, no conversion needed
  // This assumes the contract already converts to readable units
  const STROOPS_PER_USDC = 10000000;
  const amountInUSDC = amount > 1000000 ? amount / STROOPS_PER_USDC : amount;

  return parseFloat(amountInUSDC.toFixed(2));
}

/**
 * Validate decoded event has required fields
 * @param {Object} decoded - Decoded event
 * @returns {boolean} True if valid
 */
function validateDecodedEvent(decoded) {
  return !!(
    decoded &&
    decoded.ledger &&
    decoded.txHash &&
    decoded.sender &&
    decoded.creator &&
    decoded.amount &&
    decoded.amount > 0
  );
}

export {
  decodeContractEvent,
  decodeEventName,
  decodeTipEvent,
  extractAddress,
  extractAmount,
  validateDecodedEvent,
};
