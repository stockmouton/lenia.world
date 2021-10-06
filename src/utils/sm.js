const Web3 = require('web3');
const { ethers } = require("ethers");
const pako = require('pako');


exports.getEngineCode = async function(provider, leniaContract) {
    let contractGzipEngineHex;
    if (provider instanceof Web3) {
        contractGzipEngineHex = await leniaContract.methods.getEngine()
    } else {
        contractGzipEngineHex = await leniaContract.getEngine()
    }
    
    if (contractGzipEngineHex.length == 66) {
        const txHash = contractGzipEngineHex;
        const tx = await provider.getTransaction(txHash)
        const inputDataHex = tx.data;

        const decodedData = ethers.utils.defaultAbiCoder.decode(
            [ 'bytes' ],
            ethers.utils.hexDataSlice(inputDataHex, 4)
        );
        contractGzipEngineHex = decodedData[0]
    }
    
    const contractGzipEngineUint8Array = ethers.utils.arrayify(contractGzipEngineHex)
    const contractEngine = pako.inflate(contractGzipEngineUint8Array, {to: 'string'})

    return contractEngine
}

exports.getLeniaParameters = async function(provider, leniaContract, index) {
    let contractLeniaParams;
    if (provider instanceof Web3) {
        contractLeniaParams = await leniaContract.methods.getLeniaParams(index)
    } else {
        contractLeniaParams = await leniaContract.getLeniaParams(index)
    }

    if (contractLeniaParams.cells.length == 66) {
        const txHash = contractLeniaParams.cells
        const tx = await provider.getTransaction(txHash)
        const inputDataHex = tx.data;

        const decodedData = ethers.utils.defaultAbiCoder.decode(
          [ 'string', 'string', 'bytes' ],
          ethers.utils.hexDataSlice(inputDataHex, 4)
        );
        // console.log(decodedData)
        contractLeniaParams = {
            'm': decodedData[0],
            's': decodedData[1],
            'cells': decodedData[2]
        }
    }

    const m = contractLeniaParams.m
    const s = contractLeniaParams.s
    const contractGzipCellsUint8Array = ethers.utils.arrayify(contractLeniaParams.cells)
    const contractCells = pako.inflate(contractGzipCellsUint8Array, {to: 'string'})

    return {
        'm': m,
        's': s,
        'cells': contractCells
    }
}