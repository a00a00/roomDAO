

contract('Simple Tests', function(accounts) {
  

  it( "balances", async() => {
	
	for( var i=0; i<accounts.length; i++ ) {
		let bx1 = await web3.eth.getBalance( accounts[i] );
		console.log(  accounts[i] + " = " + bx1 );
	}	
	
  });
 
    
  
});
