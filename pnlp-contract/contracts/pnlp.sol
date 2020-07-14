pragma solidity >=0.4.25 <0.7.0;

contract pnlp {
    struct Article {
        uint256 id;
        bytes32[] hashes;
        address publisher;
        uint256 timestamp;
    } 
    
    uint256 public counter;
    Article[] articles;

    event Published(uint256 id, bytes32[] hashes, address publisher, uint256 timestamp);

    constructor() public {
        counter = 0;
    }

    function publish(bytes32[] memory hashes) public returns (uint256) {
        uint256 id = counter;
        articles[id] = Article(id, hashes, msg.sender, block.timestamp);
        emit Published(id, hashes, msg.sender, block.timestamp);
        counter++;
        return id;
    }

    function getArticle(uint256 id) public view returns (uint256, bytes32[] memory, address, uint256) {
        require(id < counter);
        return (articles[id].id, articles[id].hashes, articles[id].publisher, articles[id].timestamp);
    }
}
