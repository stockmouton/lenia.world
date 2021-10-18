import React, { useRef, useEffect } from "react"
import styled from "styled-components"
require('../engine')
const axios = require('axios');

// const wasmModule = require('../../build/optimized.wasm')

const StyledDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Generator = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    useEffect(async () => {
        const response = await axios.get(`metadata/${lenia_id}.json`);
        let leniaMetadata = response.data

        leniaMetadata["config"]["world_params"]["scale"] = scale

        window.leniaEngine.init(leniaMetadata, zoom, fps);
    })
    
    return (
        <StyledDiv ref={nodeRef}>
            <canvas id="RENDERING_CANVAS"></canvas>
        </StyledDiv>
    )
}

export default Generator