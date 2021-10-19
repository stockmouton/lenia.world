import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import {Web3Provider} from "../components/web3-provider";
import Layout from "../components/layout"
import GeneratorOnChain from "../components/generator-on-chain"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    const [scale] = useQueryParam("scale", NumberParam);
    const [fps] = useQueryParam("fps", NumberParam);
    
    return (
        <Web3Provider>
            <Layout>
            <Generator fps={fps || 30} scale={scale || 1} lenia_id={id || 0} />
            </Layout>
        </Web3Provider>
    )
}

export default GeneratorPage