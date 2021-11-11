import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import GeneratorOnChain from "../components/generator-on-chain"

const GeneratorOnChainPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    const [scale] = useQueryParam("scale", NumberParam);
    const [fps] = useQueryParam("fps", NumberParam);
    const [zoom] = useQueryParam("zoom", NumberParam);
    
    return (
        <GeneratorOnChain 
            zoom={zoom || 1} 
            fps={fps || 26} 
            scale={scale || 2} 
            lenia_id={id || 0} 
        />
    )
}

export default GeneratorOnChainPage