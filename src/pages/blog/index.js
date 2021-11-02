import React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
  width: 500px;
  margin: 0 auto;
  padding-top: 50px;
`

const StyledH1 = styled.h1`
    margin: 0px;
    text-align: center;
`

const StyledH4 = styled.h4`
    margin: 0px;
    text-align: center;
    padding-top: 50px;
`

const StyledUL = styled.ul`
  text-align: left;
`

const IndexPage = () => {
    return (
        <StyledDiv>
            <StyledH1>Blog</StyledH1>
            <StyledH4>✍️ Articles</StyledH4>
            <StyledUL>
                <li>
                    <a href="on-chain">Lenia on chain</a>
                </li>
            </StyledUL>
        </StyledDiv>
    )
}

export default IndexPage