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
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

import { LeniaDescriptor } from "./libs/LeniaDescriptor.sol";

contract Lenia is ERC721, ERC721Enumerable, PaymentSplitter, Ownable {

    uint256 public constant MAX_SUPPLY = 202;
    uint256 private _price = 0.1 ether;
    uint256 private _reserved = 11;

    mapping(address => bool) private _presaleList;
    bool private _isPresaleActive = false;
    bool private _isSaleActive = false;
    
    bool private _switchToOnChain = false;
    string private __baseURI;

    string private engine;
    bytes[MAX_SUPPLY] private cells;
    LeniaDescriptor.LeniaParams[MAX_SUPPLY] private leniaParams;
    LeniaDescriptor.LeniaMetadata[MAX_SUPPLY] private metadata;

    constructor(address[] memory payees, uint256[] memory shares_) ERC721("Lenia", "LENIA") PaymentSplitter(payees, shares_) {
    }

    function setEngine(string calldata engineInput) public onlyOwner {
        engine = engineInput;
    }

    function getEngine() public view returns(string memory) {
        return engine;
    }

    function setCells(uint256 id, bytes memory cellsInput) public onlyOwner {
        cells[id] = cellsInput;
    }

    function getCells(uint256 id) public view returns(bytes memory) {
        return cells[id];
    }

    function setLeniaParams(
        uint256 id,
        string memory m,
        string memory s
    )
        public
        onlyOwner
    {
        LeniaDescriptor.LeniaParams storage params = leniaParams[id];
        params.m = m;
        params.s = s;
    }

    function getLeniaParams(uint256 id) public view onlyOwner returns(LeniaDescriptor.LeniaParams memory) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return leniaParams[id];
    }

    function setMetadata(
        uint256 id,
        string memory paddedID,
        string memory imageURL,
        LeniaDescriptor.LeniaAttribute[] memory attributes
    )
        public
        onlyOwner
    {
        LeniaDescriptor.LeniaMetadata storage params = metadata[id];
        params.paddedID = paddedID;
        params.imageURL = imageURL;
        uint256 attrLengths = params.leniaAttributes.length;
        for (uint256 i = 0; i < attributes.length; i++) {
            if (i >= attrLengths) {
                params.leniaAttributes.push();
            }
            LeniaDescriptor.LeniaAttribute storage storageAttr = params.leniaAttributes[i];

            LeniaDescriptor.LeniaAttribute memory currentAttr = attributes[i];
            storageAttr.value = currentAttr.value;
            storageAttr.numericalValue = currentAttr.numericalValue;
            storageAttr.traitType = currentAttr.traitType;
        }
    }

    function getMetadata(uint256 id) public view onlyOwner returns(LeniaDescriptor.LeniaMetadata memory) {
        require(id < MAX_SUPPLY, "id out of bounds");

        return metadata[id];
    }
    
    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        if (_switchToOnChain) {
            return LeniaDescriptor.constructTokenURI(metadata[tokenId], leniaParams[tokenId]);
        } else {
            string memory tokenURIstr = super.tokenURI(tokenId);

            return bytes(tokenURIstr).length > 0 ? string(abi.encodePacked(tokenURIstr, ".json")) : "";
        }
    }

    function isPresaleActive() public view returns(bool) {
        return _isPresaleActive;
    }

    function togglePresaleStatus() external onlyOwner {
        _isPresaleActive = !_isPresaleActive;
    }

    function addPresaleList(
        address[] calldata addresses
    ) external onlyOwner {
        for (uint8 i = 0; i < addresses.length; i++) {
            _presaleList[addresses[i]] = true;
        }
    }

    function presaleMint() external payable {
        require(_isPresaleActive, "Presale is not active");

        bool isSenderEligible = _presaleList[msg.sender];

        require(isSenderEligible == true, "Not eligible for the presale");
        uint256 supply = totalSupply();
        require(supply <= MAX_SUPPLY - _reserved, "Tokens are sold out");
        require(_price <= msg.value, "Insufficient funds");

        _safeMint(msg.sender, supply);
        _presaleList[msg.sender] = false;
    }

    function isSaleActive() public view returns(bool) {
        return _isSaleActive;
    }

    function toggleSaleStatus() external onlyOwner {
        _isSaleActive = !_isSaleActive;
    }

    function mint() external payable {
        require(_isSaleActive, "Public sale is not active");
        uint256 supply = totalSupply();
        require(supply < MAX_SUPPLY - _reserved, "Tokens are sold out");
        require( _price <= msg.value, "Insufficient funds");

        _safeMint(msg.sender, supply);
    }

    function setBaseURI(string memory uri) external onlyOwner {
        __baseURI = uri;
    }

    function _baseURI() internal view override(ERC721) returns(string memory) {
        return __baseURI;
    }

    function getPrice() public view returns (uint256) {
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
        require(_number <= _reserved, "Exceeds the max reserved");

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

    function release(address payable account) public virtual override(PaymentSplitter) {
        super.release(account);
    }
}