export const ETHEREUM_CHAIN_IDS = {
  MAINNET: 1,
  RINKEBY: 4,
  HARDHAT: 1337,
}

export const ETHEREUM_HEX_CHAIN_IDS = {
  [ETHEREUM_CHAIN_IDS.MAINNET]: '0x1',
  [ETHEREUM_CHAIN_IDS.RINKEBY]: '0x4',
  [ETHEREUM_CHAIN_IDS.HARDHAT]: '0x539',
}

export const allowedChainId = (() => {
  if (process.env.NODE_ENV === 'production' && process.env.STAGING) return ETHEREUM_CHAIN_IDS.RINKEBY
  if (process.env.NODE_ENV === 'production') return ETHEREUM_CHAIN_IDS.MAINNET
  return ETHEREUM_CHAIN_IDS.HARDHAT
})()

export const chainDisplayName = (() => {
  if (process.env.NODE_ENV === 'production' && process.env.STAGING) return 'Rinkeby Testnet'
  if (process.env.NODE_ENV === 'production') return 'Ethereum Mainnet'
  return 'Hardhat Network (localhost:8545)'
})()

export const networkName = (() => {
  if (process.env.NODE_ENV === 'production' && process.env.STAGING) return 'rinkeby'
  if (process.env.NODE_ENV === 'production') return 'mainnet'
  return 'localhost'
})()

export const getDecimalFromHex = hexString => parseInt(hexString, 16)

const networkRpcUrl = (() => {
  if (process.env.NODE_ENV === 'production' && process.env.STAGING) return 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/'
  if (process.env.NODE_ENV === 'production') return 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  return 'http://localhost:8545'
})()

export const switchChainConnection = async () => {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ETHEREUM_HEX_CHAIN_IDS[allowedChainId] }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ETHEREUM_HEX_CHAIN_IDS[allowedChainId],
                rpcUrl: networkRpcUrl,
              },
            ],
          });
      }
    }
  }
}