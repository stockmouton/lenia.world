// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lenia is ERC721, ERC721Enumerable, Ownable {

    uint256 public constant MAX_SUPPLY = 1337;
    uint256 private _price = 0.08 ether;
    uint256 private _reserved = 26;

    uint256 public startingIndex;

    bool private _hasSaleStarted;
    string public baseURI;

    address private t1 = 0xc9b6321dc216D91E626E9BAA61b06B0E4d55bdb1;
    address private t2 = 0xBD152AcFA5f810Cba903c2eFe7074Be88E335f50;

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

    function flipSaleStarted() external onlyOwner {
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