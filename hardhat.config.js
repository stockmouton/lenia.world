const path = require("path")
require("dotenv").config({ 
  path: path.join(__dirname, '.env.development')
})

require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")

const ethers = require("ethers")
require('./tasks');
const {generatePrivateKey} = require('./test/utils')
const defaultPrivateKey = {
  'privateKey': process.env.DAO_PK,
  'balance': ethers.utils.parseEther("10000").toString()
}
const randomPrivateKeys = [...Array(210).keys()].map(() => (
  {'privateKey': generatePrivateKey(), 'balance': ethers.utils.parseEther("10000").toString()}
))
const allPrivateKeys = [defaultPrivateKey, ...randomPrivateKeys]

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: allPrivateKeys
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.RINKEBY_ALCHEMY_API_KEY}`,
      accounts: [process.env.DAO_PK, process.env.ADMIN1_PK, process.env.ADMIN2_PK, process.env.ADMIN3_PK],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.MAINNET_ALCHEMY_API_KEY}`,
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
    }
  },
  plugins: ["solidity-coverage"],
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: "USD",
    gasPrice: 100,
    coinmarketcap: process.env.COINMARKETCAP
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
    admin1: 1,
    admin2: 2,
    admin3: 3,
  },
}
