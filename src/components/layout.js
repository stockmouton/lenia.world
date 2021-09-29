import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import MenuButton from "./menu-button"
import 'sanitize.css';
import GlobalStyles, {createMediaQuery, BREAKPOINTS} from "../global-styles";
import NavBar from "./navbar";
import WalletConnectorButton from "./wallet-connector-button";
import Footer from "./footer";
import { EtherscanLogo, DiscordLogo, GithubLogo, OpenseaLogo, TwitterLogo } from "./brand-logo"

/**
 * If re-adding the sidebar is necessary, add:
 * ${createMediaQuery(BREAKPOINTS.xl, 'margin-left: 300px')}
 * ${createMediaQuery(BREAKPOINTS.xxl, 'margin-left: 0')}
 */
const Main = styled.main`
  margin-top: 30px;
`

const BrandLogo = styled.span`
  ${createMediaQuery(BREAKPOINTS.md, 'display: none')}
`

const BrandName = styled.span`
  display: none;
  ${createMediaQuery(BREAKPOINTS.md, 'display: inline')}
`

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <NavBar>
        <NavBar.Wrapper>
          <NavBar.Brand href="#home">
            <StaticImage
              src="../images/logo.png"
              width={27}
              quality={95}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="Lenia"
            />
            {' '} Lenia
          </NavBar.Brand>
          <NavBar.List>
            <NavBar.Item.UnderSm>
              <MenuButton />
            </NavBar.Item.UnderSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://twitter.com/lenia_nft">
                <BrandLogo><TwitterLogo height={18} /></BrandLogo>
                <BrandName>Twitter</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://discord.gg/4TFNnCkJta">
                <BrandLogo><DiscordLogo height={18} /></BrandLogo>
                <BrandName>Discord</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            {/* <NavBar.Item.AboveSm>
              <NavBar.Link>
                <BrandLogo><OpenseaLogo height={18} /></BrandLogo>
                <BrandName>Opensea</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link>
                <BrandLogo><EtherscanLogo height={18} /></BrandLogo>
                <BrandName>Etherscan</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm> */}
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://github.com/stockmouton/lenia.stockmouton.com">
                <BrandLogo><GithubLogo height={18} /></BrandLogo>
                <BrandName>Github</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item>
              <WalletConnectorButton />
            </NavBar.Item>
          </NavBar.List>
        </NavBar.Wrapper>
      </NavBar>
        
      <Main id="home">{children}</Main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
