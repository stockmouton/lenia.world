import React from "react"
import { useQueryParam, BooleanParam } from "use-query-params";
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
import SoldOutButton from "../components/sold-out-button";
import Link from "../components/link";
import Panel from "../components/panel";
import LeniaDex from "../components/leniadex"
import { LeniaContractProvider } from "../components/lenia-contract-provider";

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
                <h1>Enter the Leniaverse...</h1>
                <Lead>
                  <p>
                    After months of exploring the Leniaverse, 202 unique life-forms have been discovered and unleashed on the Ethereum blockchain. Their name: <b>Lenia</b>.
                  </p>
                  <p>
                    Join us on our big adventure in this uncharted part of the metaverse where Artificial Intelligence meets Art & Emerging Life.
                  </p>
                </Lead>
                <SoldOutButton />
              </Jumbotron>
              <LeniaDex />
              <Section id="niftty-gritty">
                <Section.Header><h1>N(i)FTty-gritty</h1></Section.Header>
                <article>
                  <h2>What is Lenia?</h2>
                  <ul>
                    <li>Lenia are pure mathematical creatures and a subject of active research in the field of Artificial Life.</li>
                    <li>They are also gorgeous and give some kind of meditative vibes.</li>
                    <li>Open Source: everything we do is open! Check our <Link href="https://github.com/stockmouton/lenia.stockmouton.com">Github</Link>!</li>
                  </ul>
                </article>

                <article>
                  <ul>
                    <li><b>Total number of Lenia:</b> 202</li>
                    <li><b>Price per Lenia:</b> 0.15 ETH</li>
                    <li><b>Mint date:</b> Thursday, October 7th, 6PM UTC</li>
                    <li><b>Premint pass:</b> 50 (12 hours window to mint before the public sale starts)</li>
                    <li>Mint one Lenia per transaction</li>
                    <li>Metadata and Rendering Engine are stored on chain</li>
                  </ul>
                </article>

                <article>
                  <h2>Membership Perks</h2>
                  <ul>
                    <li>Lenia is an evolutive collection. Future Lenia will be derived from <b>Genesis Lenia</b> that will provide benefits for their owners.</li>
                    <li>Every Lenia gives you <b>membership</b> to the <Link href="#dao">DAO</Link>.</li>
                    <li>Support AI ecosystem and research. <Link href="https://chakazul.github.io/lenia.html" target="_blank">Bert Chan</Link> has been working on Lenia since 2015 and created the <Link href="https://openlenia.github.io/" target="_blank">Open Science Lenia project</Link> to push the research further. By collecting Lenia, you support this initiative.</li>
                    <li>We ♥ Science: access exclusive channels on Discord to talk about AI, Crypto, Math, and more!</li>
                  </ul>
                </article>
              </Section>
              <Section id="why-though">
                <Section.Header><h1>Why Though?</h1></Section.Header>
                <article>
                  <h2>Lenia Origins</h2>
                  <p>We are Machine Learning and Crypto enthusiasts and we believe that beyond the inherent hype, the future will be shaped by those 2 technologies.</p>
                  <p>It just happens that the beautiful subject of artificial life is a perfect medium to provide visual support for NFTs, which are also perfect to foster a community and empower more research!</p>
                  <p>Lenia are not just nice and complex mathematical animations: they are as well a research subject in the field of artificial life.</p>
                  <p>Many questions are still unanswered in this field and this project aims to help researchers answer one of the hard questions: how one can automatically and efficiently discover those mathematical creatures?</p>
                  <p>The answer lies in the field of Artificial Intelligence and requires the work of many to bear fruits! This is why we participate in the <Link href="https://openlenia.github.io/">Open Science Lenia initiative</Link> by open-sourcing AI tools to search for Lenia!</p>
                </article>

                <article>
                  <h2 id="dao">DAO</h2>
                  <p>We aim at building a community-run DAO for all our projects.</p>
                  <p>This collection is only the first step. You can expect us to make the project live in the long term by developing more AI x Crypto work, which will bring more value to the <Link href="#dao">DAO</Link>.</p>
                  <p>
                    The DAO gets income from:
                    <ul>
                      <li><b>50% of primary sales</b></li>
                      <li><b>2.5% of secondary sales</b> (7.5% total)</li>
                    </ul>

                    <p>All further decisions will be proposed and decided by the DAO after the primary sale is complete.</p>
                  </p>
                  <p>Its vision, goals, and future projects are intended to be defined by the DAO itself, as long as it keeps aligned with its values. Come discuss in our <Link href="https://discord.gg/4TFNnCkJta">Discord</Link> for more information.</p>
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
              <Section id="quite-asked-questions">
                <Section.Header><h1>Quite Asked Questions</h1></Section.Header>
                <Panel
                  heading="What are Lenia?"
                  body={<p>Lenia are pure mathematical creatures and a subject of active research in the field of Artificial Life. See this <Link href="https://twitter.com/lenia_nft/status/1443662675536498692?s=20">Twitter thread</Link> for more explanation.</p>}
                />
                <Panel
                  heading="When was the launch date?"
                  body={<p>Launch date for the genesis collection happened on Thursday, October 7th 2021.</p>}
                />
                <Panel
                  heading="What is the DAO?"
                  body={<p>The DAO is the pillar of all projects. By minting a Lenia, you get a membership to this DAO.</p>}
                />
              </Section>
            </Container>
          </Layout>
        </LeniaContractProvider>
      </Web3ModalProvider>
    </Web3Provider>
  )
}

export default IndexPage