pragma solidity ^0.4.18;


import 'zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC20/ERC20.sol';


/**
 * @title CrowdsaleRDC0
 * @dev Crowdsale-0
 */
contract CrowdsaleRDC0 is TimedCrowdsale, Ownable {
    
    function CrowdsaleRDC0(ERC20 _token, uint256 _startTime, uint256 _finishTime,  uint _rate, address _wallet ) TimedCrowdsale(_startTime, _finishTime)  Crowdsale( _rate, _wallet, _token ) public payable {
    }
        
		
	function _forwardFunds() internal {     
        wallet.transfer(msg.value);
    }
    
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen {
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }
    
    function _processPurchase(address _beneficiary, uint256 _tokenAmount) internal {
        token.transfer(_beneficiary, _tokenAmount);
    }	
	
	function changeWallet( address _wallet ) onlyOwner public {
		require( _wallet != address(0));
		wallet = _wallet;
	}
}