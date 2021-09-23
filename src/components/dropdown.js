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
  const node = useRef();

  useEffect(() => {
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  return <StyledDropdown ref={node} {...props} />
}

export default Dropdown