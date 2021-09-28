const { expect } = require("chai");
const { ethers } = require("hardhat");
const UglifyJS = require("uglify-js");
const fs = require('fs');

describe("Lenia", function () {
  let Lenia;
  let hardhatLenia;
  let owner;
  let addr1;

  beforeEach(async function () {
    Lenia = await ethers.getContractFactory("Lenia");
    [owner, addr1] = await ethers.getSigners();

    hardhatLenia = await Lenia.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const contractOwner = await hardhatLenia.owner()

      expect(contractOwner).to.equal(owner.address);
    });
  })

  describe("Populate", function () {
    it("should set the engine", async function () {
      const engineCode = fs.readFileSync('./src/engine.js', 'utf-8')
      const result = UglifyJS.minify([engineCode]);
      
      const setEngineTx = await hardhatLenia.setEngine(result.code)
      await setEngineTx.wait()

      const contractEngine = await hardhatLenia.getEngine();
      
      expect(contractEngine.length > 0).to.equal(true);
    })
    
    it("should set metadata", async function () {
      const metadata = require('../src/fake/metadata.json')
      index = 6
      let element = metadata[index];
      delete element["config"]["cells"]
        
      const setMetadataTx = await hardhatLenia.setMetadata(index, JSON.stringify(element))
      await setMetadataTx.wait()

      const contractMetadataJson = await hardhatLenia.getMetadata(index)
      const contractMetadata = JSON.parse(contractMetadataJson)

      expect(contractMetadata["tokenID"]).to.equal(index)
    })

    it("should set cells", async function () {
      const metadata = require('../src/fake/metadata.json')
      index = 0
      let element = metadata[index];
      const cells = element["config"]["cells"]
        
      const setCellsTx = await hardhatLenia.setCells(index, cells)
      await setCellsTx.wait()

      const contractCells = await hardhatLenia.getCells(index)
      const shape = contractCells.split("::")[1]

      expect(shape).to.equal("1;21;20")
    })
  })

  describe("Transactions", function () {
    it("Should flip the sale flag", async function () {
      let hasSaleStarted = await hardhatLenia.hasSaleStarted()
      expect(hasSaleStarted).to.equal(false);

      const setSaleStartTx = await hardhatLenia.flipHasSaleStarted();
      await setSaleStartTx.wait();
      hasSaleStarted = await hardhatLenia.hasSaleStarted()

      expect(hasSaleStarted).to.equal(true);
    });
  })
});
