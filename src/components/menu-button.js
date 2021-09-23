import React, {useState} from "react"
import styled from "styled-components"
import NavBar from "./navbar"
import NavMenu from "./nav-menu"
import Dropdown from "./dropdown"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"

const StyledButton = styled(NavBar.Button)`
  color: #000000;
  background: #bbbbbb;

  :before {
    content: none;
  }
  :after {
    content: " ▼";
  }
  :hover, :focus {
    color: #bbbbbb;
    background: #000000;
  }
`

const MenuButtonText = styled.span`
  display: none;

  ${createMediaQuery(BREAKPOINTS.sm, 'display: inline')}
`

const MenuButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClick = async () => setIsDropdownOpen(true)

  const handleDropdownClickOutside = () => setIsDropdownOpen(false)

  return (
    <>
      <StyledButton 
        onClick={handleClick}
      >
        ☰ <MenuButtonText>Menu</MenuButtonText>
      </StyledButton>
      {isDropdownOpen && (
        <Dropdown onClickOutside={handleDropdownClickOutside}>
          <NavMenu />
        </Dropdown>
      )}
    </>
  )
}

export default MenuButton