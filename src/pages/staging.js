import React from "react"
import Layout from "../components/layout"
import Container from "../components/container";
import Seo from "../components/seo"
import Jumbotron from "../components/jumbotron"
import Lead from "../components/lead"
import HeroBackground from "../components/hero-background"
import Section from "../components/section"
import Sidebar from "../components/sidebar"
import NavMenu from "../components/nav-menu"
import Grid from "../components/grid"
import Profile from "../components/profile"
import {Web3Provider} from "../components/web3-provider";
import MintButton from "../components/mint-button";
import Link from "../components/link";
import LeniaDex from "../components/leniadex";

const StagingPage = () => (
  <Web3Provider>
    <Layout>
      <Seo title="Home" />
      <HeroBackground />
      <Sidebar>
          <NavMenu />
      </Sidebar>
      <Container>
        <Jumbotron>
          <h1>Enter the Leniaverse...</h1>
          <Lead>
            <p>
              Bonsoir beautiful stranger, join us on our big adventure in this uncharted part of the metaverse where mathematics meet life.
            </p>
            <p>  
              After five long and unforgiving months of exploring a tiny part of this world, 202 unique life-forms have been discovered and ready to be unleashed on the Ethereum blockchain.
            </p>
            <p>
              Their name: Lenia.
            </p>
          </Lead>
          <MintButton />
        </Jumbotron>
        <Section id="#niftty-gritty">
          <Section.Header><h1>N(i)FTty-gritty</h1></Section.Header>
          <ul>
            <li>202 Lenia to mint</li>
            <li>You can only mint one Lenia per transaction</li>
            <li>Mint date: TBA</li>
            <li>Price: TBA</li>
          </ul>
          
          <article>
            <h2>Tokenomics</h2>
            <ul>
              <li>Every Lenia gives you automatic membership to the DAO.</li>
              <li>50% of primary sales are collected by the StockMouton DAO (the rest is sent to the creators).</li>
              <li>7.5% of royalties on secondary sales, of which 33% are collected by the StockMouton DAO.</li>
              <li>All further decisions will be proposed and decided by the DAO after the primary sale is complete.</li>
            </ul>
          </article>
          
          <article>
            <h2>About the collection</h2>
            <ul>
              <li>Lenias are pure mathematical creatures and a subject of active research in the field of Articifial Life.</li>
              <li>They are also gorgeous and give some kind of meditative vibes.</li> 
              <li>Their properties (and the rendering engine!) are fully stored on chain.</li>
              <li>Those Lenia are <Link href="https://creativecommons.org/publicdomain/zero/1.0/">public domain</Link>.</li>
            </ul>
          </article>
          
        </Section>
        <Section id="leniadex">
          <Section.Header><h1>Leniadex</h1></Section.Header>
          <LeniaDex />
        </Section>
        <Section id="but-why-though">
          <Section.Header><h1>But Why Though?</h1></Section.Header>
          <article>
            <h2>The Lenia Origins</h2>
            <p>We are ML and crypto enthusiasts and we believe that beyond the inherent hype, the future will be shaped by those 2 technologies.</p>
            <p>It just happens that the beautiful subject of artificial life is a perfect medium to provide a visual support for NFTs, which are also perfect to foster a community and empower more research!</p>
            <p>Moreover, Lenias are not just nice and complex mathematical animations: they are as well a research subject in the field of artificial life.</p>
            <p>Many questions are still unanswered in this field and this project aim to help researchers answer one of the hard questions: how one can automatically and efficiently discovers those mathematical creatures?</p>
            <p>The answers lies in the field of Artificial Intelligence and requires the work of many to bear fruits! This is why we participates in the <Link href="https://openlenia.github.io/">Open Science Lenia initiative</Link> by opensourcing of AI tools to search for Lenias! If you want to learn more about it, check <Link href="https://chakazul.github.io/lenia.html">Bert Chan website</Link> or come in our <Link href="https://discord.gg/4TFNnCkJta">Discord</Link>, Morgan will be more than happy to satisfy your curiosity!</p>
          </article>
          
          <article>
            <h2>Stockmouton DAO</h2>
            <p>Beyond this NFT collection, we also aim to build a community-run DAO.</p>
            <p>This first collection is only the first step of the project, you can expect more state-of-the-art work which will contribute to the value of the DAO.</p>
            <p>Its vision, goals and future projects are intended be defined by the DAO itself, as long as it keeps aligned with its values. See <Link href="https://stockmouton.com">the Stockmouton website</Link> for more information</p>  
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
                description={<p>Nothing matters in the end.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
            <Profile
                name="Alex Orange"
                pictureSrc="https://pbs.twimg.com/profile_images/765306239920332800/y_6BlU3q_400x400.jpg" 
                twitterHandle="orangealexandre"
                role="Just the muscles"
                description={<p>Not so salty about GME</p>}
              />
            </Grid.Cell>
          </Grid>
        </Section>
        {/* <Section id="quite-queried-questions">
          <Section.Header><h1>Quite Queried Questions</h1></Section.Header>
          <Panel
            heading="Question 1"
            body={<p>Answer 1</p>}
          />
          <Panel
            heading="Question 2"
            body={<p>Answer 2</p>}
          />
        </Section> */}
      </Container>
    </Layout>
  </Web3Provider>
)

export default StagingPage
