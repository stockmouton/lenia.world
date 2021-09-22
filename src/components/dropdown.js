import React, {useRef, useEffect} from 'react'
import styled from "styled-components"

const StyledDropdown = styled.ul`
  position: absolute;
  top: 20.5px;
  left: 0;
  width: 100%;
  min-width: 160px;
  padding: 9px 4px 9px 4px;
  margin: -15.5px 4px 8px 4px;
  list-style: none;
  background-color: #bbbbbb;
  border: 1px solid #000000;
  border-radius: 0;
  box-shadow: 0px 0px 0 5px #bbbbbb;
  background-clip: padding-box; 
`

const Dropdown = ({onClickOutside, ...props}) => {
  const nodeRef = useRef(null);

  const handleClickOutside = event => {
    if (nodeRef.current && !nodeRef.current.contains(event.target)) {
      onClickOutside(event)
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside), false;
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return <StyledDropdown ref={nodeRef} {...props} />
}

Dropdown.Item = styled.li`
  padding-left: 0;
  margin-left: 0;
  list-style: none;
`

Dropdown.Button = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0 10px;
  background-color: #bbbbbb;
  color: #000000;
  cursor: pointer;
  border: 0;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;

  :hover, :focus {
    background: #aa5500;
    color: #bbbbbb;
  }
`

export default Dropdown