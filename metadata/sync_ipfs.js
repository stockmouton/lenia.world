const axios = require('axios');
const fs = require("fs")

const jsonIPFSPrefix = 'https://gateway.pinata.cloud/ipfs/Qmf6kAYSHmBXvJbtkxDcqYiDWF5akvz8QxuqzMWC3JDtNd/';
const allMetadataLocalFullpath = __dirname + "/ori/all_metadata.json";
let allMetadataLocal = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async ()=>{
    for (let index = 0; index < 202; index++) {
        const response = await axios.get(`${jsonIPFSPrefix}${index}.json`);
        let rawDataIPFS = response.data
        allMetadataLocal.push(rawDataIPFS)
        
        await sleep(100)
    }
    const allMetadataLocalJSON = JSON.stringify(allMetadataLocal)
    fs.writeFileSync(allMetadataLocalFullpath, allMetadataLocalJSON)
})();