// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat")
const fs = require("fs")
const path= require("path")

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const LeniaContract = await hre.ethers.getContractFactory("Lenia")
  const lenia = await LeniaContract.deploy()

  await lenia.deployed()

  console.log("Lenia deployed to:", lenia.address)
  
  // We automatically edit the smart contract address for frontend development purposes
  if (hre.hardhatArguments.network === 'localhost') {
    fs.writeFileSync(path.join(__dirname, "../.env.development"), `GATSBY_HARDHAT_SMART_CONTRACT_ADDRESS=${lenia.address}`)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
