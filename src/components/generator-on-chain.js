import React, { useRef, useEffect, useState } from "react"
const axios = require('axios');

import artifacts from '../artifacts.json'
import { useWeb3 } from "./web3-provider"
import { getEngineCode } from "../utils/sm"

const GeneratorOnChain = ({ fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    const { web3Provider, account } = useWeb3()
    const [contract, setContract] = useState(null)

    useEffect(async () => {
        const contract = web3Provider ? new web3Provider.eth.Contract(artifacts.contracts.Lenia.abi, artifacts.contracts.Lenia.address) : null
        
        if (contract) {
            setContract(contract)

            const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
            if (lenia_id > totalLeniaMinted) {
                lenia_id = 0;
            }
            
            const response = await axios.get(`metadata/${lenia_id}.json`);
            const leniaMetadata = response.data
            leniaMetadata["config"]["world_params"]["scale"] = scale
            // const engine = getEngineCode(web3Provider, contract, account)
            // const lenia_metadata_json = await contract.methods.getMetadata(lenia_id).call({ from: account })
            // const lenia_cells = await contract.methods.getLeniaCells(lenia_id).call({ from: account })
            // const lenia_metadata = JSON.parse(lenia_metadata_json)
            // lenia_metadata["config"]["cells"] = lenia_cells
            
            const engine = getEngineCode(web3Provider, contract, account)
            if (typeof engine === 'string' && engine.length > 0) {
                var script = document.createElement('script');
                script.innerHTML = engine
                document.body.appendChild(script);
            }

            window.leniaEngine.init(leniaMetadata);
            window.leniaEngine.run(fps);
        }
    }, [web3Provider, account])
    

    return (
        <div ref={nodeRef}>
            <canvas id="CANVAS_CELLS"></canvas>
            <canvas id="CANVAS_FIELD"></canvas>
            <canvas id="CANVAS_POTENTIAL"></canvas>
            <canvas id="CANVAS_HIDDEN" style={{'display': 'none'}}></canvas>
        </div>
    )
}

export default GeneratorOnChain