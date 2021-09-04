import React, {useEffect} from 'react'
import styled from "styled-components"
import Button from "./button"

const StyledToast = styled.div`
  position: fixed;
  top: 55px;
  right: 0;
  z-index: 1031;
  max-width: 500px;
  padding: 14px 35px 14px 14px;
  margin: 0 16px 20px 0;
  background-color: ${({type}) => (type === 'error' ? `#aa0000` : `#00aaaa`)};
  color: #ffffff;
`
const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: none;

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
    <StyledToast type={type}>
      <CloseButton aria-label="Close" onClick={onClose}>x</CloseButton>
      {children}
    </StyledToast>
  )
}

export default Toast