import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import Generator from "../components/generator"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    
    return (
        <Generator scale={1} lenia_id={id || 0} />
    )
}

export default GeneratorPage