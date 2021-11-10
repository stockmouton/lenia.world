import React, {useRef, useEffect} from 'react'
import styled from "styled-components"

const StyledDropdown = styled.div`
  position: absolute;
  top: 22px;
  left: 10px;
  width: 100%;
  min-width: 160px;
  z-index: 999;
`

const Dropdown = ({onClickOutside, ...props}) => {
  const node = useRef(null);

  const handleClickOutside = e => {
    const event = e
    if (node.current && !node.current.contains(event.target)) {
      onClickOutside(event)
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return <StyledDropdown {...props} ref={node} />
}

export default Dropdown