import latestTime from './helpers/latestTime';
import waitMs from './helpers/waitMs';


var TokenRDC = artifacts.require("./TokenRDC.sol");
var Crowdsale0 = artifacts.require("./CrowdsaleRDC0A.sol");
var BigNumber = require('bignumber.js');

contract('----- Crowdsale0-A', function(accounts) {

  const DEC = 1000000000000000000;
  let token;
  let crowd0;
  const RATE = 4500;
  
  /*
  beforeEach(async function () {
    token = await TokenRDC.new( accounts[1], accounts[2], accounts[3] );	
	let now = latestTime();
	let dt = Math.round( (new Date()).getTime()/1000 ) + 3;
	console.log( ">>>>> now=" + now + ", dt=" + dt + "; xnow=" + latestTime());
	
    crowd0 = await Crowdsale0.new( token.address, dt, now+100000, RATE );
	if( now < dt ) {
		await waitMs(1000 * (dt-now));
	}
	console.log( ">>>>> new crowd0=" + crowd0.address );
  });
  */
  
  beforeEach(async function () {
    token = await TokenRDC.new( accounts[1], accounts[2], accounts[3] );	
	let now = latestTime();	
    crowd0 = await Crowdsale0.new( token.address, now+1, now+100000, RATE );	
	await waitMs(1000*(2 + (latestTime()-now) ));	
	//console.log( ">>>>> new crowd0A=" + crowd0.address );
  });


  it( "test startCrowdsale-0 (2)", async() => {		
	await token.startCrowdsale0( crowd0.address );
	let b1 = await token.balanceOf.call( crowd0.address );	
	assert.equal( b1, 4500000 * DEC, "balance on start" );	
  });
  
  it( "test startCrowdsale-0 (2) and finish", async() => {	
	let beforeVal = await token.balanceOf.call( accounts[0] );
	await token.startCrowdsale0( crowd0.address );
	await token.finishCrowdsale();
	let afterVal = await token.balanceOf.call( accounts[0] );
	assert.equal( afterVal.valueOf(), beforeVal.valueOf(), "balance after finish" );
  });

  it( "test crowdsale-0: buy token", async() => {		
	await token.startCrowdsale0( crowd0.address );

	//let b1 = await token.balanceOf.call( crowd0.address );	
	//assert.equal( b1, 4500000 * DEC, "balance on start" );
	
	await crowd0.addToWhitelist( accounts[4] );
	
	let x3 = await crowd0.hasClosed();
	console.log( ">>>>> x3=" + x3 );
	
	let b1 = await token.balanceOf.call( crowd0.address );	
	let one = web3.toWei(1, "ether");
	await crowd0.buyTokens( accounts[4], {from: accounts[4], value:one.valueOf()} );
	
	let b2 = await token.balanceOf.call( crowd0.address );	
	let diff = b1.minus( b2 );
	let tt = new BigNumber(one);
	tt = tt.multipliedBy( RATE );
	console.log( ">>>>> b1=" + b1 + "; b2=" + b2  + ", dif=" + diff + ", tt=" + tt.valueOf() );
	assert.equal( diff.valueOf(), tt.valueOf(), "by token 4500^18" );
	//.should.be.fulfilled;
	
	/*
	let x1 = await token.finishCrowdsale();
	let afterVal = await token.balanceOf.call( accounts[0] );
	console.log( "after=" + afterVal + "; before=" + beforeVal);
	assert.equal( afterVal.valueOf(), beforeVal.valueOf(), "balance after finish" );
	*/
  });
  
    
  
});