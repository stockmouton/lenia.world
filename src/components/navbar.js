import React from "react"
import styled from "styled-components"
import Link from "./link"
import Button from "./button"
import { createMediaQuery, BREAKPOINTS, COLORS } from "../global-styles"

const NavBar = styled.div`
  background: #bbbbbb;
  height: 100%;
`

NavBar.Brand = styled(Link)`
  background: ${COLORS.BACKGROUND};
  color: #fefe54;
  display: block;
  float: left;
  padding: 0 10px;
  height: 100%;

  :hover {
    color: #fefe54;
    background: ${COLORS.BACKGROUND};
    text-decoration: none;
  }
`

NavBar.List = styled.ul`
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
  height: 100%;

  ::after { 
    content: " ";
    display: block; 
    height: 0; 
    clear: both;
  }
`

NavBar.Item = styled.li`
  position: relative;
  float: left;
  margin-left: 0;
  list-style: none;
  height: 100%;
`
NavBar.Item.UnderSm = styled(NavBar.Item)`
  ${createMediaQuery(BREAKPOINTS.sm, 'display: none;')}
`

NavBar.Item.AboveSm = styled(NavBar.Item)`
  display: none;

  ${createMediaQuery(BREAKPOINTS.sm, 'display: block;')}
`

const LinkElement = styled.a`
  color: #000000;
  text-decoration: none;
  padding: 0 10px;
  display: block;
  height: 100%;

  :hover {
    color: #bbbbbb;
    background: #000000;
  }

  :hover, :focus, :active {
    outline: 0;
  }
` 
NavBar.Link = props => (props.href?.startsWith('#') ? <LinkElement {...props} /> : <LinkElement target="_blank" rel="noopener noreferrer" {...props} />)

NavBar.Button = styled(Button)`
  background: #000000;
  color: #bbbbbb;
  margin-bottom: 0;
  box-shadow: 0 0;
  height: 100%;
  vertical-align: top;

  :active {
    margin: 0;
    background: #000084;
  }

  :disabled:hover {
    background: #000000;
    color: #bbbbbb;
  }
`

NavBar.Banner = styled.div`
  background-color: #aa0000;
  color: #ffffff;
  width: 100%;
  padding: 0 1rem;
`

NavBar.Text = styled.div`
  color: #000000;
`

export default NavBar