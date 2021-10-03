const traitTypeAttrsMap = [
 'colormap', 'family', 'ki', 'aura', 'weight', 'robustness', 'avoidance', 'velocity', 'spread'
]
const attrsMap = [
    [ "blackwhite", "carmine-blue", "carmine-green", "cinnamon", "golden", "msdos", "rainbow", "rainbow_transparent", "salvia", "whiteblack" ],
    [ "genesis", "aquarium", "terrarium", "aerium", "ignis", "maelstrom", "amphibium", "pulsium", "etherium", "nexus", "oscillium", "kaleidium" ],
    [ "kiai", "kiroku", "kihaku", "hibiki" ],
    [ "etheric", "mental", "astral", "celestial", "spiritual" ],
    [ "fly", "feather", "welter", "cruiser", "heavy" ],
    [ "aluminium", "iron", "steel", "tungsten", "vibranium" ],
    [ "kawarimi", "shunshin", "raiton", "hiraishin", "kamui" ],
    [ "immovable", "unrushed", "swift", "turbo", "flash" ],
    [ "demie", "standard", "magnum", "joeroboam", "balthazar" ],
]

function decodeContractMetdata(encodedContractMetadata) {
    const contractMetadataJSON = encodedContractMetadata.replace('data:application/json,', '');
    // console.log(contractMetadataJSON)
    return JSON.parse(contractMetadataJSON)
}

exports.decodeContractMetdata = decodeContractMetdata
exports.attrsMap = attrsMap
exports.traitTypeAttrsMap = traitTypeAttrsMap