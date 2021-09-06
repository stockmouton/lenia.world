import * as React from "react"
import Layout from "../components/layout"
import Container from "../components/container";
import Seo from "../components/seo"
import Jumbotron from "../components/jumbotron"
import Lead from "../components/lead"
import Button from "../components/button"
import HeroBackground from "../components/hero-background"
import Section from "../components/section"
import Panel from "../components/panel"
import Sidebar from "../components/sidebar"
import Grid from "../components/grid"
import Profile from "../components/profile"
import {Web3Provider} from "../components/web3-provider";
import MintButton from "../components/mint-button";

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
      <Sidebar>
          <Sidebar.List>
            <Sidebar.Item>
              <Sidebar.Link href="#nifty-gritty">The N(i)FTy gritty</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#leniadex">Leniadex</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#a-bit-of-history">A bit of history</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#but-why-owning-you-say">But why owning you say</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
                <Sidebar.Link href="#roadmap">(A sort of) Roadmap</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#the-folks-we-care-about">The folks we care about</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#family-portrait">Family Portrait</Sidebar.Link>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.Link href="#quite-queried-questions">Quite Queried Questions</Sidebar.Link>
            </Sidebar.Item>
          </Sidebar.List>
        </Sidebar>
      <Container>
        <Jumbotron>
          <h1>Enter the Lenia Metaverse...</h1>
          <Lead>
            <p>The dry part: Lenia is a collection of 1337 artificial life-forms discovered via evolutionary computation. They live as unique digital collectibles (NFT) on the Ethereum blockchain.</p>
            <p>The wet part: If you ever let your cactus or your Tamagotchi die because you were too busy or just sadistic, then this is for you. It's the power of math baby: they are born (or not), they move (or not) and they live their life unapologetically usually with nobody lifting their little finger...</p>
          </Lead>
          <MintButton />
        </Jumbotron>
        <Section id="leniadex">
          <Section.Header><h1>Leniadex</h1></Section.Header>
          <p>
            Each time a lenia is minted, thw owner will be able to decide to show it to the community or not. This move cannot be undone.
            If one decides to show it, the Lenia will appear in the pokedex and in OpenSea (A marketplace).
          </p>
          
          <p>The Pokedex for Lenia is the best example. We can have the name, the traits, some funny description like the Pokedex in the Pokemon Gameboy Game with the video.</p>
          <p>It will also show the creatures you own</p>
        </Section>
        <Section id="nifty-gritty">
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
        <Section id="but-why-owning-you-say">
          <Section.Header><h1>But why owning you say</h1></Section.Header>
          <p>The perks of owning a Lenia in the future</p>
          <p>
            This project is not just about cool arts, speculation or redistribution to our community and partner. It is also a project which aims at advancing Artificial Life reseach.
            What comes out of this cutting edge research will fueled innovation in the Stockmouton DAO.
          </p>
        </Section>
        <Section id="a-bit-of-history">
          <Section.Header><h1>A bit of history</h1></Section.Header>
          <p>Introduce the researcher behind the lenia, the whole concept, link to the references, etc.</p>
        </Section>
        <Section id="roadmap">
          <Section.Header><h1>(A sort of) Roadmap</h1></Section.Header>
          <p>Well the roadmap but in a wonky funny way.</p>
          <p>25% we release the javascript rendering engine and open the playground</p>
          <p>50%</p>
          <p>100% We redistribute money to our collaborators and the association to save the ocean. 3 Eth will be used to load up our AWS account. And we start working like monkeys on the higher complexity mathematical space for more lenias.</p>
        </Section>
        <Section id="the-folks-we-care-about">
          <Section.Header><h1>The folks we care about</h1></Section.Header>
          <p>The following people or organizations will be donated:</p>
          <ul>
            <li>5% of all primary sales</li>
            <li>1% of all secondary sales</li>
          </ul>
          <Grid>
            <Grid.Cell>
              <Profile
                name="Bert Chan"
                pictureSrc="https://pbs.twimg.com/profile_images/973083119661170688/bJWrUft8_400x400.jpg" 
                twitterHandle="BertChakovsky"
                role="Independent Researcher on Artificial Life"
                description={<p>He is the original researcher behind the Lenia lifeforms and nothing would have been possible without his scientific work.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
            <Profile
                name="Unknown Organization"
                pictureSrc="https://previews.123rf.com/images/goldenadele/goldenadele1910/goldenadele191000002/132524846-save-the-ocean-square-vector-image-the-environment-protection-vector-design-for-a-poster-flyer-print.jpg" 
                role="Protecting the world's oceans and marine life"
                description={<p>COMING SOON...</p>}
              />
            </Grid.Cell>
          </Grid>
        </Section>
        <Section id="family-portrait">
          <Section.Header><h1>Family Portrait</h1></Section.Header>
          <Grid>
            <Grid.Cell>
              <Profile
                name="Morgan Giraud"
                pictureSrc="https://pbs.twimg.com/profile_images/1115639997183426564/NC2UpU3A_400x400.png" 
                twitterHandle="morgangiraud"
                role="Big Brain Energy"
                description={<p>The collection creator, spent way too much time running his exploratory algorithms to discover these creatures.</p>}
              />
            </Grid.Cell>
            <Grid.Cell>
            <Profile
                name="Alex Orange"
                pictureSrc="https://pbs.twimg.com/profile_images/765306239920332800/y_6BlU3q_400x400.jpg" 
                twitterHandle="orangealexandre"
                role="The muscles"
                description={<p>His main skill is knowing the creator, the other ones involve web and smart contract development.</p>}
              />
            </Grid.Cell>
          </Grid>
        </Section>
        <Section id="quite-queried-questions">
          <Section.Header><h1>Quite Queried Questions</h1></Section.Header>
          <Panel
            heading="Question 1"
            body={<p>Answer 1</p>}
          />
          <Panel
            heading="Question 2"
            body={<p>Answer 2</p>}
          />
        </Section>
      </Container>
    </Layout>
  </Web3Provider>
)

export default IndexPage
