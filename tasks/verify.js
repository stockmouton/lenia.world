const fs = require('fs')
const path = require('path')

task("verify-lenia", "Verify Lenia smart contract",  async (taskArgs, hre) => {
  const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
  const LeniaDeployment = await hre.deployments.get('Lenia')

  const addresses = []
  const shares = []
  const splitter = JSON.parse(fs.readFileSync(path.join(__dirname, `../tasks/data/payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
  for (let i = 0; i < splitter.length; i+=1) {
    addresses.push(splitter[i].address)
    shares.push(splitter[i].shares)
  }

  await hre.run("verify:verify", {
    address: LeniaDeployment.address,
    constructorArguments: [
      addresses,
      shares
    ],
    libraries: {
      LeniaDescriptor: LeniaDescriptorLibraryDeployment.address,
    }
  })
})

task("verify-royalties", "Verify LeniaRoyalties smart contract",  async (taskArgs, hre) => {
  const LeniaRoyaltiesDeployment = await hre.deployments.get('LeniaRoyalties')

  const addresses = []
  const shares = []
  const splitter = JSON.parse(fs.readFileSync(path.join(__dirname, `../tasks/data/royalties-payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
  for (let i = 0; i < splitter.length; i+=1) {
    addresses.push(splitter[i].address)
    shares.push(splitter[i].shares)
  }

  await hre.run("verify:verify", {
    address: LeniaRoyaltiesDeployment.address,
    constructorArguments: [
      addresses,
      shares
    ],
    contract: "contracts/LeniaRoyalties.sol:LeniaRoyalties"
  })
})

task("verify-metadata", "Verify LeniaMetadata smart contract",  async (taskArgs, hre) => {
  const LeniaMetadataDeployment = await hre.deployments.get('LeniaMetadata')

  await hre.run("verify:verify", {
    address: LeniaMetadataDeployment.address,
    contract: "contracts/LeniaMetadata.sol:LeniaMetadata"
  })
})
