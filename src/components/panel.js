import React, { useState } from "react"
import styled from "styled-components"

const Panel = styled.article`
  background-color: #bbbbbb;
  border-color: #dddddd;
  color: #000000;
  margin: 0 0 1rem 0;
`

const Heading = styled.header`
  background-color: #555555;
  border-color: #dddddd;
  border-bottom: 0;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem 0;
`

const Body = styled.div`
  border-top-color: #dddddd;
  padding: 0 4px 0 6px;
`

const CollapseIcon = styled.span`
  padding: 0 10px 0 10px;
`

const StyledPanel = ({ heading, body }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(isOpen => !isOpen);

  return (
    <Panel>
      <Heading onClick={handleClick}>
        <h4>
          <CollapseIcon>
            {isOpen ? '-' : '+'}
          </CollapseIcon>
          {heading}
        </h4>
      </Heading>
      {isOpen && <Body>{body}</Body>}
    </Panel>
  )
}

export default StyledPanel;