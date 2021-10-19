import React from "react"
import Menu from "../menu"
import { useMenu } from "../menu-trigger"

const AxisMenu = ({ items, onItemClick }) => {
  const { onCloseMenu } = useMenu()

  const handleItemClick = (item) => {
    onCloseMenu()
    onItemClick(item)
  }

  return (
    <Menu>
      {items.map(item => (
        <Menu.Item>
          <Menu.Button key={item} onClick={() => handleItemClick(item)}>{item}</Menu.Button>
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default AxisMenu
