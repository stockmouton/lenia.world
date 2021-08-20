import * as React from "react"
import styled from "styled-components"
import Button from "./button"

const NavBar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background: #bbbbbb;
`
NavBar.Brand = styled.a`
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
  left: 0;
  display: block;
  float: left;
  margin: 0 20px 0 0;
  list-style: none;
`

NavBar.Item = styled.li`
  float: left;
  margin-left: 0;
  list-style: none;
`

NavBar.Link = styled.a`
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