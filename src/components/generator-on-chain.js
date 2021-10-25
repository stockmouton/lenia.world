import React, { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { simd } from 'wasm-feature-detect';

import Toast from './toast'
import { useLeniaContract } from './lenia-contract-provider'
import { useWeb3 } from "./web3-provider"
import { getEngineCode, getLeniaParameters } from "../utils/sm"

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const GeneratorOnChain = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    const { isUserMarkedConnected, web3Provider, account } = useWeb3()
    const { contract } = useLeniaContract()
    const [ error, setError ] = useState(null)

    let contractSet = useRef(false);

    useEffect(async () => {
        if (!isUserMarkedConnected()) {
            console.log(window.location);
            setError(new Error(
                `You must connect your account on the <a href="${window.location.origin}">homepage</a> before being able to use the generator on chain`
            ))
            return
        }

        // Account ready and contract received
        if (contract && account) {
            if (contractSet.current) {
                return
            } else {
                contractSet.current = true
            }

            lenia_id = Math.max(Math.min(lenia_id, 201), 0)                

            const hasSIMD = await simd();
            const WASMKey = hasSIMD
                ? 'engine-simd'
                : 'engine'
            const [WASMSource, WASMSIMDSource, engineBytes] = await getEngineCode(web3Provider, contract)
            const WASMByteCode = hasSIMD ? WASMSIMDSource : WASMSource
            const engine = engineBytes.toString('utf-8')
            if (typeof engine === 'string' && engine.length > 0) {
                var script = document.createElement('script');
                script.innerHTML = engine
                document.body.appendChild(script);
            }

            const leniaMetadata = await getLeniaParameters(web3Provider, contract, lenia_id)
            leniaMetadata["config"]["world_params"]["scale"] = scale
            
            window.leniaEngine.init(WASMByteCode, WASMKey, leniaMetadata, zoom, fps);
        }
    }, [account, contract])
    
    const handleToastClose = () => {
        setError(null)
    }

    return (
        <>
            <StyledDiv ref={nodeRef}>
                <canvas id="RENDERING_CANVAS"></canvas>
            </StyledDiv>
            {error && <Toast type="error" onClose={handleToastClose}><div dangerouslySetInnerHTML={ { __html: error.message } }></div></Toast>}
        </>
    )
}

export default GeneratorOnChain