const UglifyJS = require("uglify-js");
const fs = require('fs');
const pako = require('pako');

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap } = require('../test/utils')
const rootFolder = __dirname + '/..'

task("set-engine", "Set the engine in the smart contract")
    .addOptionalParam(
        'enginePath',
        'The path to the engine JS code',
        'src/engine.js',
        types.string,
    ).setAction( async ({ enginePath }, hre) => {
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
        
        const engineFullpath = rootFolder + '/' + enginePath;
        const engineCode = fs.readFileSync(engineFullpath, 'utf-8')
        const result = UglifyJS.minify([engineCode]);
        const gzipEngine = pako.deflate(result.code);
        
        await lenia.setEngine(gzipEngine)
    
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
    
    const contractEngine = await leniaUtils.getEngineCode(hre.ethers.provider, lenia)
    console.log(contractEngine)
})

task("set-cells", "Set cells in the smart contract")
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
        let metadata = require(metadataFullpath)
        let allCells = []
        for (let i = 0; i < metadata.length; i++) {
            const element = metadata[i];
            allCells.push(element.config.cells);
        }
        const gzipCells = await gzip(allCells.join("%%"));

        const setLeniaCellsTx = await lenia.setLeniaCells(gzipCells)
        const receipt = await setLeniaCellsTx.wait()

        const cells = await lenia.getLeniaCells();
        if (cells.length) {
            console.log('Cells successfully set in the smart contract')
        } else {
            throw new Error('Something went wrong, cells have not been set')
        }
    })

task("get-cells", "get a Lenia cells")
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
        
        console.log(contractAllCells[index])
    })

task("set-leniaparams", "Set all metadata in the contract")
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
            
            const setLeniaParamsTx = await lenia.setLeniaParams(
                index,
                element.config.kernels_params[0].m.toFixed(9),
                element.config.kernels_params[0].s.toFixed(9),
            )
            const receipt = await setLeniaParamsTx.wait()
        }
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
        
        const contractLeniaParams = await lenia.getLeniaParams(index)
        console.log(contractLeniaParams)
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