const axios = require('axios');
const fs = require("fs")

const jsonIPFSPrefix = 'https://gateway.pinata.cloud/ipfs/Qmf6kAYSHmBXvJbtkxDcqYiDWF5akvz8QxuqzMWC3JDtNd/';
const allMetadataLocalFullpath = `${__dirname  }/../../static/metadata/all_metadata.json`;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () =>{
    const allMetadataLocal = [];
    const promises = []
    for (let index = 0; index < 202; index+=1) {        
        promises.push((async (i) => {
            await sleep(index * 400)
            console.log(`checking ${i}`);
            return axios.get(`${jsonIPFSPrefix}${i}.json`);
        })(index))
    }

    const results = await Promise.all(promises)

    for (let i = 0; i < results.length; i+=1) {
        const response = results[i];
        const rawDataIPFS = response.data
        allMetadataLocal.push(rawDataIPFS)
    }

    const allMetadataLocalJSON = JSON.stringify(allMetadataLocal)
    fs.writeFileSync(allMetadataLocalFullpath, allMetadataLocalJSON)
})();