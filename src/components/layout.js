import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import MenuTrigger from "./menu-trigger"
import 'sanitize.css';
import GlobalStyles, {createMediaQuery, BREAKPOINTS} from "../global-styles";
import NavBar from "./navbar";
import NavMenu from "./nav-menu"
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

const MenuButtonText = styled.span`
  display: none;

  ${createMediaQuery(BREAKPOINTS.sm, 'display: inline')}
`

const NavBarWrapper = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  height: 27px;
`

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <NavBarWrapper>
        <NavBar>
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
              <MenuTrigger menu={<NavMenu />}>
                ☰ <MenuButtonText>Menu</MenuButtonText>
              </MenuTrigger>
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
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://opensea.io/collection/lenia-nft">
                <BrandLogo><OpenseaLogo height={18} /></BrandLogo>
                <BrandName>Opensea</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://etherscan.io/address/0xe95004c7f061577df60e9e46c1e724cc75b01850">
                <BrandLogo><EtherscanLogo height={18} /></BrandLogo>
                <BrandName>Etherscan</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link href="https://github.com/stockmouton/lenia.stockmouton.com">
                <BrandLogo><GithubLogo height={18} /></BrandLogo>
                <BrandName>Github</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <NavBar.Link href="/blog">
                <BrandLogo><GithubLogo height={18} /></BrandLogo>
                <BrandName>Blog</BrandName>
              </NavBar.Link>
            </NavBar.Item.AboveSm>
            <NavBar.Item>
              <WalletConnectorButton />
            </NavBar.Item>
          </NavBar.List>
        </NavBar>
      </NavBarWrapper>
        
      <Main id="home">{children}</Main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
