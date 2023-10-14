let web3;
let contract;
let userAccount;

const contractAddress = '0xc2E91ec939740132b809cDC9E51622C9120fD1E3'; 
const contractABI = [
    {
        "inputs": [],
        "name": "storeInteraction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "checkInteraction",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasInteracted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Initialize web3 and set up contract instance
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            contract = new web3.eth.Contract(contractABI, contractAddress);  // Create contract instance here
        } catch (error) {
            alert("Failed to connect to MetaMask. Please ensure that you have authorized this website to access your account.");
        }
    } else if (window.web3) {
        // Legacy web3 provider
        web3 = new Web3(window.web3.currentProvider);
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask or use a web3-enabled browser to interact with this page.");
    }
}

async function joinWhitelist() {
    try {
        await contract.methods.storeInteraction().send({ from: accounts[0] });
        document.getElementById('result').innerText = "Successfully joined the whitelist!";
    } catch (err) {
        document.getElementById('result').innerText = "Error: " + err.message;
    }
}

async function checkWhitelist() {
    try {
        const isWhitelisted = await contract.methods.checkInteraction(accounts[0]).call();
        if (isWhitelisted) {
            document.getElementById('result').innerText = "You are in the whitelist!";
        } else {
            document.getElementById('result').innerText = "You are not in the whitelist yet.";
        }
    } catch (err) {
        document.getElementById('result').innerText = "Error: " + err.message;
    }
}

// Event listener
window.addEventListener('load', async () => {
    await initWeb3();
    document.getElementById('joinWhitelist').addEventListener('click', joinWhitelist);
    document.getElementById('checkWhitelist').addEventListener('click', checkWhitelist);
});