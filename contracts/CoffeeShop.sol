// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoffeeShop {
    address public owner;
    uint256 public coffeePrice;
    mapping(address => uint256) public balances;

    event CoffeePurchased(address indexed buyer, uint256 amount);

    constructor(uint256 _coffeePrice) {
        owner = msg.sender;
        coffeePrice = _coffeePrice;
    }

    function buyCoffee() public payable {
        require(msg.value == coffeePrice, "Please send the exact amount of Ether");
        balances[owner] += msg.value;
        emit CoffeePurchased(msg.sender, msg.value);
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(balances[owner]);
        balances[owner] = 0;
    }

    function setCoffeePrice(uint256 _coffeePrice) public {
        require(msg.sender == owner, "Only the owner can set the coffee price");
        coffeePrice = _coffeePrice;
    }
}

// npx hardhat run --network localhost scripts/deploy.js
