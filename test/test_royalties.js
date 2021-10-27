const { expect } = require("chai")
const { ethers } = require("hardhat")

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Royalties", function () {
  let leniaRoyalties

  beforeEach(async function () {
    [owner, ...otherAccounts] = await ethers.getSigners()

    Royalties = await ethers.getContractFactory("LeniaRoyalties")

    const otherAddresses = otherAccounts.map(account => account.address)
    // Simulate splitting Ether balance among a group of accounts
    const payeeAdresses = [
        owner.address, // StockMouton DAO
        otherAddresses[0], // Team Member 1
        otherAddresses[1], // Team Member 2
        otherAddresses[2], // Team Member 3
    ]
    const payeeShares = [2, 1, 1, 2]
    leniaRoyalties = await Royalties.deploy(payeeAdresses, payeeShares)
  })

  describe("Deployment", function () {
    it("Should set the payees", async function () {
      const [owner] = await ethers.getSigners()
      const firstPayee = await leniaRoyalties.payee(0)
      expect(firstPayee).to.equal(owner.address)
      await timeout(3000)
    })
  })
})
