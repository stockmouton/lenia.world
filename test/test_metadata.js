const { expect } = require("chai")
const { ethers } = require("hardhat")

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Metadata", () => {
  describe("Deployment", () => {
    it("Should set the payees", async () => {
    Metadata = await ethers.getContractFactory("LeniaMetadata")

    leniaMetadata = await Metadata.deploy()
    })
  })
})
