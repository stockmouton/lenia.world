import * as React from "react"
import styled from "styled-components"
import Separator from "./separator"

const SectionElement = styled.section`
  padding: 0 0 40px 0;
`
const Section = ({children}) => (
  <>
    <Separator />
    <SectionElement>{children}</SectionElement>
  </>
)

Section.Header = styled.header`
  padding: 20px 20px;
  margin: 20px 0 20px;
  background: #00aaaa;

  h1 {
    color: #000000;
  }
`

export default Section;