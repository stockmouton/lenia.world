const { ethers } = require("hardhat")

describe("Metadata", () => {
  describe("Deployment", () => {
    it("Should set the payees", async () => {
    const Metadata = await ethers.getContractFactory("LeniaMetadata")

    await Metadata.deploy()
    })
  })
})
