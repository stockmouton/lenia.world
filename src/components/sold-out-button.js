import React from 'react'
import Button from './button'
import styled from "styled-components"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"

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

const SoldOutButton = () => (
  <>
    <StyledButton disabled>SOLD OUT!</StyledButton>
    <LeniaSupplyContent>202/202 Lenia minted</LeniaSupplyContent>
  </>
)

export default SoldOutButton