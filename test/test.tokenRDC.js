var TokenRDC = artifacts.require("./TokenRDC.sol");



contract('TokenRDC', function(accounts) {

  const DEC = 1000000000000000000;
  let token;
  
  beforeEach(async function () {
    token = await TokenRDC.new( accounts[1], accounts[2], accounts[3] );	
  });

  
  it("should put 39600000^18 coin in the first account", function() {
    return TokenRDC.deployed()
      .then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 39600000*1000000000000000000, "39600000^18 wasn't in the first account");
    });
  });

/*
  it("test1", async( accounts ) => {
	let instance = await TokenRDC.deployed();
	let x1 = await instance.test1.call();
	let xx2 = new Date().getTime();
	let x2 = Math.floor( xx2 / 1000 );
	console.log( x1 );
	console.log( x2 + "; " + xx2 );
	console.log( "we3 now = " + web3.version );
	assert.equal( x1, x2, "now time" );

let t1 = web3.eth.getBlock('latest').timestamp;
	console.log( "now = " + t1 );
  });
*/

  it( "test new TokenRDC: distrib", async() => {
	//let token = await TokenRDC.new( accounts[1], accounts[2], accounts[3] );	
	let all = await token.totalSupply.call(); //all tokens count
	
	let b1 = await token.balanceOf.call( accounts[0] );
	assert.equal( b1, (all/100*66), "Public 66%" );
	
	b1 = await token.balanceOf.call( accounts[1] );
	assert.equal( b1, (all/100*20), "Foundation 20%" );
	
	b1 = await token.balanceOf.call( accounts[2] );
	assert.equal( b1, (all/100*10), "Team 10%" ); //6000000*dec

	b1 = await token.balanceOf.call( accounts[3] );
	assert.equal( b1, (all/100*4), "Bounty, Advisor, Partnership 4%" ); // 2400000*dec	
  });
 

  it( "test startCrowdsale-0", async() => {
	//let instance = await TokenRDC.deployed();
	let beforeVal = await token.balanceOf.call( accounts[0] );
	await token.startCrowdsale0( accounts[5] );	

	let b1 = await token.balanceOf.call( accounts[5] );	
	assert.equal( b1, 4500000 * DEC, "balance on start" );
	
	let x1 = await token.finishCrowdsale();
	let afterVal = await token.balanceOf.call( accounts[0] );
	console.log( "after=" + afterVal + "; before=" + beforeVal);
	assert.equal( afterVal.valueOf(), beforeVal.valueOf(), "balance after finish" );
  });



  
    
  
});
