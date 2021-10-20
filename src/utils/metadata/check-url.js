const axios = require('axios');
const fs = require("fs")

const jsonIPFSPrefix = 'https://gateway.pinata.cloud/ipfs/Qmf6kAYSHmBXvJbtkxDcqYiDWF5akvz8QxuqzMWC3JDtNd/';
const jsonPrefix = 'https://lenia.world/metadata/';
const allMetadataLocalFullpath = __dirname + "/../../../static/metadata/all_metadata.json";
allMetadataLocal = JSON.parse(fs.readFileSync(allMetadataLocalFullpath), 'utf8');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async ()=>{
    for (let index = 0; index < 202; index++) {
        const response = await axios.get(`${jsonIPFSPrefix}${index}.json`);
        let rawDataIPFS = response.data
        let fullDataIPFS = JSON.stringify(rawDataIPFS)
        delete rawDataIPFS["image"]
        delete rawDataIPFS["animation_url"]
        let dataIPFS = JSON.stringify(rawDataIPFS)
        
        const response2 = await axios.get(`${jsonPrefix}${index}.json`);
        const rawDataWeb = response2.data
        delete rawDataWeb["image"]
        delete rawDataWeb["animation_url"]
        let dataWeb = JSON.stringify(rawDataWeb)

        const rawDataLocal = allMetadataLocal[index]
        let fullDataLocal = JSON.stringify(rawDataLocal)

        console.log(index, dataWeb == dataIPFS && fullDataLocal == fullDataIPFS)   

        await sleep(100)
    }
})();