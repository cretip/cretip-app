/**
 * Soroban Event Indexer
 * Automatically ingests tip events from Soroban contract
 * Falls back to mock events if network unavailable
 */

import { getIndexerState } from './indexer-state.js';
import { decodeContractEvent, validateDecodedEvent } from './xdr-decoder.js';
import { generateMockTipEvent } from './mock-events.js';

const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const SOROBAN_CONTRACT_ID = process.env.SOROBAN_CONTRACT_ID || '';
const POLL_INTERVAL = parseInt(process.env.INDEXER_POLL_INTERVAL || '12000'); // 12 seconds
const ENABLE_MOCK_MODE = process.env.ENABLE_MOCK_MODE !== 'false';

let indexerInterval = null;
let isRunning = false;

class SorobanIndexer {
  constructor(usersDb, tipsDb) {
    this.usersDb = usersDb;
    this.tipsDb = tipsDb;
    this.state = getIndexerState();
    this.mockEventCounter = 0;
  }

  /**
   * Start the indexer service
   */
  async start() {
    if (isRunning) {
      console.log('[Soroban Indexer] Already running');
      return;
    }

    isRunning = true;
    this.state.setStatus('running');
    console.log('[Soroban Indexer] Starting event indexer...');
    console.log(`[Soroban Indexer] Poll interval: ${POLL_INTERVAL}ms`);
    console.log(`[Soroban Indexer] Mock mode enabled: ${ENABLE_MOCK_MODE}`);

    // Start polling loop
    indexerInterval = setInterval(() => {
      this.poll().catch(err => {
        console.error('[Soroban Indexer] Poll error:', err.message);
      });
    }, POLL_INTERVAL);

    // Run first poll immediately
    await this.poll();
  }

  /**
   * Stop the indexer service
   */
  stop() {
    if (indexerInterval) {
      clearInterval(indexerInterval);
      indexerInterval = null;
    }
    isRunning = false;
    this.state.setStatus('paused');
    console.log('[Soroban Indexer] Stopped');
  }

  /**
   * Main polling loop
   */
  async poll() {
    try {
      const nextLedger = this.state.getNextLedger();
      const events = await this.fetchEvents(nextLedger);

      if (events && events.length > 0) {
        console.log(`[Soroban Indexer] Processing ${events.length} event(s) from ledger ${nextLedger}`);
        await this.processEvents(events);
      }
    } catch (error) {
      console.error('[Soroban Indexer] Poll error:', error.message);
      this.state.setStatus('error', error.message);

      // Fallback to mock events if real events fail
      if (ENABLE_MOCK_MODE) {
        console.log('[Soroban Indexer] Falling back to mock events...');
        await this.pollMockEvents();
      }
    }
  }

  /**
   * Fetch events from Soroban RPC
   * @param {number} startLedger - Starting ledger sequence
   * @returns {Promise<Array>} Array of events
   */
  async fetchEvents(startLedger) {
    if (!SOROBAN_CONTRACT_ID) {
      throw new Error('SOROBAN_CONTRACT_ID not configured');
    }

    try {
      // Simulate fetching from Soroban RPC
      // In production, use: SorobanRpc.Server.getEvents()
      const response = await fetch(`${SOROBAN_RPC_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getEvents',
          params: {
            startLedger,
            filters: [
              {
                type: 'contract',
                contractIds: [SOROBAN_CONTRACT_ID],
              },
            ],
          },
        }),
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`RPC error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }

      return data.result?.events || [];
    } catch (error) {
      console.error('[Soroban Indexer] Failed to fetch from RPC:', error.message);
      throw error;
    }
  }

  /**
   * Process fetched events
   * @param {Array} events - Raw events from RPC
   */
  async processEvents(events) {
    let processedCount = 0;
    let maxLedger = this.state.state.lastProcessedLedger;

    for (const event of events) {
      try {
        // Decode XDR event
        const decoded = decodeContractEvent(event);

        if (!decoded || !validateDecodedEvent(decoded)) {
          console.warn(`[Soroban Indexer] Invalid event structure:`, event);
          continue;
        }

        // Check for duplicates
        const isDuplicate = this.tipsDb.some(t => t.tx_hash === decoded.txHash);
        if (isDuplicate) {
          console.log(`[Soroban Indexer] Skipping duplicate tx: ${decoded.txHash}`);
          continue;
        }

        // Find user IDs by Stellar address
        const sender = this.findUserByStellarAddress(decoded.sender);
        const creator = this.findUserByStellarAddress(decoded.creator);

        if (!sender || !creator) {
          console.warn(
            `[Soroban Indexer] Could not resolve users for event. Sender: ${decoded.sender}, Creator: ${decoded.creator}`
          );
          continue;
        }

        // Create tip record
        const tipRecord = {
          id: `tip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          tx_hash: decoded.txHash,
          amount: decoded.amount,
          currency: 'USDC',
          sender: sender.id,
          creator_id: creator.id,
          timestamp: new Date(decoded.timestamp * 1000).toISOString(),
          verified: true,
          ledgerSequence: decoded.ledger,
          indexedAt: new Date().toISOString(),
        };

        // Insert into database
        this.tipsDb.push(tipRecord);

        // Update balances
        sender.balance -= decoded.amount;
        creator.balance += decoded.amount;

        console.log(
          `[Soroban Indexer] Ingested tip: ${decoded.amount} USDC from ${sender.username} to ${creator.username}`
        );

        processedCount++;
        this.state.recordEventProcessed();
        maxLedger = Math.max(maxLedger, decoded.ledger);
      } catch (error) {
        console.error('[Soroban Indexer] Error processing event:', error.message);
      }
    }

    // Update cursor
    if (processedCount > 0) {
      this.state.updateLedger(maxLedger);
    }

    console.log(
      `[Soroban Indexer] Processed ${processedCount}/${events.length} events. Cursor now at ledger ${this.state.state.lastProcessedLedger}`
    );
  }

  /**
   * Fallback: Poll mock events
   */
  async pollMockEvents() {
    try {
      this.mockEventCounter++;

      // Generate mock events periodically (every 5 polls = ~60 seconds)
      if (this.mockEventCounter % 5 === 0) {
        const mockEvent = generateMockTipEvent(this.usersDb, this.state.getNextLedger());

        if (mockEvent) {
          // Check for duplicate
          const isDuplicate = this.tipsDb.some(t => t.tx_hash === mockEvent.txHash);
          if (!isDuplicate) {
            // Create tip record from mock event
            const tipRecord = {
              id: `tip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
              tx_hash: mockEvent.txHash,
              amount: mockEvent.amount,
              currency: 'USDC',
              sender: mockEvent.sender,
              creator_id: mockEvent.creator_id,
              timestamp: new Date().toISOString(),
              verified: false, // Mock events not verified
              ledgerSequence: mockEvent.ledger,
              isMockEvent: true,
              indexedAt: new Date().toISOString(),
            };

            // Insert into database
            this.tipsDb.push(tipRecord);

            // Update balances
            const sender = this.usersDb.find(u => u.id === mockEvent.sender);
            const creator = this.usersDb.find(u => u.id === mockEvent.creator_id);

            if (sender && creator) {
              sender.balance -= mockEvent.amount;
              creator.balance += mockEvent.amount;

              console.log(
                `[Soroban Indexer] [MOCK] Generated tip: ${mockEvent.amount} USDC from ${sender.username} to ${creator.username}`
              );
            }

            this.state.updateLedger(mockEvent.ledger);
            this.state.recordEventProcessed();
          }
        }
      }
    } catch (error) {
      console.error('[Soroban Indexer] Mock event generation error:', error.message);
    }
  }

  /**
   * Find user by Stellar wallet address
   * @param {string} address - Stellar public key
   * @returns {Object|null} User object or null
   */
  findUserByStellarAddress(address) {
    return this.usersDb.find(u => u.stellar_wallet_address === address);
  }

  /**
   * Get indexer stats
   * @returns {Object} Stats object
   */
  getStats() {
    return this.state.getStats();
  }
}

export { SorobanIndexer };
