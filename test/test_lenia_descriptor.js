const { expect } = require("chai");
const { ethers } = require("hardhat");

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap, deployLeniaContract } = require('./utils')

describe("LeniaDescriptor", () => {
    let lenia;

    beforeEach(async () => {
        lenia = await deployLeniaContract(ethers)
    })

    describe("constructTokenURI", () => {
        if (!process.env.REPORT_GAS) {
            it("empty attributes array - should return a valid JSON engine", async () => {
                const index = 0;
                
                // Fake lenia params
                const m = 0.123456789
                const s = 1.123456789
                const cells = Buffer.from("x");

                const stringID = index.toString()
                const name = `Lenia #${  stringID}`;
                const imageURL = "image.png";
                const animationURL = "video.mp4";
                const smLeniaAttributes = []

                await lenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await lenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )
                const encodedContractMetadata = await lenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.name).to.equal(name)
                expect(contractMetadata.config.kernels_params[0].m).to.equal(m)
                expect(contractMetadata.config.kernels_params[0].s).to.equal(s)
                expect(contractMetadata.attributes.length).to.equal(1)
            })

            it("one attributes array - should return a valid JSON the engine", async () => {
                const index = 5;

                // Fake lenia params
                const m = 0.123456789
                const s = 1.123456789
                const cells = Buffer.from("x");

                const stringID = index.toString()

                const imageURL = "image.png";
                const animationURL = "video.mp4";
                const attrTraitType0 = 'Colormap'
                const attrValue0 = 'Black White'

                const smLeniaAttributes = [{
                    'value': attrsMap[traitTypeAttrsMap.indexOf(attrTraitType0)].indexOf(attrValue0),
                    'numericalValue': '0.000',
                    'traitType': traitTypeAttrsMap.indexOf(attrTraitType0),
                }]
                
                await lenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await lenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )

                const encodedContractMetadata = await lenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.attributes[0].value).to.equal(attrValue0)
                expect(contractMetadata.attributes[0].trait_type).to.equal(attrTraitType0)
                expect(contractMetadata.attributes[0].numerical_value).to.equal(0.)
            })
        }
        it("test all attributes - should return a valid JSON the engine", async () => {
            const index = 5;

            // Fake lenia params
            const m = 0.123456789
            const s = 1.123456789
            const cells = Buffer.from("x");

            const stringID = index.toString()
            const imageURL = "image.png";
            const animationURL = "video.mp4";
            for (let i = 0; i < traitTypeAttrsMap.length; i+=1) {
                const smLeniaAttributes = []
                for (let j = 0; j < attrsMap[i].length; j+=1) {
                    smLeniaAttributes.push({
                        'traitType': i,
                        'value': j,
                        'numericalValue': '0.000',
                    })
                }
            
                await lenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await lenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )

                const encodedContractMetadata = await lenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)
                    
                for (let j = 0; j < attrsMap[i].length; j+=1) {
                    expect(contractMetadata.attributes[j].trait_type).to.equal(traitTypeAttrsMap[i])
                    expect(contractMetadata.attributes[j].value).to.equal(attrsMap[i][j])
                    expect(contractMetadata.attributes[j].numerical_value).to.equal(0.)
                }
            }
        })
    })
});
