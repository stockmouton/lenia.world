const { expect } = require("chai")
const { ethers } = require("hardhat")
const UglifyJS = require("uglify-js")
const fs = require('fs')
const path = require('path')
const pako = require('pako');

const { attrsMap, traitTypeAttrsMap, deployLeniaContract, deployLeniaMetadataContract } = require('./utils')
const leniaUtils = require('../src/utils/sm')

const rootFolder = __dirname + '/..'

describe("Lenia", function () {
  let lenia
  let leniaMetadata

  beforeEach(async function () {
    lenia = await deployLeniaContract(ethers)
    leniaMetadata = await deployLeniaMetadataContract(ethers)
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const [owner] = await ethers.getSigners()
      const contractOwner = await lenia.owner()
      expect(contractOwner).to.equal(owner.address)
    })
  })

  describe("Populate", function () {
    it("should log (and get) the engine using calldata", async function () {
      const jsenginePath = 'src/engine.js';
      const wasmSourcePath = 'static/optimized.wasm';
      const wasmSimdSourcePath = 'static/optimized-simd.wasm';

      const engineCode = fs.readFileSync(path.join(rootFolder, jsenginePath), 'utf-8')
      const engineCodeMinified = UglifyJS.minify([engineCode]).code;
      const engineCodeMinifiedBuffer = Buffer.from(engineCodeMinified)
      const wasmSource = fs.readFileSync(path.join(rootFolder, wasmSourcePath))
      const wasmSimdSource = fs.readFileSync(path.join(rootFolder, wasmSimdSourcePath))

      const gzipFullEngine = leniaUtils.compressAllEngineCode(
        wasmSource, wasmSimdSource, engineCodeMinifiedBuffer
      )
      const logEngineTx = await leniaMetadata.logEngine(gzipFullEngine)
      await logEngineTx.wait()
      const setEngineMetadataTx = await leniaMetadata.setEngine(logEngineTx.hash)
      await setEngineMetadataTx.wait()

      const setEngineTx = await lenia.setEngine(leniaMetadata.address)
      await setEngineTx.wait()
      
      const files = await leniaUtils.getEngineCode(ethers.provider, leniaMetadata)
      const WASMSource = files[0]
      const WASMSimdSource = files[1]
      const engineCodeMinified2 = files[2].toString('utf-8')

      let wasmConfig = {
        env: {
            'memory': new WebAssembly.Memory({initial: 10})
        },
        engine:{  // Name of the file
            GF_ID       : 0,
            GF_M        : 1.,
            GF_S        : 1.,
            T           : 10,
        },
        Math
      };
      await WebAssembly.instantiate(WASMSource, wasmConfig)
      wasmConfig = {
          env: {
              'memory': new WebAssembly.Memory({initial: 10})
          },
          'engine-simd':{  // Name of the file
              GF_ID       : 0,
              GF_M        : 1.,
              GF_S        : 1.,
              T           : 10,
          },
          Math
      };
      await WebAssembly.instantiate(WASMSimdSource, wasmConfig)
      
      expect(engineCodeMinified2).to.equal(engineCodeMinified)
    })

    it("should log (and get) metadata using callData", async function () {
      const metadata = require('../static/metadata/all_metadata.json')
      
      const max_length = 5
      for (let index = 0; index < max_length; index++) {
        let elementMetadata = metadata[index];
        const fullmetadataGZIP = pako.deflate(JSON.stringify(elementMetadata));
       
        const logMetadataTx = await leniaMetadata.logMetadata(fullmetadataGZIP)
        await logMetadataTx.wait()

        const setMetadataTx = await leniaMetadata.setMetadata(index, logMetadataTx.hash)
        await setMetadataTx.wait()
      }

      for (let index = 0; index < max_length; index++) {
        const element = metadata[index];
        const leniaMetadataContract = await leniaUtils.getMetadata(ethers.provider, leniaMetadata, index)
        
        expect(leniaMetadataContract.config.kernels_params[0].m).to.equal(element.config.kernels_params[0].m)
        expect(leniaMetadataContract.config.kernels_params[0].s).to.equal(element.config.kernels_params[0].s)
        expect(leniaMetadataContract.config.cells).to.equal(element.config.cells)
      }
    })
  })

  describe("Presale", function () {
    it("should toggle the presale status", async function () {
      let isPreSaleActive = await lenia.isPresaleActive()
      expect(isPreSaleActive).to.equal(false)

      await lenia.togglePresaleStatus()
      isPreSaleActive = await lenia.isPresaleActive()

      expect(isPreSaleActive).to.equal(true)

      await lenia.togglePresaleStatus()

      isPreSaleActive = await lenia.isPresaleActive()

      expect(isPreSaleActive).to.equal(false)
    })

    it("should add addresses to the presale list", async function() {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const eligibleAccounts = otherAccounts.filter((_, i) => i < (otherAccounts.length / 2))
      const eligibleAddresses = eligibleAccounts.map(account => account.address)
      const uneligibleAccounts = otherAccounts.filter((_, i) => i >= (otherAccounts.length / 2))
      const uneligibleAddresses = uneligibleAccounts.map(account => account.address)

      // Add eligible addresses to the presale list
      await lenia.addPresaleList(eligibleAddresses)

      for (i = 0; i < eligibleAddresses.length; i++) {
        expect(await lenia.isEligibleForPresale(eligibleAddresses[i])).to.equal(true)
      }

      for (i = 0; i < uneligibleAddresses.length; i++) {
        expect(await lenia.isEligibleForPresale(uneligibleAddresses[i])).to.equal(false)
      }
    })

    it("should mint for the presale only once for an eligible address", async function () {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const eligibleAccounts = otherAccounts.filter((_, i) => i < (otherAccounts.length / 2))
      const eligibleAddresses = eligibleAccounts.map(account => account.address)
      const uneligibleAccounts = otherAccounts.filter((_, i) => i >= (otherAccounts.length / 2))
      let lastMintedSupply = 0

      // Add eligible addresses to the presale list
      await lenia.addPresaleList(eligibleAddresses)

      // Start the presale
      await lenia.togglePresaleStatus()

      const contractPrice = await lenia.getPrice()

      // Mint for each address
      for (let i = 0; i < eligibleAccounts.length; i++) {
        const account = eligibleAccounts[i]
        await lenia.connect(account).presaleMint({
          value: contractPrice
        })
        
        // Check if the supply has increased
        const totalSupply = await lenia.totalSupply()
        expect(totalSupply).to.equal(lastMintedSupply + 1)
        lastMintedSupply += 1

        // Try to mint again with the same address and fail
        const failingMintTx = lenia.connect(account).presaleMint({
          value: contractPrice
        })

        expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }

      // Try to mint for each uneligible address and fail
      for (let i = 0; i < uneligibleAccounts.length; i++) {
        const account = uneligibleAccounts[i]
        const failingMintTx = lenia.connect(account).presaleMint({
          value: contractPrice
        })

        expect(failingMintTx).to.be.revertedWith('Not eligible for the presale')
      }
    })

    it("should not mint when presale is not active", async function () {    
      const contractPrice = await lenia.getPrice()
      const mintTx = lenia.presaleMint({
        value: contractPrice
      })

      expect(mintTx).to.be.revertedWith("Presale is not active")
    })

    it("should not mint when max public supply is reached", async function () {
      const [_, ...otherAccounts] = await ethers.getSigners()
      const maxSupply = await lenia.MAX_SUPPLY()
      const reserved = await lenia.getReservedLeft()
      const publicSupply = maxSupply - reserved
      
      const eligibleWallets = []

      for (let i = 0; i <= publicSupply; i++) {
        eligibleWallets.push(ethers.Wallet.createRandom())
      }
      const eligibleAddresses = otherAccounts.map(wallet => wallet.address)
      await lenia.addPresaleList(eligibleAddresses)
      await lenia.togglePresaleStatus()
      
      const contractPrice = await lenia.getPrice()
      for (let i = 0; i < eligibleAddresses.length; i++) {
        const mintTx = lenia.connect(otherAccounts[i]).presaleMint({
          value: contractPrice
        })
        
        if (i < publicSupply) {
          await mintTx
          expect(await lenia.totalSupply()).to.equal(i + 1)
        }
        else expect(mintTx).to.be.revertedWith("Tokens are sold out")
      }
    })

    it("should not mint when transaction value doesn\'t meet price", async function () {
      await lenia.togglePresaleStatus()
      
      // Add eligible addresses to the presale list
      const [owner] = await ethers.getSigners()
      await lenia.addPresaleList([owner.address])

      const contractPrice = await lenia.getPrice()
      const mintTx = lenia.presaleMint({
        value: contractPrice.sub(ethers.utils.parseEther("0.001"))
      })

      expect(mintTx).to.be.revertedWith("Insufficient funds")
    })
  })

  describe("Sale", () => {
    it("should toggle the sale status", async function () {
      let isSaleActive;

      isSaleActive = await lenia.isSaleActive()
      expect(isSaleActive).to.equal(false)
  
      await lenia.toggleSaleStatus()
  
      isSaleActive = await lenia.isSaleActive()
      expect(isSaleActive).to.equal(true)
  
      await lenia.toggleSaleStatus()
      isSaleActive = await lenia.isSaleActive()
      expect(isSaleActive).to.equal(false)
    })

    it("should toggle the sale status only by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const toggleSaleTx = lenia.connect(account).toggleSaleStatus()
      expect(toggleSaleTx).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("should not mint when sale is not active", async function () {          
      const contractPrice = await lenia.getPrice()
      const mintTx = lenia.mint({
        value: contractPrice
      })

      expect(mintTx).to.be.revertedWith("Public sale is not active")
    })
  
    it("should mint for the sale", async function () {
      await lenia.toggleSaleStatus()
    
      const contractPrice = await lenia.getPrice()
      await lenia.mint({
        value: contractPrice
      })

      const totalSupply = await lenia.totalSupply()
      const contractBalance = await lenia.provider.getBalance(lenia.address)
      expect(ethers.utils.formatEther(contractBalance)).to.equal('0.15')
      expect(totalSupply).to.equal(1)
    })

    it("should not mint when max public supply is reached", async function () {
      await lenia.toggleSaleStatus()

      const maxSupply = await lenia.MAX_SUPPLY()
      const reserved = await lenia.getReservedLeft()
      const publicSupply = maxSupply - reserved
      for (i = 1; i <= publicSupply + 1; i++) {
        const contractPrice = await lenia.getPrice()
        const mintTx = lenia.mint({
          value: contractPrice
        })
        
        const totalSupply = await lenia.totalSupply()
        if (i <= publicSupply) expect(totalSupply).to.equal(i)
        else expect(mintTx).to.be.revertedWith("Tokens are sold out")
      }
    })

    it("should not mint when transaction value doesn\'t meet price", async function () {
      await lenia.toggleSaleStatus()
    
      const contractPrice = await lenia.getPrice()
      const mintTx = lenia.mint({
        value: contractPrice.sub(ethers.utils.parseEther("0.001"))
      })

      expect(mintTx).to.be.revertedWith("Insufficient funds")
    })
  })

  describe("Payment Splitter", () => {
    it("should send the money to the different shareholders", async function () {
      const [owner, payee, ...otherAccounts] = await ethers.getSigners()
      const minter = otherAccounts[10]
      await lenia.toggleSaleStatus()
      
      
      for (i = 0; i < 10; i++) {
        const contractPrice = await lenia.getPrice()
        await lenia.connect(minter).mint({
          value: contractPrice
        })
      }

      const contractBalance = await lenia.provider.getBalance(lenia.address)
      const payeeBalance = await lenia.provider.getBalance(payee.address)
      const shares = await lenia.shares(payee.address)
      const totalShares = await lenia.totalShares()

      await lenia.release(payee.address)
      const newPayeeBalance = await lenia.provider.getBalance(payee.address)
      const expectedPayeeBalance = payeeBalance.add(contractBalance.mul(shares).div(totalShares))
      expect(newPayeeBalance.eq(expectedPayeeBalance)).to.equal(true)
    })
  })

  describe("Claim an amount of reserved tokens", () => {
    it("should mint the number of reserved tokens to an account", async () => {
      const [_, account] = await ethers.getSigners()
      const reserved = await lenia.getReservedLeft()
      await lenia.claimReserved(2, account.address)
      
      expect(await lenia.balanceOf(account.address)).to.equal(2)
      expect(await lenia.getReservedLeft()).to.equal(reserved - 2)
      expect(await lenia.totalSupply()).to.equal(2)
    })

    it("should not exceed the maximum amount of reserved tokens", async () => {
      const [_, account] = await ethers.getSigners()
      const reserved = await lenia.getReservedLeft()
      const reserveTx = lenia.claimReserved(reserved + 1, account.address)
      
      expect(reserveTx).to.be.revertedWith("Exceeds the max reserved")
    })

    it("should only be called by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const reserveTx = lenia.connect(account).claimReserved(2, account.address)
      expect(reserveTx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Set Base URI", async () => {
    it("should only be called by the owner", async () => {
      const [_, account] = await ethers.getSigners()
      const reserveTx = lenia.connect(account).setBaseURI('stockmouton.com')
      expect(reserveTx).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })
})
