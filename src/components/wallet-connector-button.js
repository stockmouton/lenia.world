import React, {useState} from 'react'
import { useWeb3 } from "./web3-provider"
import {useWeb3Modal} from "./web3-modal-provider"
import NavBar from "./navbar"
import Dropdown from "./dropdown";
import Menu from "./menu"
import Toast from './toast'
import { getAllowedChainIds, getChainDisplayName } from '../utils/wallet'
import { useQueryParam, StringParam } from "use-query-params";

const WalletConnectorButton = () => {
  const { resetWeb3Provider, account, chainId } = useWeb3()
  const { web3Modal, openWeb3Modal } = useWeb3Modal()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState(null)
  const [network] = useQueryParam("network", StringParam)

  const allowedChainIds = getAllowedChainIds(network)
  const chainDisplayName = getChainDisplayName(network)

  const handleDisconnect = async () => {
    try {
      await resetWeb3Provider()
      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      await web3Modal.clearCachedProvider()
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
    if (account && !allowedChainIds.includes(chainId)) return `Wrong Network! Please connect to ${chainDisplayName}`
    if (account) return getTruncatedAccount(account)
    return 'Connect Wallet'
  }

  return (
    <>
      <NavBar.Button 
        onClick={handleClick}
        disabled={account && !allowedChainIds.includes(chainId)}
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