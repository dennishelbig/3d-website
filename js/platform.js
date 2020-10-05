/* jshint devel: true */
/* jshint undef: true, unused: false */
/*globals TimelineMax, gsap, Linear */
/* "-W100": true */
/* :write ++enc=utf-8 */





/********************************************
*************  HELPER FUNCTIONS  ************
********************************************/



// Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
var  timerId;
var  throttleFunction  =  function (func, delay) {
	// If setTimeout is already scheduled, no need to do anything
	if (timerId) {
		return;
	}

	// Schedule a setTimeout after delay seconds
	timerId  =  setTimeout(function () {
		func();
		
		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
		// the next scroll event function execution can be scheduled by the setTimeout
		timerId  =  undefined;
	}, delay);
};





function offset(el) {
    var rect = el.getBoundingClientRect(),
    	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    	scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}


/********************************************
*************  OFFSET FUNCTIONS  ************
********************************************/




var $body = document.getElementById('body');
var $canvas = document.getElementById('canvas');
var $platform = document.getElementById("platform");
var $area = document.getElementById("area");
var	$map = document.getElementById('map');
var	$mapInner = document.getElementById('inner-map');
var	$point = document.getElementById('point');


var rotateAngleX = 0;
var rotateAngleY = 0;


var tweenMove;
var tweenCoordsPoint;
var moveFired = false;
var turnFired = false;


var mapRatio = $area.offsetWidth / $map.offsetWidth;





/********************************************
*************  ROTATE FUNCTIONS  ************
********************************************/


var $displayDeg = document.getElementById('display-deg').getElementsByTagName('span')[0];
var $displayX = document.getElementById('display-x-coord').getElementsByTagName('span')[0];
var $displayY = document.getElementById('display-y-coord').getElementsByTagName('span')[0];




function rotateSquareWithDevice( input ){
	rotateAngleY = rotateAngleY + input.deltaX / -10;
	rotateAngleY = Math.round((rotateAngleY + Number.EPSILON) * 100) / 100;

	if( rotateAngleY >= 360 ){
		rotateAngleY = rotateAngleY - 360;
	}
	if( rotateAngleY <= 0 ){
		rotateAngleY = rotateAngleY + 360;
	}

	gsap.set( $platform, {
		rotateY: rotateAngleY,
	});

	$displayDeg.innerHTML = Math.floor(rotateAngleY);
}


var prevY;
function rotateSquareWithKeys( input ){

	prevY = rotateAngleY;
	rotateAngleY = rotateAngleY + input;
	rotateAngleY = Math.round((rotateAngleY + Number.EPSILON) * 100) / 100;


	if( rotateAngleY >= 360 ){
		gsap.set( $platform,{
			rotateY: prevY - 360
		});
		rotateAngleY = rotateAngleY - 360;
		
	}

	if( rotateAngleY < 0 ){
		gsap.set( $platform,{
			rotateY: prevY + 360
		});
		rotateAngleY = rotateAngleY + 360;
	}


			
	gsap.to( $platform, {
		ease: Linear.easeNone,
		rotateY: rotateAngleY,
		duration: 0.05,
		onComplete: function(){
			if( turnFired === true ){
				rotateSquareWithKeys( input );
			}
		}
	});

	$displayDeg.innerHTML = Math.floor(rotateAngleY);
}



function getSrollInput(e){
	// console.log( e );
	rotateSquareWithDevice( e );
	event.preventDefault();
}

// $body.addEventListener('wheel', e => e.preventDefault());
$canvas.addEventListener("wheel", getSrollInput, false);






/********************************************
*************  OFFSET FUNCTIONS  ************
********************************************/


var x = 0;
var y = 0;
var unit = 200;
var duration = 0.1;



function getOffsetX(){
	var value;
	if( rotateAngleY >= 0 && rotateAngleY < 90 ){
		value = (rotateAngleY / -90 * unit);
		// console.log( '<90  -- x: ' + value );
	}
	if( rotateAngleY >= 90 && rotateAngleY < 180 ){
		value = ( (180 - rotateAngleY ) / -90 * unit);
		// console.log( '>90  -- x: ' + value );
	}
	if( rotateAngleY >= 180 && rotateAngleY < 270 ){
		value = (( rotateAngleY - 180 ) / 90 * unit);
		// console.log( '>180  -- x: ' + value );
	}
	if( rotateAngleY >= 270 && rotateAngleY < 360 ){
		value = ( ( rotateAngleY - 360 ) / -90 * unit);
		// console.log( '>270  -- x: ' + value );
	}

	return value;
}



function getOffsetY(){

	var value;

	if( rotateAngleY >= 0 && rotateAngleY < 90 ){
		value = ( unit - rotateAngleY / 90 * unit );
		// console.log( '<90  --  y: ' + value );
	}
	if( rotateAngleY >= 90 && rotateAngleY < 180 ){
		value = ( ( 90 - rotateAngleY ) / 90 * unit);
		// console.log( '>90  --  y: ' + value );
	}
	if( rotateAngleY >= 180 && rotateAngleY < 270 ){
		value = (( rotateAngleY - 270 ) / 90 * unit);
		// console.log( '>180  --  y: ' + value );
	}
	if( rotateAngleY >= 270 && rotateAngleY < 360 ){
		value = ( (270 - rotateAngleY ) / -90 * unit);
		// console.log( '>270  --  y: ' + value );
	}

	return value;
}


var areaHeight = $area.offsetHeight;
var areaWidth = $area.offsetWidth;

console.log( areaWidth );
console.log( areaHeight );

var $sections = document.getElementsByTagName('section');
var $sectionsNone = document.querySelectorAll('section.none');
var $cells = document.getElementsByClassName('cell');



var sectionOffset = [];


setTimeout(function(){
	for (var i = $sectionsNone.length - 1; i >= 0; i--) {
		var $thisSection = $sectionsNone[i];
		var sectionLeft = $thisSection.offsetLeft - areaWidth / 2;
		var sectionRight = sectionLeft + $thisSection.offsetWidth;
		var sectionTop = $thisSection.parentElement.offsetTop - areaHeight / 2;
		var sectionBottom = sectionTop + $thisSection.offsetHeight;

		sectionOffset.push({
			'left': sectionLeft,
			'right': sectionRight,
			'top': sectionTop,
			'bottom': sectionBottom
		});
	}

	console.log(sectionOffset);
}, 1000);




var wallOffset = 100;
var maxOffset = ($platform.offsetWidth - wallOffset) / 2;


function limitOffset(inputX, inputY){

	for (var i = sectionOffset.length - 1; i >= 0; i--) {

		var thisArray =  sectionOffset[i],
			left = thisArray.left - wallOffset,
			right = thisArray.right + wallOffset,
			top = thisArray.top - wallOffset,
			bottom = thisArray.bottom + wallOffset,

			lastX = x,
			lastY = y,
			newX, newY;



		if( inputX > maxOffset){
			inputX = maxOffset;
			console.log( 'a' );
		}
		if( inputX < maxOffset * -1 ){
			inputX = maxOffset * -1 ;
			console.log( 'b' );
		}
		if( inputY > maxOffset ){
			inputY = maxOffset;
			console.log( 'c' );
		}
		if( inputY < maxOffset * -1 ){
			inputY = maxOffset * -1 ;
			console.log( 'd' );
		}




		if( // if almost inside
			inputX >= left &&
			inputX <= right &&
			inputY >= top &&
			inputY <= bottom
		){

			console.log('--------' + i);
			

			if( inputX >= thisArray.left - wallOffset && inputX <= thisArray.left + wallOffset ){
				// console.log('left wall');
				newX = left; // X stimmt nicht
				newY = inputY;
				// console.log('%c correction:   x: '+ Math.floor(newX)+'    y: '+ Math.floor(newY), 'background: #222; color: red' );

				// if (newY > maxOffset || newY < maxOffset * -1 ){
				// 	if( newY > maxOffset){
				// 		newY = maxOffset - 0;
				// 		console.log( 'a' );
				// 	}
				// 	if( newY < maxOffset * -1 ){
				// 		newY = (maxOffset - 0) * -1 ;
				// 		console.log( 'b' );
				// 	}

				// 	if( inputY >= thisArray.top - wallOffset && inputY <= thisArray.top + wallOffset ){
				// 		newY = top;
				// 	}

				// 	if( inputY >= thisArray.bottom - wallOffset && inputY <= thisArray.bottom + wallOffset ){
				// 		newY = bottom;
				// 	}



				// 	if( newY > maxOffset){
				// 		newY = maxOffset - 0;
				// 		console.log( 'a' );
				// 	}
				// 	if( newY < maxOffset * -1 ){
				// 		newY = (maxOffset - 0) * -1 ;
						
				// 		console.log( 'b' );
				// 	}
				// }


				return [newX, newY];
			}
			else if( inputX >= thisArray.right - wallOffset && inputX <= thisArray.right + wallOffset ){
				// console.log('right wall');
				newX = right;
				newY = inputY;

				// if (newX > maxOffset || newX < maxOffset * -1 ){

				// 	if( newX > maxOffset){
				// 		newX = maxOffset - 0;
				// 		console.log( 'a' );
				// 	}
				// 	if( newX < maxOffset * -1 ){
				// 		newX = (maxOffset - 0) * -1 ;
				// 		console.log( 'b' );
				// 	}


				// 	if( inputY >= thisArray.top - wallOffset && inputY <= thisArray.top + wallOffset ){
				// 		newY = top;
				// 	}

				// 	if( inputY >= thisArray.bottom - wallOffset && inputY <= thisArray.bottom + wallOffset ){
				// 		newY = bottom;
				// 	}



				// 	if( newY > maxOffset){
				// 		newY = maxOffset - 0;
				// 		console.log( 'a' );
				// 	}
				// 	if( newY < maxOffset * -1 ){
				// 		newY = (maxOffset - 0) * -1 ;
				// 		console.log( 'b' );
				// 	}
				// }



				console.log('%c correction:   x: '+ Math.floor(newX)+'    y: '+ Math.floor(newY), 'background: #222; color: red' );
				return [newX, newY];
			}
			else if( inputY >= thisArray.top - wallOffset && inputY <= thisArray.top + wallOffset ){
				// console.log('top wall');
				newY = top;
				newX = inputX;

				


				// console.log('%c correction:   x: '+ Math.floor(newX)+'    y: '+ Math.floor(newY), 'background: #222; color: red' );
				return [newX, newY];
			}
			else if( inputY >= thisArray.bottom - wallOffset && inputY <= thisArray.bottom + wallOffset ){
				// console.log('bottom wall');
				newY = bottom;
				newX = inputX;


				// if( newY > maxOffset){
				// 	newY = maxOffset - 0;
				// 	console.log( 'a' );
				// }
				// if( newY < maxOffset * -1 ){
				// 	newY = (maxOffsett - 0) * -1 ;
				// 	console.log( 'b' );
				// }

				// if( inputY >= thisArray.top - wallOffset && inputY <= thisArray.top + wallOffset ){
				// 	newY = top;
				// }

				// if( inputY >= thisArray.bottom - wallOffset && inputY <= thisArray.bottom + wallOffset ){
				// 	newY = bottom;
				// }
				// console.log('%c correction:   x: '+ Math.floor(newX)+'    y: '+ Math.floor(newY), 'background: #222; color: red' );
				return [newX, newY];
			}

		}

	}
	return [inputX, inputY];
}
// limitOffset();


// console.log(offsetArray);

	



function getCurrentSection(){
	var $currentSection = document.elementFromPoint(0, 0);
}

getCurrentSection();



/********************************************
*************  MOVE FUNCTIONS  **************
********************************************/


function updatePositionMap(){
	var limitOffsetCoords = limitOffset(x, y); 
	$displayX.innerHTML = Math.floor( limitOffsetCoords[0] );
	$displayY.innerHTML = Math.floor(  limitOffsetCoords[1] );

	tweenCoordsPoint = gsap.to( $point, {
		duration: duration,
		ease: Linear.easeNone,
		x: limitOffsetCoords[0] / mapRatio * -1,
		y: limitOffsetCoords[1] / mapRatio * -1
	});
}




function moveForwards(){
	x = x + getOffsetX();
	y = y + getOffsetY();
	
	var limitOffsetCoords = limitOffset(x, y); 

	x = limitOffsetCoords[0];
	y = limitOffsetCoords[1];


	updatePositionMap();
	

	tweenMove = gsap.to($area,{
		ease: Linear.easeNone,
		duration: duration,
		y: y,
		x: x,
		onComplete: function(){
			if( moveFired === true ){
				moveForwards();
			}
		}
	});
}




function moveBackwards(){
	x = x + getOffsetX() * -1;
	y = y + getOffsetY() * -1;


	var limitOffsetCoords = limitOffset(x, y); 

	x = limitOffsetCoords[0];
	y = limitOffsetCoords[1];


	updatePositionMap();

	tweenMove = gsap.to($area,{
		ease: Linear.easeNone,
		duration: duration,
		y: y,
		x: x,
		onComplete: function(){
			if( moveFired === true ){
				moveBackwards();
			}
		}
	});
}


function moveLeft(){
	x = x + getOffsetY();
	y = y + getOffsetX() * -1;


	var limitOffsetCoords = limitOffset(x, y); 

	x = limitOffsetCoords[0];
	y = limitOffsetCoords[1];


	updatePositionMap();

	tweenMove = gsap.to($area,{
		ease: Linear.easeNone,
		duration: duration,
		y: y,
		x: x,
		onComplete: function(){
			if( moveFired === true ){
				moveLeft();
			}
		}
	});
}


function moveRight(){
	x = x + getOffsetY() * -1;
	y = y + getOffsetX();


	var limitOffsetCoords = limitOffset(x, y); 

	x = limitOffsetCoords[0];
	y = limitOffsetCoords[1];


	updatePositionMap();

	tweenMove = gsap.to($area,{
		ease: Linear.easeNone,
		duration: duration,
		y: y,
		x: x,
		onComplete: function(){
			if( moveFired === true ){
				moveRight();
			}
		}
	});
}







function turnRight(){
	x = x + getOffsetY() * -1;
	y = y + getOffsetX();


	x = limitOffset(x);
	y = limitOffset(y);

	updatePositionMap();

	tweenMove = gsap.to($area,{
		ease: Linear.easeNone,
		duration: duration,
		y: y,
		x: x,
		onComplete: function(){
			if( moveFired === true ){
				moveRight();
			}
		}
	});
}







/********************************************
**************  KEY FUNCTIONS  **************
********************************************/

var listener = new window.keypress.Listener();



function keyup() {
    moveFired = false;
	console.log('keyup');
	// updatePosition();
    // tweenMove.kill();
    // tweenCoordsPoint.kill();
    // gsap.killDelayedCallsTo(loop);
}




// https://dmauro.github.io/Keypress/

var rotateKey;

var my_scope = this;
var my_combos = listener.register_many([
    {
        "keys" : "w",
        // "is_exclusive" : true,
        "on_keydown": function(e) {
        	if( !moveFired ) {
       			moveFired = true;
        		throttleFunction( moveForwards, 0);
	    	}
        },
        "on_keyup" : function(event) {
        	keyup();
        	// console.log('w');
            // Normally because we have a keyup event handler,
            // event.preventDefault() would automatically be called.
            // But because we're returning true in this handler,
            // event.preventDefault() will not be called.
            // return true;
        },
        "this" : my_scope
    },
    {
        "keys" : "s",
        "on_keydown": function(e){
        	if( !moveFired ) {
       			moveFired = true;
        		throttleFunction( moveBackwards, 0);
	    	}
        },
        "on_keyup" : function(event) {
        	keyup();
        	// console.log('s');
        },
        "this" : my_scope
    },

    {
        "keys" : "a",
         "on_keydown": function(e){
        	if( !moveFired ) {
       			moveFired = true;
        		throttleFunction( moveLeft, 0);
	    	}
        },
        "on_keyup" : function(event) {
        	keyup();
        	// console.log('a');
        },
        "this" : my_scope
    },
    {
        "keys" : "d",
         "on_keydown": function(e){
        	if( !moveFired ) {
       			moveFired = true;
        		throttleFunction( moveRight, 0);
	    	}
        },
        "on_keyup" : function(event) {
        	keyup();
        	// console.log('d');
        },
        "this" : my_scope
    },
    {
        "keys" : "left",
         "on_keydown": function(e){
         	if( !turnFired ) {
         		rotateKey = 'left'; 
       			turnFired = true;
         		rotateSquareWithKeys( -5 );
	    	}
        },
        "on_keyup" : function(event) {
       		turnFired = false;
        	console.log('left');
        },
        "this" : my_scope
    },
    {
        "keys" : "right",
         "on_keydown": function(e){
         	if( !turnFired ) {
         		rotateKey = 'right'; 
       			turnFired = true;
         		rotateSquareWithKeys( 5 );
	    	}
        },
        "on_keyup" : function(event) {
       		turnFired = false;
        	console.log('right');
        },
        "this" : my_scope
    },
    {
        "keys" : "space",
         "on_keydown": function(e){
         	console.log('space');
        },
        "this" : my_scope
    }
]);


