import React from "react"
import styled from "styled-components"
import Menu from "./menu"
import { useQueryParam, BooleanParam } from "use-query-params";

const StyledMenu = styled(Menu)`
  width: 264px;
`

const NavMenu = () => {
  const [isStaging] = useQueryParam("staging", BooleanParam)

  return (
    <StyledMenu>
      <Menu.Item>
        <Menu.Link href="#home">Home</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#niftty-gritty">N(i)FTty-gritty</Menu.Link>
      </Menu.Item>
      {isStaging && (
        <Menu.Item>
          <Menu.Link href="#leniadex">Leniadex</Menu.Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <Menu.Link href="#why-though">Why Though</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#family-portrait">Family Portrait</Menu.Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Link href="#quite-asked-questions">Quite Asked Questions</Menu.Link>
      </Menu.Item>
    </StyledMenu>
  )
}

export default NavMenu