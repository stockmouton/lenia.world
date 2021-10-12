const axios = require('axios');


const jsonIPFSPrefix = 'https://gateway.pinata.cloud/ipfs/Qmf6kAYSHmBXvJbtkxDcqYiDWF5akvz8QxuqzMWC3JDtNd/';
const jsonPrefix = 'https://lenia.world/metadata/';

(async ()=>{
    for (let index = 0; index < 202; index++) {
        const response = await axios.get(`${jsonIPFSPrefix}${index}.json`);
        let dataIPFS = JSON.stringify(response.data.attributes)
        
        const response2 = await axios.get(`${jsonPrefix}${index}.json`);
        let dataWeb = JSON.stringify(response2.data.attributes)

        console.log(index, dataWeb == dataIPFS)   
    }
})();