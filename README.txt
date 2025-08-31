EthPayment Smart Contract

Overview
--------
The EthPayment contract is designed to securely handle ETH transfers between EOAs (Externally Owned Accounts) and contracts.  
It enforces ownership control and balance checks so that:
1. No EOA or contract can send funds from any other account’s balance.
2. No transaction can be made with insufficient funds.
3. All transactions must pass through this contract, which acts as a trusted gatekeeper.

This ensures safe handling of four types of transactions:
1. EOA → EOA
   - The owner sends ETH to this contract.
   - The contract then forwards ETH to the recipient EOA.
2. EOA → Contract
   - The owner sends ETH to this contract.
   - The contract then forwards ETH to another contract.
3. Contract → EOA
   - A contract can send ETH to this contract (via receive()).
   - The owner then forwards it to an EOA.
4. Contract → Contract
   - A contract funds this contract.
   - The owner forwards it to another contract.


Key Features
------------
- Owner-only transfers
  Only the deploying account (owner) can transfer ETH from the contract.

- Balance check
  The contract verifies it has enough ETH before any transfer.
  This prevents overdrawing or creating fake balances.

- Fraud prevention
  * No one can spend ETH on behalf of another account.
  * Only the owner can initiate outgoing transfers.
  * No transaction will succeed if funds are insufficient.

- Universal receiver
  The contract can receive ETH from both EOAs and contracts.


Functions and Their Usefulness
------------------------------
constructor()
- Sets the deployer as the owner.
- This ensures only one trusted account can authorize outgoing transfers.

payEth(address payable recipient, uint256 amount)
- Transfers ETH from this contract to the specified recipient.
- Useful for securely forwarding ETH to any EOA or contract.
- Built-in checks prevent unauthorized use and fraudulent transfers.

receive() external payable
- Allows the contract to accept ETH.
- Useful for storing funds before forwarding them.
- Enables both EOAs and contracts to deposit ETH.
