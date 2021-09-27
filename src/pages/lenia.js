import React, { useRef, useEffect } from "react"
import queryString from 'query-string'
import { init, run } from "../engine";

import all_lenias from "../fake/metadata.json"

const Engine = ({ location }) => {
    const data = queryString.parse(location.search)
    const lenia_id = data['id']

    let lenia_metadata
    if (lenia_id < all_lenias.length) {
        lenia_metadata = all_lenias[lenia_id]
    } else {
        lenia_metadata = all_lenias[0]
    }

    const nodeRef = useRef(null);
    useEffect(() => {
        if (nodeRef.current) {
            init(lenia_metadata);
            run();
        }
    })

    return (
        <div ref={nodeRef}>
            <canvas id="CANVAS_CELLS"></canvas>
            <canvas id="CANVAS_FIELD"></canvas>
            <canvas id="CANVAS_POTENTIAL"></canvas>
            <canvas id="CANVAS_HIDDEN" style={{'display': 'none'}}></canvas>
        </div>
    )
}

export default Engine