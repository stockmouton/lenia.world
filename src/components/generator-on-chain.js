import React, { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { simd } from 'wasm-feature-detect';

import { useLeniaContract } from './lenia-contract-provider'
import { useWeb3 } from "./web3-provider"
import { getEngineCode } from "../utils/sm"

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const GeneratorOnChain = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    const { web3Provider, account } = useWeb3()
    const { contract } = useLeniaContract()

    useEffect(async () => {
        if (contract) {
            const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
            if (lenia_id > totalLeniaMinted) {
                lenia_id = 0;
            }

            const hasSIMD = await simd();
            const WASMKey = hasSIMD
                ? 'engine-simd'
                : 'engine'
            const [WASMSource, WASMSIMDSource, engineBytes] = await getEngineCode(web3Provider, contract, account)
            const WASMByteCode = hasSIMD ? WASMSIMDSource : WASMSource
            const engine = engineBytes.toString('utf-8')
            console.log(engine)
            if (typeof engine === 'string' && engine.length > 0) {
                var script = document.createElement('script');
                script.innerHTML = engine
                document.body.appendChild(script);
            }

            const leniaResponse = await fetch(`/metadata/${lenia_id}.json`);
            let leniaMetadata = await leniaResponse.json()
            leniaMetadata["config"]["world_params"]["scale"] = scale
            // const engine = getEngineCode(web3Provider, contract, account)
            // const lenia_metadata_json = await contract.methods.getMetadata(lenia_id).call({ from: account })
            // const lenia_cells = await contract.methods.getLeniaCells(lenia_id).call({ from: account })
            // const lenia_metadata = JSON.parse(lenia_metadata_json)
            // lenia_metadata["config"]["cells"] = lenia_cells
            
            

            window.leniaEngine.init(WASMByteCode, WASMKey, leniaMetadata, zoom, fps);
        }
    }, [web3Provider, account])
    

    return (
        <StyledDiv ref={nodeRef}>
            <canvas id="RENDERING_CANVAS"></canvas>
        </StyledDiv>
    )
}

export default GeneratorOnChain