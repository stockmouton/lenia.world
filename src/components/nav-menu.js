import React from "react"
import styled from "styled-components"
import Menu from "./menu"

const StyledMenu = styled(Menu)`
  width: 264px;
`

const NavMenu = () => (
  <StyledMenu>
    <Menu.Item>
      <Menu.Link href="#summary">Summary</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#leniadex">Leniadex</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#nifty-gritty">The N(i)FTy gritty</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#but-why-owning-you-say">But why owning you say</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#research">The research</Menu.Link>
    </Menu.Item>
    <Menu.Item>
        <Menu.Link href="#roadmap">Roadmap</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#the-folks-we-care-about">The folks we care about</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#family-portrait">Family Portrait</Menu.Link>
    </Menu.Item>
    <Menu.Item>
      <Menu.Link href="#quite-queried-questions">Quite Queried Questions</Menu.Link>
    </Menu.Item>
  </StyledMenu>
)

export default NavMenu