const contractAddress = ""; // Replace with your actual contract address
const contractABI = [ // Paste your ABI address here
  ];

let web3;
let coffeeShopContract;
let userAccount;

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('account').innerText = `Connected: ${userAccount}`;
            coffeeShopContract = new web3.eth.Contract(contractABI, contractAddress);

            document.getElementById('connectButton').addEventListener('click', connectMetaMask);
            document.getElementById('buyCoffeeButton').addEventListener('click', buyCoffee);
            document.getElementById('withdrawFundsButton').addEventListener('click', withdrawFunds);
            document.getElementById('setPriceButton').addEventListener('click', setCoffeePrice);
            updateTotalCoffeeSold();
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('account').innerText = `Connected: ${userAccount}`;
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

async function buyCoffee() {
    try {
        console.log("Fetching coffee price...");
        const price = await coffeeShopContract.methods.coffeePrice().call();
        console.log("Coffee price in wei:", price);

        console.log("Sending transaction to buy coffee...");
        await coffeeShopContract.methods.buyCoffee().send({ from: userAccount, value: price });
        console.log("Transaction sent!");

        alert('Coffee purchased!');
        updateTotalCoffeeSold();
    } catch (error) {
        console.error("Error purchasing coffee:", error);
        alert(`Error purchasing coffee: ${error.message}`);
    }
}

async function withdrawFunds() {
    try {
        await coffeeShopContract.methods.withdrawFunds().send({ from: userAccount });
        alert('Funds withdrawn!');
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        alert(`Error withdrawing funds: ${error.message}`);
    }
}

async function setCoffeePrice() {
    try {
        const newPrice = document.getElementById('setPriceInput').value;
        const newPriceInWei = web3.utils.toWei(newPrice, 'ether');
        await coffeeShopContract.methods.setCoffeePrice(newPriceInWei).send({ from: userAccount });
        alert('Coffee price updated!');
    } catch (error) {
        console.error("Error setting coffee price:", error);
        alert(`Error setting coffee price: ${error.message}`);
    }
}

async function updateTotalCoffeeSold() {
    try {
        const events = await coffeeShopContract.getPastEvents('CoffeePurchased', {
            fromBlock: 0,
            toBlock: 'latest'
        });
        const totalSold = events.length;
        document.getElementById('totalCoffeeSold').innerText = totalSold;
    } catch (error) {
        console.error("Error fetching total coffee sold:", error);
    }
}
