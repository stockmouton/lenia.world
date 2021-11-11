import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { simd } from 'wasm-feature-detect';
import { ethers } from "ethers";

import artifacts from '../artifacts/mainnet.json'
import { getEngineCode, getMetadata } from "../utils/sm"

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const GeneratorOnChain = ({zoom, fps, scale, leniaId }) => {
    const nodeRef = useRef(null);
    
    const modifiedLeniaId = Math.max(Math.min(leniaId, 201), 0)
    useEffect(async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
        const metadataContract = new ethers.Contract(
            artifacts.contracts.LeniaMetadata.address, 
            artifacts.contracts.LeniaMetadata.abi, 
            provider
        );
        const [WASMSource, WASMSIMDSource, engineBytes] = await getEngineCode(provider, metadataContract)
        const leniaMetadata = await getMetadata(provider, metadataContract, modifiedLeniaId)
        
        leniaMetadata.config.world_params.scale = scale

        const hasSIMD = await simd();
        const WASMKey = hasSIMD ? 'engine-simd' : 'engine'
        const WASMByteCode = hasSIMD ? WASMSIMDSource : WASMSource

        const engine = engineBytes.toString('utf-8')
        if (engine.length > 0) {
            const script = document.createElement('script');
            script.innerHTML = engine
            document.body.appendChild(script);
            window.leniaEngine.init(WASMByteCode, WASMKey, leniaMetadata, zoom, fps);
        }
    }, [])

    return (
        <StyledDiv ref={nodeRef}>
            <canvas id="RENDERING_CANVAS" />
        </StyledDiv>
    )
}

export default GeneratorOnChain