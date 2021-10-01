const { expect } = require("chai");
const { ethers } = require("hardhat");

const { decodeContractMetdata, attrsMap, traitTypeAttrsMap } = require('./utils')

describe("LeniaDescriptor", function () {
    let Lenia;
    let hardhatLenia;
    let owner;
    let addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        LeniaDescriptor = await ethers.getContractFactory("LeniaDescriptor");
        const leniaDescriptorLibrary = await LeniaDescriptor.deploy();

        Lenia = await ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: leniaDescriptorLibrary.address
        }
        });

        hardhatLenia = await Lenia.deploy();
    });

    describe("constructTokenURI", function () {
        if (!process.env.REPORT_GAS) {
            it("empty attributes array - should return a valid JSON the engine", async function () {
                const index = 0;
                const paddedID = index.toString().padStart(3, '0')

                let name = "Lenia #" + paddedID;
                let imageURL = "image.png";
                let m = 0.123456789
                let s = 1.123456789
                let smLeniaAttributes = []

                const setMetadataTx = await hardhatLenia.setMetadata(
                    index, 
                    paddedID,
                    imageURL,
                    m.toFixed(9),
                    s.toFixed(9),
                    smLeniaAttributes
                )
                const receipt = await setMetadataTx.wait()

                const encodedContractMetadata = await hardhatLenia.getMetadata(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.name).to.equal(name)
            })

            it("one attributes array - should return a valid JSON the engine", async function () {
                const index = 0;
                const paddedID = index.toString().padStart(3, '0')

                let name = "Lenia #" + paddedID;
                let imageURL = "image.png";
                let m = 0.123456789
                let s = 1.123456789
                const attrTraitType0 = 'colormap'
                const attrValue0 = 'blackwhite'
                let smLeniaAttributes = [{
                    'value': attrsMap[traitTypeAttrsMap.indexOf(attrTraitType0)].indexOf(attrValue0),
                    'numericalValue': '0.000',
                    'traitType': traitTypeAttrsMap.indexOf(attrTraitType0),
                }]
                const setMetadataTx = await hardhatLenia.setMetadata(
                    index, 
                    paddedID,
                    imageURL,
                    m.toFixed(9),
                    s.toFixed(9),
                    smLeniaAttributes
                )
                const receipt = await setMetadataTx.wait()

                const encodedContractMetadata = await hardhatLenia.getMetadata(index)
                const contractMetadata = decodeContractMetdata(encodedContractMetadata)

                expect(contractMetadata.attributes[0].value).to.equal(attrValue0)
                expect(contractMetadata.attributes[0].trait_type).to.equal(attrTraitType0)
                expect(contractMetadata.attributes[0].numerical_value).to.equal(0.)
            })
        }
        it("test all attributes - should return a valid JSON the engine", async function () {
            const index = 0;
            const paddedID = index.toString().padStart(3, '0')

            let name = "Lenia #" + paddedID;
            let imageURL = "image.png";
            let m = 0.123456789
            let s = 1.123456789
            for (let i = 0; i < traitTypeAttrsMap.length; i++) {
                let smLeniaAttributes = []
                for (let j = 0; j < attrsMap[i].length; j++) {
                    smLeniaAttributes.push({
                        'traitType': i,
                        'value': j,
                        'numericalValue': '0.000',
                    })
                }
            
                const setMetadataTx = await hardhatLenia.setMetadata(
                    index, 
                    paddedID,
                    imageURL,
                    m.toFixed(9),
                    s.toFixed(9),
                    smLeniaAttributes
                )
                const receipt = await setMetadataTx.wait()

                const encodedContractMetadata = await hardhatLenia.getMetadata(index)
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
