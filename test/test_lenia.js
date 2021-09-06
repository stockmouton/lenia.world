const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lenia", function () {
  it("Should flip the sale flag", async function () {
    const Lenia = await ethers.getContractFactory("Lenia");
    const lenia = await Lenia.deploy();
    await lenia.deployed();

    // read the contract (no need for a transaction)
    let hasSaleStarted = await lenia.hasSaleStarted()
    expect(hasSaleStarted).to.equal(false);

    // Write the contract
    const flipSaleTx = await lenia.flipSaleStarted();
    // wait until the transaction is mined
    await flipSaleTx.wait();

    hasSaleStarted = await lenia.hasSaleStarted()
    expect(hasSaleStarted).to.equal(true);
  });
});
