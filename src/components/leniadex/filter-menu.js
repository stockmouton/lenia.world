import React from "react"
import Menu from "../menu"
import { useMenu } from "../menu-trigger"

const FilterMenu = ({items, filters, onClearAll, onFilterClick}) => {
  const {onCloseMenu} = useMenu()

  const handleClearAllClick = () => {
    onCloseMenu()
    onClearAll()
  } 

  return (
    <Menu>
      {filters.length > 0 && (
        <>
          <Menu.Item>
            <Menu.Button cta onClick={handleClearAllClick}>Clear All</Menu.Button>
          </Menu.Item>                       
          <Menu.Divider />
        </>
      )}
      {items.map(item => (
          <Menu.Item>
            <Menu.Button key={item} onClick={() => onFilterClick(item)} selected={filters.includes(item)}>{item} {filters.includes(item) ? '✓' : ''}</Menu.Button>
          </Menu.Item>
      ))}
    </Menu>
  )
}

export default FilterMenu
