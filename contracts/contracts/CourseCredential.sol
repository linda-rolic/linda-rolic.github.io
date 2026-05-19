// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CourseCredential
 * @dev Soulbound (non-transferable) NFT credential for data analytics course completion.
 *      Only the contract owner (platform) can issue credentials.
 *      Each wallet can only hold one credential per course.
 */
contract CourseCredential is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct Credential {
        address learner;
        string courseId;
        string courseName;
        uint256 issuedAt;
    }

    // tokenId => Credential
    mapping(uint256 => Credential) public credentials;

    // learner => courseId => tokenId (0 means not issued)
    mapping(address => mapping(string => uint256)) public learnerCourseToken;

    // courseId => list of tokenIds
    mapping(string => uint256[]) public courseTokens;

    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed learner,
        string courseId,
        string courseName,
        uint256 issuedAt
    );

    constructor() ERC721("DataAnalyticsCredential", "DAC") Ownable(msg.sender) {}

    /**
     * @dev Issue a soulbound credential to a learner.
     *      Only callable by the platform owner.
     */
    function issueCertificate(
        address learner,
        string calldata courseId,
        string calldata courseName,
        string calldata metadataURI
    ) external onlyOwner returns (uint256) {
        require(learner != address(0), "Invalid learner address");
        require(learnerCourseToken[learner][courseId] == 0, "Credential already issued for this course");

        _nextTokenId++;
        uint256 tokenId = _nextTokenId;

        _safeMint(learner, tokenId);
        _setTokenURI(tokenId, metadataURI);

        credentials[tokenId] = Credential({
            learner: learner,
            courseId: courseId,
            courseName: courseName,
            issuedAt: block.timestamp
        });

        learnerCourseToken[learner][courseId] = tokenId;
        courseTokens[courseId].push(tokenId);

        emit CredentialIssued(tokenId, learner, courseId, courseName, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Verify a credential by tokenId. Returns full credential details.
     */
    function verifyCertificate(uint256 tokenId)
        external
        view
        returns (
            address learner,
            string memory courseId,
            string memory courseName,
            uint256 issuedAt,
            string memory metadataURI
        )
    {
        require(_ownerOf(tokenId) != address(0), "Credential does not exist");
        Credential memory cred = credentials[tokenId];
        return (
            cred.learner,
            cred.courseId,
            cred.courseName,
            cred.issuedAt,
            tokenURI(tokenId)
        );
    }

    /**
     * @dev Check if a learner has a credential for a specific course.
     */
    function hasCredential(address learner, string calldata courseId) external view returns (bool) {
        return learnerCourseToken[learner][courseId] != 0;
    }

    /**
     * @dev Get all token IDs issued for a course.
     */
    function getCourseCredentials(string calldata courseId) external view returns (uint256[] memory) {
        return courseTokens[courseId];
    }

    // ─── Soulbound: block all transfers ───────────────────────────────────────

    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound: credentials are non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("Soulbound: credentials are non-transferable");
    }
}
