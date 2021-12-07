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
import SoldOutButton from "../components/sold-out-button";
import Link from "../components/link";
import Panel from "../components/panel";
import LeniaDex from "../components/leniadex"
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
                    <li>Open Source: everything we do is open! Check our <Link href="https://github.com/stockmouton/lenia.world">Github</Link>!</li>
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