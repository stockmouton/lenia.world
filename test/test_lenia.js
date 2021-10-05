const { expect } = require("chai")
const { ethers } = require("hardhat")
const UglifyJS = require("uglify-js")
const fs = require('fs')

const { attrsMap, traitTypeAttrsMap, deployLeniaContract } = require('./utils')
const { max } = require("lodash")
const {gzip, ungzip} = require('node-gzip');

describe("Lenia", function () {
  let hardhatLenia

  beforeEach(async function () {
    hardhatLenia = await deployLeniaContract(ethers)
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const [owner] = await ethers.getSigners()
      const contractOwner = await hardhatLenia.owner()
      expect(contractOwner).to.equal(owner.address)
    })
  })

  describe("Populate", function () {
    it("should set the engine", async function () {
      const engineCode = fs.readFileSync('./src/engine.js', 'utf-8')
      const result = UglifyJS.minify([engineCode])
      await hardhatLenia.setEngine(result.code)

      const contractEngine = await hardhatLenia.getEngine()

      expect(contractEngine.length > 0).to.equal(true)
    })
    
    it("should set and get cells per cells", async function () {
      let metadata = require('../static/metadata/all_metadata.json')
      const max_length = 5 // metadata.length
      for (let i = 0; i < max_length; i++) {
          const element = metadata[i];
          const gzipCells = await gzip(element.config.cells);

          await hardhatLenia.setLeniaCells(i, gzipCells)
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        
        const contractGzipCellsHex = await hardhatLenia.getLeniaCells(index)
        const contractGzipCell = Buffer.from(ethers.utils.arrayify(contractGzipCellsHex))
        const contractCellsBuffer = await ungzip(contractGzipCell);
        const contractCells = contractCellsBuffer.toString('utf-8')

        expect(contractCells).to.equal(element.config.cells)
      }
    })

    it("should set and get lenia parameters", async function () {
      const metadata = require('../static/metadata/all_metadata.json')
      
      const max_length = 5 // metadata.length
      for (let index = 0; index < max_length; index++) {
        let element = metadata[index];
        await hardhatLenia.setLeniaKenelsParams(
          index,
          element.config.kernels_params[0].m.toFixed(9),
          element.config.kernels_params[0].s.toFixed(9),
        )
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        const contractParams = await hardhatLenia.getLeniaParams(index)
        expect(contractParams.m).to.equal(element.config.kernels_params[0].m.toFixed(9))
        expect(contractParams.s).to.equal(element.config.kernels_params[0].s.toFixed(9))
      }
      
    })

    it("should set and get metadata", async function () {
      const metadata = require('../static/metadata/all_metadata.json')
      
      const max_length = 5 // metadata.length
      for (let index = 0; index < max_length; index++) {
        let element = metadata[index];

        const stringID = index.toString()

        let imageURL = "image.mp4";
        let animationURL = "video.mp4";
        let smLeniaAttributes = []
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          const traitTypeIndex = traitTypeAttrsMap.indexOf(attr.trait_type)
          smLeniaAttributes.push({
            'traitType': traitTypeIndex,
            'value': attrsMap[traitTypeIndex].indexOf(attr.value),
            'numericalValue': attr.numerical_value ? attr.numerical_value.toFixed(9) : traitTypeIndex.toFixed(1),
          })
        }

        await hardhatLenia.setMetadata(
            index, 
            stringID,
            imageURL,
            animationURL,
            smLeniaAttributes
        )
      }

      for (let index = 0; index < max_length; index++) {        
        const stringID = index.toString()
        const contractMetadata = await hardhatLenia.getMetadata(index)

        expect(contractMetadata.stringID).to.equal(stringID)
      }
    })

    it("should not return onchain metadata for unready element", async function () {
      const metadata = require('../static/metadata/all_metadata.json')
      
      const index = 0;
      
      let element = metadata[index];
        
      const stringID = index.toString()

      let imageURL = "image.mp4";
      let animationURL = "video.mp4";
      let smLeniaAttributes = []
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        const traitTypeIndex = traitTypeAttrsMap.indexOf(attr.trait_type)
        smLeniaAttributes.push({
          'traitType': traitTypeIndex,
          'value': attrsMap[traitTypeIndex].indexOf(attr.value),
          'numericalValue': attr.numerical_value ? attr.numerical_value.toFixed(9) : traitTypeIndex.toFixed(1),
        })
      }

      await hardhatLenia.setMetadata(
          index, 
          stringID,
          imageURL,
          animationURL,
          smLeniaAttributes
      )

      try {
        const tokenURI = await hardhatLenia.tokenURI(index)
      }
      catch (error) {
          const errorString = 'VM Exception while processing transaction'
          expect(error.message.startsWith(errorString)).to.equal(true);
      }
    })

    it("should return onchain metadata for ready element", async function () {
      const metadata = require('../static/metadata/all_metadata.json')
      
      const index = 0;
      
      let element = metadata[index];
        
      const stringID = index.toString()

      // Fake lenia params
      let m = element.config.kernels_params[0].m
      let s = element.config.kernels_params[0].s
      const gzipCells = await gzip(element.config.cells);
      // gzipCells = Buffer.from('x');

      let imageURL = "image.mp4";
      let animationURL = "video.mp4";
      let smLeniaAttributes = []
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        const traitTypeIndex = traitTypeAttrsMap.indexOf(attr.trait_type)
        smLeniaAttributes.push({
          'traitType': traitTypeIndex,
          'value': attrsMap[traitTypeIndex].indexOf(attr.value),
          'numericalValue': attr.numerical_value ? attr.numerical_value.toFixed(9) : traitTypeIndex.toFixed(1),
        })
      }

      await hardhatLenia.setLeniaKenelsParams(
          index,
          m.toFixed(9),
          s.toFixed(9),
      )

      await hardhatLenia.setLeniaCells(
          index,
          gzipCells
      )

      await hardhatLenia.setMetadata(
          index, 
          stringID,
          imageURL,
          animationURL,
          smLeniaAttributes
      )

      const tokenURI = await hardhatLenia.tokenURI(index)
    })
  })

  describe("Presale", function () {
    it("should toggle the presale status", async function () {
      let isPreSaleActive = await hardhatLenia.isPresaleActive()
      expect(isPreSaleActive).to.equal(false)

      await hardhatLenia.togglePresaleStatus()
      isPreSaleActive = await hardhatLenia.isPresaleActive()

      expect(isPreSaleActive).to.equal(true)

      await hardhatLenia.togglePresaleStatus()

      isPreSaleActive = await hardhatLenia.isPresaleActive()

      expect(isPreSaleActive).to.equal(false)
    })

    it("should mint for the presale only once for an eligible address", async function () {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const eligibleAccounts = otherAccounts.filter((_, i) => i < (otherAccounts.length / 2))
      const eligibleAddresses = eligibleAccounts.map(account => account.address)
      const uneligibleAccounts = otherAccounts.filter((_, i) => i >= (otherAccounts.length / 2))
      let lastMintedSupply = 0

      // Add eligible addresses to the presale list
      const addPresaleListTx = await hardhatLenia.addPresaleList(eligibleAddresses)
      await addPresaleListTx.wait()

      // Start the presale
      await hardhatLenia.togglePresaleStatus()

      const contractPrice = await hardhatLenia.getPrice()

      // Mint for each address
      for (let i = 0; i < eligibleAccounts.length; i++) {
        const account = eligibleAccounts[i]
        await hardhatLenia.connect(account).presaleMint({
          value: contractPrice
        })
        
        // Check if the supply has increased
        const totalSupply = await hardhatLenia.totalSupply()
        expect(totalSupply).to.equal(lastMintedSupply + 1)
        lastMintedSupply += 1

        // Try to mint again with the same address and fail
        const failingMintTx = hardhatLenia.connect(account).presaleMint({
          value: contractPrice
        })

        await expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }

      // Try to mint for each uneligible address and fail
      for (let i = 0; i < uneligibleAccounts.length; i++) {
        const account = uneligibleAccounts[i]
        const failingMintTx = hardhatLenia.connect(account).presaleMint({
          value: contractPrice
        })

        await expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }
    })
  })

  describe("Sale", () => {
    it("should toggle the sale status", async function () {
      expect(await hardhatLenia.isSaleActive()).to.equal(false)
  
      await hardhatLenia.toggleSaleStatus()
  
      expect(await hardhatLenia.isSaleActive()).to.equal(true)
  
      await hardhatLenia.toggleSaleStatus()
  
      isSaleActive = await hardhatLenia.isSaleActive()
  
      expect(await hardhatLenia.isSaleActive()).to.equal(false)
    })
  
    it("should mint for the sale", async function () {
      await hardhatLenia.toggleSaleStatus()
    
      const contractPrice = await hardhatLenia.getPrice()
      await hardhatLenia.mint({
        value: contractPrice
      })

      const totalSupply = await hardhatLenia.totalSupply()
      expect(totalSupply).to.equal(1)
    })

    it("should not mint when max supply is reached", async function () {
      await hardhatLenia.toggleSaleStatus()

      const maxSupply = await hardhatLenia.MAX_SUPPLY()
      const reserved = await hardhatLenia.getReservedLeft()
      const publicSupply = maxSupply - reserved
      for (i = 1; i <= publicSupply + 1; i++) {
        const contractPrice = await hardhatLenia.getPrice()
        const mintTx = hardhatLenia.mint({
          value: contractPrice
        })
        
        const totalSupply = await hardhatLenia.totalSupply()
        if (i <= publicSupply) expect(totalSupply).to.equal(i)
        else expect(mintTx).to.be.revertedWith("Tokens are sold out")
      }
    })
  })
})
