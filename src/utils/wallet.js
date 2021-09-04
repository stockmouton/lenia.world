export const ETHEREUM_CHAIN_IDS = {
  MAINNET: 1,
  RINKEBY: 4,
  HARDHAT: 1337,
}

export const ETHEREUM_HEX_CHAIN_IDS = {
  MAINNET: '0x1',
  RINKEBY: '0x4',
  HARDHAT: '0x539',
}

export const ALLOWED_CHAIN_ID = ETHEREUM_CHAIN_IDS[process.env.GATSBY_ETHEREUM_CHAIN] || ETHEREUM_CHAIN_IDS[MAINNET]

export const getDecimalFromHex = hexString => parseInt(hexString, 16)

const RINKEBY_RPC_URL = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/'

export const switchChainConnection = async () => {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ETHEREUM_HEX_CHAIN_IDS[process.env.GATSBY_ETHEREUM_CHAIN] }], // Force connection to Rinkeby. TODO: add to env file
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ETHEREUM_HEX_CHAIN_IDS[process.env.GATSBY_ETHEREUM_CHAIN], // TODO: add to env file
                rpcUrl: RINKEBY_RPC_URL,
              },
            ],
          });
      }
    }
  }
}