const pnlp = artifacts.require("pnlp");

contract("pnlp", (accounts) => {
  it("should call a function that depends on a linked library", () => {
    let instance;
    let counterBefore;
    let article;
    let articleId;
    let counterAfter;

    return pnlp
      .deployed()
      .then((_instance) => {
        instance = _instance;
        return instance.counter.call();
      })
      .then((_counterBefore) => {
        counterBefore = _counterBefore;
        return instance.publish.call(["hash1", "hash2"]);
      })
      .then((_articleId) => {
        articleId = _articleId;
        return instance.counter.call();
      })
      .then((_counterAfter) => {
        counterAfter = _counterAfter;
        // counterBefore here is used as it is the id of the published contract.
        return instance.publish.call(counterBefore);
      })
      .then(() => {
        assert.equal(
          counterBefore,
          0,
          "The counter was not originally set to 0"
        );
        assert.equal(articleId, 0, "The id of the article is not 0");
        assert.equal(counterAfter, 1, "The counter was not updated to 1");
        // Add a test for article
      });
  });
});
