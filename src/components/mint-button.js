import React, { useEffect, useState } from 'react'
import Button from './button'
import { useWeb3 } from "./web3-provider"
import Toast from './toast'
import styled from "styled-components"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"
import Countdown from "./countdown"
import { useWeb3Modal } from './web3-modal-provider'
import { useLeniaContract, SALE_STATUSES } from './lenia-contract-provider'

const BUTTON_STATUSES = {
  CONNECT: 'CONNECT',
  NOT_ALLOWED: 'NOT_ALLOWED',
  READY: 'READY',
  LOADING: 'LOADING',
  SOLD_OUT: 'SOLD_OUT'
}

const MINTING_TRANSACTION_STATUSES = {
  READY: 'READY',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
}

const LeniaSupplyContent = styled.p`
  text-align: center;
`

const StyledButton = styled(Button)`
  font-size: 1.25rem;
  padding: 14px 24px;
  width: 100%;

  ${createMediaQuery(BREAKPOINTS.sm, `
    font-size: 1.5rem;
    width: auto;
  `)}
  
`

const MintButton = () => {
  const { web3Provider, account } = useWeb3()
  const { openWeb3Modal } = useWeb3Modal()
  const { isEligibleForPresale, saleStatus, totalLeniaMinted, totalLeniaSupply, initBlockchainData, updateBlockchainData, contract } = useLeniaContract()
  const [mintingTransactionStatus, setMintingTransactionStatus] = useState(MINTING_TRANSACTION_STATUSES.READY)
  const [buttonStatus, setButtonStatus] = useState(BUTTON_STATUSES.CONNECT)
  const [error, setError] = useState(null)

  const getButtonStatus = (account, canAccountMint, isSoldOut) => {
    if (account === '') return BUTTON_STATUSES.CONNECT
    if (isSoldOut) return BUTTON_STATUSES.SOLD_OUT
    return canAccountMint ? BUTTON_STATUSES.READY : BUTTON_STATUSES.NOT_ALLOWED
  }

  useEffect(() => {
    initBlockchainData()
  }, [web3Provider, account])

  useEffect(() => {
    const canAccountMint = (saleStatus === SALE_STATUSES.PRESALE && isEligibleForPresale) || saleStatus === SALE_STATUSES.PUBLIC
    setButtonStatus(getButtonStatus(account, canAccountMint, totalLeniaSupply == totalLeniaMinted && totalLeniaSupply > 0))
  }, [saleStatus, isEligibleForPresale, totalLeniaMinted, totalLeniaSupply, account])

  const handleClick = async () => {
    if (account === '') return openWeb3Modal()

    setButtonStatus(BUTTON_STATUSES.LOADING)
    setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.PROCESSING)
    try {
      const contractMethod = saleStatus === SALE_STATUSES.PUBLIC ? 'mint' : 'presaleMint'
      const leniaUnitPrice = await contract.methods.getPrice().call({ from: account })
      await contract.methods[contractMethod]().send({ from: account, value: leniaUnitPrice })
      setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.SUCCESS)
      updateBlockchainData()
    } catch (error) {
      setError(error)
      setButtonStatus(BUTTON_STATUSES.READY)
      setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.ERROR)
    }
  }

  const handleToastClose = () => {
    setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.READY)
    setError(null)
  }

  const getButtonContent = () => ({
    [BUTTON_STATUSES.CONNECT]: 'Connect Wallet',
    [BUTTON_STATUSES.NOT_ALLOWED]: saleStatus === SALE_STATUSES.PRESALE ?
      <span>Sale starts at 6pm UTC</span> :
      <span>Presale starts at 6am UTC</span>,
    [BUTTON_STATUSES.READY]: 'Mint one lenia',
    [BUTTON_STATUSES.LOADING]: <>Processing transaction...</>,
    [BUTTON_STATUSES.SOLD_OUT]: 'Sold out!'
  }[buttonStatus])

  return (
    <>
      <p>
        Presale: Thursday Oct 7th, 6AM UTC<br />
        Public Sale: Thursday Oct 7th, 6PM UTC
      </p>
      <StyledButton onClick={handleClick} disabled={[BUTTON_STATUSES.NOT_ALLOWED, BUTTON_STATUSES.LOADING, BUTTON_STATUSES.SOLD_OUT].includes(buttonStatus)}>{getButtonContent()}</StyledButton>
      {saleStatus !== SALE_STATUSES.NOT_STARTED && Boolean(totalLeniaSupply) && <LeniaSupplyContent>{totalLeniaMinted}/{totalLeniaSupply} Lenia minted</LeniaSupplyContent>}
      {mintingTransactionStatus == MINTING_TRANSACTION_STATUSES.ERROR && error && <Toast type="error" onClose={handleToastClose}>{error?.message}</Toast>}
      {mintingTransactionStatus == MINTING_TRANSACTION_STATUSES.SUCCESS && <Toast onClose={handleToastClose}>You successfully minted a lenia.</Toast>}
    </>
  )
}

export default MintButton