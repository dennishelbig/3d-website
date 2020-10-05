/* jshint devel: true */
/* jshint undef: true, unused: false */
/*globals TimelineMax, gsap */
/* "-W100": true */
/* :write ++enc=utf-8 */
console.clear();

var $body = document.getElementById('body');
var infobox = document.getElementById('info-box');
var $canvas = document.getElementById('canvas');
var $square = document.getElementById("square");
var $xaxis = document.getElementById("x-axis");
var $zaxis = document.getElementById("z-axis");



function getMouse(e){
  // console.log('x: ' + e.pageX + ' --- y: '+ e.pageY);
}
document.addEventListener("mousemove", getMouse); 




var x = 0;
var y = 0;

function rotateSquare(input){
	x = x + input.deltaX / 10;
	
	if( y <= 90 && y >= -90 ){
		y = y + input.deltaY / 10 * -1;
	}else if( y > 90 ){
		y = 90;
	}
	else if( y < -90 ){
		y = -90;
	}


	gsap.to( $xaxis, {
		duration: 0,
		rotateX: y,
		// x: '-50%',
		// y: '-50%',
		// z: '50vw',
	});

	gsap.to( $zaxis, {
		rotateZ: x * -1,
		// x: '-25%'
		// x: '-50%',
		// y: '-50%',
	});

	console.log('x: ' + x + ' --- y: ' + y);
	infobox.innerHTML = 'x: ' + x + ' <br> y: ' + y;
}




function getSrollInput(e){
	// console.log( e );
	rotateSquare( e );
	event.preventDefault();
	// 
}

// $body.addEventListener('wheel', e => e.preventDefault());
$canvas.addEventListener("wheel", getSrollInput, false);





// // Add the event listener which gets triggered when using the trackpad 
// $canvas.addEventListener('mousewheel', function(event) {
//   // We don't want to scroll below zero or above the width and height 
//   var maxX = this.scrollWidth - this.offsetWidth;
//   var maxY = this.scrollHeight - this.offsetHeight;

//   // If this event looks like it will scroll beyond the bounds of the element, prevent it and set the scroll to the boundary manually 
//   if (this.scrollLeft + event.deltaX < 0 || 
//      this.scrollLeft + event.deltaX > maxX || 
//      this.scrollTop + event.deltaY < 0 || 
//      this.scrollTop + event.deltaY > maxY) {

//     event.preventDefault();

//     // Manually set the scroll to the boundary
//     this.scrollLeft = Math.max(0, Math.min(maxX, this.scrollLeft + event.deltaX));
//     this.scrollTop = Math.max(0, Math.min(maxY, this.scrollTop + event.deltaY));
//   }
// }, false);