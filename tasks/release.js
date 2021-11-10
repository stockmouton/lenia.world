const prompt = require("prompt")
const fs = require("fs")
const path = require("path")

task("release", "Withdraw money from contract for one address", async (taskArgs, hre) => {
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

  let shares;
  if (hre.hardhatArguments.network === 'mainnet') {
    shares = JSON.parse(fs.readFileSync(path.join(__dirname, `data/payment-splitter-${hre.hardhatArguments.network}.json`), 'utf8'))
  } else {
    const accounts = await hre.ethers.getSigners()
    shares = [{name: "deployer", address: accounts[0].address, shares: 1}]
  }
  
  console.log(shares)
  console.log('Is this ok? [y/N]')
  const { ok } = await prompt.get(['ok']);
  if (ok !== 'y') {
    console.log('Quitting!')
    process.exit()
  }

  const releaseTx = await lenia.release(shares[0].address);
  // wait until the transaction is mined
  await releaseTx.wait();
})

task("get-shares", "Get shares").addParam(
  'address',
  'An Ethereum address'
).setAction( async ({ address }, hre) => {
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

const shares = await lenia.shares(address)
console.log(`Shares for ${address} is ${shares})`)
})