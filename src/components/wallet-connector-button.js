import React, {useState} from 'react'
import { useWeb3 } from "./web3-provider"
import Web3Modal from "web3modal"
import styled from "styled-components"
import Button from "./button"
import Dropdown from "./dropdown";
import Toast from './toast'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { allowedChainId, chainName } from '../utils/wallet'

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // TODO: create our own Infura key
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },
  }
})

const StyledButton = styled(Button)`
  background: #000000;
  color: #bbbbbb;
  margin-bottom: 0;
  box-shadow: 0 0;

  :active {
    margin: 0;
    background: #000084;
  }

  :disabled:hover {
    background: #000000;
    color: #bbbbbb;
  }
`

const WalletConnectorButton = () => {
  const { initWeb3Provider, resetWeb3Provider, account, chainId } = useWeb3()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState(null)

  const openWeb3Modal = async () => {
    try {
      const provider = await web3Modal.connect()
      initWeb3Provider(provider)
    } catch(error) {
      if (error instanceof Error) {
        setError(error)
      }
    }
  }

  const handleDisconnect = async () => {
    try {
      await resetWeb3Provider()
      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      web3Modal.clearCachedProvider()
    } catch(error) {
      setError(error)
    }
  }

  const handleClick = async () => {
    if (account) return setIsDropdownOpen(true)
    openWeb3Modal()
  }

  const handleDropdownClickOutside = () => setIsDropdownOpen(false)
  const handleChangeProviderButtonClick = async () => {
    
    try {
      await handleDisconnect()
      openWeb3Modal()
    } catch(error) {
      setError(error)
    }
  }

  const handleToastClose = () => setError(null)

  const getTruncatedAccount = account => {
    const lastLetterIndex = account.length - 1 
    return `${account.substring(0, 3)}...${account.substring(lastLetterIndex - 4, lastLetterIndex)}`
  }

  const getConnectorButtonContent = () => {
    if (account && chainId !== allowedChainId) return `Wrong Network! Please connect to ${chainName}`
    if (account) return getTruncatedAccount(account)
    return 'Connect Wallet'
  }

  return (
    <>
      <StyledButton 
        onClick={handleClick}
        disabled={account && chainId !== allowedChainId}
      >
        {getConnectorButtonContent()}
      </StyledButton>
      {isDropdownOpen && (
        <Dropdown onClickOutside={handleDropdownClickOutside}>
          <Dropdown.Item>
            <Dropdown.Button onClick={handleChangeProviderButtonClick}>Change</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={handleDisconnect}>Disconnect</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown>
      )}
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export default WalletConnectorButton