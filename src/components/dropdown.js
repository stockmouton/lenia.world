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
  useEffect(() => {
    document.addEventListener("click", onClickOutside), false;
    return () => {
      document.removeEventListener("click", onClickOutside, false);
    };
  }, []);

  return <StyledDropdown {...props} />
}

export default Dropdown