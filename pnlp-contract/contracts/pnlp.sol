pragma solidity >=0.4.25 <0.7.0;

contract pnlp {
    struct Publication {
        bytes32 ipnsHash;
        address publisher;
        uint256 timestamp;
    }

    struct Article {
        address publisher;
        uint256 timestamp;
    }

    mapping (string => Publication) public publications;
    mapping (bytes32 => Article) public articles;

    event CreatedPublication(string publicationName, bytes32 ipnsHash, address publisher, uint256 timestamp);
    event PublishedArticle(string publicationName, address publisher, uint256 timestamp);

    function createPublication(string memory publicationName, bytes32 ipnsHash) public {
        // Using ipns
        // No collisions allowed!
        // record callers address
        // v3 Require a stake
        require(publications[publicationName].publisher == address(0), "publicationName is already in use");
        emit CreatedPublication(publicationName, ipnsHash, msg.sender, block.timestamp);
        Publication memory publication = Publication(ipnsHash, msg.sender, block.timestamp);
        publications[publicationName] = publication;
    }

    function publishArticle(string memory publicationName, bytes32 ipfsHash) public {
        require(publications[publicationName].publisher == msg.sender, "articles can only be added to a publication by the publication creator");
        emit PublishedArticle(publicationName, msg.sender, block.timestamp);
        Article memory article = Article(msg.sender, block.timestamp);
        articles[ipfsHash] = article;
    }

    // - Get all of the publications? - Not now (check out The Graph)
    // - You know the publication, list all of the articles?
    // - Get ipns hash of pulbication from name of pulbication
    // - v3 Keep track of ipFs addresses of publications so that when ipns points to something else, history is kept.
}
