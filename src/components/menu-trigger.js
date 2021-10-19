import React, { useState, useContext, createContext } from "react"
import styled from "styled-components"
import NavBar from "./navbar"
import Dropdown from "./dropdown"

const menuContext = createContext({})

const StyledButton = styled(NavBar.Button)`
  color: #000000;
  background: #bbbbbb;

  :before, :after {
    content: none;
  }
  :hover, :focus {
    color: #bbbbbb;
    background: #000000;
  }
`

const MenuTrigger = ({ children, menu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClick = async () => setIsDropdownOpen(true)

  const handleDropdownClickOutside = () => setIsDropdownOpen(false)

  const onCloseMenu = () => setIsDropdownOpen(false)

  return (
    <>
      <StyledButton
        onClick={handleClick}
      >
        {children}
      </StyledButton>
      <menuContext.Provider
        value={{
          onCloseMenu
        }}
      >
        {isDropdownOpen && (
          <Dropdown onClickOutside={handleDropdownClickOutside}>

            {menu}
          </Dropdown>
        )}
      </menuContext.Provider>

    </>
  )
}

export default MenuTrigger

export const useMenu = () => useContext(menuContext)