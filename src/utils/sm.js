const Web3 = typeof window !== 'undefined' ? require('web3') : null;
const { ethers } = require("ethers");
const pako = require('pako');

exports.getEngineCode = async function(provider, leniaContract) {
    let contractGzipEngineHex;
    if (Web3 != null && provider instanceof Web3) {
        contractGzipEngineHex = await leniaContract.methods.getEngine().call()
    } else {
        contractGzipEngineHex = await leniaContract.getEngine()
    }

    if (contractGzipEngineHex.length == 66) {
        const txHash = contractGzipEngineHex;
        let inputDataHex;
        if (Web3 != null && provider instanceof Web3) {
            const tx = await provider.eth.getTransaction(txHash)
            inputDataHex = tx.input;
        } else {
            const tx = await provider.getTransaction(txHash)
            inputDataHex = tx.data;  
        }
        const decodedData = ethers.utils.defaultAbiCoder.decode(
            [ 'bytes' ],
            ethers.utils.hexDataSlice(inputDataHex, 4)
        );
        contractGzipEngineHex = decodedData[0]
    }
    
    const contractGzipEngineUint8Array = ethers.utils.arrayify(contractGzipEngineHex)
    const contractEngine = pako.inflate(contractGzipEngineUint8Array)
    const finalBuffer = Buffer.from(contractEngine)

    const nbFiles = parseInt(finalBuffer.readUInt32LE(0).toString(), 10)
    let nbBytesPrefix = (nbFiles + 1) * 4
    let files = []
    for (let i = 0; i < nbFiles; i++) {
        const fileLength = parseInt(finalBuffer.readUInt32LE((i + 1) * 4).toString(), 10)
        let fileBuffer = Buffer.allocUnsafe(fileLength)
        finalBuffer.copy(fileBuffer, 0, nbBytesPrefix, nbBytesPrefix + fileLength)
        files.push(fileBuffer)
        nbBytesPrefix += fileLength
    }

    return files
}

exports.getLeniaParameters = async function(provider, leniaMetadataContract, index) {
    let txHash;
    if (Web3 != null && provider instanceof Web3) {
        txHash = await leniaMetadataContract.methods.getLeniaParams(index).call()
    } else {
        txHash = await leniaMetadataContract.getLeniaParams(index)
    }

    let inputDataHex;
    if (Web3 != null && provider instanceof Web3) {
        const tx = await provider.eth.getTransaction(txHash)
        inputDataHex = tx.input;
    } else {
        const tx = await provider.getTransaction(txHash)
        inputDataHex = tx.data;  
    }

    const decodedData = ethers.utils.defaultAbiCoder.decode(
        [ 'string', 'string', 'bytes' ],
        ethers.utils.hexDataSlice(inputDataHex, 4)
    );
    const rawMetadata = decodedData[2]

    const contractGzipMetadataUint8Array = ethers.utils.arrayify(rawMetadata)
    const contractMetadata = pako.inflate(contractGzipMetadataUint8Array, {to: 'string'})
    const leniaMetadata = JSON.parse(contractMetadata)

    return leniaMetadata
}