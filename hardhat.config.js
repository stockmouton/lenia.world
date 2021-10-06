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
  'privateKey': '0xbc14f35250faa51f04d1d19b9d01b4e79efc2267a366a93a4c9102d7f4229f05',
  'balance': ethers.utils.parseEther("10000").toString()
}
const randomPrivateKeys = [...Array(210).keys()].map(() => (
  {'privateKey': generatePrivateKey(), 'balance': ethers.utils.parseEther("10000").toString()}
))
const allPrivateKeys = [].concat([defaultPrivateKey], randomPrivateKeys)

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
