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
    
    bytes private engine;
    bytes[MAX_SUPPLY] private metadata;

    function logEngine(bytes calldata callEngine) external onlyOwner {}

    function setEngine(bytes calldata callEngine) public onlyOwner {
        engine = callEngine;
    }

    function getEngine() public view returns(bytes memory) {
        return engine;
    }

    function logMetadata(bytes calldata callMetadata) external onlyOwner {}

    function setMetadata(uint256 id, bytes calldata metadataAddress) public onlyOwner {
        require(id < MAX_SUPPLY, "id out of bounds");

        metadata[id] = metadataAddress;
    }

    function getMetadata(uint256 id) public view  returns(bytes memory) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return metadata[id];
    }
}