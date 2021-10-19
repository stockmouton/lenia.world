import React from "react"
import styled from "styled-components"
import Link from "./link"

const Menu = styled.ul`
  margin: 10px 5px;
  margin-left: -5px;
  padding: 10px 15px;
  border: 2px solid #000000;
  box-shadow: 0 0 0 5px, 11px 13px 0 4px black;
  background: #bbbbbb;
  list-style: none;
`

Menu.Item = styled.li`
  margin-left: 0;
`

Menu.Divider = styled(Menu.Item)`
  width: calc(100% + 15px);
  margin: 9px -7.5px;
  height: 0;
  overflow: hidden;
  background-color: #e5e5e5;
  border-bottom: 1px solid #000000;
`

Menu.Link = styled(Link)`
  color: #000000;
  margin-right: -10px;
  margin-left: -10px;
  padding: 0 8px;
  display: block;

  :hover, :focus {
    color: #bbbbbb;
    background: #000000;
  }
`

const MenuButton = styled(Menu.Link)`
  ${({cta}) => (cta ? `
    background: #000000;
    color: #bbbbbb;
    text-align: center;

    :before {
      content: "< ";
      float: left;
    }
  
    :after {
      content: ">";
      float: right;
    }

    :hover, :focus {
      color: #ffffff;
      background: #555555;
    }
  ` : `
    :hover, :focus {
      background: #aa5500;
      color: #bbbbbb;
    }
  `)}
    ${({selected}) => (selected ? `
      background: #aa5500;
      color: #bbbbbb;
    ` : '')}
`
Menu.Button = props => <MenuButton {...props} href="#!" role="button" /> 

export default Menu