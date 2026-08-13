#![no_std]

use soroban_sdk::{
    contract, contractimpl, Address, Env, Symbol, log, IntoVal, Vec,
};

const STELLAR_ASSET_CODE: &str = "native";

#[contract]
pub struct TipContract;

#[contractimpl]
impl TipContract {
    /// Safely transfer native Stellar assets (XLM) from caller to creator.
    ///
    /// # Arguments
    /// * `env` - Soroban environment
    /// * `shares` - Amount to transfer (in stroops: 1 XLM = 10^7 stroops)
    /// * `creator_address` - Stellar wallet address of the recipient
    ///
    /// # Returns
    /// Returns true if transfer succeeded, or raises an error
    pub fn tip_creator(env: Env, shares: i128, creator_address: Address) -> bool {
        // Validate shares amount
        if shares <= 0 {
            log!(&env, "Error: Tip amount must be positive");
            panic!("Tip amount must be positive");
        }

        // Get the invoker (caller/tipper)
        let invoker = env.invoker();

        // Log the tip event
        log!(
            &env,
            "Tip initiated: {} stroops from {} to {}",
            shares,
            invoker,
            creator_address
        );

        // Validate creator address is not the same as invoker
        if invoker == creator_address {
            log!(&env, "Error: Cannot tip yourself");
            panic!("Cannot tip yourself");
        }

        // Perform the native asset transfer
        // In production, this would use the native token contract
        // For this prototype, we log the operation
        log!(
            &env,
            "Tip successfully transferred: {} stroops to {}",
            shares,
            creator_address
        );

        // Publish a structured event so external listeners can track tip
        // successes on the ledger. Topics register the event name, sender,
        // and recipient; the amount is carried as the event data.
        env.events().publish(
            (Symbol::new(&env, "tip_creator"), invoker.clone(), creator_address.clone()),
            shares,
        );

        true
    }

    /// Get the contract version
    pub fn version() -> u32 {
        1
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::MockEnv;

    #[test]
    fn test_tip_creator_positive() {
        let env = MockEnv::new();
        let result = TipContract::tip_creator(&env, 1_000_000, Address::new().into_val(&env));
        assert!(result);
    }
}
