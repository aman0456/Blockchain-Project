var Network = artifacts.require("./Network.sol");

module.exports = function(deployer) {
  deployer.deploy(Network);
};