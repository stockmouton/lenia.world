import React, { createContext, useState, useEffect, useContext } from 'react'
import Toast from './toast'
import { allowedChainId, chainDisplayName, getDecimalFromHex, switchChainConnection} from '../utils/wallet'

const Web3 = typeof window !== 'undefined' ? require('web3') : null;
const web3Context = createContext(null)

export const Web3Provider = ({ children }) => {
  const [web3Provider, setWeb3Provider] = useState(null)
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)

  const initWeb3Provider = async provider => {
    try {
      const web3Provider = new Web3(provider)
      const newChainId = await web3Provider.eth.getChainId()

      if (newChainId !== allowedChainId) {
        setError(new Error(`Please switch to ${chainDisplayName}`))
        switchChainConnection()
        return
      }

      setWeb3Provider(web3Provider)
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
        if (newChainId === allowedChainId) return;

        setError(new Error(`Please switch to ${chainDisplayName}`))
        switchChainConnection()
      })
    } catch(error) {
      setError(new Error('There was an error connecting to the network.'))
    }
  }

  const resetWeb3Provider = async () => {
    try {
      // TODO: check which providers don't have this method
      if (provider.close) {
        await provider.close();
        setProvider(null)
      }

      setAccount('')
      setWeb3Provider(null)
    } catch (error) {
      setError(error)
    }
  }

  const handleToastClose = () => setError(null)

  useEffect(async () => {
    if (web3Provider == null) return;

    try {
      const accounts = await web3Provider.eth.getAccounts()
      if (accounts.length == 0) throw new Error('There is no existing account present.')
      setAccount(accounts[0])
    } catch (error) {
      setError(error)
    }

  }, [web3Provider])

  return (
    <>
      <web3Context.Provider value={{
        initWeb3Provider,
        resetWeb3Provider,
        web3Provider,
        account,
        chainId,
        provider,
      }}>{children}</web3Context.Provider>
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export const useWeb3 = () => useContext(web3Context)