task("start-sale", "Start Lenia sale", async (taskArgs, hre) => {
    if (hre.hardhatArguments.network == null) {
      throw new Error('Please add the missing --network <localhost|rinkeby|goerli> argument')
    }

    const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
    const LeniaContractFactory = await hre.ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: LeniaDescriptorLibraryDeployment.address
        },
    })
    const LeniaDeployment = await hre.deployments.get('Lenia')
    const lenia = LeniaContractFactory.attach(LeniaDeployment.address)

    let hasSaleStarted = await lenia.hasSaleStarted()
    if (hasSaleStarted) {
      throw new Error('The sale has already started, no need to run this task.')
    }
  
    const setSaleStartTx = await lenia.flipHasSaleStarted();
  
    // wait until the transaction is mined
    await setSaleStartTx.wait();
    hasSaleStarted = await lenia.hasSaleStarted()
    if (hasSaleStarted) {
      console.log('Sale was successfully started')
    } else {
      throw new Error('Something went wrong, sale couldn\'t be started')
    }
})