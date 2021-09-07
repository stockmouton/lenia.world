const TESTNET_SMART_CONTRACT_ADDRESS = ''
const MAINNET_SMART_CONTRACT_ADDRESS = ''

export const smartContractAddress = (() => {
  if (process.env.NODE_ENV === 'development') return process.env.GATSBY_SMART_CONTRACT_ADDRESS
  if (process.env.STAGING) return TESTNET_SMART_CONTRACT_ADDRESS
  return MAINNET_SMART_CONTRACT_ADDRESS
})()