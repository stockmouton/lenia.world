import React, {useRef, useEffect} from 'react'
import styled from "styled-components"

const StyledDropdown = styled.ul`
  position: absolute;
  top: 22px;
  left: 10px;
  width: 100%;
  min-width: 160px;
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

export default Dropdown