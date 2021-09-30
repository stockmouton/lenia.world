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
    string public constant EXTERNAL_LINK = "https://lenia.world";

    struct LeniaAttribute {
        string value;
        string numericalValue;
        string traitType;
    }

    struct LeniaURIParams {
        string name;
        string imageURL;
        string description;
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
        // prettier-ignore
        return string(
            abi.encodePacked(
                "data:application/json,",
                bytes(
                    abi.encodePacked(
                        '{'
                            '"name":"', params.name, '",',
                            '"description":"', params.description, '",',
                            '"external_link":"', EXTERNAL_LINK, '",',
                            '"image":"', params.imageURL, '",',
                            '"attributes":', getAttributesJSON(params), ',',
                            '"config": ', getConfigJSON(params),
                        '}'
                    )
                )
            )
        );
    }

    /**
     * @notice Get the Lenia attributes
     */
    function getAttributesJSON(LeniaURIParams memory params)
        public
        pure
        returns (string memory json)
    {
        string memory output;
        for (uint256 index = 0; index < params.leniaAttributes.length; index++) {
            if (bytes(output).length == 0) {
                output = string(abi.encodePacked(
                    "[", getAttributeJSON(params.leniaAttributes[index])
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
        return string(abi.encodePacked(
            '{',
                '"value":"', attr.value, '",',
                '"trait_type":"', attr.traitType, '",',
                '"numerical_value": "', attr.numericalValue, '"',
            '}'
        ));
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
            '{',
                '"kernels_params":', getKernelParamsJSON(params), ',',
                '"world_params":', getWorldParamsJSON(),
            '}'
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
            '[',
                '{"b": "1", "c_in": 0, "c_out": 0, "gf_id": 0, "h": 1, "k_id": 0,',
                '"m": ', params.m, ',',
                '"q": 4, "r": 1,',
                '"s": ', params.s, '}',
            ']'
        ));
    }
}
