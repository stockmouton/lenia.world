import React, { useRef, useEffect } from "react"
require('../engine')
const axios = require('axios');

const Generator = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    useEffect(async () => {
        const response = await axios.get(`metadata/${lenia_id}.json`);
        let leniaMetadata = response.data

        leniaMetadata["config"]["world_params"]["scale"] = scale

        window.leniaEngine.init(leniaMetadata, zoom);
        // window.leniaEngine.run(fps);
        // window.leniaEngine.render()
    })
    
    return (
        <div ref={nodeRef}>
            <canvas id="CANVAS_CELLS"></canvas>
        </div>
    )
}

export default Generator