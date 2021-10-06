import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import {Web3Provider} from "../components/web3-provider";
import Layout from "../components/layout"
import Generator from "../components/generator"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    
    return (
        <Web3Provider>
            <Layout>
                <Generator onchain={true} lenia_id={id || 0} />
            </Layout>
        </Web3Provider>
    )
}

export default GeneratorPage