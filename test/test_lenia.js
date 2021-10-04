const { expect } = require("chai")
const { ethers } = require("hardhat")
const UglifyJS = require("uglify-js")
const fs = require('fs')

const { attrsMap, traitTypeAttrsMap, deployLeniaContract } = require('./utils')

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

    it("should set and get cells", async function () {
      const { gzip, ungzip } = require('node-gzip')

      let metadata = require('../src/fake/metadata.json')
      let allCells = []
      for (let i = 0; i < metadata.length; i++) {
        const element = metadata[i]
        allCells.push(element.config.cells)
      }
      const gzipCells = await gzip(allCells.join("%%"))

      await hardhatLenia.setCells(gzipCells)

      const contractGzipCellsHex = await hardhatLenia.getCells()
      const contractGzipCell = Buffer.from(ethers.utils.arrayify(contractGzipCellsHex))
      const contractCells = await ungzip(contractGzipCell)
      const contractAllCells = contractCells.toString('utf-8').split('%%')

      expect(contractAllCells.length).to.equal(allCells.length)
      expect(contractAllCells[0]).to.equal(allCells[0])
      expect(contractAllCells[-1]).to.equal(allCells[-1])
    })

    it("should set and get lenia parameters", async function () {
      const metadata = require('../src/fake/metadata.json')

      const index = 0
      let element = metadata[index]

      await hardhatLenia.setLeniaParams(
        index,
        element.config.kernels_params[0].m.toFixed(9),
        element.config.kernels_params[0].s.toFixed(9),
      )

      const contractParams = await hardhatLenia.getLeniaParams(index)
      expect(contractParams.m).to.equal(element.config.kernels_params[0].m.toFixed(9))
      expect(contractParams.s).to.equal(element.config.kernels_params[0].s.toFixed(9))
    })

    it("should set and get metadata", async function () {
      const metadata = require('../src/fake/metadata.json')

      const index = 0
      const paddedID = index.toString().padStart(3, '0')
      let element = metadata[index]

      let imageURL = "image.mp4"
      let smLeniaAttributes = []
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
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

      const contractMetadata = await hardhatLenia.getMetadata(index)
      expect(contractMetadata.paddedID).to.equal(paddedID)
    })
  })

  describe("Transactions", function () {
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
        const contractTotalSupply = await hardhatLenia.totalSupply()
        expect(contractTotalSupply).to.equal(lastMintedSupply + 1)
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
  
      expect(await hardhatLenia.isSaleActive()).to.equal(true)
  
      const contractPrice = await hardhatLenia.getPrice()
      await hardhatLenia.mint({
        value: contractPrice
      })

      const contractTotalSupply = await hardhatLenia.totalSupply()
      expect(contractTotalSupply).to.equal(1)
    })
  })
})
