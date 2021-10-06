const prompt = require('prompt');
const { assert } = require("chai")

const deployLeniaContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments
  
  const accounts = await getNamedAccounts()
  
  if (hre.hardhatArguments.network == 'mainnet') {
    assert(accounts.length == 4, 'Expecting 4 addresses to deploy on mainnet')
    console.log(accounts)

    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
      console.log('Quitting!')
      process.exit()
    }
  }

  
  const deployer = accounts[0]
  const leniaDescriptorLibrary = await deploy("LeniaDescriptor", {
    from: deployer,
    log: true, 
  });
  
  // const otherAddresses = otherAccounts.map(account => account.address)
  // // Simulate splitting Ether balance among a group of accounts
  // const payeeAdresses = [
  //     owner.address, // StockMouton DAO
  //     otherAddresses[0], // Team Member 1
  //     otherAddresses[1], // Team Member 2
  //     otherAddresses[2], // Team Member 3
  // ]
  // const payeeShares = [450, 225, 225, 100]
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
