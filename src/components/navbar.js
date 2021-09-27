import styled from "styled-components"
import Link from "./link"
import Button from "./button"
import { createMediaQuery, BREAKPOINTS, COLORS } from "../global-styles"

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  height: 27px;
`

NavBar.Wrapper = styled.div`
  background: #bbbbbb;
  height: 100%;
`

NavBar.Brand = styled(Link)`
  background: ${COLORS.BACKGROUND};
  color: #fefe54;
  display: block;
  float: left;
  padding: 0 10px;

  :hover {
    color: #fefe54;
    background: ${COLORS.BACKGROUND};
    text-decoration: none;
  }
`

NavBar.List = styled.ul`
  position: relative;
  right: 0;
  display: block;
  float: left;
  margin: 0;
  list-style: none;
  height: 100%;
`

NavBar.Item = styled.li`
  position: relative;
  float: left;
  margin-left: 0;
  list-style: none;
  height: 100%;
`
NavBar.Item.UnderXl = styled(NavBar.Item)`
  ${createMediaQuery(BREAKPOINTS.xl, 'display: none;')}
`

NavBar.Item.AboveMd = styled(NavBar.Item)`
  display: none;

  ${createMediaQuery(BREAKPOINTS.md, 'display: block;')}
`

NavBar.Link = styled(Link)`
  color: #000000;
  padding: 0 10px;
  display: block;
  height: 100%;

  :hover, :focus {
    color: #bbbbbb;
    background: #000000;
  }
`

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

export default NavBar