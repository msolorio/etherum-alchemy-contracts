require('dotenv').config();
// For Hardhat 
const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const {
  API_URL,
  PUBLIC_KEY,
  PRIVATE_KEY
} = process.env;

const web3 = createAlchemyWeb3(API_URL);

const contractAddress = '0xe630383aa6f768274bb31146fe663ea0cd7fc0dd';

const helloWorldContract = new web3.eth.Contract(contract.abi, contractAddress);

async function updateMessage(newMessage) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
  const gasEstimate = await helloWorldContract.methods.update(newMessage).estimateGas();

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: gasEstimate,
    maxFeePerGas: 1000000108,
    data: helloWorldContract.methods.update(newMessage).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise.then((signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
      if (err) {
        return console.log(`something went wrong ==>`, err)
      }

      console.log(`The hash of your transaction is ${hash}. Check Alchemy's Mempool to view the status of your transaction!`)
    }).catch((err) => {
      console.log('Promise failed:', err);
    })
  })
}

async function main() {
  const message = await helloWorldContract.methods.message().call();

  console.log('The current message is:', message);

  // await updateMessage('Hello, again!')
}

main();

// console.log(JSON.stringify(contract.abi));