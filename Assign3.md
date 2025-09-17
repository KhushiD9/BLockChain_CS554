# LotteryGame Smart Contract

A simple Ethereum-based lottery game implemented in Solidity. The contract allows exactly **3 unique players** to join by paying a fixed entry fee, after which a winner is chosen randomly and rewarded the entire prize pool.

---

## Protocol Overview

1. **Players Join the Game**  
   - Each player sends exactly **0.01 Ether** to join the game.
   - The first three players who successfully send the correct fee are registered as:
     - `alice`
     - `bob`
     - `oscar`
   - Once 3 players join, the game starts automatically.
   - Event emitted:  
     `PlayerJoined(address player)`

2. **Pick the Winner**  
   - After the game has started, anyone can call `pickWinner()` to:
     - Generate a pseudo-random index.
     - Select the winner.
     - Transfer the entire contract balance (0.03 ETH) to the winner.
     - Emit an event to log the winner.
   - Event emitted:  
     `WinnerDeclared(address winner, uint256 amountWon)`

---

## Humans Involved & Their Roles

| Role                        | Description |
|-----------------------------|------------|
| Alice                       | The first player to join the game. |
| Bob                         | The second player to join the game. |
| Oscar                       | The third player to join the game, which triggers the game start. |
| Any Ethereum Account Holder | Anyone can join the game by sending exactly 0.01 Ether and can also call the `pickWinner()` function to determine the winner once all players are registered. |
| Winner                      | One of the three players randomly selected after the game starts, who receives the entire prize pool. |

---

## Key Functions

- `joinGame()`:  
    Allows a user to join the game by sending exactly 0.01 Ether. Prevents duplicate participation.

- `pickWinner()`:  
    Picks a pseudo-random winner among the three players and transfers the total contract balance to them.

- `_hasJoined(address player)`:  
    Internal helper function that checks whether a player has already joined the game.

- `receive()`:  
    Fallback function to accept plain Ether transfers.

---

## Events

- `PlayerJoined(address player)`:  
    Emitted when a player joins the game.

- `WinnerDeclared(address winner, uint256 amountWon)`:  
    Emitted when a winner is declared and the prize is transferred.


