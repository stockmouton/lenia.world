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
    
    it("should set and get cells per cells", async function () {
      const {gzip, ungzip} = require('node-gzip');

      // let metadata = require('../src/fake/metadata.json')
      let metadata = require('../tmp/data/all_metadata.json')
      const max_length = 5 // metadata.length
      for (let i = 0; i < max_length; i++) {
          const element = metadata[i];
          const gzipCells = await gzip(element.config.cells);

          const setCellsTx = await hardhatLenia.setCells(i, gzipCells)
          const receipt = await setCellsTx.wait()
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        
        const contractGzipCellsHex = await hardhatLenia.getCells(index)
        const contractGzipCell = Buffer.from(ethers.utils.arrayify(contractGzipCellsHex))
        const contractCellsBuffer = await ungzip(contractGzipCell);
        const contractCells = contractCellsBuffer.toString('utf-8')

        expect(contractCells).to.equal(element.config.cells)
      }
    })
    
    it("should set and get lenia parameters", async function () {
      const metadata = require('../src/fake/metadata.json')
      
      const max_length = 5 // metadata.length
      for (let index = 0; index < max_length; index++) {
        let element = metadata[index];
        const setLeniaParamsTx = await hardhatLenia.setLeniaParams(
          index,
          element.config.kernels_params[0].m.toFixed(9),
          element.config.kernels_params[0].s.toFixed(9),
        )
        const receipt = await setLeniaParamsTx.wait()
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        const contractParams = await hardhatLenia.getLeniaParams(index)
        expect(contractParams.m).to.equal(element.config.kernels_params[0].m.toFixed(9))
        expect(contractParams.s).to.equal(element.config.kernels_params[0].s.toFixed(9))
      }
      
    })

    it("should set and get metadata", async function () {
      const metadata = require('../src/fake/metadata.json')
      
      const max_length = 5 // metadata.length
      for (let index = 0; index < max_length; index++) {
        let element = metadata[index];        
        const paddedID = index.toString().padStart(3, '0')

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
          smLeniaAttributes
        )
        const receipt = await setMetadataTx.wait()
      }

      for (let index = 0; index < max_length; index++) {        
        const contractMetadata = await hardhatLenia.getMetadata(index)
        const paddedID = index.toString().padStart(3, '0')

        expect(contractMetadata.paddedID).to.equal(paddedID)
      }
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
