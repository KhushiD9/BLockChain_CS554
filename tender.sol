// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TenderingProcess {
    struct Bid {
        bytes32 commitment;
        uint revealedBid;  
        bool revealed;
    }

    address public owner;
    bool public biddingEnded;
    bool public revealEnded;
    address public winner;
    uint public winningBid;

    mapping(address => Bid) public bids;
    address[] public vendors;

    // Events
    event BidCommitted(address vendor);
    event BidRevealed(address vendor, uint amount);
    event TenderFinalized(address winner, uint amount);

    constructor(address[] memory _vendors) {
        owner = msg.sender;
        vendors = _vendors;
        biddingEnded = false;
        revealEnded = false;
        winningBid = type(uint).max; // for checking the lowest one
    }

    // Vendors first commit to a bid (hash of bid + secret salt)
    function commitBid(bytes32 _commitment) external {
        require(!biddingEnded, "Commit phase ended");
        require(isVendor(msg.sender), "Not an authorized vendor");
        require(bids[msg.sender].commitment == 0, "Already committed");

        bids[msg.sender].commitment = _commitment;
        emit BidCommitted(msg.sender);
    }

    // End commit phase
    function endCommitPhase() external {
        require(msg.sender == owner, "Only owner can end commit phase");
        require(!biddingEnded, "Commit already ended");
        biddingEnded = true;
    }

    // Vendors reveal their bid with the original amount + salt
    function revealBid(uint _amount, string calldata _salt) external {
        require(biddingEnded, "Commit phase not ended");
        require(!revealEnded, "Reveal phase ended");
        require(isVendor(msg.sender), "Not an authorized vendor");

        Bid storage b = bids[msg.sender];
        require(!b.revealed, "Already revealed");

        // Verify commitment
        require(
            keccak256(abi.encodePacked(_amount, _salt)) == b.commitment,
            "Commitment mismatch"
        );

        b.revealed = true;
        b.revealedBid = _amount;

        emit BidRevealed(msg.sender, _amount);

        // Track lowest bid
        if (_amount < winningBid) {
            winningBid = _amount;
            winner = msg.sender;
        }
    }

    // End reveal phase and finalize tender
    function finalizeTender() external {
        require(msg.sender == owner, "Only owner can finalize");
        require(biddingEnded, "Commit phase not ended");
        require(!revealEnded, "Already finalized");

        revealEnded = true;
        require(winner != address(0), "No valid bids revealed");

        emit TenderFinalized(winner, winningBid);
    }

    // Helper: check if address is a registered vendor
    function isVendor(address _addr) internal view returns (bool) {
        for (uint i = 0; i < vendors.length; i++) {
            if (vendors[i] == _addr) return true;
        }
        return false;
    }
}

