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
import {Web3Provider} from "../components/web3-provider";
import MintButton from "../components/mint-button";
import Link from "../components/link";
import Panel from "../components/panel";

import Beast from "../images/beast.mp4"

const IndexPage = () => (
  <Web3Provider>
    <Layout>
      <Seo title="Home" />
      <HeroBackground>
        <video width="100%"  preload='auto' loop autoPlay muted>
          <source src={Beast} type="video/mp4" />
        </video>
      </HeroBackground>
      <Container>
        <Jumbotron>
          <h1>Enter the Leniaverse...</h1>
          <Lead>
            <p>
              After months of exploring the Leniaverse, 202 unique life-forms have been discovered and ready to be unleashed on the Ethereum blockchain. Their name: <b>Lenia</b>.
            </p>
            <p>
              Join us on our big adventure in this uncharted part of the metaverse where Artifical Intelligence meet Art & Emerging Life.
            </p>
          </Lead>
          <MintButton />
        </Jumbotron>
        <Section id="#niftty-gritty">
          <Section.Header><h1>N(i)FTty-gritty</h1></Section.Header>
          <article>
            <h2>What is Lenia?</h2>
            <ul>
              <li>Lenia are pure mathematical creatures and a subject of active research in the field of Articifial Life.</li>
              <li>They are also gorgeous and give some kind of meditative vibes.</li>
              <li>Open Source: everything we do is open! Check our <Link href="https://github.com/stockmouton/lenia.stockmouton.com">Github</Link>!</li>
            </ul>
          </article>

          <article>
          <ul>
            <li><b>Total number of Lenia:</b> 202</li>
            <li><b>Price per Lenia:</b> TBA</li>
            <li><b>Mint date:</b> TBA</li>
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
              <li>We ♥ Science: access exclusive channels on Discord to talk about AI, Crypto, Maths and more!</li>
            </ul>
          </article>


        </Section>
        <Section id="but-why-though">
          <Section.Header><h1>Why Though?</h1></Section.Header>
          <article>
            <h2>The Lenia Origins</h2>
            <p>We are Machine Learning and Crypto enthusiasts and we believe that beyond the inherent hype, the future will be shaped by those 2 technologies.</p>
            <p>It just happens that the beautiful subject of artificial life is a perfect medium to provide a visual support for NFTs, which are also perfect to foster a community and empower more research!</p>
            <p>Moreover, Lenia are not just nice and complex mathematical animations: they are as well a research subject in the field of artificial life.</p>
            <p>Many questions are still unanswered in this field and this project aims to help researchers answer one of the hard questions: how one can automatically and efficiently discovers those mathematical creatures?</p>
            <p>The answers lies in the field of Artificial Intelligence and requires the work of many to bear fruits! This is why we participates in the <Link href="https://openlenia.github.io/">Open Science Lenia initiative</Link> by opensourcing AI tools to search for Lenia!</p>
          </article>

          <article>
            <h2 id="dao">DAO</h2>
            <p>We aim to build a community-run DAO for all our projects.</p>
            <p>This collection is only the first step. You can expect us to make the project live on the long term by developing more AI x Crypto work, which will bring more value to the <Link href="#dao">DAO</Link>.</p>
            <p>The DAO gets income from:
            <ul>
              <li><b>50% of primary sales</b></li>
              <li><b>2.5% of secondary sales</b> (7.5% total)</li>
            </ul>

            <p>All further decisions will be proposed and decided by the DAO after the primary sale is complete.</p>

            </p>
            <p>Its vision, goals and future projects are intended to be defined by the DAO itself, as long as it keeps aligned with its values. Come discuss in our <Link href="https://discord.gg/4TFNnCkJta">Discord</Link> for more information.</p>
          </article>
        </Section>
        <Section id="family-portrait">
          <Section.Header><h1>Family Portrait</h1></Section.Header>
          <Grid md={2}>
            <Grid.Cell>
              <Profile
                name="Morgan Giraud"
                pictureSrc="https://pbs.twimg.com/profile_images/1115639997183426564/NC2UpU3A_400x400.png"
                twitterHandle="morgangiraud"
                role="Big Brain Energy"
                description={<p>ML amateur and crypto enthusiast. Tends to be lost in math.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
            <Profile
                name="Alex Orange"
                pictureSrc="https://pbs.twimg.com/profile_images/765306239920332800/y_6BlU3q_400x400.jpg"
                twitterHandle="orangealexandre"
                role="Just the muscles"
                description={<p>Not so salty about GME.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
              <Profile
                name="BBA"
                pictureSrc="https://pbs.twimg.com/profile_images/1438171620930199552/kCY1Ikha_400x400.jpg"
                twitterHandle="ape6743"
                role="Apefluencer"
                description={<p>Metaverse famous apefluencer, jack of all trades, master of none.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
            <Profile
                name="Toomaie"
                pictureSrc="https://pbs.twimg.com/profile_images/1440620975314255872/14oEM_B6_400x400.jpg"
                twitterHandle="toomaie"
                role="Passing By"
                description={<p>Generative Art & Cellular Automata mad scientist. Speaking Solidity.</p>}
              />
            </Grid.Cell>
          </Grid>
        </Section>
        <Section id="quite-queried-questions">
          <Section.Header><h1>Quite Asked Questions</h1></Section.Header>
          <Panel
            heading="What are Lenia?"
            body={<p>Lenia are pure mathematical creatures and a subject of active research in the field of Articifial Life.</p>}
          />
          <Panel
            heading="When is launch date?"
            body={<p>Launch date is set to happen early October. Final mint date TBA.</p>}
          />
          <Panel
            heading="What will be the cost?"
            body={<p>The price of each Lenia will be announced soon.</p>}
          />
          <Panel
            heading="What is the DAO?"
            body={<p>The DAO is the pillar of all projects. By minting a Lenia, you get a membership to this DAO.</p>}
          />
        </Section>
      </Container>
    </Layout>
  </Web3Provider>
)

export default IndexPage