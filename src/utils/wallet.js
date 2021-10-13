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

export const getAllowedChainIds = (isStaging = false) => {
  if (process.env.NODE_ENV === 'production' && isStaging) return [ETHEREUM_CHAIN_IDS.RINKEBY]
  if (process.env.NODE_ENV === 'production') return [ETHEREUM_CHAIN_IDS.MAINNET]
  return [ETHEREUM_CHAIN_IDS.HARDHAT, ETHEREUM_CHAIN_IDS.RINKEBY, ETHEREUM_CHAIN_IDS.MAINNET]
}

export const chainDisplayName = (() => {
  if (process.env.NODE_ENV === 'production' && isStaging) return 'Rinkeby Testnet'
  if (process.env.NODE_ENV === 'production') return 'Ethereum Mainnet'
  return 'localhost:8545, Rinkeby Testnet or Ethereum Mainnet'
})()

export const networkName = (() => {
  if (process.env.NODE_ENV === 'production' && isStaging) return 'rinkeby'
  if (process.env.NODE_ENV === 'production') return 'mainnet'
  return 'localhost'
})()

export const getDecimalFromHex = hexString => parseInt(hexString, 16)

const NETWORK_RPC_URLS = {
  [ETHEREUM_CHAIN_IDS.MAINNET]: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [ETHEREUM_CHAIN_IDS.RINKEBY]: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
}

export const switchChainConnection = async (allowedChainId) => {
  if (process.env.NODE_ENV !== 'production') return


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
                rpcUrl: NETWORK_RPC_URLS[allowedChainId],
              },
            ],
          });
      }
    }
  }
}