import React, { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { simd } from 'wasm-feature-detect';

import Toast from './toast'
import { useLeniaContract } from './lenia-contract-provider'
import { useWeb3 } from "./web3-provider"
import { getEngineCode, getMetadata } from "../utils/sm"

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const GeneratorOnChain = ({ zoom, fps, scale, leniaId }) => {
    const nodeRef = useRef(null);

    const { isUserMarkedConnected, web3Provider, account } = useWeb3()
    const { metadataContract } = useLeniaContract()
    const [ error, setError ] = useState(null)

    const contractSet = useRef(false);

    useEffect(async () => {
        if (!isUserMarkedConnected()) {
            setError(new Error(
                `You must connect your account on the <a href="${window.location.origin}">homepage</a> before being able to use the generator on chain`
            ))
            return
        }

        // Account ready and contract received
        if (metadataContract && account) {
            if (contractSet.current) {
                return
            } 
                contractSet.current = true
            

            const modifiedLeniaId = Math.max(Math.min(leniaId, 201), 0)                

            const hasSIMD = await simd();
            const WASMKey = hasSIMD
                ? 'engine-simd'
                : 'engine'
            const [WASMSource, WASMSIMDSource, engineBytes] = await getEngineCode(web3Provider, metadataContract)
            const WASMByteCode = hasSIMD ? WASMSIMDSource : WASMSource
            const engine = engineBytes.toString('utf-8')
            if (typeof engine === 'string' && engine.length > 0) {
                const script = document.createElement('script');
                script.innerHTML = engine
                document.body.appendChild(script);
            }

            const leniaMetadata = await getMetadata(web3Provider, metadataContract, modifiedLeniaId)
            leniaMetadata.config.world_params.scale = scale
            
            window.leniaEngine.init(WASMByteCode, WASMKey, leniaMetadata, zoom, fps);
        }
    }, [account, metadataContract])
    
    const handleToastClose = () => {
        setError(null)
    }

    return (
        <>
            <StyledDiv ref={nodeRef}>
                <canvas id="RENDERING_CANVAS" />
            </StyledDiv>
            {/* eslint-disable-next-line react/no-danger */}
            {error && <Toast type="error" onClose={handleToastClose}><div dangerouslySetInnerHTML={ { __html: error.message } } /></Toast>}
        </>
    )
}

export default GeneratorOnChain