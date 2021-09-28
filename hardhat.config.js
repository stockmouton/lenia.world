const path = require("path")
require("dotenv").config({ path: path.join(__dirname, '.env.development') })

require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")

const UglifyJS = require("uglify-js");
const fs = require('fs');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address);
  }
})

task("start-sale", "Start Lenia sale", async (taskArgs, hre) => {
  if (hre.hardhatArguments.network == null) {
    throw new Error('Please add the missing --network <localhost|rinkeby|goerli> argument')
  }

  const LeniaContract = await hre.ethers.getContractFactory("Lenia")
  const LeniaDeployment = await hre.deployments.get('Lenia')

  const lenia = LeniaContract.attach(LeniaDeployment.address)
  let hasSaleStarted = await lenia.hasSaleStarted()

  if (hasSaleStarted) {
    throw new Error('The sale has already started, no need to run this task.')
  }

  const setSaleStartTx = await lenia.flipHasSaleStarted();

  // wait until the transaction is mined
  await setSaleStartTx.wait();
  hasSaleStarted = await lenia.hasSaleStarted()
  if (hasSaleStarted) {
    console.log('Sale was successfully started')
  } else {
    throw new Error('Something went wrong, sale couldn\'t be started')
  }
})

task("set-fake-metadata", "Add metadata to the contract", async (taskArgs, hre) => {
  if (hre.hardhatArguments.network == null) {
    throw new Error('Please add the missing --network <localhost|rinkeby|goerli> argument')
  }

  const LeniaContract = await hre.ethers.getContractFactory("Lenia")
  const LeniaDeployment = await hre.deployments.get('Lenia')

  const lenia = LeniaContract.attach(LeniaDeployment.address)
  
  const metadata = require('./src/fake/metadata.json')
  for (let index = 0; index < metadata.length; index++) {
    let element = metadata[index];

    const cells = element["config"]["cells"]
    delete element["config"]["cells"]
    
    console.log(`adding metadata id ${index}`)
    const setMetadataTx = await lenia.setMetadata(index, JSON.stringify(element))
    await setMetadataTx.wait()
    const setCellsTx = await lenia.setCells(index, cells)
    await setCellsTx.wait()
  }

  let metadatum = await lenia.getMetadata(0)
  let cells = await lenia.getCells(0)
})

task("set-engine", "Set the engine in the smart contract", async (taskArgs, hre) => {
  if (hre.hardhatArguments.network == null) {
    throw new Error('Please add the missing --network <localhost|rinkeby|goerli> argument')
  }

  const LeniaContract = await hre.ethers.getContractFactory("Lenia")
  const LeniaDeployment = await hre.deployments.get('Lenia')

  const lenia = LeniaContract.attach(LeniaDeployment.address)
  
  const engineCode = fs.readFileSync('./src/engine.js', 'utf-8')
  const result = UglifyJS.minify([engineCode]);
  const setEngineTx = await lenia.setEngine(result.code)
  await setEngineTx.wait()

  const contractEngine = await lenia.getEngine();
  if (contractEngine.length) {
    console.log('Rendering engine successfully set in the smart contract')
  } else {
    throw new Error('Something went wrong, rendering engine has not be set')
  }
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
      // accounts: process.env.PRIVATE_KEY !== undefined ? [{'privateKey': process.env.PRIVATE_KEY, 'balance': '10000'}] : [],
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: process.env.GOERLI_PRIVATE_KEY !== undefined ? [process.env.GOERLI_PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.RINKEBY_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
    },
  },
  plugins: ["solidity-coverage"],
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: "USD",
    gasPrice: 50,
    coinmarketcap: process.env.COINMARKETCAP
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
  },
}
