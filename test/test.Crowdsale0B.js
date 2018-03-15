import latestTime from './helpers/latestTime';
import waitMs from './helpers/waitMs';

var TokenRDC = artifacts.require("./TokenRDC.sol");
var Crowdsale0B = artifacts.require("./CrowdsaleRDC0B.sol");
var BigNumber = require('bignumber.js');

contract('B: Crowdsale0', function(accounts) {

  const DEC = 1000000000000000000;
  let token;
  let crowd0;
  const RATE = 4500;
  let sec = 1;
  
  let checkIsOpen = async function() {
	 let xopen = await crowd0.openingTime.call(); 
	 let now = latestTime();
	 let xclosed = await crowd0.closingTime.call();
	 
	 let tt = "(open=" + xopen + "; now=" + now + "; closed=" + xclosed + ")";
	 if( xopen <= now && xclosed >= now ) {
		 console.log( "----->>> OPEN: " + tt );
	 } else {
		 console.log( "----->>> NOT open: " + tt );
	 }	 	 
  };
  /*
  const waitMs = (ms) => {
	return new Promise((resolve) => {
		console.log( "...waiting for " + ms + " ms" );
		setTimeout(resolve, ms);
		});
	};
  */
  beforeEach(async function () {
    token = await TokenRDC.new( accounts[1], accounts[2], accounts[3] );		
	let now = latestTime();	
	let dt = Math.round( (new Date()).getTime()/1000 );
	console.log( ">>>>> now=" + now + ", dt=" + dt + "; xnow=" + latestTime());
    crowd0 = await Crowdsale0B.new( token.address, now+2, now+1000000, RATE );
	await waitMs(3000);
	console.log( ">>>>> new crowd0=" + crowd0.address );
  });


  it( "B: test startCrowdsale-0: start balance", async() => {		
	await token.startCrowdsale0( crowd0.address );
	let b1 = await token.balanceOf.call( crowd0.address );	
	assert.equal( b1, 4500000 * DEC, "balance on start" );	
  });
  
  
  it( "B: test startCrowdsale-0: start and finish", async() => {	
	let beforeVal = await token.balanceOf.call( accounts[0] );
	await token.startCrowdsale0( crowd0.address );
	await token.finishCrowdsale();
	let afterVal = await token.balanceOf.call( accounts[0] );
	assert.equal( afterVal.valueOf(), beforeVal.valueOf(), "balance after the finish must be equal" );
  });

  
  it( "test crowdsale-0: buy token - 1 eth", async() => {		
	await token.startCrowdsale0( crowd0.address );
	
	let x3 = await crowd0.hasClosed();
	console.log( "(3) >>>>> isClosed=" + x3 );
	
	let b1 = await token.balanceOf.call( crowd0.address );	
	console.log( "(3) >>>>> balance crowd0=" + b1 );
	
	await checkIsOpen();
	let one = web3.toWei(1, "ether");
	await crowd0.buyTokens( accounts[4], {from: accounts[4], value:one.valueOf()} );
	
	let b2 = await token.balanceOf.call( crowd0.address );	
	let diff = b1.minus( b2 );
	let tt = new BigNumber(one);
	tt = tt.multipliedBy( RATE );
	console.log( ">>>>> b1=" + b1 + "; b2=" + b2  + ", dif=" + diff + ", tt=" + tt.valueOf() );
	assert.equal( diff.valueOf(), tt.valueOf(), "sold tokens: 4500^18" );		
  });
  
  
  it( "test crowdsale-0: buy token - 50 eth", async() => {		
	await token.startCrowdsale0( crowd0.address );
	
	let bx1 = await web3.eth.getBalance( accounts[0] );
	console.log( ">>>>>  bx1=" + bx1 );
	
	let x3 = await crowd0.hasClosed();
	console.log( ">>>>> isClosed=" + x3 );
	
	let sum = web3.toWei(50, "ether");
	await crowd0.buyTokens( accounts[4], {from: accounts[4], value:sum.valueOf()} );
	
	let b2 = await token.balanceOf.call( crowd0.address );	
	let bx2 = await web3.eth.getBalance( accounts[0] );
	console.log( ">>>>> b2=" + b2 + "; eth=" + bx2 );
	
	assert.equal( bx2.minus(bx1).valueOf(), sum.valueOf(), "50 ether" );		
  }); 
  
  it( "test crowdsale-0: buy token - 950 eth", async() => {		
	await token.startCrowdsale0( crowd0.address );
	
	let sum = web3.toWei(950, "ether");
	await crowd0.buyTokens( accounts[4], {from: accounts[4], value:sum.valueOf()} );
	
	let b2 = await token.balanceOf.call( crowd0.address );		
	console.log( ">>>>> b2=" + b2 );	
	assert.equal( bx2.valueOf(), 0, "0 ether" );		
  }); 
  
  
  
  it( "back 50 eth", async() => {		
	await web3.eth.sendTransaction({
		from: accounts[0],
		to: accounts[4],
		value: web3.toWei(50, "ether"),		
		gasLimit: 21000,
		gasPrice: 20000000000
	});
  
  }); 
  
});