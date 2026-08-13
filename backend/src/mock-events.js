/**
 * Mock Events Generator
 * Generates synthetic tipping events for local development and fallback scenarios
 */

const PRESET_AMOUNTS = [2, 5, 10, 15, 25];

/**
 * Generate a mock tip event
 * @param {Array} users - Array of user objects from database
 * @param {number} currentLedger - Current ledger sequence
 * @returns {Object|null} Mock event or null if insufficient users
 */
function generateMockTipEvent(users, currentLedger) {
  // Need at least one creator and one fan
  const creators = users.filter(u => u.is_creator);
  const fans = users.filter(u => !u.is_creator);

  if (creators.length === 0 || fans.length === 0) {
    return null; // Not enough users to generate a mock event
  }

  const randomCreator = creators[Math.floor(Math.random() * creators.length)];
  const randomFan = fans[Math.floor(Math.random() * fans.length)];
  const randomAmount = PRESET_AMOUNTS[Math.floor(Math.random() * PRESET_AMOUNTS.length)];

  return {
    type: 'contract',
    ledger: currentLedger,
    txHash: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    contractId: process.env.SOROBAN_CONTRACT_ID || 'MOCK_CONTRACT',
    topic: ['dGlwX3NlbnQ='], // Base64: 'tip_sent'
    value: [
      randomFan.stellar_wallet_address || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HV5E',
      randomCreator.stellar_wallet_address || 'GBXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890AB',
      randomAmount,
    ],
    sender: randomFan.id,
    creator_id: randomCreator.id,
    amount: randomAmount,
    isMockEvent: true,
  };
}

/**
 * Create mock events in batch for testing
 * @param {Array} users - Array of user objects
 * @param {number} count - Number of events to generate
 * @param {number} startLedger - Starting ledger number
 * @returns {Array} Array of mock events
 */
function generateMockEventBatch(users, count = 3, startLedger = 1000) {
  const events = [];
  for (let i = 0; i < count; i++) {
    const event = generateMockTipEvent(users, startLedger + i);
    if (event) {
      events.push(event);
    }
  }
  return events;
}

export { generateMockTipEvent, generateMockEventBatch };
