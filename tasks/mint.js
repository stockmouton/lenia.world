const fs = require('fs')
const path = require('path')
const prompt = require('prompt');

task("add-presale-list", "Add a range of addresses to the presale list", async (taskArgs, hre) => {
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

  let presaleList;
  if (hre.hardhatArguments.network === 'mainnet' || hre.hardhatArguments.network === 'rinkeby') {
    presaleList = JSON.parse(fs.readFileSync(path.join(__dirname, `data/presale-list-${hre.hardhatArguments.network}.json`), 'utf8'))
  } else {
    const accounts = await hre.ethers.getSigners()
    // Add first ten addresses
    presaleList = accounts.map(account => account.address).filter((_, i) => i < 10)
  }
  
  console.log(presaleList)
  console.log('Is this ok? [y/N]')
  const { ok } = await prompt.get(['ok']);
  if (ok !== 'y') {
    console.log('Quitting!')
    process.exit()
  }

  const addPresaleListTx = await lenia.addPresaleList(presaleList);
  // wait until the transaction is mined
  await addPresaleListTx.wait();

  for (let i = 0; i < presaleList.length; i+=1) {
    const account = presaleList[i]
    const isEligibleForPresale = await lenia.isEligibleForPresale(account)
    if (isEligibleForPresale) {
      console.log(`${account} is eligible for presale`)
    } else {
      throw new Error(`${account} could not be added to the list somehow`)
    }
  }  
})

task("eligible-presale", "Check if an address is eligible for presale list").addParam(
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

  const isEligibleForPresale = await lenia.isEligibleForPresale(address)
  console.log(`${address} is ${isEligibleForPresale ? '' : 'not'} eligible for presale`)
})

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

  let reserved
  if (hre.hardhatArguments.network === 'mainnet' || hre.hardhatArguments.network === 'rinkeby') {
    reserved = JSON.parse(fs.readFileSync(path.join(__dirname, `data/claim-reserved-${hre.hardhatArguments.network}.json`), 'utf8'))
  } else {
    const accounts = await hre.ethers.getSigners()
    // Add first ten addresses
    reserved = accounts.map((account, i) => ({
      name: i,
      address: account.address,
      reserved: 2,
    })).filter((_, i) => i < 10)
  }
  
  console.log(reserved)
  console.log('Is this ok? [y/N]')
  const { ok } = await prompt.get(['ok']);
  if (ok !== 'y') {
    console.log('Quitting!')
    process.exit()
  }
  for (let i = 0; i < reserved.length; i+=1) {
    const futureOwner = reserved[i]
    console.log(futureOwner)
    const claimReservedTx = await lenia.claimReserved(futureOwner.reserved, futureOwner.address);
    console.log(claimReservedTx)
    // wait until the transaction is mined
    await claimReservedTx.wait();
    console.log('successful transaction')

    const tokensOfOwner = await lenia.tokensOfOwner(futureOwner.address)
    console.log(`${futureOwner.name}(${futureOwner.address}) owns:`)
    console.log(tokensOfOwner)
  }
})