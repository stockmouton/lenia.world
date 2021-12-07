import React from "react"
import Layout from "../components/layout"
import Container from "../components/container";
import Seo from "../components/seo"
import Jumbotron from "../components/jumbotron"
import Lead from "../components/lead"
import HeroBackground from "../components/hero-background"
import Section from "../components/section"
import Grid from "../components/grid"
import Profile from "../components/profile"
import { Web3Provider } from "../components/web3-provider";
import { Web3ModalProvider } from "../components/web3-modal-provider"
import Link from "../components/link";
import Button from "../components/button";
import { LeniaContractProvider } from "../components/lenia-contract-provider";
import { useQueryParam, BooleanParam } from "use-query-params";

import BBA_PICTURE from "../images/bba.png"
import ALEX_PICTURE from "../images/alexorange.jpeg"
import MORGAN_PICTURE from "../images/morgangiraud.png"
import TOOMAIE_PICTURE from "../images/toomaie.jpeg"

const IndexPage = () => {
  const [isStaging] = useQueryParam("staging", BooleanParam)
  return (
    <Web3Provider>
      <Web3ModalProvider>
        <LeniaContractProvider>
          <Layout>
            <Seo title="Home" />
            <HeroBackground />
            <Container>
              <Jumbotron>
                <h1>Lenia Research</h1>
                <Lead>
                  <p>
                    After releasing 202 unique life-forms on the Ethereum blockchain. We are now working on a self-funding decentralized and transparent research lab to help us funds our journey to explore Lenia deeper!
                  </p>
                  <p>
                    Help us create a new economically viable way of doing open research!
                  </p>
                </Lead>
                <Link href="#research-lab">
                  <Button>
                    Learn more!
                  </Button>
                </Link>
              </Jumbotron>
              <Section id="research-lab">
                <Section.Header><h1>The research lab</h1></Section.Header>
                <article>
                  <h2>Origins</h2>
                  <p>We are Machine Learning and Crypto enthusiasts and we believe that beyond the inherent hype, the future will be shaped by those 2 technologies.</p>
                  <p>It just happens that the beautiful subject of artificial life is a perfect medium to provide visual support for NFTs, which are also perfect to foster a community and empower more research!</p>
                  <p>Lenia are not just nice and complex mathematical animations: they are as well a research subject in the field of artificial life.</p>
                  <p>Many questions are still unanswered in this field and this project aims to help researchers answer one of the hard questions: how one can automatically and efficiently discover those mathematical creatures?</p>
                  <p>The answer lies in the field of Artificial Intelligence and requires the work of many to bear fruits! This is why we participate in the <Link href="https://openlenia.github.io/">Open Science Lenia initiative</Link> by open-sourcing AI tools to search for Lenia!</p>
                </article>

                <article>
                  <h2 id="dao">DAO</h2>
                  <p>We aim at building a self-funding, decentralized ans transparent research lab for all our projects. All our work is open-source.</p>
                  <p>You can expect us to make the project live in the long term by developing more AI x Crypto work, which will bring more value to the <Link href="#dao">DAO</Link>.</p>
                  <p>
                    Currently the DAO gets income from:
                    <ul>
                      <li><b>50% of primary sales of the Lenia Genesis NFT collection</b></li>
                      <li><b>2.5% of secondary sales of the Lenia Genesis NFT collection</b> (7.5% total)</li>
                    </ul>

                    <p>All further decisions will be proposed and decided by the DAO after the primary sale is complete.</p>
                  </p>
                  <p>Its vision, goals, and future projects are intended to be defined by the DAO itself, as long as it keeps aligned with its values. Come discuss in our <Link href="https://discord.gg/4TFNnCkJta">Discord</Link> for more information.</p>
                </article>
              </Section>
              <Section id="research">
                <Section.Header><h1>On-going research</h1></Section.Header>
                <article>
                  <h2>Lenia Genesis NFT collection</h2>
                  <p>
                    Our first project has been to work on an <Link href="https://quality-diversity.github.io">quality-diversity algorithm</Link> which could find automatically Lenia creatures.
                    To do so we built a new library to simulate Lenia called Leniax. Which consist of a set of tools written in <Link href="https://github.com/google/jax">JAX</Link> to facilitate the exploration of the Leniaverse.
                  </p>
                  <p>The algorithm discovered hundreds of potentials creatures. And we curated the 202 most interesting ones from that set manually.</p>
                  <p>This is currently the best way to show your support! Each sells reward the DAO and help us fund more research!</p>
                </article>
                <div style={{ textAlign: 'center', marginTop: '1rem'}}>
                  <Link href="/lenia-genesis" target="">
                    <Button>  
                      Check them out!
                    </Button>
                  </Link>
                </div>
                <article>
                  <h2>More to come.</h2>
                  <p>
                    Now that the first proof-of-concept of research-powered NFT collection has been established. The goal is to keep pushing the envelope on Lenia and explore more complex variations of the Leniaverse.
                  </p>
                </article>
              </Section>
              <Section id="family-portrait">
                <Section.Header><h1>Family Portrait</h1></Section.Header>
                <Grid md={2}>
                  <Grid.Cell>
                    <Profile
                      name="Morgan Giraud"
                      pictureSrc={MORGAN_PICTURE}
                      twitterHandle="morgangiraud"
                      role="Big Brain Energy"
                      description={<p>ML amateur and crypto enthusiast. Tends to be lost in math.</p>}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Profile
                      name="Alex Orange"
                      pictureSrc={ALEX_PICTURE}
                      twitterHandle="orangealexandre"
                      role="Just the muscles"
                      description={<p>Full-stack developer, humble yield farmer, sprinkles some Solidity in his daily life</p>}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Profile
                      name="BBA"
                      pictureSrc={BBA_PICTURE}
                      twitterHandle="ape6743"
                      role="Apefluencer"
                      description={<p>Metaverse famous apefluencer, jack of all trades, master of none.</p>}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Profile
                      name="Toomaie"
                      pictureSrc={TOOMAIE_PICTURE}
                      twitterHandle="toomaie"
                      role="Passing By"
                      description={<p>Generative Art &amp; Cellular Automata mad scientist. Speaking Solidity.</p>}
                    />
                  </Grid.Cell>
                </Grid>
              </Section>
            </Container>
          </Layout>
        </LeniaContractProvider>
      </Web3ModalProvider>
    </Web3Provider>
  )
}

export default IndexPage