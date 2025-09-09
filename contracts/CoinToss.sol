// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CoinTossReferee {
    address public referee; // referee (deployer)
    address public playerA; // Indian captain
    address public playerB; // England captain
    uint public stake;

    mapping(address => bytes32) public commitments;
    mapping(address => uint8) public revealedChoice;
    mapping(address => bool) public hasRevealed;

    bool public gameFinished;
    address public winner;

    constructor(address _playerA, address _playerB, uint _stake) {
        referee = msg.sender;
        playerA = _playerA;
        playerB = _playerB;
        stake = _stake;
    }

    modifier onlyPlayers() {
        require(msg.sender == playerA || msg.sender == playerB, "Not a player");
        _;
    }

    modifier onlyReferee() {
        require(msg.sender == referee, "Only referee can call");
        _;
    }

    function commit(bytes32 _commitHash) external payable onlyPlayers {
        require(commitments[msg.sender] == bytes32(0), "Already committed");
        require(msg.value == stake, "Must send exact stake");
        commitments[msg.sender] = _commitHash;
    }

    function reveal(uint8 _choice, bytes32 _nonce) external onlyPlayers {
        require(commitments[msg.sender] != bytes32(0), "No commitment found");
        require(!hasRevealed[msg.sender], "Already revealed");
        require(_choice == 0 || _choice == 1, "Choice must be 0 or 1");

        bytes32 computed = keccak256(abi.encodePacked(_choice, _nonce, msg.sender));
        require(computed == commitments[msg.sender], "Reveal does not match commit");

        revealedChoice[msg.sender] = _choice;
        hasRevealed[msg.sender] = true;
    }

    // Referee announces winner after both revealed
    function decideWinner() external onlyReferee {
        require(!gameFinished, "Game already finished");
        require(hasRevealed[playerA] && hasRevealed[playerB], "Both must reveal first");

        uint8 choiceA = revealedChoice[playerA];
        uint8 choiceB = revealedChoice[playerB];

        if (choiceA == choiceB) {
            winner = playerA; // India wins
        } else {
            winner = playerB; // England wins
        }

        gameFinished = true;

        // Pay out immediately
        payable(winner).transfer(address(this).balance);
    }
}
