# IIT Bhilai - Tendering DApp Documentation

##  Overview
This project implements a **sealed-bid tendering system** on Ethereum using Solidity.  

The process has two phases:  
1. **Commit Phase** – Vendors submit hidden bids (commitments).  
2. **Reveal Phase** – Vendors reveal actual bids, and the contract determines the lowest bidder.  

### Key Features
- **Fairness:** No vendor can see another’s bid during commit phase.  
- **Transparency:** Reveals are checked against cryptographic commitments.  
- **Security:** Only registered vendors can participate, only the owner manages tender phases.  

The DApp includes:  
```bash
├── index.html      # UI interface
├── app.css         # Styling
├── app.js          # Web3 logic + ABI + Contract Address
└── contract.sol    # Smart contract
```
---

##  Functions & Execution Rights

### 1. commitBid(bytes32 _commitment)
- **Who can call:** Vendors only.  
- **Purpose:** Vendors submit a hashed bid commitment (`keccak256(amount + salt)`).  
- **Checks:**  
  - Commit phase must be active.  
  - Vendor must not have committed before.  
- **Event emitted:** `BidCommitted(address vendor)`  

---

### 2. endCommitPhase()
- **Who can call:** Owner only.  
- **Purpose:** Ends commit phase → no new commitments allowed.  
- **Effect:** Sets `biddingEnded = true`.  

---

### 3. revealBid(uint _amount, string _salt)
- **Who can call:** Vendors only.  
- **Purpose:** Reveal actual bid amount and salt. Contract verifies it against commitment.  
- **Checks:**  
  - Commit phase must be ended.  
  - Reveal phase must not be finalized.  
  - Vendor must not have revealed before.  
  - Hash must match earlier commitment.  
- **Event emitted:** `BidRevealed(address vendor, uint amount)`  

---

### 4. finalizeTender()
- **Who can call:** Owner only.  
- **Purpose:** Ends reveal phase, declares winner with lowest valid bid.  
- **Checks:**  
  - Commit phase must be ended.  
  - Reveal phase must not be already finalized.  
  - At least one valid bid revealed.  
- **Event emitted:** `TenderFinalized(address winner, uint amount)`  

---

### 5. isVendor(address _addr)
- **Who can call:** Internal only.  
- **Purpose:** Checks if an address is a registered vendor.  

---

##  Deployment & Usage

### Step 1: Deploy Contract
- The **owner (deployer)** provides vendor addresses when deploying:  
  ```solidity
  ["0xVendor1...", "0xVendor2...", "0xVendor3..."]



### Step 2: Add the contract address
- The contract address should be added to the **app.js** file in the **CONTRACT_ADDRESS**.



### Step 3: Allow bidders to use the application
