import React, { useRef, useEffect } from "react"
require('../engine')
const axios = require('axios');

const Generator = ({ zoom, fps, scale, lenia_id }) => {
    const nodeRef = useRef(null);

    useEffect(async () => {
        const response = await axios.get(`metadata/${lenia_id}.json`);
        let leniaMetadata = response.data

        leniaMetadata["config"]["world_params"]["scale"] = scale

        // fps = 5;
        window.leniaEngine.init(leniaMetadata, zoom);
        window.leniaEngine.run(fps);
    })
    
    return (
        <div ref={nodeRef}>
            <canvas id="CANVAS_CELLS"></canvas>
            <canvas id="CANVAS_HIDDEN" style={{'display': 'none'}}></canvas>
        </div>
    )
}

export default Generator