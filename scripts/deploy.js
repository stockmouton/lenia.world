const hre = require("hardhat")
const fs = require("fs")
const path= require("path")

async function main() {
  // // Load all metadata
  // metadata = []
  // for (let index = 0; index < 210; index++) {
  //   let lenia_json = fs.readFileSync(`${__dirname}/fake/${index}-metadata.json`);
  //   // let lenia_metadata = JSON.parse(lenia_json);
  //   metadata.push(lenia_json)
  // }

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
