import React, { useRef, useEffect } from "react"

import { init, ResizeAll, run } from "../engine";

const Engine = () => {
    const nodeRef = useRef(null);

    var defaultLeniaxMetadata = {
		"name": "Lenia #0", 
		"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 
		"external_link": "https://lenia.stockmouton.com", 
		"image": "lenia-0.gif", 
		"animation_url": "on_chain_url", 
		"attributes": [{"value": "golden", "trait_type": "Colormap"}, {"value": "genesis", "trait_type": "Family"}, {"value": "kiroku", "trait_type": "Ki", "numerical_value": 0.47488}, {"value": "etheric", "trait_type": "Aura", "numerical_value": 0.70382}, {"value": "fly", "trait_type": "Weight", "numerical_value": 0.43592}, {"value": "Aluminium", "trait_type": "Robustness", "numerical_value": 0.35293}, {"value": "Raiton", "trait_type": "Avoidance", "numerical_value": 0.19542}, {"value": "turbo", "trait_type": "Velocity", "numerical_value": 0.47964}, {"value": "Standard", "trait_type": "Spread", "numerical_value": 1.2353}], 
		"config": {
			"kernels_params": [{"b": "1", "c_in": 0, "c_out": 0, "gf_id": 0, "h": 1, "k_id": 0, "m": 0.15, "q": 4, "r": 1, "s": 0.015}], 
			"world_params": {"R": 13, "T": 10, "nb_channels": 1, "nb_dims": 2, "scale": 2.0}, 
			"cells": "AAAAAAAAAAAAAAAAAAAAOZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAp\u00f4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC\u00e6FKF\u00d5\u00d0\u00ccAAAAAAAAAAAAAAAAAAAAAAAAAAAAG\u00d6P\u00d5U\u00c5UxV\u00edZ\u00c9\u00e5MH\u00ccAAAAAAAAAAAAAAAADbNAQgK\u00c9T\u00daS\u00c6JjCrAAAAF\u00e3\u00d8Ws\u00f9AAAAAAAAAAAAAAO\u00c6eon\u00c1p\u00c6S\u00e5G\u00c9AAAAAAAAAAAApww\u00ecAAAAAAAAAAAAU\u00fdo\u00f4\u00c3\u00eex\u00ddbjD\u00d4AAAAAAAAAAAAAAf\u00dcgEAAAAAAAAAAUOt\u00f3\u00c3\u00c8r\u00d9dzW\u00d1XBAAAAAAAAAAAAAAi\u00c1LeAAAAAABXP\u00f8k\u00d3mFh\u00cah\u00fbp\u00c4xNzNAAAAAAAAAAAAK\u00f5c\u00f4AAAAAAJ\u00f8VGNWOWY\u00f4pz\u00c3\u00cc\u00cf\u00ce\u00d6\u00f6\u00d9\u00c9g\u00daAAAAAAAAC\u00e2b\u00e7HDAAAAP\u00cfQ\u00d3B\u00fdAAV\u00fdvW\u00ce\u00e6\u00dc\u00d1\u00e9\u00f0\u00f0T\u00f3u\u00cc\u00e5G\u00faAAAAF\u00c5X\u00e5O\u00e4AAA\u00c1UJI\u00dbAAAAAAvq\u00d5t\u00e8w\u00f6F\u00fd\u00fd\u00fd\u00fd\u00fd\u00fd\u00detf\u00f1M\u00e3QNZ\u00c4RGE\u00c9A\u00dcV\u00ceFWAAAAAAAA\u00d4\u00e8\u00ed\u00cb\u00fd\u00fd\u00fac\u00f3\u00da\u00fd\u00fd\u00fa\u00d2\u00d8xp\u00e6fzeRQoAAm\u00e2X\u00c8GQAAAAAAAAE\u00eb\u00ec\u00ca\u00fd\u00fd\u00fd\u00fd\u00e5X\u00e4\u00c8\u00eb\u00f4\u00e1D\u00c9Dpfe\u00d7NQAAAA\u00d6yP\u00e8AAAAAAAAAAXj\u00f9\u00c8\u00fd\u00fd\u00efq\u00e1c\u00df\u00f6\u00d9Y\u00c9Aq\u00d9b\u00e6H\u00deAAAAAA\u00eb\u00fdAAAAAAAAAAAAn\u00fc\u00edB\u00f1\u00da\u00e4v\u00d9\u00de\u00cfRz\u00d6lAS\u00efD\u00cfAAAAAAGD\u00e0AAAAAAAAAAABAt\u00d6\u00d5\u00d6\u00d7\u00f2\u00cfS\u00c2\u00fco\u00efbsLWAAAAAAAAAAJr\u00cfvAAAAAAAAAAUUs\u00e2\u00c2\u00e1yGo\u00d5dDP\u00c1DZAAAAAAAAAAAADBw\u00dcX\u00dfF\u00f6D\u00d6KbVohumNj\u00c4Z\u00faPQE\u00caAAAAAAAAAAAAAAAAAAW\u00fbf\u00eacRZ\u00e9cQb\u00f2ZfSOJxCmAAAAAAAAAAAAAAAAAAAAAAAAHcL\u00eeMNI\u00efGFBvAAAAAAAAAA::1;21;20"
		}, 
		"tokenID": 0
	}

    useEffect(() => {
        if (nodeRef.current) {
            // Set world
            var size_power2 = 7
            ResizeAll(size_power2);

            // Set animal
            init(defaultLeniaxMetadata["config"]);

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