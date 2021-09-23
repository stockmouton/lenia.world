const deployLeniaContract = async hre => {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments

  const {deployer} = await getNamedAccounts()

  await deploy('Lenia', {
    from: deployer,
    log: true,
  })
}

deployLeniaContract.tags = ['Lenia']


module.exports = deployLeniaContract
