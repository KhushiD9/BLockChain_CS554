# CoinTossReferee Smart Contract

## Roles 

### Referee (Deployer)
- Deploys the smart contract.
- Verifies that both players have revealed their choices.
- Announces the winner based on the revealed choices.
- **Cannot participate in the game.**

### Player A (Indian Captain)
- Commits a choice (`0` or `1`) using a hash of the choice and a secret nonce.
- Reveals the choice and nonce later.
- Wins if both players pick the **same choice**.

### Player B (England Captain)
- Commits a choice (`0` or `1`) using a hash of the choice and a secret nonce.
- Reveals the choice and nonce later.
- Wins if the players pick **different choices**.

---

## Protocol

### Step 1: The Set of Humans
| Role          | Address Specified During Deployment |
|---------------|------------------------------------|
| Referee       | Deployer                           |
| Player A      | Indian Captain                     |
| Player B      | England Captain                    |

### Step 2: The Set of Functions (Human-wise)
| Function       | Callable By          | Description                                                                 |
|----------------|--------------------|-----------------------------------------------------------------------------|
| `commit(bytes32 _commitHash)` | Player A / Player B | Player submits a commitment hash of their choice and nonce.                 |
| `reveal(uint8 _choice, bytes32 _nonce)` | Player A / Player B | Player reveals their original choice and nonce. Contract verifies against the previous commitment. |
| `decideWinner()` | Referee           | Referee checks both players have revealed and decides the winner.           |

### Step 3: Sequence of Operations

### Commit Phase
- **Player A** calculates `commitHashA = keccak256(abi.encodePacked(choiceA, nonceA))` and calls `commit(commitHashA)`.
- **Player B** calculates `commitHashB = keccak256(abi.encodePacked(choiceB, nonceB))` and calls `commit(commitHashB)`.

### Reveal Phase
- **Player A** calls `reveal(choiceA, nonceA)`.
- **Player B** calls `reveal(choiceB, nonceB)`.
- The contract verifies that the revealed values match the committed hashes.

### Winner Announcement
- **Referee** calls `decideWinner()`.
- If `choiceA == choiceB`, **Player A wins**.
- If `choiceA != choiceB`, **Player B wins**.
- The contract sets `gameFinished = true` and stores the winner's address in `winner`.

