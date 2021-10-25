// SPDX-License-Identifier: MIT

// @title Metadata contract for the Lenia collection

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

import "@openzeppelin/contracts/access/Ownable.sol";

contract LeniaMetadata is Ownable {
    uint256 public constant MAX_SUPPLY = 202;
    bytes[MAX_SUPPLY] public metadata;


    function setLeniaParams(uint256 id, bytes memory metadataAddress) public onlyOwner {
        metadata[id] = metadataAddress;
    }

    function getLeniaParams(uint256 id) public view returns(bytes memory) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return metadata[id];
    }
}