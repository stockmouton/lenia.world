import styled from "styled-components"

const Button = styled.button`
  display: inline-block;
  padding: 0 10px;
  margin-bottom: 20px;
  color: #000000;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  background: #bbbbbb;
  border: 0;
  border-width: 0;
  border-radius: 0;
  box-shadow: 10px 10px 0 #000000;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;

  :before {
    content: "< ";
  }

  :after {
    content: " >";
  }

  :focus, :hover {
    color: #ffffff;
    text-decoration: none;
    background: #555555;
    outline: 0;
  }

  :active {
    margin: 10px 0 10px 10px;
    outline: 0;
    box-shadow: 0 0 0;
  }

  :disabled {
    opacity: 0.5;
  }

  :disabled:hover {
    cursor: not-allowed;
    background: #bbbbbb;
    color: #000000;
  }

  a {
    color: #000000;
  }
`

export default Button