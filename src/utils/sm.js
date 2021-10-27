const Web3 = typeof window !== 'undefined' ? require('web3') : null;
const { ethers } = require("ethers");
const pako = require('pako');

exports.getEngineCode = async function(provider, leniaMetadataContract) {
    let txHash;
    if (Web3 != null && provider instanceof Web3) {
        txHash = await leniaMetadataContract.methods.getEngine().call()
    } else {
        txHash = await leniaMetadataContract.getEngine()
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
        [ 'bytes' ],
        ethers.utils.hexDataSlice(inputDataHex, 4)
    );
    contractGzipEngineHex = decodedData[0]

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

exports.getMetadata = async function(provider, leniaMetadataContract, index) {
    let txHash;
    if (Web3 != null && provider instanceof Web3) {
        txHash = await leniaMetadataContract.methods.getMetadata(index).call()
    } else {
        txHash = await leniaMetadataContract.getMetadata(index)
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
        [ 'bytes' ],
        ethers.utils.hexDataSlice(inputDataHex, 4)
    );
    const rawMetadata = decodedData[0]

    const contractGzipMetadataUint8Array = ethers.utils.arrayify(rawMetadata)
    const contractMetadata = pako.inflate(contractGzipMetadataUint8Array, {to: 'string'})
    const leniaMetadata = JSON.parse(contractMetadata)

    return leniaMetadata
}


exports.compressAllEngineCode = function(wasmSource, wasmSimdSource, engineCodeMinifiedBuffer) {
    const metadataBuffer = Buffer.allocUnsafe(4 * 4);
    metadataBuffer.writeUInt32LE(3, 0)
    metadataBuffer.writeUInt32LE(wasmSource.length, 4)
    metadataBuffer.writeUInt32LE(wasmSimdSource.length, 8)
    metadataBuffer.writeUInt32LE(engineCodeMinifiedBuffer.length, 12)

    const finalBuffer = Buffer.concat([
        metadataBuffer,
        wasmSource, 
        wasmSimdSource, 
        engineCodeMinifiedBuffer
    ])
    const gzipFullEngine = pako.deflate(finalBuffer);

    return gzipFullEngine
}