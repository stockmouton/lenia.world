import React, {useEffect} from 'react'
import styled from "styled-components"
import Button from "./button"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0 auto;

  ${createMediaQuery(BREAKPOINTS.xl, `
    top: 60px;
    left: auto;
    right: 0;
    max-width: 500px;
    margin: 0;
  `)}
`
const StyledToast = styled.div`
  position: relative;
  margin: 20px;
  z-index: 1031;
  padding: 14px 35px 14px 14px;
  background-color: ${({type}) => (type === 'error' ? `#aa0000` : `#00aaaa`)};
  color: #ffffff;
  text-align: left;

  ${createMediaQuery(BREAKPOINTS.xl, `
    margin: 0 20px 20px 0;
    max-width: 500px;
  `)}
`
const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: none;
  font-size: 1rem;

  :before, :after {
    content: none;
  }

  :hover {
    margin: 0;
  }
`

const Toast = ({children, type, onClose}) => {
  useEffect(() => {
    setTimeout(onClose, 10000)  
  }, [])

  return (
    <Wrapper>
      <StyledToast type={type}>
        <CloseButton aria-label="Close" onClick={onClose}>x</CloseButton>
        {children}
      </StyledToast>
    </Wrapper>
  )
}

export default Toast