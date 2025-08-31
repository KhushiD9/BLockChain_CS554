//SPDX-License-Identifier: Khushi
pragma solidity ^0.8.26;

contract EthPayment{
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Non authorized owner");
        _;
    }

    function payEth(address payable recipient, uint256 amount) external onlyOwner{
        require(address(this).balance >= amount, "Insufficient balance in contract");

        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}
}