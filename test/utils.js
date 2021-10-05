const crypto = require('crypto');

exports.deployLeniaContract = async (ethers) => {
    [owner, ...otherAccounts] = await ethers.getSigners()

    LeniaDescriptor = await ethers.getContractFactory("LeniaDescriptor")
    const leniaDescriptorLibrary = await LeniaDescriptor.deploy()

    Lenia = await ethers.getContractFactory("Lenia", {
        libraries: {
            LeniaDescriptor: leniaDescriptorLibrary.address
        }
    })

    const otherAddresses = otherAccounts.map(account => account.address)
    // Simulate splitting Ether balance among a group of accounts
    const payeeAdresses = [
        owner.address, // StockMouton DAO
        otherAddresses[0], // Team Member 1
        otherAddresses[1], // Team Member 2
        otherAddresses[2], // Team Member 3
    ]
    const payeeShares = [450, 225, 225, 100]
    return Lenia.deploy(payeeAdresses, payeeShares)
}

exports.generatePrivateKey = () => {
    return `0x${crypto.randomBytes(32).toString('hex')}`
}

exports.traitTypeAttrsMap = [
    'colormap', 'family', 'ki', 'aura', 'weight', 'robustness', 'avoidance', 'velocity', 'spread'
]
exports.attrsMap = [
    ["blackwhite", "carmine-blue", "carmine-green", "cinnamon", "golden", "msdos", "rainbow", "rainbow_transparent", "salvia", "whiteblack"],
    ["genesis", "aquarium", "terrarium", "aerium", "ignis", "maelstrom", "amphibium", "pulsium", "etherium", "nexus", "oscillium", "kaleidium"],
    ["kiai", "kiroku", "kihaku", "hibiki"],
    ["etheric", "mental", "astral", "celestial", "spiritual"],
    ["fly", "feather", "welter", "cruiser", "heavy"],
    ["aluminium", "iron", "steel", "tungsten", "vibranium"],
    ["kawarimi", "shunshin", "raiton", "hiraishin", "kamui"],
    ["immovable", "unrushed", "swift", "turbo", "flash"],
    ["demie", "standard", "magnum", "jeroboam", "balthazar"],
]

exports.decodeContractMetdata = function decodeContractMetdata(encodedContractMetadata) {
    const contractMetadataJSON = encodedContractMetadata.replace('data:application/json,', '');
    return JSON.parse(contractMetadataJSON)
}