import React from "react"
import styled from "styled-components"
import { useMediaQuery } from 'beautiful-react-hooks'; 

const List = styled.ul`
  padding: 5px;
  overflow: auto;
  width: 100%;
  max-height: 100%;
  background: #bbbbbb;
  list-style: none;

  @media (min-width: 430px) {
    padding: 10px;
  }
`

const Item = styled.li`
  margin-left: 0;
  border-bottom: 1px solid #000000;
`

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 5px 1px;
  color: #000000;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  background: #bbbbbb;
  border: 0;
  border-width: 0;
  border-radius: 0;
  font-size: 0.9rem;
  line-height: inherit;
  font-family: inherit;

  @media (min-width: 430px) {
    padding: 10px 10px;
  }

  :focus, :hover {
    background: #aa5500;
    color: #bbbbbb;
    text-decoration: none;
    outline: 0;
  }
`

const LeniaList = ({ items, onItemClick }) => {
  const isAboveSmallMobile = useMediaQuery(`(min-width: 330px)`);
  return (
    <List>
      {items.map(item => (
        <Item>
          <Button key={item.id} onClick={() => onItemClick(item)}>{isAboveSmallMobile && 'Lenia '}#{item.id}</Button>
        </Item>
      ))}
    </List>
  )
}

export default LeniaList