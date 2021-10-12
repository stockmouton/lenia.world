const { expect } = require("chai")
const { ethers } = require("hardhat")
const UglifyJS = require("uglify-js")
const fs = require('fs')
const pako = require('pako');

const { attrsMap, traitTypeAttrsMap, deployLeniaContract } = require('./utils')
const leniaUtils = require('../src/utils/sm')

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
    it("should set and get the engine", async function () {
      const engineCode = fs.readFileSync('./src/engine.js', 'utf-8')
      const result = UglifyJS.minify([engineCode])
      const gzipEngine = pako.deflate(result.code);

      await hardhatLenia.setEngine(gzipEngine)

      const contractEngine = await leniaUtils.getEngineCode(ethers.provider, hardhatLenia)
      expect(contractEngine).to.equal(result.code)
    })

    it("should log (and get) the engine using calldata", async function () {
      const engineCode = fs.readFileSync('./src/engine.js', 'utf-8')
      const result = UglifyJS.minify([engineCode])
      const gzipEngine = pako.deflate(result.code);

      const logEngineTx = await hardhatLenia.logEngine(gzipEngine)
      await hardhatLenia.setEngine(logEngineTx.hash)

      const contractEngine = await leniaUtils.getEngineCode(ethers.provider, hardhatLenia)
      expect(contractEngine).to.equal(result.code)
    })

    it("should set and get lenia parameters", async function () {
      const metadata = require('../metadata/fake/all_metadata.json')
      
      const max_length = 5 // metadata.length
      for (let index = 0; index < max_length; index++) {
        let element = metadata[index];
        const m = element.config.kernels_params[0].m.toFixed(9)
        const s = element.config.kernels_params[0].s.toFixed(9)
        const gzipCells = pako.deflate(element.config.cells);

        await hardhatLenia.setLeniaParams(
          index, m, s, gzipCells
        )
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        const leniaParams = await leniaUtils.getLeniaParameters(ethers.provider, hardhatLenia, index)
        expect(leniaParams.m).to.equal(element.config.kernels_params[0].m.toFixed(9))
        expect(leniaParams.s).to.equal(element.config.kernels_params[0].s.toFixed(9))
        expect(leniaParams.cells).to.equal(element.config.cells)
      }
      
    })

    it("should log (and get) cells using callData", async function () {
      const metadata = require('../metadata/fake/all_metadata.json')
      
      const max_length = 5
      for (let index = 0; index < max_length; index++) {
        element = metadata[index]
        const m = element.config.kernels_params[0].m.toFixed(9)
        const s = element.config.kernels_params[0].s.toFixed(9)
        const gzipCells = pako.deflate(element.config.cells);

        // Update the cells as a hash
        const logLeniaParamsTx = await hardhatLenia.logLeniaParams(
          m, s, gzipCells
        )
        await hardhatLenia.setLeniaParams(index, "", "", logLeniaParamsTx.hash)
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        const leniaParams = await leniaUtils.getLeniaParameters(ethers.provider, hardhatLenia, index)

        expect(leniaParams.m).to.equal(element.config.kernels_params[0].m.toFixed(9))
        expect(leniaParams.s).to.equal(element.config.kernels_params[0].s.toFixed(9))
        expect(leniaParams.cells).to.equal(element.config.cells)
      }
    })

    it("should set and get metadata", async function () {
      const metadata = require('../metadata/fake/all_metadata.json')
      
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
      const metadata = require('../metadata/fake/all_metadata.json')
      
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

      await hardhatLenia.setBaseURI('https://fake.com/metadata/')
      await hardhatLenia.toggleSaleStatus()
      const contractPrice = await hardhatLenia.getPrice()
      await hardhatLenia.mint({
        value: contractPrice
      })

      await hardhatLenia.setMetadata(
          index, 
          stringID,
          imageURL,
          animationURL,
          smLeniaAttributes
      )

      const tokenURI = await hardhatLenia.tokenURI(index)
      expect(tokenURI).to.equal('https://fake.com/metadata/0.json')
    })

    it("should return onchain metadata for ready element", async function () {
      const metadata = require('../metadata/fake/all_metadata.json')
      
      const index = 0;
      
      let element = metadata[index];
        
      const stringID = index.toString()

      // Fake lenia params
      const m = element.config.kernels_params[0].m.toFixed(9)
      const s = element.config.kernels_params[0].s.toFixed(9)
      const gzipCells = pako.deflate(element.config.cells);

      let imageURL = "image.gif";
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

      await hardhatLenia.setLeniaParams(
          index, m, s, gzipCells
      )

      await hardhatLenia.setMetadata(
          index, 
          stringID,
          imageURL,
          animationURL,
          smLeniaAttributes
      )

      const tokenMetadataJSON = await hardhatLenia.tokenURI(index)
      const data = JSON.parse(tokenMetadataJSON.replace('data:application/json,', ''))
      expect(data.image).to.equal("image.gif")
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

    it("should add addresses to the presale list", async function() {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const eligibleAccounts = otherAccounts.filter((_, i) => i < (otherAccounts.length / 2))
      const eligibleAddresses = eligibleAccounts.map(account => account.address)
      const uneligibleAccounts = otherAccounts.filter((_, i) => i >= (otherAccounts.length / 2))
      const uneligibleAddresses = uneligibleAccounts.map(account => account.address)

      // Add eligible addresses to the presale list
      await hardhatLenia.addPresaleList(eligibleAddresses)

      for (i = 0; i < eligibleAddresses.length; i++) {
        expect(await hardhatLenia.isEligibleForPresale(eligibleAddresses[i])).to.equal(true)
      }

      for (i = 0; i < uneligibleAddresses.length; i++) {
        expect(await hardhatLenia.isEligibleForPresale(uneligibleAddresses[i])).to.equal(false)
      }
    })

    it("should mint for the presale only once for an eligible address", async function () {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const eligibleAccounts = otherAccounts.filter((_, i) => i < (otherAccounts.length / 2))
      const eligibleAddresses = eligibleAccounts.map(account => account.address)
      const uneligibleAccounts = otherAccounts.filter((_, i) => i >= (otherAccounts.length / 2))
      let lastMintedSupply = 0

      // Add eligible addresses to the presale list
      await hardhatLenia.addPresaleList(eligibleAddresses)

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

        expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }

      // Try to mint for each uneligible address and fail
      for (let i = 0; i < uneligibleAccounts.length; i++) {
        const account = uneligibleAccounts[i]
        const failingMintTx = hardhatLenia.connect(account).presaleMint({
          value: contractPrice
        })

        expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }
    })

    it("should not mint when presale is not active", async function () {    
      const contractPrice = await hardhatLenia.getPrice()
      const mintTx = hardhatLenia.presaleMint({
        value: contractPrice
      })

      expect(mintTx).to.be.revertedWith("Presale is not active")
    })

    it("should not mint when max public supply is reached", async function () {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const maxSupply = await hardhatLenia.MAX_SUPPLY()
      const reserved = await hardhatLenia.getReservedLeft()
      const publicSupply = maxSupply - reserved
      
      const eligibleWallets = []

      for (let i = 0; i <= publicSupply; i++) {
        eligibleWallets.push(ethers.Wallet.createRandom())
      }
      const eligibleAddresses = otherAccounts.map(wallet => wallet.address)
      await hardhatLenia.addPresaleList(eligibleAddresses)
      await hardhatLenia.togglePresaleStatus()
      
      const contractPrice = await hardhatLenia.getPrice()
      for (let i = 0; i < eligibleAddresses.length; i++) {
        const mintTx = hardhatLenia.connect(otherAccounts[i]).presaleMint({
          value: contractPrice
        })
        
        if (i < publicSupply) {
          await mintTx
          expect(await hardhatLenia.totalSupply()).to.equal(i + 1)
        }
        else expect(mintTx).to.be.revertedWith("Tokens are sold out")
      }
    })

    it("should not mint when transaction value doesn\'t meet price", async function () {
      await hardhatLenia.togglePresaleStatus()
      
      // Add eligible addresses to the presale list
      const [owner] = await ethers.getSigners()
      await hardhatLenia.addPresaleList([owner.address])

      const contractPrice = await hardhatLenia.getPrice()
      const mintTx = hardhatLenia.presaleMint({
        value: contractPrice.sub(ethers.utils.parseEther("0.001"))
      })

      expect(mintTx).to.be.revertedWith("Insufficient funds")
    })
  })

  describe("Sale", () => {
    it("should toggle the sale status", async function () {
      let isSaleActive;

      isSaleActive = await hardhatLenia.isSaleActive()
      expect(isSaleActive).to.equal(false)
  
      await hardhatLenia.toggleSaleStatus()
  
      isSaleActive = await hardhatLenia.isSaleActive()
      expect(isSaleActive).to.equal(true)
  
      await hardhatLenia.toggleSaleStatus()
      isSaleActive = await hardhatLenia.isSaleActive()
      expect(isSaleActive).to.equal(false)
    })

    it("should toggle the sale status only by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const toggleSaleTx = hardhatLenia.connect(account).toggleSaleStatus()
      expect(toggleSaleTx).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("should not mint when sale is not active", async function () {          
      const contractPrice = await hardhatLenia.getPrice()
      const mintTx = hardhatLenia.mint({
        value: contractPrice
      })

      expect(mintTx).to.be.revertedWith("Public sale is not active")
    })
  
    it("should mint for the sale", async function () {
      await hardhatLenia.toggleSaleStatus()
    
      const contractPrice = await hardhatLenia.getPrice()
      await hardhatLenia.mint({
        value: contractPrice
      })

      const totalSupply = await hardhatLenia.totalSupply()
      const contractBalance = await hardhatLenia.provider.getBalance(hardhatLenia.address)
      expect(ethers.utils.formatEther(contractBalance)).to.equal('0.15')
      expect(totalSupply).to.equal(1)
    })

    it("should not mint when max public supply is reached", async function () {
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

    it("should not mint when transaction value doesn\'t meet price", async function () {
      await hardhatLenia.toggleSaleStatus()
    
      const contractPrice = await hardhatLenia.getPrice()
      const mintTx = hardhatLenia.mint({
        value: contractPrice.sub(ethers.utils.parseEther("0.001"))
      })

      expect(mintTx).to.be.revertedWith("Insufficient funds")
    })
  })

  describe("Payment Splitter", () => {
    it("should send the money to the different shareholders", async function () {
      const [owner, payee, ...otherAccounts] = await ethers.getSigners()
      const minter = otherAccounts[10]
      await hardhatLenia.toggleSaleStatus()
      
      
      for (i = 0; i < 10; i++) {
        const contractPrice = await hardhatLenia.getPrice()
        await hardhatLenia.connect(minter).mint({
          value: contractPrice
        })
      }

      const contractBalance = await hardhatLenia.provider.getBalance(hardhatLenia.address)
      const payeeBalance = await hardhatLenia.provider.getBalance(payee.address)
      const shares = await hardhatLenia.shares(payee.address)
      const totalShares = await hardhatLenia.totalShares()

      await hardhatLenia.release(payee.address)
      const newPayeeBalance = await hardhatLenia.provider.getBalance(payee.address)
      const expectedPayeeBalance = payeeBalance.add(contractBalance.mul(shares).div(totalShares))
      expect(newPayeeBalance.eq(expectedPayeeBalance)).to.equal(true)
    })
  })

  describe("Claim an amount of reserved tokens", () => {
    it("should mint the number of reserved tokens to an account", async () => {
      const [_, account] = await ethers.getSigners()
      const reserved = await hardhatLenia.getReservedLeft()
      await hardhatLenia.claimReserved(2, account.address)
      
      expect(await hardhatLenia.balanceOf(account.address)).to.equal(2)
      expect(await hardhatLenia.getReservedLeft()).to.equal(reserved - 2)
      expect(await hardhatLenia.totalSupply()).to.equal(2)
    })

    it("should not exceed the maximum amount of reserved tokens", async () => {
      const [_, account] = await ethers.getSigners()
      const reserved = await hardhatLenia.getReservedLeft()
      const reserveTx = hardhatLenia.claimReserved(reserved + 1, account.address)
      
      expect(reserveTx).to.be.revertedWith("Exceeds the max reserved")
    })

    it("should only be called by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const reserveTx = hardhatLenia.connect(account).claimReserved(2, account.address)
      expect(reserveTx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Set Base URI", async () => {
    it("should only be called by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const reserveTx = hardhatLenia.connect(account).setBaseURI('stockmouton.com')
      expect(reserveTx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })
})
