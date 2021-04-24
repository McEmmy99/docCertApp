// const Web3 = require('web3');
// const jsSHA = require("jssha");
// const fs = require("fs");


var contract = undefined;
let web3 = undefined;
var provider = undefined;
let address = "0x4723bac0819a3AeAb88382BaA03a06E4dB418BBb";
var abi = undefined;

async function notary_init () {
  if (window.ethereum) {
    provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      //user denied account access....
      console.error("user denied account access")
    }
  }

  // Legacy dapp browsers...
  else if (window.web3) {
    provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache

  else {
    alert("No Ethereum interface injected into browser. Read-only access");
  }
  // else {
  //   provider = new web3.providers.HttpProvider('http://localhost:8545');
  // }

  // let provider = new Web3.providers.HttpProvider("http://localhost:8545");
  web3 = new Web3(provider);

  abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    }
  ];

  contract = new web3.eth.Contract(abi, address);

};

//sends a hash to the blockchain
function notary_send(hash, callback) {
    web3.eth.getAccounts(function (error, accounts) {
      contract.methods.addDocHash(hash).send({
        from: accounts[0]
      },function(error, tx) {
        if (error) callback(error, null);
        else callback(null, tx);
      });
    });
};

//looks up a hash on the blockchain
function notary_find (hash, callback) {
  contract.methods.findDocHash(hash).call( function (error, result) {
    if (error) callback(error, null);
    else {
      let resultObj = {
        mineTime:  new Date(result[0] * 1000),
        blockNumber: result[1]
      }
      callback(null, resultObj);
    }
  });
};