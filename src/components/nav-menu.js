import React from "react"
import styled from "styled-components"
import Menu from "./menu"

const StyledMenu = styled(Menu)`
  width: 264px;
`

const NavMenu = () => (
  <StyledMenu>
    <Menu.Item>
      <Menu.Link href="#niftty-gritty">N(i)FTty-gritty</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#leniadex">Leniadex</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#but-why-though">But Why Though</Menu.Link>
    </Menu.Item>
    {/* <Menu.Item>
      <Menu.Link href="#the-folks-we-care-about">The folks we care about</Menu.Link>
    </Menu.Item> */}
    <Menu.Item>
      <Menu.Link href="#family-portrait">Family Portrait</Menu.Link>
    </Menu.Item>
    {/* <Menu.Item>
      <Menu.Link href="#quite-queried-questions">Quite Queried Questions</Menu.Link>
    </Menu.Item> */}
  </StyledMenu>
)

export default NavMenu