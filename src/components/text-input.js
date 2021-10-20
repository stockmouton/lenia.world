import React from "react"
import styled from "styled-components"

const Input = styled.input`
  display: inline-block;
  padding: .375rem .75rem;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  background: #000000;
  vertical-align: middle;
  color: #bbbbbb;
  border: 2px solid #bbbbbb;
  outline: 0;
  caret-color: #bbbbbb;
  appearance: none;
  width: 100%;
`

const TextInput = ({type, ...props}) => <Input type={type ?? 'text'} {...props} />

export default TextInput