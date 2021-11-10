const { types } = require("hardhat/config")

task("start-presale", "Start Lenia presale", async (taskArgs, hre) => {
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

  let isPresaleActive = await lenia.isPresaleActive()
  if (isPresaleActive) {
    throw new Error('The presale has already started, no need to run this task.')
  }

  const setSaleStartTx = await lenia.togglePresaleStatus();

  // wait until the transaction is mined
  await setSaleStartTx.wait();
  isPresaleActive = await lenia.isPresaleActive()
  if (isPresaleActive) {
    console.log('Presale was successfully started')
  } else {
    throw new Error('Something went wrong, presale couldn\'t be started')
  }
})

task("set-baseuri", "Set the base uri")
  .addOptionalParam(
    'baseuri',
    'The metadata baseURI',
    'http://localhost:8000/metadata/',
    types.string,
  ).setAction( async ({ baseuri }, hre ) => {
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

    await lenia.setBaseURI(baseuri)
    console.log('baseURI was successfully set')
  })

task("start-sale", "Start Lenia sale", async (taskArgs, hre) => {
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

    let isSaleActive = await lenia.isSaleActive()
    if (isSaleActive) {
      throw new Error('The sale has already started, no need to run this task.')
    }
  
    const setSaleStartTx = await lenia.toggleSaleStatus();
  
    // wait until the transaction is mined
    await setSaleStartTx.wait();
    isSaleActive = await lenia.isSaleActive()
    if (isSaleActive) {
      console.log('Sale was successfully started')
    } else {
      throw new Error('Something went wrong, sale couldn\'t be started')
    }
})