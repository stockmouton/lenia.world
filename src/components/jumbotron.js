import styled from "styled-components"
import Lead from "./lead"
import Button from "./button"

const Jumbotron = styled.div`
  margin: 80px 0;
  text-align: center;

  h1 {
    font-size: 5rem;
    line-height: 1;
  }

  ${Lead} {
    font-size: 24px;
    line-height: 1.25;
  }

  ${Button} {
    font-size: 21px;
    padding: 14px 24px;
  }
`
export default Jumbotron