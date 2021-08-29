import * as React from "react"
import styled from "styled-components"
import Link from "./link"

const Sidebar = styled.nav`
  position: fixed;
  top: 110px;
  left: 0;
  margin-left: 16px;
  width: 264px;
`

Sidebar.List = styled.ul`
  margin: 10px 5px;
  margin-left: -5px;
  padding: 10px 15px;
  border: 2px solid #000000;
  box-shadow: 0 0 0 5px, 11px 13px 0 4px black;
  background: #bbbbbb;
  list-style: none;
`

Sidebar.Item = styled.li`
  margin-left: 0;
`

Sidebar.Link = styled(Link)`
  color: #000000;
  margin-right: -10px;
  margin-left: -10px;
  padding: 0 8px;
  display: block;

  :hover {
    color: #bbbbbb;
    background: #000000;
  }
`

export default Sidebar