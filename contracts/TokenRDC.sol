pragma solidity ^0.4.18;


import 'zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol';
import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


/**
 * @title TokenRDC
 *  
 */
 contract TokenRDC is BurnableToken, StandardToken, Ownable  { 
    
  string public constant name = "ROOMCOIN";
   
  string public constant symbol = "RDC";
    
  uint32 public constant decimals = 18;

  uint256 public INITIAL_SUPPLY = 60000000 * (10 ** uint256(decimals));
  
  address public currentCrowdsale;

  function TokenRDC( address _foundation, address _team, address _BAP ) public {
    require( _foundation != address(0x0));
    require( _team != address(0x0));  
    require( _BAP != address(0x0));  
    
    uint256 dec = 10 ** uint256(decimals); //1000000000000000000;
    totalSupply_ = INITIAL_SUPPLY;
    
	balances[msg.sender] = INITIAL_SUPPLY;
	transfer( _foundation, 12000000 * dec ); 	// Foundation 20%
	transfer( _team, 6000000 * dec );			// Team 10%
	transfer(  _BAP, 2400000 * dec );			// Bounty, Advisor, Partnership 4%
  }
  
  /**
  * @dev transfer token to crowdsale's contract / переводим токены на адрес контратракта распродажи
  * @param _crowdsale The address of crowdsale's contract.
  */  
  function startCrowdsale0( address _crowdsale ) onlyOwner public {
      _startCrowdsale( _crowdsale, 4500000 );
  }
  
  /**
  * @dev transfer token to crowdsale's contract / переводим токены на адрес контратракта распродажи
  * @param _crowdsale The address of crowdsale's contract.
  */  
  function startCrowdsale1( address _crowdsale ) onlyOwner public {
      _startCrowdsale( _crowdsale, 7920000 );
  }
  
  /**
  * @dev transfer token to crowdsale's contract / переводим токены на адрес контратракта распродажи
  * @param _crowdsale The address of crowdsale's contract.
  */  
  function startCrowdsale2( address _crowdsale ) onlyOwner public {
      _startCrowdsale( _crowdsale, balances[owner] );
  }
  
  /**
  * @dev transfer token to crowdsale's contract / переводим токены на адрес контратракта распродажи
  * @param _crowdsale The address of crowdsale's contract.
  * @param _value The amount to be transferred.
  */  
  function _startCrowdsale( address _crowdsale, uint256 _value ) onlyOwner internal {
      require(currentCrowdsale == address(0));
      currentCrowdsale = _crowdsale;
      uint256 dec = 10 ** uint256(decimals);
      uint256 val = _value * dec;
      if( val > balances[owner] ) {
          val = balances[ owner ];
      }
      transfer( _crowdsale, val );
  }
  
  /**
  * @dev transfer token back to owner / переводим токены обратно владельцу контнракта
  * 
  */
  function finishCrowdsale() onlyOwner public returns (bool) {
    require(currentCrowdsale != address(0));
    require( balances[currentCrowdsale] > 0 );
    
    uint256 value = balances[ currentCrowdsale ];
    balances[currentCrowdsale] = 0;
    balances[owner] = balances[owner].add(value);
    Transfer(currentCrowdsale, owner, value);
    
    currentCrowdsale = address(0);
    return true;
  }
}
