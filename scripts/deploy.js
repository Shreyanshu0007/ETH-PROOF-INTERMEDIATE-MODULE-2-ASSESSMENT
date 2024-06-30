const hre = require("hardhat");

async function main() {
  const [coffeePrice] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", coffeePrice.address);

  const initialCoffeePrice = hre.ethers.utils.parseEther('0.01'); // Setting tea price to 0.01 Ether
  const CoffeeShop = await hre.ethers.getContractFactory("CoffeeShop");
  const coffeeShop = await CoffeeShop.deploy(initialCoffeePrice);

  console.log("CoffeeShop contract deployed to:", coffeeShop.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
