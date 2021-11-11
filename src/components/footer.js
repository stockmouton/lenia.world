import React from "react"
import styled from "styled-components"
import { createMediaQuery, BREAKPOINTS } from "../global-styles"
import { EtherscanLogo, DiscordLogo, GithubLogo, OpenseaLogo, TwitterLogo } from "./brand-logo"
import Link from "./link"

const StyledFooter = styled.footer`
  margin: 1rem;
  text-align: center;
`

const SocialMedia = styled.div`
  display: flex;
  justify-content: center;

  ${createMediaQuery(BREAKPOINTS.sm, 'display: none;')}
  
`
SocialMedia.Item = styled.div`
  margin-left: 2rem;

  :first-child {
    margin-left: 0;
  }
`

const Footer = () => (
  <StyledFooter>
    <p>
      © {new Date().getFullYear()}, Built with all the love and care in the world by
      {` `}
      <Link href="https://stockmouton.com">Stockmouton</Link>
    </p>
    <SocialMedia>
      <SocialMedia.Item>
        <Link href="https://twitter.com/lenia_nft">
          <TwitterLogo height={18} />
        </Link>
      </SocialMedia.Item>
      <SocialMedia.Item>
        <Link href="https://discord.gg/4TFNnCkJta">
          <DiscordLogo height={18} />
        </Link>
      </SocialMedia.Item>
      <SocialMedia.Item>
        <Link href="https://opensea.io/collection/lenia-nft">
          <OpenseaLogo height={18} />
        </Link>
      </SocialMedia.Item>
      <SocialMedia.Item>
        <Link href="https://etherscan.io/address/0xe95004c7f061577df60e9e46c1e724cc75b01850">
          <EtherscanLogo height={18} />
        </Link>
      </SocialMedia.Item>
      <SocialMedia.Item>
        <Link href="https://github.com/stockmouton/lenia.world">
          <GithubLogo height={18} />
        </Link>
      </SocialMedia.Item>
    </SocialMedia>
  </StyledFooter>
)

export default Footer;