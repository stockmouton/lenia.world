import React from "react"
import styled from "styled-components"
import Menu from "./menu"
import { useMenu } from "./menu-trigger";
import { useQueryParam, BooleanParam } from "use-query-params";

const StyledMenu = styled(Menu)`
  width: 264px;
`

const NavMenu = () => {
  const [isStaging] = useQueryParam("staging", BooleanParam)
  const {onCloseMenu} = useMenu()

  return (
    <StyledMenu>
      <Menu.Item>
        <Menu.Link href="#home" onClick={onCloseMenu}>Home</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#niftty-gritty" onClick={onCloseMenu}>N(i)FTty-gritty</Menu.Link>
      </Menu.Item>
      {isStaging && (
        <Menu.Item>
          <Menu.Link href="#leniadex" onClick={onCloseMenu}>Leniadex</Menu.Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <Menu.Link href="#why-though" onClick={onCloseMenu}>Why Though</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#family-portrait" onClick={onCloseMenu}>Family Portrait</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#quite-asked-questions" onClick={onCloseMenu}>Quite Asked Questions</Menu.Link>
      </Menu.Item>
    </StyledMenu>
  )
}

export default NavMenu