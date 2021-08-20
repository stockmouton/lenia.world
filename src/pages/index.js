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
        <Button>Mint it!</Button>
      </Jumbotron>
      <Section>
        <Section.Header><h1>The N(i)FTy Gritty</h1></Section.Header>
        <p>We explained everything about tokenomics here: number of creatures, traits, what happens when minting and selling on second market in terms of fee redistribution. What you will own at the end, etc.</p>
      </Section>
      <Section>
        <Section.Header><h1>Bestiary</h1></Section.Header>
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
      </Section>
      <Section>
        <Section.Header><h1>(A sort of) Roadmap</h1></Section.Header>
        <p>Well the roadmap but in a wonky funny way.</p>
      </Section>
      <Section>
        <Section.Header><h1>Family Portrait</h1></Section.Header>
        <p>The team of course</p>
      </Section>
    </Container>
  </Layout>
)

export default IndexPage
