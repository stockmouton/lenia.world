import React, { useRef, useEffect } from "react"
require('../engine')
const axios = require('axios');

const Generator = ({ scale, lenia_id }) => {
    const nodeRef = useRef(null);

    useEffect(async () => {
        const response = await axios.get(`metadata/${lenia_id}.json`);
        let leniaMetadata = response.data

        leniaMetadata["config"]["world_params"]["scale"] = scale

        window.leniaEngine.init(leniaMetadata);
        window.leniaEngine.run();
    })
    
    return (
        <div ref={nodeRef}>
            <canvas id="CANVAS_CELLS"></canvas>
            <canvas id="CANVAS_HIDDEN" style={{'display': 'none'}}></canvas>
        </div>
    )
}

export default Generator