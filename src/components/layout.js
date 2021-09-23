import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"
import MenuButton from "./menu-button"
import 'sanitize.css';
import GlobalStyles, {createMediaQuery, BREAKPOINTS} from "../global-styles";
import NavBar from "./navbar";
import WalletConnectorButton from "./wallet-connector-button";
import Link from "./link";
import Footer from "./footer";
import {networkName} from '../utils/wallet'

const Main = styled.main`
  margin-top: 30px;

  ${createMediaQuery(BREAKPOINTS.xl, 'margin-left: 300px')}
  ${createMediaQuery(BREAKPOINTS.xxl, 'margin-left: 0')}
`

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <NavBar>
        {process.env.STAGING && <NavBar.Banner>This website is in early alpha: please use the {networkName} network for testing purposes and use at your own caution!</NavBar.Banner>}
        <NavBar.Wrapper>
          <NavBar.Brand href="#home">
            <StaticImage
              src="../images/orbium.png"
              width={27}
              quality={95}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="Lenia"
            />
            {' '} Lenia
          </NavBar.Brand>
          <NavBar.List>
            <NavBar.Item.UnderXl>
              <MenuButton />
            </NavBar.Item.UnderXl>
            <NavBar.Item.AboveMd>
              <NavBar.Link href="https://twitter.com/lenia_nft">Twitter</NavBar.Link>
            </NavBar.Item.AboveMd>
            <NavBar.Item.AboveMd>
              <NavBar.Link href="https://discord.gg/4TFNnCkJta">Discord</NavBar.Link>
            </NavBar.Item.AboveMd>
            {/* <NavBar.Item.AboveMd>
              <NavBar.Link>Etherscan</NavBar.Link>
            </NavBar.Item.AboveMd>
            <NavBar.Item.AboveMd>
              <NavBar.Link>OpenSea</NavBar.Link>
            </NavBar.Item.AboveMd> */}
            <NavBar.Item.AboveMd>
              <NavBar.Link href="https://github.com/stockmouton/lenia.stockmouton.com">Github</NavBar.Link>
            </NavBar.Item.AboveMd>
            <NavBar.Item>
              <WalletConnectorButton />
            </NavBar.Item>
          </NavBar.List>
        </NavBar.Wrapper>
      </NavBar>
        
      <Main id="home">{children}</Main>
      <Footer>
        © {new Date().getFullYear()}, Built with all the love and care in the world by
        {` `}
        <Link href="https://stockmouton.com">Stockmouton</Link>
      </Footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
