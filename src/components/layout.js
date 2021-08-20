/**
 * Layout component
 */

import * as React from "react"
import PropTypes from "prop-types"
import { StaticImage } from "gatsby-plugin-image"

import 'sanitize.css';
import GlobalStyles from "../global-styles";
import NavBar from "./navbar";
import Button from "./button"

const Layout = ({ children }) => {

  return (
    <>
      <GlobalStyles />
      <NavBar>
        <NavBar.Brand href="/">
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
            <NavBar.Link>The N(i)FTy gritty</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
            <NavBar.Link>Bestiary</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
            <NavBar.Link>A bit of history</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
            <NavBar.Link>But why owning you say</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
              <NavBar.Link>(A sort of) Roadmap</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
            <NavBar.Link>Family Portrait</NavBar.Link>
          </NavBar.Item>
          <NavBar.Item>
            <NavBar.Button>Connect Wallet</NavBar.Button>
          </NavBar.Item>
        </NavBar.List>
      </NavBar>
      <main>{children}</main>
      <footer
        style={{
          marginTop: `2rem`,
        }}
      >
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
