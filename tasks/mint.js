const fs = require('fs')
const path = require('path')

task("claim-reserved", "Claim reserved tokens for the team", async (taskArgs, hre) => {
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

  const reserved = JSON.parse(fs.readFileSync(path.join(__dirname, `data/claim-reserved-${hre.hardhatArguments.network}.json`), 'utf8'))
  for (i = 0; i < reserved.length; i++) {
    const futureOwner = reserved[i]
    const claimReservedTx = await lenia.claimReserved(futureOwner.reserved, futureOwner.address);
    // wait until the transaction is mined
    await claimReservedTx.wait();
  }
})