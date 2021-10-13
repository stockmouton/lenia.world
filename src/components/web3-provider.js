import React, { createContext, useState, useEffect, useContext } from 'react'
import Toast from './toast'
import { getAllowedChainIds, getChainDisplayName, getDecimalFromHex, switchChainConnection} from '../utils/wallet'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useQueryParam, StringParam } from "use-query-params";

const Web3 = typeof window !== 'undefined' ? require('web3') : null;
const web3Context = createContext(null)

export const Web3Provider = ({ children }) => {
  const [web3Provider, setWeb3Provider] = useState(null)
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)
  const [network] = useQueryParam("network", StringParam)

  const allowedChainIds = getAllowedChainIds(network)
  const chainDisplayName = getChainDisplayName(network)
  
  const initAccount = async (web3Provider, isFirstConnection = false) => {
    try {
      const accounts = await web3Provider.eth.getAccounts()
      if (isFirstConnection && accounts.length == 0) throw new Error('There is no existing account present.')
      setAccount(accounts[0])
    } catch (error) {
      setError(error)
    }
  }

  const initWeb3Provider = async provider => {
    try {
      const web3Provider = new Web3(provider)
      const newChainId = await web3Provider.eth.getChainId()

      if (!allowedChainIds.includes(newChainId)) {
        setError(new Error(`Please switch to ${chainDisplayName}`))
        switchChainConnection()
        return
      }

      setWeb3Provider(web3Provider)
      setProvider(provider)
      setChainId(newChainId)
      initAccount(web3Provider, true)

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
        if (allowedChainIds.includes(newChainId)) return;

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

  const initDefaultProvider = async () => {
    let web3Provider = null
    try {
      web3Provider = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/${isStaging ? process.env.RINKEBY_ALCHEMY_API_KEY: process.env.MAINNET_ALCHEMY_API_KEY}`)
      const newChainId = await web3Provider.eth.getChainId()
      setWeb3Provider(provider)
      setChainId(newChainId)
    } catch(error) {
      return
    }
  }

  const initExistingProvider = () => {
    // Check if browser is running Metamask
    let web3Provider
    if (window.ethereum) {
      initWeb3Provider(window.ethereum);
    } else if (window.web3) {
      initWeb3Provider(window.web3.currentProvider);
    } else {
      initDefaultProvider()
    }
  };

  const handleToastClose = () => setError(null)

  useEffect(initExistingProvider, []);

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