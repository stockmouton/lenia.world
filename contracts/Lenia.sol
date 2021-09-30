// SPDX-License-Identifier: MIT

// @title Main contract for the Lenia collection

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

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import { LeniaDescriptor } from "./libs/LeniaDescriptor.sol";

contract Lenia is ERC721, ERC721Enumerable, Ownable {

    uint256 public constant MAX_SUPPLY = 202;
    uint256 private _price = 0.1 ether;
    uint256 private _reserved = 11;

    uint256 public startingIndex;

    bool private _hasSaleStarted;
    string public baseURI;

    bytes private gzipCells;
    string private engine;
    LeniaDescriptor.LeniaURIParams[MAX_SUPPLY] private metadata;

    constructor() ERC721("Lenia", "LENIA") {
        _hasSaleStarted = false;
    }

    modifier whenSaleStarted() {
        require(_hasSaleStarted, "Primary sale hasn't started yet");
        _;
    }

    function mint() external payable whenSaleStarted {
        uint256 supply = totalSupply();
        require(supply <= MAX_SUPPLY - _reserved, "Tokens are sold out!");
        require( _price <= msg.value, "Inconsistent amount sent!");

        _safeMint(msg.sender, supply);
    }

    function getMetadata(uint256 id) public view onlyOwner returns(string memory) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return LeniaDescriptor.constructTokenURI(metadata[id]);
    }

    function setCells(bytes memory gzipCellsInput) public onlyOwner {
        gzipCells = gzipCellsInput;
    }

    function getCells() public view returns(bytes memory) {
        return gzipCells;
    }

    function setMetadata(
        uint256 id,
        string memory name,
        string memory imageURL,
        string memory description,
        string memory m,
        string memory s,
        LeniaDescriptor.LeniaAttribute[] memory attributes
    )
        public
        onlyOwner
    {
        LeniaDescriptor.LeniaURIParams storage params = metadata[id];
        params.name = name;
        params.imageURL = imageURL;
        params.description = description;
        params.m = m;
        params.s = s;
        for (uint256 i = 0; i < attributes.length; i++) {
            params.leniaAttributes.push();
            LeniaDescriptor.LeniaAttribute storage storageAttr = params.leniaAttributes[i];

            LeniaDescriptor.LeniaAttribute memory currentAttr = attributes[i];
            storageAttr.value = currentAttr.value;
            storageAttr.numericalValue = currentAttr.numericalValue;
            storageAttr.traitType = currentAttr.traitType;
        }
    }

    function setEngine(string calldata engineInput) public onlyOwner {
        engine = engineInput;
    }

    function getEngine() public view returns(string memory) {
        return engine;
    }


    function flipHasSaleStarted() external onlyOwner {
        _hasSaleStarted = !_hasSaleStarted;
    }

    function hasSaleStarted() public view returns(bool) {
        return _hasSaleStarted;
    }

    function setBaseURI(string memory uri) external onlyOwner {
        baseURI = uri;
    }

    function _baseURI() internal view override(ERC721) returns(string memory) {
        return baseURI;
    }

    // Make it possible to change the price for the dutch auction
    function setPrice(uint256 _newPrice) external onlyOwner {
        _price = _newPrice;
    }

    function getPrice() public view returns (uint256){
        return _price;
    }

    function getReservedLeft() public view returns (uint256) {
        return _reserved;
    }

    function tokensOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function claimReserved(uint256 _number, address _receiver) external onlyOwner {
        require(_number <= _reserved, "That would exceed the max reserved.");

        uint256 _tokenId = totalSupply();
        for (uint256 i; i < _number; i++) {
            _safeMint(_receiver, _tokenId + i);
        }

        _reserved = _reserved - _number;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}