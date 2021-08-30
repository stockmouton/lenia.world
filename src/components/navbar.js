import styled from "styled-components"
import Button from "./button"
import Link from "./link"

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background: #bbbbbb;
`
NavBar.Brand = styled(Link)`
  background: #0e1a8e;
  color: #fefe54;
  display: block;
  float: left;
  padding: 0 10px;

  :hover {
    color: #fefe54;
    background: #000084;
    text-decoration: none;
  }
`

NavBar.List = styled.ul`
  position: relative;
  right: 0;
  display: block;
  float: left;
  margin: 0 20px;
  list-style: none;
`

NavBar.Item = styled.li`
  float: left;
  margin-left: 0;
  list-style: none;
`

NavBar.Link = styled(Link)`
  color: #000000;
  padding: 0 10px;
  display: block;

  :hover {
    color: #bbbbbb;
    background: #000000;
  }
`

NavBar.Button = styled(Button)`
  background: #000000;
  color: #bbbbbb;
  margin-bottom: 0;
  box-shadow: 0 0;

  :active {
    margin: 0;
    background: #000084;
  }
`

export default NavBar