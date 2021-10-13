import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import Generator from "../components/generator"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    const [scale] = useQueryParam("scale", NumberParam);
    
    return (
        <Generator scale={scale || 1} lenia_id={id || 0} />
    )
}

export default GeneratorPage