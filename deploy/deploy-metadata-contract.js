const prompt = require('prompt');

const deployLeniaMetadataContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments
  
  const accounts = await getNamedAccounts()
  const deployer = accounts.deployer
  let addresses = []
  let shares = []

  if (hre.hardhatArguments.network == 'mainnet' || hre.hardhatArguments.network == 'rinkeby') {
    console.log(`Deploying LeniaMetadata Contract on ${hre.hardhatArguments.network}`)
    const deployer = accounts.deployer
    console.log('Deployer', deployer)
    console.log('Is this ok? [y/N]')
    const { ok } = await prompt.get(['ok']);
    if (ok !== 'y') {
      console.log('Quitting!')
      process.exit()
    }
  }

  await deploy('LeniaMetadata', {
    from: deployer,
    log: true,
  })
}

deployLeniaMetadataContract.tags = ['lenia-metadata']


module.exports = deployLeniaMetadataContract
