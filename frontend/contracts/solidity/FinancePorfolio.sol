// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
//just go through the code and see if there are flaws because i have used ai in the end to optimize the scan score rn 69 the score is
//also add off anymore params you want or get from the user
error PortfolioExists();
error PortfolioNotFound();
error InvalidTokenId();
error TokenNotFound();
error InvalidAmount();

contract FinancePortfolio is ERC721, Ownable2Step {
    uint256 private _nextCarbonNFTId = 1;
    uint256 private _nextLessonNFTId = 10000;
    
    struct Portfolio {
        string ipfsHash;//ye wala place will contain the hash of his portfolio  
        string personName;
        uint256 carbonCredits;
        uint256 lessonsCompleted;
        bool isRegistered;
    }
    
    // Mappings with named parameters (Solidity 0.8.18+)
    mapping(address owner => Portfolio info) public portfolios;
    mapping(uint256 tokenId => string uri) public carbonNFTURIs;
    mapping(uint256 tokenId => string uri) public lessonNFTURIs;
    
    // Events
    event PortfolioCreated(address indexed owner, string personName, string ipfsHash);
    event PortfolioUpdated(address indexed owner, string newIpfsHash);
    event CarbonCreditsAdded(address indexed owner, uint256 amount, uint256 newTotal);
    event LessonCompleted(address indexed owner, uint256 lessonId, uint256 totalCompleted);
    event NFTMinted(address indexed owner, uint256 tokenId, bool isCarbonNFT);
    event URISet(uint256 indexed tokenId, string uri, bool isCarbonNFT);
    
    constructor() payable ERC721("Finance Portfolio", "FP") Ownable(msg.sender) {}
    
    function createPortfolio(string calldata _ipfsHash, string calldata _personName) external {
        if (portfolios[msg.sender].isRegistered) revert PortfolioExists();
        
        // Individual assignments for gas optimization
        Portfolio storage newPortfolio = portfolios[msg.sender];
        newPortfolio.ipfsHash = _ipfsHash;
        newPortfolio.personName = _personName;
        newPortfolio.isRegistered = true;
        
        emit PortfolioCreated(msg.sender, _personName, _ipfsHash);
    }
    
    function updatePortfolioIPFS(string calldata _newIpfsHash) external {
        Portfolio storage portfolio = portfolios[msg.sender];
        if (!portfolio.isRegistered) revert PortfolioNotFound();
        
        // Check if new value is different
        if (keccak256(bytes(portfolio.ipfsHash)) != keccak256(bytes(_newIpfsHash))) {
            portfolio.ipfsHash = _newIpfsHash;
            emit PortfolioUpdated(msg.sender, _newIpfsHash);
        }
    }
    
    function addCarbonCredits(address _user, uint256 _amount) external payable onlyOwner {
        if (_amount == 0) revert InvalidAmount();
        Portfolio storage portfolio = portfolios[_user];
        if (!portfolio.isRegistered) revert PortfolioNotFound();
        
        portfolio.carbonCredits += _amount;
        uint256 nftCount = portfolio.carbonCredits / 100;
        
        if (nftCount > 0) {
            uint256 creditsUsed = nftCount * 100;
            portfolio.carbonCredits -= creditsUsed;
            
            for (uint256 i; i < nftCount;) {
                _mintCarbonNFT(_user);
                unchecked { ++i; }
            }
        }
        
        emit CarbonCreditsAdded(_user, _amount, portfolio.carbonCredits);
    }
    
    function completedLesson(address _user) external payable onlyOwner {
        Portfolio storage portfolio = portfolios[_user];
        if (!portfolio.isRegistered) revert PortfolioNotFound();
        
        unchecked { ++portfolio.lessonsCompleted; }
        _mintLessonNFT(_user);
        
        emit LessonCompleted(_user, portfolio.lessonsCompleted, portfolio.lessonsCompleted);
    }
    
    function _mintCarbonNFT(address _user) private {
        uint256 newTokenId = _nextCarbonNFTId;
        unchecked { ++_nextCarbonNFTId; }
        _safeMint(_user, newTokenId);
        emit NFTMinted(_user, newTokenId, true);
    }
    
    function _mintLessonNFT(address _user) private {
        uint256 newTokenId = _nextLessonNFTId;
        unchecked { ++_nextLessonNFTId; }
        _safeMint(_user, newTokenId);
        emit NFTMinted(_user, newTokenId, false);
    }
    
    function setCarbonNFTURI(uint256 _tokenId, string calldata _uri) external payable onlyOwner {
        if (_tokenId >= _nextCarbonNFTId) revert InvalidTokenId();
        carbonNFTURIs[_tokenId] = _uri;
        emit URISet(_tokenId, _uri, true);
    }
    
    function setLessonNFTURI(uint256 _tokenId, string calldata _uri) external payable onlyOwner {
        if (_tokenId < 10000 || _tokenId >= _nextLessonNFTId) revert InvalidTokenId();
        lessonNFTURIs[_tokenId] = _uri;
        emit URISet(_tokenId, _uri, false);
    }
    
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        address owner = _ownerOf(_tokenId);
        if (owner == address(0)) revert TokenNotFound();
        
        return _tokenId < 10000 ? carbonNFTURIs[_tokenId] : lessonNFTURIs[_tokenId];
    }
} 