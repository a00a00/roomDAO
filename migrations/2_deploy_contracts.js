var TokenRDC = artifacts.require("./TokenRDC.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenRDC,"0x01","0x02","0x03");
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
