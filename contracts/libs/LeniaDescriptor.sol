// SPDX-License-Identifier: MIT

// @title The library to get the Lenia metadata

/**********************************************
 *                        .                   *
 *                          ,,                *
 *                      ......*#*             *
 *                 .......    ..*%%,          *
 *          .,,****,..             ,#(.       *
 *         .,**((((*,.               .*(.     *
 *          .**((**,,,,,,,             .*,    *
 *        .......,,**(((((((*.          .,,   *
 *       ...      ,*((##%&&&&@&(,        .,.  *
 *       ..        ,((#&&@@@@@@@@&(*.  ..,,.  *
 *    ,. ..          ,#&@@@@@@@@@@@%#(*,,,,.  *
 *      ((,.           *%@@@@&%%%&&%#(((*,,.  *
 *        (&*            *%@@@&&%%##(((**,.   *
 *          (&(           .*(#%%##(((**,,.    *
 *            .((,         .,*(((((**,..      *
 *               .,*,,.....,,,,*,,,..         *
 *                    ..........              *
**********************************************/

pragma solidity ^0.8.6;

library LeniaDescriptor {
    string public constant NAME_PREFIX = "Lenia #";
    string public constant DESCRIPTION = "A beautiful lifeform creature known as Lenia.";
    string public constant EXTERNAL_LINK = "https://lenia.world";

    struct LeniaAttribute {
        uint16 traitType;
        uint16 value;
        string numericalValue;
    }

    struct LeniaURIParams {
        string paddedId;
        string imageURL;
        string m;
        string s;
        LeniaAttribute[] leniaAttributes;
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(LeniaURIParams memory params)
        public
        pure
        returns (string memory)
    {
        bytes memory nameField = abi.encodePacked(
            '"name":"', NAME_PREFIX, params.paddedId, '"'
        );
        bytes memory descField = abi.encodePacked(
            '"description":"', DESCRIPTION, '"'
        );
        bytes memory extLinkField = abi.encodePacked(
            '"external_link":"', EXTERNAL_LINK, '"'
        );
        bytes memory imgField = abi.encodePacked(
            '"image":"', params.imageURL, '"'
        );
        bytes memory attrField = abi.encodePacked(
            '"attributes":', getAttributesJSON(params)
        );
        bytes memory configField = abi.encodePacked(
            '"config": ', getConfigJSON(params)
        );

        // prettier-ignore
        return string(
            abi.encodePacked(
                "data:application/json,",
                abi.encodePacked(
                    "{",
                        nameField, ",",
                        descField, ",",
                        extLinkField, ",",
                        imgField, ",",
                        attrField, ",",
                        configField,
                    "}"
                )
            )
        );
    }

    /**
     * @notice Get the Lenia attributes
     */
    function getAttributesJSON(LeniaURIParams memory params)
        private
        pure
        returns (string memory json)
    {
        string memory output = "[";
        for (uint256 index = 0; index < params.leniaAttributes.length; index++) {
            if (bytes(output).length == 1) {
                output = string(abi.encodePacked(
                    output,
                    getAttributeJSON(params.leniaAttributes[index])
                ));
            } else {
                output = string(abi.encodePacked(
                    output, ",",
                    getAttributeJSON(params.leniaAttributes[index])
                ));
            }

        }
        output = string(abi.encodePacked(output, "]"));

        return output;
    }

    /**
     * @notice Get one Lenia attribute
     */
    function getAttributeJSON(LeniaAttribute memory attr)
        private
        pure
        returns (string memory json)
    {
        string memory currentTraitType = getTraitType(attr.traitType);
        bytes32 currentTraitTypeHash = keccak256(bytes(currentTraitType));
        string memory currentValue;
        if (currentTraitTypeHash == keccak256(bytes("colormap"))) {
            currentValue = getColormap(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("family"))) {
            currentValue = getFamily(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("ki"))) {
            currentValue = getKi(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("aura"))) {
            currentValue = getAura(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("weight"))) {
            currentValue = getWeight(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("robustness"))) {
            currentValue = getRobustness(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("avoidance"))) {
            currentValue = getAvoidance(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("velocity"))) {
            currentValue = getVelocity(attr.value);
        } else if (currentTraitTypeHash == keccak256(bytes("spread"))) {
            currentValue = getSpread(attr.value);
        }
        return string(abi.encodePacked(
            "{",
                '"value":"', currentValue, '",',
                '"trait_type":"', currentTraitType, '",',
                '"numerical_value":', attr.numericalValue,
            "}"
        ));
    }

    /**
     * @notice Get the trait type
     */
    function getTraitType(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[9] memory traitTypes = [
            "colormap", "family", "ki", "aura", "weight", "robustness", "avoidance", "velocity", "spread"
        ];

        return traitTypes[index];
    }

    /**
     * @notice Get the trait type
     */
     function getColormap(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[10] memory colormaps = [
            "blackwhite", "carmine_blue", "carmine_green", "cinnamon", "golden", "msdos", "rainbow", "rainbow_transparent", "salvia", "whiteblack"
        ];

        return colormaps[index];
    }

    /**
     * @notice Get the family
     */
    function getFamily(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[12] memory familys = [
            "genesis", "aquarium", "terrarium", "aerium", "ignis", "maelstrom", "amphibium", "pulsium", "etherium", "nexus", "oscillium", "kaleidium"
        ];

        return familys[index];
    }

    /**
     * @notice Get the ki
     */
    function getKi(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[4] memory kis = [
            "kiai", "kiroku", "kihaku", "hibiki"
        ];

        return kis[index];
    }

    /**
     * @notice Get the aura
     */
    function getAura(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory auras = [
            "etheric", "mental", "astral", "celestial", "spiritual"
        ];

        return auras[index];
    }

    /**
     * @notice Get the weight
     */
    function getWeight(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory weights = [
            "fly", "feather", "welter", "cruiser", "heavy"
        ];

        return weights[index];
    }

    /**
     * @notice Get the robustness
     */
    function getRobustness(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory robustnesss = [
            "aluminium", "iron", "steel", "tungsten", "vibranium"
        ];

        return robustnesss[index];
    }

    /**
     * @notice Get the avoidance
     */
    function getAvoidance(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory avoidances = [
            "kawarimi", "shunshin", "raiton", "hiraishin", "kamui"
        ];

        return avoidances[index];
    }

    /**
     * @notice Get the velocity
     */
    function getVelocity(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory velocitys = [
            "immovable", "unrushed", "swift", "turbo", "flash"
        ];

        return velocitys[index];
    }

    /**
     * @notice Get the spread
     */
    function getSpread(uint16 index)
        private
        pure
        returns (string memory)
    {
        string[5] memory spreads = [
            "demie", "standard", "magnum", "joeroboam", "balthazar"
        ];

        return spreads[index];
    }

    /**
     * @notice Get the Lenia configuration
     */
    function getConfigJSON(LeniaURIParams memory params)
        private
        pure
        returns (string memory json)
    {
        return string(abi.encodePacked(
            "{",
                '"kernels_params":', getKernelParamsJSON(params), ',',
                '"world_params":', getWorldParamsJSON(),
            "}"
        ));
    }

    /**
     * @notice Get the Lenia world_params
     */
    function getWorldParamsJSON()
        private
        pure
        returns (string memory json)
    {
        return '{"R": 13, "T": 10, "nb_channels": 1, "nb_dims": 2, "scale": 1}';
    }

    /**
     * @notice Get the Lenia kernels_params
     */
    function getKernelParamsJSON(LeniaURIParams memory params)
        private
        pure
        returns (string memory json)
    {
        return string(abi.encodePacked(
            "[",
                '{"b": "1", "c_in": 0, "c_out": 0, "gf_id": 0, "h": 1, "k_id": 0,',
                '"m": ', params.m, ',',
                '"q": 4, "r": 1,',
                '"s": ', params.s, '}',
            "]"
        ));
    }
}
