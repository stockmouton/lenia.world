import React, { useEffect } from "react"
import { Web3Provider } from "../components/web3-provider"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Container from "../components/container"
import Jumbotron from "../components/jumbotron"
import Lead from "../components/lead"
import Shauns from "../images/shauns.gif"

const NotFoundPage = () => {
  useEffect(() => setTimeout(() => window.location.replace("/"), 5000))

  return (
    <Web3Provider>
      <Layout>
        <Seo title="404: Not found" />
        <Container>
          <Jumbotron>
            <h1>404: Page Not Found</h1>
            <img src={Shauns} />
            <Lead>
              <p>But fret not traveller, you will be redirected to our homepage in a few seconds...</p>
            </Lead>
          </Jumbotron>
        </Container>
      </Layout>
    </Web3Provider>
  )
}

export default NotFoundPage
