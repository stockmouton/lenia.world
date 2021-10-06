const prompt = require('prompt');
const { assert } = require("chai")

const deployLeniaContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments
  
  const accounts = await getNamedAccounts()
  if (hre.hardhatArguments.network == 'mainnet' || hre.hardhatArguments.network == 'rinkeby') {
    assert(Object.keys(accounts).length == 4, 'Expecting 4 addresses to deploy on mainnet')
    
    console.log(accounts)
    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
      console.log('Quitting!')
      process.exit()
    }
  }

  const deployer = accounts.deployer
  const leniaDescriptorLibrary = await deploy("LeniaDescriptor", {
    from: deployer,
    log: true, 
  });
  
  await deploy('Lenia', {
    args: [[deployer], [1]],
    from: deployer,
    log: true, 
    libraries: {
      LeniaDescriptor: leniaDescriptorLibrary.address
    }
  })
}

deployLeniaContract.tags = ['Lenia']


module.exports = deployLeniaContract
