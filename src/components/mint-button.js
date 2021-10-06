import React, { useEffect, useState } from 'react'
import artifacts from '../artifacts.json'
import Button from './button'
import {useWeb3} from "./web3-provider"
import Toast from './toast'
import styled from "styled-components"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"
import { useQueryParam, BooleanParam } from "use-query-params"
import Countdown from "react-countdown"

const SALE_STATUSES = {
  NOT_STARTED: 'NOT_STARTED',
  PRESALE: 'PRESALE',
  PUBLIC: 'PUBLIC',
}

const getSaleStatus = (isPresaleActive, isSaleActive) => {
  if (isSaleActive) return SALE_STATUSES.PUBLIC
  if (isPresaleActive) return SALE_STATUSES.PRESALE
  return SALE_STATUSES.NOT_STARTED
}

const BUTTON_STATUSES = {
  DISABLED: 'DISABLED',
  READY: 'READY',
  LOADING: 'LOADING',
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
  const [totalLeniaSupply, setTotalLeniaSupply] = useState(0)
  const [totalLeniaMinted, setTotalLeniaMinted] = useState(0)
  const [contract, setContract] = useState(null)
  const [saleStatus, setSaleStatus] = useState(SALE_STATUSES.NOT_STARTED)
  const [mintingTransactionStatus, setMintingTransactionStatus] = useState(MINTING_TRANSACTION_STATUSES.READY)
  const [buttonStatus, setButtonStatus] = useState(BUTTON_STATUSES.DISABLED)
  const [error, setError] = useState(null)
  const [isStaging] = useQueryParam("staging", BooleanParam)

  useEffect(async () => {
    // TODO: Remove this when smart contract is deployed on mainnet
    if (!isStaging) return

    const contract = web3Provider ? new web3Provider.eth.Contract(artifacts.contracts.Lenia.abi, artifacts.contracts.Lenia.address) : null
    if (contract) {
      setContract(contract)
      try {
        const isPresaleActive = await contract.methods.isPresaleActive().call({from: account})
        console.log(isPresaleActive)
        const isEligibleForPresale = await contract.methods.isEligibleForPresale(account).call({from: account})
        const isSaleActive = await contract.methods.isSaleActive().call({ from: account })
        const canAccountMint = (isPresaleActive && isEligibleForPresale) || isSaleActive
        setSaleStatus(getSaleStatus(isPresaleActive, isSaleActive))
        setButtonStatus(canAccountMint ? BUTTON_STATUSES.READY : BUTTON_STATUSES.DISABLED)

        const totalLeniaSupply = await contract.methods.MAX_SUPPLY().call({ from: account }) || 0
        const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account }) || 0
        setTotalLeniaSupply(totalLeniaSupply)
        setTotalLeniaMinted(totalLeniaMinted)
      } catch (error) {
        setError(error)
      }
    }
  }, [web3Provider, account])

  const handleClick = async () => {
    setButtonStatus(BUTTON_STATUSES.LOADING)
    setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.PROCESSING)
    try {
      const contractMethod = saleStatus === SALE_STATUSES.PUBLIC ? 'mint' : 'presaleMint'
      const leniaUnitPrice = await contract.methods.getPrice().call({from: account})
      await contract.methods[contractMethod]().send({ from: account, value: leniaUnitPrice})
      setMintingTransactionStatus(MINTING_TRANSACTION_STATUSES.SUCCESS)
      setButtonStatus(BUTTON_STATUSES.READY)
      try {
        const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
        setTotalLeniaMinted(totalLeniaMinted)
      } catch(error) {
        // Do nothing, this is just a read operation, no need to scare the user.
      }
    } catch(error) {
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
    [BUTTON_STATUSES.DISABLED]: saleStatus === SALE_STATUSES.PRESALE ? 
      <span>Sale starts in <Countdown date={new Date('October 7, 2021 18:00:00')} /></span> : 
      <span>Presale starts in <Countdown date={new Date('October 7, 2021 06:00:00')} /></span>,
    [BUTTON_STATUSES.READY]: 'Mint one lenia',
    [BUTTON_STATUSES.LOADING]: 'Processing transaction...',
  }[buttonStatus])

  return (
    <>
      <p>
        Presale: Thursday Oct 7th, 6AM UTC<br />
        Public Sale: Thursday Oct 7th, 6PM UTC
      </p>
      <StyledButton onClick={handleClick} disabled={[BUTTON_STATUSES.DISABLED, BUTTON_STATUSES.LOADING].includes(buttonStatus)}>{getButtonContent()}</StyledButton>
      {saleStatus !== SALE_STATUSES.NOT_STARTED && Boolean(totalLeniaSupply) && <LeniaSupplyContent>{totalLeniaMinted}/{totalLeniaSupply} Lenia minted</LeniaSupplyContent>}
      {mintingTransactionStatus == MINTING_TRANSACTION_STATUSES.ERROR && error && <Toast type="error" onClose={handleToastClose}>{error?.message}</Toast>}
      {mintingTransactionStatus == MINTING_TRANSACTION_STATUSES.SUCCESS && <Toast onClose={handleToastClose}>You successfully minted a lenia.</Toast>}
    </>
  )
}

export default MintButton