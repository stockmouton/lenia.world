const { expect } = require("chai")
const { ethers } = require("hardhat")

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Metadata", function () {
  describe("Deployment", function () {
    it("Should set the payees", async function () {
    Metadata = await ethers.getContractFactory("LeniaMetadata")

    leniaMetadata = await Metadata.deploy()
    })
  })
})
