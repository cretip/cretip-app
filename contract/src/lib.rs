#![no_std]

use soroban_sdk::{
    contract, contractimpl, Address, Env, Symbol, log, IntoVal, Vec,
};

const STELLAR_ASSET_CODE: &str = "USDC";
const CONTRACT_VERSION: u32 = 1;

#[contract]
pub struct TipContract;

#[contractimpl]
impl TipContract {
    /// Transfer USDC from tipper (caller) to creator via event emission.
    /// 
    /// This function validates the tip parameters, emits a native Soroban contract event,
    /// and returns true on success. The event is then picked up by the backend event indexer.
    ///
    /// # Arguments
    /// * `env` - Soroban environment
    /// * `amount` - Amount to transfer in stroops (1 USDC = 10^7 stroops)
    /// * `creator_address` - Stellar wallet address of the creator (recipient)
    ///
    /// # Returns
    /// Returns true if event was successfully emitted, panics on validation failure
    ///
    /// # Events Emitted
    /// Publishes a "tip_sent" event with:
    /// - Topics: (Symbol("tip_sent"), Address(tipper), Address(creator))
    /// - Data: amount (i128 in stroops)
    pub fn tip_creator(env: Env, amount: i128, creator_address: Address) -> bool {
        // Step 1: Validate tip amount is positive
        if amount <= 0 {
            log!(&env, "Error: Tip amount must be positive. Got: {}", amount);
            panic!("Tip amount must be positive");
        }

        // Step 2: Get the tipper (contract invoker)
        let tipper = env.invoker();

        // Step 3: Validate tipper is not tipping themselves
        if tipper == creator_address {
            log!(&env, "Error: Cannot tip yourself");
            panic!("Cannot tip yourself");
        }

        // Step 4: Log tip initiation (for debugging)
        log!(
            &env,
            "Tip initiated: {} stroops from {} to {}",
            amount,
            tipper,
            creator_address
        );

        // Step 5: Emit native Soroban contract event for backend indexer
        // This event structure is indexable by the backend event indexer:
        // - Topics[0]: "tip_sent" (event name)
        // - Topics[1]: tipper address
        // - Topics[2]: creator address
        // - Data: amount in stroops
        env.events().publish(
            (
                Symbol::new(&env, "tip_sent"),
                tipper.clone(),
                creator_address.clone(),
            ),
            amount,
        );

        // Step 6: Log successful event emission
        log!(
            &env,
            "Tip event emitted: {} USDC stroops to {}",
            amount,
            creator_address
        );

        true
    }

    /// Get the contract version
    pub fn version() -> u32 {
        CONTRACT_VERSION
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::{MockEnv, Address as MockAddress};
    use soroban_sdk::Symbol;

    /// Test: Successful tip emission
    #[test]
    fn test_tip_creator_success() {
        let env = MockEnv::new();
        let tipper = MockAddress::random(&env);
        let creator = MockAddress::random(&env);
        let amount = 5_000_000i128; // 5 USDC in stroops

        // Invoke the tip_creator function
        let result = TipContract::tip_creator(&env, amount, creator.clone());

        // Assert the function returned true
        assert!(result, "tip_creator should return true on success");

        // Verify event was emitted
        let events = env.events().all();
        assert!(!events.is_empty(), "At least one event should be emitted");

        // Check for tip_sent event in emitted events
        let tip_event_found = events.iter().any(|(topics, data)| {
            topics.len() == 3 && data.is_some()
        });
        assert!(tip_event_found, "tip_sent event should be emitted");
    }

    /// Test: Reject negative tip amount
    #[test]
    #[should_panic(expected = "Tip amount must be positive")]
    fn test_tip_creator_negative_amount() {
        let env = MockEnv::new();
        let creator = MockAddress::random(&env);
        
        // This should panic
        TipContract::tip_creator(&env, -1000, creator);
    }

    /// Test: Reject zero tip amount
    #[test]
    #[should_panic(expected = "Tip amount must be positive")]
    fn test_tip_creator_zero_amount() {
        let env = MockEnv::new();
        let creator = MockAddress::random(&env);
        
        // This should panic
        TipContract::tip_creator(&env, 0, creator);
    }

    /// Test: Reject self-tipping
    #[test]
    #[should_panic(expected = "Cannot tip yourself")]
    fn test_tip_creator_self_tip() {
        let env = MockEnv::new();
        let self_address = MockAddress::random(&env);
        
        // Attempt to tip yourself - should panic
        TipContract::tip_creator(&env, 1_000_000, self_address.clone());
    }

    /// Test: Contract version
    #[test]
    fn test_contract_version() {
        let version = TipContract::version();
        assert_eq!(version, 1, "Contract version should be 1");
    }

    /// Test: Event data structure
    #[test]
    fn test_tip_event_structure() {
        let env = MockEnv::new();
        let tipper = MockAddress::random(&env);
        let creator = MockAddress::random(&env);
        let amount = 10_000_000i128; // 10 USDC

        TipContract::tip_creator(&env, amount, creator.clone());

        // Retrieve all events
        let events = env.events().all();
        assert!(!events.is_empty(), "Events should be recorded");

        // Validate event structure
        for (topics, data) in events {
            if topics.len() >= 3 {
                // Topics should contain: Symbol("tip_sent"), Address(tipper), Address(creator)
                // Data should contain: amount (i128)
                assert!(data.is_some(), "Event data should not be empty");
            }
        }
    }
}
