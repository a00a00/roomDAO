// Async waiting for milli-seconds
export default function waitMs( ms ) {
  return new Promise((resolve) => {
		console.log( "...waiting for " + ms + " ms" );
		setTimeout(resolve, ms);
		});	
}
