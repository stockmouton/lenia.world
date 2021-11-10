import React from "react"
import styled from "styled-components"

const LinkElement = styled.a`
  color: ${({inverse}) => (inverse ? `#aa5500` : `#fefe54`)};
  text-decoration: none;
  background-color: transparent;

  :hover, :focus {
    background: ${({inverse}) => (inverse ? `#fefe54` : `#aa5500`)};
  }
  
  :hover, :active {
    outline: 0;
  }
  
  :focus {
    outline: thin solid #333;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
  }
`

const Link = ({href, ...props}) => (props.href?.startsWith('#') ? <LinkElement href={href} {...props} /> : <LinkElement href={href} target="_blank" rel="noopener noreferrer" {...props} />)

export default Link;