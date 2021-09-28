import React from "react"
import queryString from 'query-string'

import {Web3Provider} from "../components/web3-provider";
import Layout from "../components/layout"
import Engine from "../components/engine"

const LeniaPage = ({ location }) => {
    const data = queryString.parse(location.search)
    let lenia_id = parseInt(data['id'], 10)
    if (isNaN(lenia_id)) {
        lenia_id = 0;
    }

    return (
        <Web3Provider>
            <Layout>
                <Engine lenia_id={lenia_id} />
            </Layout>
        </Web3Provider>
    )
}

export default LeniaPage