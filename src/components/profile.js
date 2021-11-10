import React from "react"
import styled from "styled-components"
import HeroUnit from "./hero-unit"
import Link from "./link"

const StyledHeroUnit = styled(HeroUnit)`
  padding: 0;
  height: 100%;
`

const Picture = styled.figure`
  border: 5px solid #ffffff;
  display: flex;
  background-color: #ffffff;
`

const Caption = styled.figcaption`
  padding-left: 1rem;
  color: #000000;
`

const Article = styled.article`
  margin: 0;
  padding: 1rem;
`

const Image = styled.img`
  width: 80px;
`

const Profile = ({pictureSrc, name, twitterHandle, title, description}) => (
  <StyledHeroUnit>
    <Picture>
      <Image src={pictureSrc} />
      <Caption>{name}<br /><Link inverse href={`https://twitter.com/${twitterHandle}`}>@{twitterHandle}</Link></Caption>
    </Picture>
    <Article>
      <h2>{title}</h2>
      {description}
    </Article>
  </StyledHeroUnit>
)

export default Profile