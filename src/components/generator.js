import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { simd } from 'wasm-feature-detect';

if (typeof window !== 'undefined') {
    require('../engine')
}

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Generator = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    useEffect(async () => {  
        const hasSIMD = await simd();
        const response = hasSIMD
            ? await fetch('/optimized-simd.wasm')
            : await fetch('/optimized.wasm')
        const WASMSource = await response.arrayBuffer()
        const WASMKey = hasSIMD
            ? 'engine-simd'
            : 'engine'
  
        const leniaResponse = await fetch(`/metadata/${lenia_id}.json`);
        const leniaMetadata = await leniaResponse.json()

        leniaMetadata.config.world_params.scale = scale

        window.leniaEngine.init(WASMSource, WASMKey, leniaMetadata, zoom, fps);
    })
    
    return (
        <StyledDiv ref={nodeRef}>
            <canvas id="RENDERING_CANVAS" />
        </StyledDiv>
    )
}

export default Generator