import React, { useRef, useEffect, useState } from "react"

import artifacts from '../artifacts.json'
import { useWeb3 } from "./web3-provider"

const Engine = ({ lenia_id }) => {
    const { web3Provider, account } = useWeb3()
    const [contract, setContract] = useState(null)

    const nodeRef = useRef(null);
    useEffect(async () => {
        const contract = web3Provider ? new web3Provider.eth.Contract(artifacts.contracts.Lenia.abi, artifacts.contracts.Lenia.address) : null
        
        if (contract) {
            setContract(contract)

            const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
            if (lenia_id > totalLeniaMinted) {
                lenia_id = 0;
            }
            // const lenia_metadata_json = await contract.methods.getMetadata(lenia_id).call({ from: account })
            // const lenia_cells = await contract.methods.getLeniaCells(lenia_id).call({ from: account })
            // const lenia_metadata = JSON.parse(lenia_metadata_json)
            // lenia_metadata["config"]["cells"] = lenia_cells

            if ( !('leniaEngine' in window) ) {
                const engine = await contract.methods.getEngine().call({ from: account })
                var script = document.createElement('script');
                script.innerHTML = engine
                document.body.appendChild(script);
            }
        } else {
            const all_metadata = require('../../static/metadata/all_metadata.json')
            require('../engine')
            const lenia_metadata = all_metadata[0]
            if (nodeRef.current) {
                window.leniaEngine.init(lenia_metadata);
                window.leniaEngine.run();
            }
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

export default Engine