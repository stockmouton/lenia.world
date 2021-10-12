const prompt = require('prompt');
const { assert } = require("chai")
const fs = require("fs")
const path = require("path")

const deployLeniaRoyaltiesContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments
  
  const accounts = await getNamedAccounts()
  const addresses = []
  const shares = []

  if (hre.hardhatArguments.network == 'mainnet' || hre.hardhatArguments.network == 'rinkeby') {
    splitter = JSON.parse(fs.readFileSync(path.join(__dirname, `../tasks/data/royalties-payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
    for (i = 0; i < splitter.length; i++) {
      addresses.push(splitter[i].address)
      shares.push(splitter[i].shares)
    }
  } else {
    //addresses = await getNamedAccounts()
  }
    
  assert(Object.keys(addresses).length == 4, 'Expecting 4 addresses to deploy on mainnet')
  console.log('Deploying LeniaRoyalties Contract')
  console.log('Splitees', addresses)
  console.log('Shares', shares)
  const deployer = accounts.deployer
  console.log('Deployer', deployer)
  console.log('Is this ok? [y/N]')
  const { ok } = await prompt.get(['ok']);
  if (ok !== 'y') {
    console.log('Quitting!')
    process.exit()
  }
  
  await deploy('LeniaRoyalties', {
    args: [addresses, shares],
    from: deployer,
    log: true,
  })
}

deployLeniaRoyaltiesContract.tags = ['LeniaRoyalties']


module.exports = deployLeniaRoyaltiesContract
