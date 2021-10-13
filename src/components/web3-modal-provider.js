import React, { createContext, useState, useContext } from 'react'
import { useWeb3 } from "./web3-provider"
import Web3Modal from "web3modal"
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect } from 'react'
import { useQueryParam, StringParam } from "use-query-params";


const web3ModalContext = createContext({})

const getNetworkName = () => {
  if (process.env.NODE_ENV === 'production') return 'mainnet'
  return 'localhost'
}

export const Web3ModalProvider = ({ children }) => {
  const { initWeb3Provider } = useWeb3()
  const [error, setError] = useState(null)
  const [web3Modal, setWeb3Modal] = useState(null)
  const [network] = useQueryParam("network", StringParam)

  const networkName = network || getDefaultNetworkName()

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

  useEffect(() => {
    setWeb3Modal(new Web3Modal({
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
    }))
  }, [])
  
  return (
    <>
      <web3ModalContext.Provider value={{
        openWeb3Modal,
        web3Modal,
      }}>{children}</web3ModalContext.Provider>
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export const useWeb3Modal = () => useContext(web3ModalContext)