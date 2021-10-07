const fs = require('fs')
const path = require('path')

task("verify-osef", "Set the engine in the smart contract",  async (taskArgs, hre) => {
  const LeniaDescriptorLibraryDeployment = await hre.deployments.get('LeniaDescriptor')
  const LeniaDeployment = await hre.deployments.get('Lenia')

  const addresses = []
  const shares = []
  splitter = JSON.parse(fs.readFileSync(path.join(__dirname, `../tasks/data/payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
  for (i = 0; i < splitter.length; i++) {
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
});
})