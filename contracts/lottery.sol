// SPDX-License-Identifier: khushi
pragma solidity ^0.8.13;

contract LotteryGame {
    address public alice;
    address public bob;
    address public oscar;
    
    uint256 public constant ENTRY_FEE = 0.01 ether;
    address[] public players;
    bool public gameStarted;
    bool public winnerDeclared;
    
    event PlayerJoined(address player);
    event WinnerDeclared(address winner, uint256 amountWon);

    constructor() {
        gameStarted = false;
        winnerDeclared = false;
    }
    
    function joinGame() external payable {
        require(!gameStarted, "Game already started");
        require(msg.value == ENTRY_FEE, "Must send exactly 0.01 ether");
        require(!_hasJoined(msg.sender), "Player already joined");

        players.push(msg.sender);

        // Assign the first three players as alice, bob, and oscar
        if (players.length == 1) {
            alice = msg.sender;
        } else if (players.length == 2) {
            bob = msg.sender;
        } else if (players.length == 3) {
            oscar = msg.sender;
            gameStarted = true;
        }

        emit PlayerJoined(msg.sender);
    }

    function pickWinner() external {
        require(gameStarted, "Game not started yet");
        require(!winnerDeclared, "Winner already declared");
        require(players.length == 3, "All players must join first");

        // Simple pseudo-randomness
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))
        ) % players.length;

        address winner = players[randomIndex];
        uint256 prizeAmount = address(this).balance;

        payable(winner).transfer(prizeAmount);

        winnerDeclared = true;
        emit WinnerDeclared(winner, prizeAmount);
    }

    function _hasJoined(address player) internal view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) {
                return true;
            }
        }
        return false;
    }

    receive() external payable {}
}
