import styled from "styled-components"
import Lead from "./lead"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"

const Jumbotron = styled.div`
  padding: 40px 0;
  text-align: center;

  h1 {
    font-size: 2.6rem;
    line-height: 1;
  }

  ${Lead} {
    font-size: 1.25rem;
    line-height: 1.25;
  }

  p {
    color: #f1f1f1;
  }

  ${createMediaQuery(BREAKPOINTS.sm, `
    padding: 80px 0;

    h1 {
      font-size: 5rem;
    }

    ${Lead} {
      font-size: 1.5rem;
      line-height: 1.25;
    }
  `)}
`
export default Jumbotron