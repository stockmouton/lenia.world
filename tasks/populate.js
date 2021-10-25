const UglifyJS = require("uglify-js");
const fs = require('fs');
const path = require('path');
const pako = require('pako');
const prompt = require('prompt');

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap } = require('../test/utils')
const leniaUtils = require('../src/utils/sm');
const { bool } = require("prop-types");
const rootFolder = __dirname + '/..'

task("set-engine", "Set the engine in the smart contract")
    .addParam(
        'onlog',
        'should the data be stored on the log',
        types.bool
    ).addOptionalParam(
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
    ).setAction( async ({ onlog, jsenginePath, wasmSourcePath, wasmSimdSourcePath }, hre) => {
        if (hre.hardhatArguments.network == null) {
            throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
        }

        onlog = !!onlog
        console.log(`we are about to push data inside the ${onlog ? 'chain logs' : 'chain directly'}`)
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
        
        const engineCode = fs.readFileSync(path.join(rootFolder, jsenginePath), 'utf-8')
        const engineCodeMinified = UglifyJS.minify([engineCode]).code;
        const engineCodeMinifiedBuffer = Buffer.from(engineCodeMinified)
        const wasmSource = fs.readFileSync(path.join(rootFolder, wasmSourcePath))
        const wasmSimdSource = fs.readFileSync(path.join(rootFolder, wasmSimdSourcePath))
        
        const metadataBuffer = Buffer.allocUnsafe(4 * 4);
        metadataBuffer.writeUInt32LE(3, 0)
        metadataBuffer.writeUInt32LE(wasmSource.length, 4)
        metadataBuffer.writeUInt32LE(wasmSimdSource.length, 8)
        metadataBuffer.writeUInt32LE(engineCodeMinifiedBuffer.length, 12)
        console.log(engineCodeMinified)
        const finalBuffer = Buffer.concat([
            metadataBuffer,
            wasmSource, 
            wasmSimdSource, 
            engineCodeMinifiedBuffer
        ])
        const gzipFullEngine = pako.deflate(finalBuffer);
        
        if (onlog === true) {
            const logEngineTx = await lenia.logEngine(gzipFullEngine)
            await lenia.setEngine(logEngineTx.hash)
        } else {
            await lenia.setEngine(gzipFullEngine)
        }
    
        const contractEngine = await lenia.getEngine();
        if (contractEngine.length) {
            console.log('Rendering engine successfully set in the smart contract')
        } else {
            throw new Error('Something went wrong, rendering engine has not been set')
        }
    })

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
    
    const files = await leniaUtils.getEngineCode(hre.ethers.provider, lenia)

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

task("set-leniaparams", "Set all metadata in the contract")
    .addParam(
        'onlog',
        'should the data be stored on the log',
        types.bool
    ).addOptionalParam(
        'metadataPath',
        'The path to the metadata containing the cells',
        'static/metadata/all_metadata.json',
        types.string,
    ).setAction( async ({ onlog, metadataPath }, hre ) => {
        if (hre.hardhatArguments.network == null) {
            throw new Error('Please add the missing --network <localhost|rinkeby|mainnet> argument')
        }

        onlog = !!onlog
        console.log(`we are about to push data inside the ${onlog ? 'chain logs' : 'chain directly'}`)
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
        
        const metadataFullpath = rootFolder + '/' + metadataPath
        const metadata = require(metadataFullpath)
        for (let index = 0; index < metadata.length; index++) {
            console.log(`Setting index ${index}`)
            let element = metadata[index];
            const m = element.config.kernels_params[0].m.toFixed(9)
            const s = element.config.kernels_params[0].s.toFixed(9)
            const gzipCells = pako.deflate(element.config.cells);
            
            if (onlog === true) {
                const logLeniaParamsTx = await lenia.logLeniaParams(
                    m, s, gzipCells
                )
                await lenia.setLeniaParams(index, "", "", logLeniaParamsTx.hash)
            } else {
                await lenia.setLeniaParams(
                    index, m, s, gzipCells
                )
            }
            
        }
        console.log('done!')
    })

task("get-leniaparams", "Get a Lenia metadata")
    .addOptionalParam(
        'index',
        'The cell\'s index',
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
        
        const leniaParams = await leniaUtils.getLeniaParameters(hre.ethers.provider, lenia, index)
        console.log(leniaParams)
    })

task("set-metadata", "Set all metadata in the contract")
    .addOptionalParam(
        'metadataPath',
        'The path to the metadata containing the cells',
        'src/fake/metadata.json',
        types.string,
    ).setAction( async ({ metadataPath }, hre ) => {
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
        
        const metadataFullpath = rootFolder + '/' + metadataPath
        const metadata = require(metadataFullpath)
        for (let index = 0; index < metadata.length; index++) {
            let element = metadata[index];
            
            const paddedID = index.toString().padStart(3, '0');
            let imageURL = element["image"];
            let smLeniaAttributes = [];
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                const traitTypeIndex = traitTypeAttrsMap.indexOf(attr.trait_type.toLowerCase())
                smLeniaAttributes.push({
                    'traitType': traitTypeIndex,
                    'value': attrsMap[traitTypeIndex].indexOf(attr.value.toLowerCase()),
                    'numericalValue': attr.numerical_value ? attr.numerical_value.toFixed(9) : traitTypeIndex.toFixed(1),
                })
            }
        
            console.log(`adding metadata id ${index}`)
            const setMetadataTx = await lenia.setMetadata(
                index, 
                paddedID,
                imageURL,
                // element["animation_url"],
                // element["on_chain_url"],
                smLeniaAttributes
            )
            const receipt = await setMetadataTx.wait()
        }
    })

task("get-metadata", "Get a Lenia metadata")
    .addOptionalParam(
        'index',
        'The cell\'s index',
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
 
        const contractGzipCellsHex = await lenia.getLeniaCells()
        const contractGzipCell = Buffer.from(ethers.utils.arrayify(contractGzipCellsHex))
        const contractCells = await ungzip(contractGzipCell);
        const contractAllCells = contractCells.toString('utf-8').split('%%')
        
        const encodedContractMetadata = await lenia.getMetadata(index)
        const contractMetadata = decodeContractMetdata(encodedContractMetadata)

        contractMetadata.config.cells = contractAllCells[index];
        console.log(contractMetadata)
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
    .setAction( async ( {jsenginePath, wasmSourcePath, wasmSimdSourcePath, metadataPath}, hre ) => {
        if (hre.hardhatArguments.network == null) {
            throw new Error('Please add the missing --network <localhost> argument')
        }
        if(hre.hardhatArguments.network != 'localhost') {
            throw new Error('This task only work for localhost')
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
        
        const engineFullpath = path.join(rootFolder, jsenginePath)
        console.log(`Setting the engine at ${engineFullpath}`)
        const engineCode = fs.readFileSync(engineFullpath, 'utf-8')
        const engineCodeMinified = UglifyJS.minify([engineCode]).code;
        const wasmSource = fs.readFileSync(path.join(rootFolder, wasmSourcePath), 'utf-8')
        const wasmSimdSource = fs.readFileSync(path.join(rootFolder, wasmSimdSourcePath), 'utf-8')
        const finalString = [wasmSource, wasmSimdSource, engineCodeMinified].join("%%")
        const gzipFullEngine = pako.deflate(finalString);
        await lenia.setEngine(gzipFullEngine)
        console.log('Setting the engine: Done')

        const metadataFullpath = rootFolder + '/' + metadataPath
        console.log(`Setting all lenia Parameters using metadata at ${metadataFullpath}`)
        const metadata = require(metadataFullpath)
        for (let index = 0; index < metadata.length; index++) {
            let element = metadata[index];
            const m = element.config.kernels_params[0].m.toFixed(9)
            const s = element.config.kernels_params[0].s.toFixed(9)
            const gzipCells = pako.deflate(element.config.cells);

            await lenia.setLeniaParams(index, m, s, gzipCells);
        }
        console.log('Setting all lenia Parameters: Done')

        let isSaleActive = await lenia.isSaleActive()
        if (!isSaleActive) {
            console.log('Starting sales')
            const setSaleStartTx = await lenia.toggleSaleStatus();
            isSaleActive = await lenia.isSaleActive()
            if (!isSaleActive) {
                throw new Error('Sale did not activate')
            }
            console.log('Starting sales: Done')
        }
        
        console.log('Claiming Reserved')
        const claimReservedTx = await lenia.claimReserved(11, accounts[0].address);
        console.log('Claiming Reserved: Done')

        console.log('Minting everything')
        const maxSupply = Number(await lenia.MAX_SUPPLY())
        const totalSupply = Number(await lenia.totalSupply())
        const contractPrice = await lenia.getPrice()
        console.log(maxSupply, totalSupply);
        for (let index = 0; index < maxSupply - totalSupply; index++) {
            await lenia.mint({
                value: contractPrice
            })
        }
        console.log('Minting Everything: Done')

        console.log('if you want assets to be update, you need to launch the reveal script now.');
    })