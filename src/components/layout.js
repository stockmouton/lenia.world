import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"

import 'sanitize.css';
import GlobalStyles from "../global-styles";
import NavBar from "./navbar";
import WalletConnectorButton from "./wallet-connector-button";
import Link from "./link";
import Footer from "./footer";

const Main = styled.main`
  margin-top: 30px
`

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <NavBar>
        <NavBar.Banner>This website is in early alpha: please switch to the Rinkeby network for testing purposes and use at your own caution!</NavBar.Banner>
        <div>
          <NavBar.Brand href="#home">
            <StaticImage
              src="../images/lenia-logo.png"
              width={27}
              quality={95}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="Lenia"
            />
            {' '} Lenia
          </NavBar.Brand>
          <NavBar.List>
            <NavBar.Item>
              <NavBar.Link href="https://twitter.com/lenia_nft">Twitter</NavBar.Link>
            </NavBar.Item>
            <NavBar.Item>
              <NavBar.Link href="https://discord.gg/RGFDGMKg">Discord</NavBar.Link>
            </NavBar.Item>
            <NavBar.Item>
              <NavBar.Link>Etherscan</NavBar.Link>
            </NavBar.Item>
            <NavBar.Item>
              <NavBar.Link>OpenSea</NavBar.Link>
            </NavBar.Item>
            <NavBar.Item>
              <WalletConnectorButton />
            </NavBar.Item>
          </NavBar.List>
        </div>
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
