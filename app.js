let provider, signer, account;
let contract;

const CONTRACT_ADDRESS = "0xdB9F15Fc5b1B7bb9b87F9aC28706b04F58a0edbE";
const CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "_vendors",
				"type": "address[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "vendor",
				"type": "address"
			}
		],
		"name": "BidCommitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "vendor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BidRevealed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_commitment",
				"type": "bytes32"
			}
		],
		"name": "commitBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endCommitPhase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "finalizeTender",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_salt",
				"type": "string"
			}
		],
		"name": "revealBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TenderFinalized",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "biddingEnded",
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
		"name": "bids",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "commitment",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "revealedBid",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "revealed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revealEnded",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "vendors",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winningBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// helper
const $ = id => document.getElementById(id);

// connect metamask
$("connectBtn").onclick = async () => {
  if (!window.ethereum) return alert("Install MetaMask first!");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  account = await signer.getAddress();
  $("account").innerText = "Connected: " + account;

  // contract bind yahin pe ho jayega
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  $("contractInfo").innerText = "Contract loaded at " + CONTRACT_ADDRESS;
};

// show commitment hash
$("showCommitHashBtn").onclick = () => {
  const amt = $("commitAmount").value.trim();
  const salt = $("commitSalt").value;
  if (!amt || !salt) return alert("Enter amount and salt");
  const hash = ethers.solidityPackedKeccak256(
    ["uint256", "string"],
    [BigInt(amt), salt]
  );
  $("commitHashOut").innerText = "Commitment hash: " + hash;
};

// commit bid
$("commitBtn").onclick = async () => {
  const amt = $("commitAmount").value.trim();
  const salt = $("commitSalt").value;
  if (!amt || !salt) return alert("Enter amount and salt");
  try {
    const commitment = ethers.solidityPackedKeccak256(
      ["uint256", "string"],
      [BigInt(amt), salt]
    );
    const tx = await contract.commitBid(commitment);
    $("commitHashOut").innerText = "Tx sent: " + tx.hash;
    await tx.wait();
    $("commitHashOut").innerText += "\nConfirmed!";
  } catch (e) {
    $("commitHashOut").innerText = "Error: " + e.message;
  }
};

// reveal bid
$("revealBtn").onclick = async () => {
  const amt = $("revealAmount").value.trim();
  const salt = $("revealSalt").value;
  if (!amt || !salt) return alert("Enter reveal amount and salt");
  try {
    const tx = await contract.revealBid(BigInt(amt), salt);
    $("revealTxOut").innerText = "Tx sent: " + tx.hash;
    await tx.wait();
    $("revealTxOut").innerText += "\nRevealed!";
  } catch (e) {
    $("revealTxOut").innerText = "Error: " + e.message;
  }
};

// owner: end commit phase
$("endCommitBtn").onclick = async () => {
  try {
    const tx = await contract.endCommitPhase();
    $("ownerTxOut").innerText = "Tx: " + tx.hash;
    await tx.wait();
    $("ownerTxOut").innerText += "\nCommit phase ended.";
  } catch (e) {
    $("ownerTxOut").innerText = "Error: " + e.message;
  }
};

// owner: finalize tender
$("finalizeBtn").onclick = async () => {
  try {
    const tx = await contract.finalizeTender();
    $("ownerTxOut").innerText = "Tx: " + tx.hash;
    await tx.wait();
    $("ownerTxOut").innerText += "\nTender finalized.";
  } catch (e) {
    $("ownerTxOut").innerText = "Error: " + e.message;
  }
};

// get winner
$("getWinnerBtn").onclick = async () => {
  try {
    const w = await contract.winner();
    $("stateOut").innerText = "Winner: " + w;
  } catch (e) {
    $("stateOut").innerText = "Error: " + e.message;
  }
};

// get winning bid
$("getWinningBidBtn").onclick = async () => {
  try {
    const wb = await contract.winningBid();
    $("stateOut").innerText = "Winning bid: " + wb.toString();
  } catch (e) {
    $("stateOut").innerText = "Error: " + e.message;
  }
};
