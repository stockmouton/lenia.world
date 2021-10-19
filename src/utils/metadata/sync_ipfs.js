const axios = require('axios');
const fs = require("fs")

const jsonIPFSPrefix = 'https://gateway.pinata.cloud/ipfs/Qmf6kAYSHmBXvJbtkxDcqYiDWF5akvz8QxuqzMWC3JDtNd/';
const allMetadataLocalFullpath = __dirname + "/../../../static/metadata/all_metadata.json";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () =>{
    let allMetadataLocal = [];
    const promises = []
    for (let index = 0; index < 202; index++) {        
        promises.push((async (index) => {
            await sleep(index * 400)
            console.log(`checking ${index}`);
            return axios.get(`${jsonIPFSPrefix}${index}.json`);
        })(index))
    }

    let results = await Promise.all(promises)

    for (let i = 0; i < results.length; i++) {
        const response = results[i];
        let rawDataIPFS = response.data
        allMetadataLocal.push(rawDataIPFS)
    }

    const allMetadataLocalJSON = JSON.stringify(allMetadataLocal)
    fs.writeFileSync(allMetadataLocalFullpath, allMetadataLocalJSON)
})();