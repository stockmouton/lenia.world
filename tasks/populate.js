const fs = require('fs');
const UglifyJS = require("uglify-js")
const path = require('path');
const pako = require('pako');
const prompt = require('prompt');

const leniaUtils = require('../src/utils/sm');
const { init } = require('es-module-lexer');
const { assert } = require('console');
const rootFolder = __dirname + '/..'


async function setEngine({ jsenginePath, wasmSourcePath, wasmSimdSourcePath }, hre) {
    if (hre.hardhatArguments.network == null) {
        throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
    }

    console.log(`We are about to push data inside the chain logs on ${hre.hardhatArguments.network}`)
    console.log('Paths:');
    console.log(`   - ${jsenginePath}`);
    console.log(`   - ${wasmSourcePath}`);
    console.log(`   - ${wasmSimdSourcePath}`);
    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
        console.log('Quitting!')
        process.exit()
    }

    const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
    const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
        },
    })
    const LeniaDeployment = await hre.deployments.get('Lenia')
    const lenia = LeniaContractFactory.attach(LeniaDeployment.address)
    
    const LeniaMetadataContractFactory = await hre.ethers.getContractFactory("LeniaMetadata")
    const LeniaMetadataDeployment = await hre.deployments.get('LeniaMetadata')
    const leniaMetadata = LeniaMetadataContractFactory.attach(LeniaMetadataDeployment.address)

    const engineCode = fs.readFileSync(path.join(rootFolder, jsenginePath), 'utf-8')
    const engineCodeMinified = UglifyJS.minify([engineCode]).code;
    const engineCodeMinifiedBuffer = Buffer.from(engineCodeMinified)
    const wasmSource = fs.readFileSync(path.join(rootFolder, wasmSourcePath))
    const wasmSimdSource = fs.readFileSync(path.join(rootFolder, wasmSimdSourcePath))

    const gzipFullEngine = leniaUtils.compressAllEngineCode(
        wasmSource, wasmSimdSource, engineCodeMinifiedBuffer
    )

    const logEngineTx = await leniaMetadata.logEngine(gzipFullEngine)
    console.log(`Waiting for log tx: ${logEngineTx.hash} (${logEngineTx.nonce})  (payload size in bytes: ${gzipFullEngine.length})`)
    await logEngineTx.wait()
    const setEngineCodeTx = await leniaMetadata.setEngine(logEngineTx.hash)
    console.log(`Waiting for setEngineCode tx: ${setEngineCodeTx.hash} (${setEngineCodeTx.nonce})`)
    await setEngineCodeTx.wait()

    const setEngineTx = await lenia.setEngine(LeniaMetadataDeployment.address)
    console.log(`Waiting for set tx: ${setEngineTx.hash} (${setEngineTx.nonce})`)
    await setEngineTx.wait()

    const contractEngine = await leniaMetadata.getEngine();
    if (contractEngine.length) {
        console.log('Rendering engine successfully set in the smart contract')
    } else {
        throw new Error('Something went wrong, rendering engine has not been set')
    }
}
task("set-engine", "Set the engine in the smart contract")
    .addOptionalParam(
        'jsenginePath',
        'The path to the engine JS code',
        'src/engine.js',
        types.string,
    ).addOptionalParam(
        'wasmSourcePath',
        'The path to the WASM core code',
        'static/optimized.wasm',
        types.string,
    ).addOptionalParam(
        'wasmSimdSourcePath',
        'The path to the WASM SIMD core code',
        'static/optimized-simd.wasm',
        types.string,
    ).setAction(setEngine)

task("get-engine", "Set the engine in the smart contract",  async (taskArgs, hre) => {
    if (hre.hardhatArguments.network == null) {
        throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
    }

    const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
    const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
        },
    })
    const LeniaDeployment = await hre.deployments.get('Lenia')
    const lenia = LeniaContractFactory.attach(LeniaDeployment.address)
    
    const leniaMetadataContractAdress = await lenia.getEngine()
    const LeniaMetadataContractFactory = await hre.ethers.getContractFactory("LeniaMetadata")
    const leniaMetadata = LeniaMetadataContractFactory.attach(leniaMetadataContractAdress)
    
    const files = await leniaUtils.getEngineCode(hre.ethers.provider, leniaMetadata)

    const WASMSource = files[0]
    const WASMSimdSource = files[1]
    const engineCodeMinified = files[2].toString('utf-8')

    let wasmConfig = {
        env: {
            'memory': new WebAssembly.Memory({initial: 10})
        },
        engine:{  // Name of the file
            GF_ID       : 0,
            GF_M        : 1.,
            GF_S        : 1.,
            T           : 10,
        },
        Math
    };
    await WebAssembly.instantiate(WASMSource, wasmConfig)
    wasmConfig = {
        env: {
            'memory': new WebAssembly.Memory({initial: 10})
        },
        'engine-simd':{  // Name of the file
            GF_ID       : 0,
            GF_M        : 1.,
            GF_S        : 1.,
            T           : 10,
        },
        Math
    };
    await WebAssembly.instantiate(WASMSimdSource, wasmConfig)
    console.log(engineCodeMinified)
})


task("get-engine-address", "Get the engine address",  async (taskArgs, hre) => {
    if (hre.hardhatArguments.network == null) {
        throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
    }

    const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
    const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
        },
    })
    const LeniaDeployment = await hre.deployments.get('Lenia')
    const lenia = LeniaContractFactory.attach(LeniaDeployment.address)
    
    const engineAddress = await lenia.getEngine()
    console.log(engineAddress)
})

async function setMetadata({ metadataPath, initIndex, stopIndex }, hre ) {
    if (hre.hardhatArguments.network == null) {
        throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
    }

    const metadataFullpath = rootFolder + '/' + metadataPath
    const metadata = require(metadataFullpath)

    initIndex = Math.max(initIndex, 0)
    stopIndex = Math.min(stopIndex, metadata.length)
    console.log(initIndex < stopIndex);
    if (!(initIndex < stopIndex)) {
        throw new Error(`stopIndex ${stopIndex} must be bigger than initIndex ${initIndex}`)
    }

    console.log(`we are about to push data inside the chain logs on ${hre.hardhatArguments.network}`)
    console.log(`initIndex: ${initIndex}`)
    console.log(`stopIndex: ${stopIndex}`)
    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
        console.log('Quitting!')
        process.exit()
    }

    const LeniaMetadataContractFactory = await hre.ethers.getContractFactory("LeniaMetadata")
    const LeniaMetadataDeployment = await hre.deployments.get('LeniaMetadata')
    const leniaMetadata = LeniaMetadataContractFactory.attach(LeniaMetadataDeployment.address)
    
    overrides = {}
    // overrides = {
    //     maxFeePerGas: 100_000_000_000,  // Gwei
    //     maxPriorityFeePerGas: 1_000_000_000
    // }
    for (let index = initIndex; index < stopIndex; index++) {
        console.log(`Setting index ${index}`)

        let elementMetadata = metadata[index];
        const fullmetadataGZIP = pako.deflate(JSON.stringify(elementMetadata));
       
        const logMetadataTx = await leniaMetadata.logMetadata(fullmetadataGZIP, overrides)
        console.log(`Waiting for log tx: ${logMetadataTx.hash} (${logMetadataTx.nonce})`)
        // await logMetadataTx.wait() Thanks to nonce, we don't need to wait for the log call to be executed

        const setMetadataTx = await leniaMetadata.setMetadata(index, logMetadataTx.hash, overrides)
        console.log(`Waiting for set tx: ${setMetadataTx.hash} (${setMetadataTx.nonce})`)
        await setMetadataTx.wait()
        // In this case, we wait jsut to make sure we don't rush
    }
    console.log('done!')
}
task("set-metadata", "Set all metadata in the contract")
    .addParam(
        'initIndex',
        'index at which we start adding metadata'
    ).addParam(
        'stopIndex',
        'index at which we stop adding metadata'
    ).addOptionalParam(
        'metadataPath',
        'The path to the metadata containing the cells',
        'static/metadata/all_metadata.json',
        types.string,
    ).setAction(setMetadata)

task("get-metadata", "Get a Lenia metadata")
    .addOptionalParam(
        'index',
        'The metadata\'s index',
        0,
        types.int,
    ).setAction( async ({ index }, hre ) => {
        if (hre.hardhatArguments.network == null) {
            throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
        }
    
        const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
        const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
            libraries: {
                LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
            },
        })
        const LeniaDeployment = await hre.deployments.get('Lenia')
        const lenia = LeniaContractFactory.attach(LeniaDeployment.address)
        
        const leniaMetadataContractAdress = await lenia.getEngine()
        console.log(leniaMetadataContractAdress);
        const LeniaMetadataContractFactory = await hre.ethers.getContractFactory("LeniaMetadata")
        const leniaMetadata = LeniaMetadataContractFactory.attach(leniaMetadataContractAdress)
        
        const leniaParams = await leniaUtils.getMetadata(hre.ethers.provider, leniaMetadata, index)
        console.log(leniaParams)
    })

task("populate-all", "Full populate the contract")
    .addOptionalParam(
        'jsenginePath',
        'The path to the engine JS code',
        'src/engine.js',
        types.string,
    ).addOptionalParam(
        'wasmSourcePath',
        'The path to the WASM core code',
        'static/optimized.wasm',
        types.string,
    ).addOptionalParam(
        'wasmSimdSourcePath',
        'The path to the WASM SIMD core code',
        'static/optimized-simd.wasm',
        types.string,
    )
    .addOptionalParam(
        'metadataPath',
        'The path to the metadata containing the cells',
        'static/metadata/all_metadata.json',
        types.string,
    )
    .setAction( async ( {onlog, jsenginePath, wasmSourcePath, wasmSimdSourcePath, metadataPath}, hre ) => {
        if (hre.hardhatArguments.network == null) {
            throw new Error('Please add the missing --network <localhost> argument')
        }
        if(hre.hardhatArguments.network != 'localhost' && hre.hardhatArguments.network != 'rinkeby') {
            throw new Error('This task only work for localhost or Rinkeby testnet')
        }


        const accounts = await hre.ethers.getSigners()

        const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
        const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
            libraries: {
                LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
            },
        })
        const LeniaDeployment = await hre.deployments.get('Lenia')
        const lenia = LeniaContractFactory.attach(LeniaDeployment.address)

        const LeniaMetadataContractFactory = await hre.ethers.getContractFactory("LeniaMetadata")
        const LeniaMetadataDeployment = await hre.deployments.get('LeniaMetadata')
        const leniaMetadata = LeniaMetadataContractFactory.attach(LeniaMetadataDeployment.address)
        
        const engineFullpath = path.join(rootFolder, jsenginePath)
        console.log(`Setting the engine at ${engineFullpath}`)
        await setEngine({jsenginePath, wasmSourcePath, wasmSimdSourcePath}, hre)
        console.log('Setting the engine: Done')

        const metadataFullpath = rootFolder + '/' + metadataPath
        console.log(`Setting all lenia Parameters using metadata at ${metadataFullpath}`)
        await setMetadata({ metadataPath }, hre)
        console.log('Setting all lenia Parameters: Done')

        let isSaleActive = await lenia.isSaleActive()
        if (!isSaleActive) {
            console.log('Starting sales')
            const setSaleStartTx = await lenia.toggleSaleStatus();
            await setSaleStartTx.wait()
            isSaleActive = await lenia.isSaleActive()
            if (!isSaleActive) {
                throw new Error('Sale did not activate')
            }
            console.log('Starting sales: Done')
        }
        
        console.log('Claiming Reserved')
        const claimReservedTx = await lenia.claimReserved(11, accounts[0].address);
        await claimReservedTx.wait()
        console.log('Claiming Reserved: Done')

        console.log('Minting everything')
        const maxSupply = Number(await lenia.MAX_SUPPLY())
        const totalSupply = Number(await lenia.totalSupply())
        const contractPrice = await lenia.getPrice()
        console.log(maxSupply, totalSupply);
        for (let index = 0; index < maxSupply - totalSupply; index++) {
            const mintTx = await lenia.mint({
                value: contractPrice
            })
            await mintTx.wait()
        }
        console.log('Minting Everything: Done')

        console.log('if you want assets to be update, you need to launch the reveal script now.');
    })
