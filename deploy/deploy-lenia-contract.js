const prompt = require('prompt');
const { assert } = require("chai")
const fs = require("fs")
const path = require("path");
const { solidityKeccak256 } = require('ethers/lib/utils');

const deployLeniaContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments
  
  const accounts = await getNamedAccounts()
  const deployer = accounts.deployer
  let addresses = []
  let shares = []

  if (hre.hardhatArguments.network == 'mainnet' || hre.hardhatArguments.network == 'rinkeby') {
    splitter = JSON.parse(fs.readFileSync(path.join(__dirname, `../tasks/data/payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
    for (i = 0; i < splitter.length; i++) {
      addresses.push(splitter[i].address)
      shares.push(splitter[i].shares)
    }
    assert(Object.keys(addresses).length == 4, 'Expecting 4 addresses to deploy on mainnet')

    console.log('Deploying Lenia Contract')
    console.log('Splitees', addresses)
    console.log('Shares', shares)
    
    console.log('Deployer', deployer)
    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
      console.log('Quitting!')
      process.exit()
    }
  } else {
    addresses = [
      accounts.deployer,
      accounts.admin1,
      accounts.admin2,
      accounts.admin3,
    ]
    shares = [1, 2, 3, 4]
  }
  
  const leniaDescriptorLibrary = await deploy("LeniaDescriptor", {
    from: deployer,
    log: true, 
  });
  
  await deploy('Lenia', {
    args: [addresses, shares],
    from: deployer,
    log: true, 
    libraries: {
      LeniaDescriptor: leniaDescriptorLibrary.address
    }
  })
}

deployLeniaContract.tags = ['Lenia']


module.exports = deployLeniaContract
