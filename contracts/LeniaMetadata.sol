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
    address[MAX_SUPPLY] public metadata;


    function setLeniaParams(uint256 id, address metadataAddress) public onlyOwner {
        metadata[id] = metadataAddress;
    }

    function getLeniaParams(uint256 id) public view returns(address) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return metadata[id];
    }
}