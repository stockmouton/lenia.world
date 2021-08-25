import * as React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Container from "../components/container";
import Seo from "../components/seo"
import Jumbotron from "../components/jumbotron"
import Lead from "../components/lead"
import Button from "../components/button"
import HeroBackground from "../components/hero-background"
import Section from "../components/section"

import Beast from "../images/beast.mp4"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <HeroBackground>
      <video width="100%"  preload='auto' loop autoPlay muted>
        <source src={Beast} type="video/mp4" />
      </video>
    </HeroBackground>
    <Container>
      <Jumbotron>
        <h1>Enter the Lenia Metaverse...</h1>
        <Lead>
          <p>The dry part: Lenia is a collection of 1337 artificial life-forms discovered via evolutionary computation. They live as unique digital collectibles (NFT) on the Ethereum blockchain.</p>
          <p>The wet part: If you ever let your cactus or your Tamagotchi die because you were too busy or just sadistic, then this is for you. It's the power of math baby: they are born (or not), they move (or not) and they live their life unapologetically usually with nobody lifting their little finger...</p>
        </Lead>
        <Button>Mint day to be announced!</Button>
      </Jumbotron>
      <Section>
        <Section.Header><h1>The N(i)FTy Gritty</h1></Section.Header>
        <p>The first NFTS which are note designed but discovered: All of the creatures that will be showcased in this collections are discovered in very complex mathematical world. Those wolrd are actually so complex taht it would be very tedious (if not impossible) to discover them by hands. This is why we designed sone Artificial intelligence to help us find them.</p>
        <p>Every Lenia minted in this very first collection will give you access to revenue sharing:
          - 1% of all sales on the secondary market will be redistributed to lenia's owners
          - 1% of all future sales of new lenia collections (see roadmap) will be redistributed to lenia's owners
        </p>
        <p>
          Each Lenia of the first collection will give you access to the Stockmouton DAO (more on the missionf of stockmouton here: stockmouton.com)
        </p>
        <p>At mint time, Lenia traits will be revealed but the creature itseld will not (see bestiray)</p>
        <p>Every lenia, gives the owner exclusive access to the high resolution version displayed in the custom rendering engine (might need a beeffy computer thouhg). Plus the capacity to see how the creatures interact with itself in the playground</p>
        <p>
          All minting information (Date, Price, etc.) will be announced soon.
          - The minting will happen as a dutch auction starting from 1 ETH and decreasing from here down to 0.05ETH every hour.
        </p>

      </Section>
      <Section>
        <Section.Header><h1>Bestiary</h1></Section.Header>
        <p>
          Each time a lenia is minted, thw owner will be able to decide to show it to the community or not. This move cannot be undone.
          If one decides to show it, the Lenia will appear in the pokedex and in OpenSea (A marketplace).
        </p>
        
        <p>The Pokedex for Lenia is the best example. We can have the name, the traits, some funny description like the Pokedex in the Pokemon Gameboy Game with the video.</p>
        <p>It will also show the creatures you own</p>
      </Section>
      <Section>
        <Section.Header><h1>A bit of history</h1></Section.Header>
        <p>Introduce the researcher behind the lenia, the whole concept, link to the references, etc.</p>
      </Section>
      <Section>
        <Section.Header><h1>But why owning you say</h1></Section.Header>
        <p>The perks of owning a Lenia in the future</p>
        <p>
          This project is not just about cool arts, speculation or redistribution to our community and partner. It is also a project which aims at advancing Artificial Life reseach.
          What comes out of this cutting edge research will fueled innovation in the Stockmouton DAO.
        </p>
      </Section>
      <Section>
        <Section.Header><h1>(A sort of) Roadmap</h1></Section.Header>
        <p>Well the roadmap but in a wonky funny way.</p>
        <p>25% we release the javascript rendering engine and open the playground</p>
        <p>50%</p>
        <p>100% We redistribute money to our collaborators and the association to save the ocean. 3 Eth will be used to load up our AWS account. And we start working like monkeys on the higher complexity mathematical space for more lenias.</p>
      </Section>
      <Section>
        <Section.Header><h1>Family Portrait</h1></Section.Header>
        <p>Jean-mimi le roi du baby et Roger le roi du rosée (learn French to understand this section)</p>
      </Section>
    </Container>
  </Layout>
)

export default IndexPage
