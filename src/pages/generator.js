import React from "react"
import { useQueryParam, NumberParam } from "use-query-params";

import Generator from "../components/generator"

const GeneratorPage = () => {
    const [id] = useQueryParam("id", NumberParam);
    const [scale] = useQueryParam("scale", NumberParam);
    const [fps] = useQueryParam("fps", NumberParam);
    const [zoom] = useQueryParam("zoom", NumberParam);

    return (
        <Generator zoom={zoom || 1} fps={fps || 26} scale={scale || 2} lenia_id={id || 0} />
    )
}

export default GeneratorPage