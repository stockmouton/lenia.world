import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import Generator from "../components/generator"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    const [scale] = useQueryParam("scale", NumberParam);
    const [fps] = useQueryParam("fps", NumberParam);
    
    return (
        <Generator fps={fps || 30} scale={scale || 1} lenia_id={id || 0} />
    )
}

export default GeneratorPage