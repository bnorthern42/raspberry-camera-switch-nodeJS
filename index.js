//Camera Lib
const PiCamera = require('pi-camera');
// GPIO Lib
const Gpio = require('pigpio').Gpio;

/**
Remove Old File if it exists:

*/

const fs = require('fs');
const path = __dirname+'/test.jpg';
try{
	fs.unlinkSync(path)
	console.info("Old JPG removed");
}catch(err){
	console.log("JPG removal error, possibly not found");
	console.error(err);
}

/**
Camera Setup
*/
const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});
/**
Button/ future motion switch enable
*/
const switcher = new Gpio(4, {
	mode: Gpio.INPUT,
	pullUpDown: Gpio.PUD_DOWN,
	edge: Gpio.FALLING_EDGE
});
/**
Falling edge:
Normal 0. 
ON	1: ---------
			    \
				 \
				  \			
OFF	0:			   --------- 

If ON (1) detected, then  'OFF'(0) by the switch being released, it will activate...
Tutorial: https://www.youtube.com/watch?v=24y9glSuyK8
**/

try{
	//Switch enables when "released" aka falling edge
	switcher.on('interrupt', (level) => {
	myCamera.snap()
	  .then((result) => {
	    // Your picture was captured
	    console.log("picture taken");
	  })
	  .catch((error) => {
	  	console.log("Error taking picture");
	     // Handle your error
	  });
	});

	  
}catch(err){
	console.log("error, in interrupt");
	console.error(err);
}



 process.on('SIGINT', () => {
 	console.info('\nShutdown Signal Recieved: SIGINT');
 	process.exit();
 })
