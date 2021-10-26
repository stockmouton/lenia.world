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

    bytes[MAX_SUPPLY] public leniaParameters;
    
    function setLeniaParams(uint256 id, bytes memory metadataAddress) public onlyOwner {
        require(id < MAX_SUPPLY, "id out of bounds");

        leniaParameters[id] = metadataAddress;
    }
}