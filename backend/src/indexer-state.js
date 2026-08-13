/**
 * Indexer State Manager
 * Tracks cursor position and indexer status in memory
 * In production, this would be persisted to a database
 */

class IndexerState {
  constructor() {
    this.state = {
      id: 'soroban_indexer',
      lastProcessedLedger: process.env.SOROBAN_START_LEDGER ? parseInt(process.env.SOROBAN_START_LEDGER) : 0,
      lastProcessedTimestamp: new Date().toISOString(),
      contractId: process.env.SOROBAN_CONTRACT_ID || '',
      status: 'initialized', // 'initialized', 'running', 'paused', 'error'
      errorMessage: null,
      processedEventCount: 0,
      lastEventTimestamp: null,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get current indexer state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update the last processed ledger
   * @param {number} ledger - Ledger sequence number
   */
  updateLedger(ledger) {
    this.state.lastProcessedLedger = ledger;
    this.state.lastProcessedTimestamp = new Date().toISOString();
    this.state.updatedAt = new Date().toISOString();
  }

  /**
   * Mark an event as processed
   */
  recordEventProcessed() {
    this.state.processedEventCount++;
    this.state.lastEventTimestamp = new Date().toISOString();
    this.state.updatedAt = new Date().toISOString();
  }

  /**
   * Set indexer status
   * @param {string} status - 'running', 'paused', 'error'
   * @param {string|null} errorMessage - Error message if status is 'error'
   */
  setStatus(status, errorMessage = null) {
    this.state.status = status;
    this.state.errorMessage = errorMessage;
    this.state.updatedAt = new Date().toISOString();
  }

  /**
   * Get next ledger to process
   * @returns {number} Next ledger sequence
   */
  getNextLedger() {
    return this.state.lastProcessedLedger + 1;
  }

  /**
   * Reset to initial state (useful for testing)
   */
  reset() {
    this.state.lastProcessedLedger = 0;
    this.state.processedEventCount = 0;
    this.state.errorMessage = null;
    this.state.status = 'initialized';
    this.state.updatedAt = new Date().toISOString();
  }

  /**
   * Get stats summary
   * @returns {Object} Stats object
   */
  getStats() {
    return {
      ledger: this.state.lastProcessedLedger,
      eventsProcessed: this.state.processedEventCount,
      status: this.state.status,
      lastUpdated: this.state.updatedAt,
    };
  }
}

// Singleton instance
let indexerStateInstance = null;

/**
 * Get or create indexer state instance
 * @returns {IndexerState} Indexer state instance
 */
function getIndexerState() {
  if (!indexerStateInstance) {
    indexerStateInstance = new IndexerState();
  }
  return indexerStateInstance;
}

export { IndexerState, getIndexerState };
