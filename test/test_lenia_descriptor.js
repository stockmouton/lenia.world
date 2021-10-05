const { expect } = require("chai");
const { ethers } = require("hardhat");

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap, deployLeniaContract } = require('./utils')

describe("LeniaDescriptor", function () {
    let hardhatLenia;

    beforeEach(async function () {
        hardhatLenia = await deployLeniaContract(ethers)
    })

    describe("constructTokenURI", function () {
        if (!process.env.REPORT_GAS) {
            it("empty attributes array - should return a valid JSON engine", async function () {
                const index = 0;
                
                // Fake lenia params
                let m = 0.123456789
                let s = 1.123456789
                let cells = Buffer.from("x");

                const stringID = index.toString()
                let name = "Lenia #" + stringID;
                let imageURL = "image.png";
                let animationURL = "video.mp4";
                let smLeniaAttributes = []

                await hardhatLenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await hardhatLenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )
                const encodedContractMetadata = await hardhatLenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.name).to.equal(name)
                expect(contractMetadata.config.kernels_params[0].m).to.equal(m)
                expect(contractMetadata.config.kernels_params[0].s).to.equal(s)
                expect(contractMetadata.attributes.length).to.equal(1)
            })

            it("one attributes array - should return a valid JSON the engine", async function () {
                const index = 5;

                // Fake lenia params
                let m = 0.123456789
                let s = 1.123456789
                let cells = Buffer.from("x");

                const stringID = index.toString()

                let imageURL = "image.png";
                let animationURL = "video.mp4";
                const attrTraitType0 = 'Colormap'
                const attrValue0 = 'Black White'
                let smLeniaAttributes = [{
                    'value': attrsMap[traitTypeAttrsMap.indexOf(attrTraitType0)].indexOf(attrValue0),
                    'numericalValue': '0.000',
                    'traitType': traitTypeAttrsMap.indexOf(attrTraitType0),
                }]
                
                await hardhatLenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await hardhatLenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )

                const encodedContractMetadata = await hardhatLenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.attributes[0].value).to.equal(attrValue0)
                expect(contractMetadata.attributes[0].trait_type).to.equal(attrTraitType0)
                expect(contractMetadata.attributes[0].numerical_value).to.equal(0.)
            })
        }
        it("test all attributes - should return a valid JSON the engine", async function () {
            const index = 5;

            // Fake lenia params
            let m = 0.123456789
            let s = 1.123456789
            let cells = Buffer.from("x");

            const stringID = index.toString()
            let imageURL = "image.png";
            let animationURL = "video.mp4";
            for (let i = 0; i < traitTypeAttrsMap.length; i++) {
                let smLeniaAttributes = []
                for (let j = 0; j < attrsMap[i].length; j++) {
                    smLeniaAttributes.push({
                        'traitType': i,
                        'value': j,
                        'numericalValue': '0.000',
                    })
                }
            
                await hardhatLenia.setLeniaParams(
                    index,
                    m.toFixed(9),
                    s.toFixed(9),
                    cells
                )

                await hardhatLenia.setMetadata(
                    index, 
                    stringID,
                    imageURL,
                    animationURL,
                    smLeniaAttributes
                )

                const encodedContractMetadata = await hardhatLenia.tokenURI(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)
                    
                currentAttrIndex = 0
                for (let j = 0; j < attrsMap[i].length; j++) {
                    expect(contractMetadata.attributes[currentAttrIndex].trait_type).to.equal(traitTypeAttrsMap[i])
                    expect(contractMetadata.attributes[currentAttrIndex].value).to.equal(attrsMap[i][j])
                    expect(contractMetadata.attributes[currentAttrIndex].numerical_value).to.equal(0.)

                    currentAttrIndex++
                }
            }
        })
    })
});
