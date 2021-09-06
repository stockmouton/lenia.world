import React, { useEffect, useState } from 'react'
import Lenia from '../../artifacts/contracts/Lenia.sol/Lenia.json'
import Button from './button'
import { useWeb3 } from "./web3-provider"
import { smartContractAddress } from '../utils/smart-contract'
import Toast from './toast'
import styled from "styled-components"

const LeniaSupplyContent = styled.p`
  text-align: center;
`

const MintButton = () => {
  const { web3Provider, account } = useWeb3()
  const [hasSaleStarted, setHasSaleStarted] = useState(false)
  const [totalLeniaSupply, setTotalLeniaSupply] = useState(0)
  const [totalLeniaMinted, setTotalLeniaMinted] = useState(0)
  const [contract, setContract] = useState(null)
  const [error, setError] = useState(null)

  useEffect(async () => {
    const contract = web3Provider ? new web3Provider.eth.Contract(Lenia.abi, smartContractAddress) : null

    if (contract) {
      setContract(contract)
      try {
        const hasSaleStarted = await contract.methods.hasSaleStarted().call({ from: account })
        const totalLeniaSupply = await contract.methods.MAX_SUPPLY().call({ from: account })
        const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
        setHasSaleStarted(hasSaleStarted)
        setTotalLeniaSupply(totalLeniaSupply)
        setTotalLeniaMinted(totalLeniaMinted)
      } catch (error) {
        setError(error)
      }
    }
  }, [web3Provider, account])

  const handleClick = async () => {
    try {
      const leniaUnitPrice = await contract.methods.getPrice().call({from: account})
      await contract.methods.mint().send({ from: account, value: leniaUnitPrice})
      const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
      setTotalLeniaMinted(totalLeniaMinted)
    } catch(error) {
      setError(error)
    }
  }

  const handleToastClose = () => setError(null)

  return (
    <>
      {hasSaleStarted ? <Button onClick={handleClick}>Mint one lenia</Button> :
        <Button disabled>Minting day to be announced</Button>}
      {Boolean(totalLeniaSupply) && <LeniaSupplyContent>{totalLeniaMinted}/{totalLeniaSupply} lenia minted</LeniaSupplyContent>}
      {error?.message && <Toast type="error" onClose={handleToastClose}>{error.message}</Toast>}
    </>
  )
}

export default MintButton