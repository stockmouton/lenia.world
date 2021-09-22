import React, {useState} from "react"
import NavBar from "./navbar"
import Dropdown from "./dropdown"

const MenuButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClick = async () => {
    if (account) return setIsDropdownOpen(true)
  }

  const handleDropdownClickOutside = () => setIsDropdownOpen(false)

  return (
    <>
      <NavBar.Button 
        onClick={handleClick}
      >
        ☰ Menu
      </NavBar.Button>
      {isDropdownOpen && (
        <Dropdown onClickOutside={handleDropdownClickOutside}>
          <Dropdown.Item>
            <Dropdown.Button onClick={handleChangeProviderButtonClick}>Change</Dropdown.Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Button onClick={handleDisconnect}>Disconnect</Dropdown.Button>
          </Dropdown.Item>
        </Dropdown>
      )}
    </>
  )
}

export default MenuButton