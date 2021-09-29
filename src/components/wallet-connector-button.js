import React, {useState} from 'react'
import { useWeb3 } from "./web3-provider"
import Web3Modal from "web3modal"
import NavBar from "./navbar"
import Dropdown from "./dropdown";
import Menu from "./menu"
import Toast from './toast'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { allowedChainId, chainDisplayName, networkName } from '../utils/wallet'
 

const WalletConnectorButton = () => {
  const { initWeb3Provider, resetWeb3Provider, account, chainId } = useWeb3()
  const [web3Modal, setWeb3Modal] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState(null)

  const openWeb3Modal = async () => {
    let modalInstance = web3Modal
    if (modalInstance == null) {
      modalInstance = new Web3Modal({
        network: networkName,
        cacheProvider: true,
        // Tell Web3modal what providers we have available.
        // Built-in web browser provider (only one can exist as a time)
        // like MetaMask, Brave or Opera is added automatically by Web3modal
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: "9aa3d95b3bc440fa88ea12eaa4456161",
            }
          },
        }
      })
      setWeb3Modal(modalInstance)
    }
    
    try {
      const provider = await modalInstance.connect()
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
    if (account && chainId !== allowedChainId) return `Wrong Network! Please connect to ${chainDisplayName}`
    if (account) return getTruncatedAccount(account)
    return 'Connect Wallet'
  }

  return (
    <>
      <NavBar.Button 
        onClick={handleClick}
        disabled={account && chainId !== allowedChainId}
      >
        {getConnectorButtonContent()}
      </NavBar.Button>
      {isDropdownOpen && (
        <Dropdown onClickOutside={handleDropdownClickOutside}>
          <Menu>
            <Menu.Item>
              <Menu.Button onClick={handleChangeProviderButtonClick}>Change</Menu.Button>
            </Menu.Item>
            <Menu.Item>
              <Menu.Button onClick={handleDisconnect}>Disconnect</Menu.Button>
            </Menu.Item>
          </Menu>
        </Dropdown>
      )}
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export default WalletConnectorButton