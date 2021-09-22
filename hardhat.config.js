const path = require("path")
require("dotenv").config({ path: path.join(__dirname, '.env.development') })

require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")

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

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
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
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
  },
}
