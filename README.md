# Novara

## Overview
Novara is a inspection tool designed for Base Sepolia. It validates RPC connectivity, block and gas data, and verifies bytecode at specified addresses.

Built for Base.

## Purpose
Novara is designed to:
- Perform a quick RPC health check to verify connectivity
- Read wallet balances if available
- Fetch the latest block number and gas price
- Check for the presence of bytecode at specified contract addresses

Ideal for validating Base Sepolia environments, checking contract deployments, and performing system diagnostics without making any state-modifying calls.

## What Novara Does
- Checks RPC health with the `eth_chainId` method
- Reads wallet balances (if connected via Coinbase Wallet)
- Fetches the latest block data (block number, timestamp, gas price)
- Verifies the presence of bytecode at specified addresses
- Provides readable explorer links for all outputs

## What Novara Never Does
- It does not send transactions
- It does not sign messages
- It does not modify onchain state

## Internal Flow
1) Initialize Base Sepolia settings (RPC URL, chainId, explorer)  
2) Perform an `eth_chainId` RPC check  
3) Connect via Coinbase Wallet to discover addresses  
4) If addresses are found, read balances  
5) Fetch and display the latest block and gas price  
6) Verify bytecode presence at specified contract addresses  
7) Output results with explorer links  

## Base Sepolia Details
- Network: Base Sepolia  
- chainId (decimal): 84532  
- Explorer: https://sepolia.basescan.org  

## Repository Structure
- README.md  
- app/Novara.mjs  
- package.json  
- contracts/BalanceReader.sol  
- contracts/BlockVerifier.sol  
- config/base-sepolia.json  
- samples/targets.json  

## Author Contacts
- GitHub: https://github.com/inrush-irony/

- Email: inrush-irony00@icloud.com       

## License
MIT License

## Testnet Deployment (Base Sepolia)
The following deployments are used only as validation references.

network: base sepolia  
chainId (decimal): 84532  
explorer: https://sepolia.basescan.org  

BalanceReader.sol address:  
0xC9d92835b697a497b0c96F6f243D7aF7B05A345B  

Deployment and verification:
- https://sepolia.basescan.org/address/0xC9d92835b697a497b0c96F6f243D7aF7B05A345B
- https://sepolia.basescan.org/0xC9d92835b697a497b0c96F6f243D7aF7B05A345B/0#code  

BlockVerifier.sol address:  
0x85D5A6BdEDB8d2c1fB585b010C8dF3fC46C4e9cD  

Deployment and verification:
- https://sepolia.basescan.org/address/0x85D5A6BdEDB8d2c1fB585b010C8dF3fC46C4e9cD
- https://sepolia.basescan.org/0x85D5A6BdEDB8d2c1fB585b010C8dF3fC46C4e9cD/0#code  

These deployments provide a controlled environment for validating base tooling and read-only onchain access prior to base mainnet usage.
