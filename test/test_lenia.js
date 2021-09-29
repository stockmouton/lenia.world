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
    [owner, addr1] = await ethers.getSigners();

    LeniaDescriptor = await ethers.getContractFactory("LeniaDescriptor");
    const leniaDescriptorLibrary = await LeniaDescriptor.deploy();

    Lenia = await ethers.getContractFactory("Lenia", {
      libraries: {
        LeniaDescriptor: leniaDescriptorLibrary.address
      }
    });

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
      
      const setEngineTx = await hardhatLenia.setEngine(result.code.substring(0, 14000))
      const receipt = await setEngineTx.wait()

      const contractEngine = await hardhatLenia.getEngine();
      
      expect(contractEngine.length > 0).to.equal(true);
    })
    
    it("should set and get metadata", async function () {
      const metadata = require('../src/fake/metadata.json')
      index = 0
      let element = metadata[index];
        
      const setMetadataTx = await hardhatLenia.setMetadata(
        index, 
        "Lenia",
        "image.mp4",
        element.description,
        element.config.kernels_params[0].m.toFixed(10),
        element.config.kernels_params[0].s.toFixed(10),
        ""// element.config.cells
      )
      const receipt = await setMetadataTx.wait()

      const encodedContractMetadata = await hardhatLenia.getMetadata(index)
      const contractMetadataJSON = Buffer.from(
        encodedContractMetadata.replace('data:application/json;base64,', ''), 
        'base64'
      ).toString('ascii')
      const contractMetadata = JSON.parse(contractMetadataJSON)

      expect(contractMetadata.config.kernels_params[0].m).to.equal(element.config.kernels_params[0].m)
    })
  })

  describe("Transactions", function () {
    it("Should flip the sale flag", async function () {
      let hasSaleStarted = await hardhatLenia.hasSaleStarted()
      expect(hasSaleStarted).to.equal(false);

      const setSaleStartTx = await hardhatLenia.flipHasSaleStarted();
      const receipt = await setSaleStartTx.wait();
      hasSaleStarted = await hardhatLenia.hasSaleStarted()

      expect(hasSaleStarted).to.equal(true);
    });

    it("Should mint", async function () {
      const setSaleStartTx = await hardhatLenia.flipHasSaleStarted();
      const saleReceipt = await setSaleStartTx.wait();

      let hasSaleStarted = await hardhatLenia.hasSaleStarted()
      expect(hasSaleStarted).to.equal(true);

      let contractPrice = await hardhatLenia.getPrice()

      const mintTx = await hardhatLenia.mint({ 
          value: contractPrice
      })
      const mintReceipt = await mintTx.wait()

      const contractTotalSupply = await hardhatLenia.totalSupply()

      expect(contractTotalSupply).to.equal(1);
    });
  })
});
