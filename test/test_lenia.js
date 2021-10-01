const { expect } = require("chai");
const { ethers } = require("hardhat");
const UglifyJS = require("uglify-js");
const fs = require('fs');

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap } = require('./utils')

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
      const setEngineTx = await hardhatLenia.setEngine(result.code)
      const receipt = await setEngineTx.wait()

      const contractEngine = await hardhatLenia.getEngine();
      
      expect(contractEngine.length > 0).to.equal(true);
    })
    
    it("should set and get cells", async function () {
      const {gzip, ungzip} = require('node-gzip');

      let metadata = require('../src/fake/metadata.json')
      let allCells = []
      for (let i = 0; i < metadata.length; i++) {
          const element = metadata[i];
          allCells.push(element.config.cells);
      }
      const gzipCells = await gzip(allCells.join("%%"));

      const setCellsTx = await hardhatLenia.setCells(gzipCells)
      const receipt = await setCellsTx.wait()
      
      const contractGzipCellsHex = await hardhatLenia.getCells()
      const contractGzipCell = Buffer.from(ethers.utils.arrayify(contractGzipCellsHex))
      const contractCells = await ungzip(contractGzipCell);
      const contractAllCells = contractCells.toString('utf-8').split('%%')

      expect(contractAllCells.length).to.equal(allCells.length)
      expect(contractAllCells[0]).to.equal(allCells[0])
      expect(contractAllCells[-1]).to.equal(allCells[-1])
    })
  

    it("should set and get metadata", async function () {
      const metadata = require('../src/fake/metadata.json')
      
      const index = 0;
      const paddedID = index.toString().padStart(3, '0')
      let element = metadata[index];

      let name = "Lenia #" + paddedID;
      let imageURL = "image.mp4";
      let smLeniaAttributes = []
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        const traitTypeIndex = traitTypeAttrsMap.indexOf(attr.trait_type.toLowerCase())
        smLeniaAttributes.push({
          'traitType': traitTypeIndex,
          'value': attrsMap[traitTypeIndex].indexOf(attr.value.toLowerCase()),
          'numericalValue': attr.numerical_value ? attr.numerical_value.toFixed(9) : traitTypeIndex.toFixed(1),
        })
      }
      const setMetadataTx = await hardhatLenia.setMetadata(
        index, 
        paddedID,
        imageURL,
        element.config.kernels_params[0].m.toFixed(9),
        element.config.kernels_params[0].s.toFixed(9),
        smLeniaAttributes
      )
      const receipt = await setMetadataTx.wait()

      const encodedContractMetadata = await hardhatLenia.getMetadata(index)
      const contractMetadata = decodeContractMetdata(encodedContractMetadata)
      expect(contractMetadata.name).to.equal(name)
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
