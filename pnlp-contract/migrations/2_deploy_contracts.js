const pnlp = artifacts.require("pnlp");

module.exports = function (deployer) {
  deployer.deploy(pnlp);
};
