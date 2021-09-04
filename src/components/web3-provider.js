import React, { createContext, useState, useEffect, useContext } from 'react'
import Web3 from 'web3'
import Toast from './toast'
import { ALLOWED_CHAIN_ID, getDecimalFromHex, switchChainConnection} from '../utils/wallet'

const web3Context = createContext(null)

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)

  const initWeb3 = async provider => {
    try {
      const web3 = new Web3(provider)
      const newChainId = await web3.eth.getChainId()

      if (newChainId !== ALLOWED_CHAIN_ID) {
        setError(new Error('The website is in early alpha: please switch to the Rinkeby testnet'))
        switchChainConnection()
        return
      }

      setWeb3(web3)
      setProvider(provider)
      setChainId(newChainId)

      provider.on("accountsChanged", accounts => {
        if (accounts.length == 0) {
          setError(new Error('There is no existing account present.'))
          resetWeb3()
          return;
        }
        setAccount(accounts[0])
      });

      provider.on("chainChanged", hexChainId => {
        const newChainId = getDecimalFromHex(hexChainId)
        setChainId(newChainId)
        if (newChainId === ALLOWED_CHAIN_ID) return;

        setError(new Error('The website is in early alpha: please connect to the Rinkeby testnet'))
        switchChainConnection()
      })
    } catch(error) {
      setError(new Error('There was an error connecting to the network.'))
    }
  }

  const resetWeb3 = async () => {
    try {
      // TODO: check which providers don't have this method
      if (provider.close) {
        await provider.close();
        setProvider(null)
      }

      setAccount('')
      setWeb3(null)
    } catch (error) {
      setError(error)
    }
  }

  const handleToastClose = () => setError(null)

  useEffect(async () => {
    if (web3 == null) return;

    try {
      const accounts = await web3.eth.requestAccounts()
      if (accounts.length == 0) throw new Error('There is no existing account present.')
      setAccount(accounts[0])
    } catch (error) {
      setError(error)
    }

  }, [web3])

  return (
    <>
      <web3Context.Provider value={{
        initWeb3,
        resetWeb3,
        web3,
        account,
        chainId,
        provider,
      }}>{children}</web3Context.Provider>
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export const useWeb3 = () => useContext(web3Context)