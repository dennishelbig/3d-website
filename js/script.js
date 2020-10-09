/* jshint devel: true */
/* jshint undef: true, unused: false */
/*globals TimelineMax, gsap, _, Linear, Sine, SuperGif */
/* "-W100": true */
/* :write ++enc=utf-8 */

// first check for touch devices
function is_touch_device4() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  
  var mq = function (query) {
      return window.matchMedia(query).matches;
  };

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) { // jshint ignore:line
      return true;
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}
var isTouch = is_touch_device4();



// own throttle
function throttle (callback, limit) {
  var wait = false;                  // Initially, we're not waiting
  return function () {               // We return a throttled function
      if (!wait) {                   // If we're not waiting
          callback.call();           // Execute users function
          wait = true;               // Prevent future invocations
          setTimeout(function () {   // After a period of time
              wait = false;          // And allow future invocations
          }, limit);
      }
  };
}


document.querySelectorAll('.wall').forEach(function( $element, i ){
  var $target = document.createElement('div');
  var $staticImg = document.createElement('div');
  var $imgTag = document.createElement('img');
  var $fullscreen = document.createElement('div');
  var $rect = document.createElement('div');
  

  $target.classList.add('target');
  $staticImg.classList.add('static-img');
  $rect.classList.add('rect');
  $fullscreen.classList.add('fullscreen');
  

  if( i < 6){
    $imgTag.setAttribute('src', 'img/gif_prev/'+(i+1)+'.gif');
    $imgTag.setAttribute('src', 'img/gif/'+(i+1)+'.gif');
    $imgTag.setAttribute('rel:animated_src', 'img/gif/'+(i+1)+'.gif');
    $imgTag.setAttribute('rel:auto_play', '0');
    $imgTag.setAttribute('rel:rubbable', '0');
  }

  $element.append($target);
  $element.append($staticImg);
  $element.append($rect);
  $element.append($fullscreen);

  $staticImg.append($imgTag);
  

  
  $target.addEventListener('click', function(){
    if( !$rect.classList.contains('is-active') ){

      $rect.classList.add('is-active');
      setTimeout(function(){
        $rect.classList.remove('is-active');
      },100);
    }
  });
});



/************************************************ */
/**********     GIF PLAY / PAUSE     ************ */
/************************************************ */

var $images = document.querySelectorAll('img');
var $rubs = [];
$images.forEach(function($image, i){
    if (/.*\.gif/.test($image.src)) {
      var rub = new SuperGif({ gif: $image } );
      rub.load(function(){
        console.log('oh hey, now the gif is loaded');
      });
      $rubs.push(rub);
      setTimeout(function(){
      },0 * i );
      // use rubs later on play / pause
    }

});



var $body = document.getElementById('body');
var $infobox = document.getElementById('info-box');
var $coord_x = $infobox.querySelector('.coord-x');
var $coord_y = $infobox.querySelector('.coord-y');
var $canvas = document.getElementById('canvas');
var $square = document.getElementById("square");
var $xaxis = document.getElementById("x-axis");
var $zaxis = document.getElementById("z-axis");


var $targetsCurrent = [];
var $targetsNotCurrent = [];

function collectCurrentTargets(){
  $targetsCurrent = [
    document.querySelector('.current-level .level-part-0'),
    document.querySelector('.current-level .level-part-1'),
    document.querySelector('.current-level .level-part-2'),
    document.querySelector('.current-level .level-part-3'),
    document.querySelector('.current-level .level-part-4'),
    document.querySelector('.current-level .level-part-5')
  ];
}
collectCurrentTargets();



function collectNotCurrentTargets(){
  $targetsNotCurrent = [
    document.querySelectorAll('.level:not(.current-level) .level-part-0'),
    document.querySelectorAll('.level:not(.current-level) .level-part-1'),
    document.querySelectorAll('.level:not(.current-level) .level-part-2'),
    document.querySelectorAll('.level:not(.current-level) .level-part-3'),
    document.querySelectorAll('.level:not(.current-level) .level-part-4'),
    document.querySelectorAll('.level:not(.current-level) .level-part-5')
  ];

  $targetsNotCurrent.forEach(function( elements ){
    elements.forEach(function( element ){
      element.classList.remove('hidden');
    });
  });
}
collectNotCurrentTargets();



// var x = 0;
// var y = 0;

var currentViewCoords = {
  x: 0,
  y: 0
};

function xLimit( x ){
  if( x > 360 ){
    x = x - 360;
  }
  if( x < 0 ){
    x = x + 360;
  }
  return x;
}


function yLimit( y ){
	if( y > 90 ){
		y = 90;
  }
	else if( y < -90 ){
		y = -90;
  }
  return y;
}


function updateAxis( x, y ){
	gsap.set( $xaxis, {
    rotateX: y,
	});
	gsap.set( $zaxis, {
		rotateZ: x * 1,
	});
}


var roundedCoords= {

};

function roundCoords(){
  roundedCoords.x = Math.floor(currentViewCoords.x);
  roundedCoords.y = Math.floor(currentViewCoords.y);
}


function updateInfo(){
  $coord_x.innerHTML = roundedCoords.x;
  $coord_y.innerHTML = roundedCoords.y;
}


function focusX( deg ){
  if( deg >= 330 || deg < 30 ){
    $targetsCurrent[4].classList.add('hidden');
    $targetsCurrent[5].classList.add('hidden');
    $targetsCurrent[0].classList.add('hidden');

    $targetsCurrent[1].classList.remove('hidden');
    $targetsCurrent[1].classList.remove('enable-focus');
    $targetsCurrent[2].classList.remove('hidden');
    $targetsCurrent[2].classList.add('enable-focus');
    $targetsCurrent[3].classList.remove('hidden');
    $targetsCurrent[3].classList.remove('enable-focus');

    return 2;
    // console.log('330 --- 30');
  }

  if( deg >= 30 && deg < 90 ){
    $targetsCurrent[5].classList.add('hidden');
    $targetsCurrent[0].classList.add('hidden');
    $targetsCurrent[1].classList.add('hidden');

    $targetsCurrent[2].classList.remove('hidden');
    $targetsCurrent[2].classList.remove('enable-focus');
    $targetsCurrent[3].classList.remove('hidden');
    $targetsCurrent[3].classList.add('enable-focus');
    $targetsCurrent[4].classList.remove('hidden');
    $targetsCurrent[4].classList.remove('enable-focus');
  
    return 3;
    // console.log('30 --- 90');
  }

  if( deg >= 90 && deg < 150 ){
    $targetsCurrent[0].classList.add('hidden');
    $targetsCurrent[1].classList.add('hidden');
    $targetsCurrent[2].classList.add('hidden');

    $targetsCurrent[3].classList.remove('hidden');
    $targetsCurrent[3].classList.remove('enable-focus');
    $targetsCurrent[4].classList.remove('hidden');
    $targetsCurrent[4].classList.add('enable-focus');
    $targetsCurrent[5].classList.remove('hidden');
    $targetsCurrent[5].classList.remove('enable-focus');

    return 4;
    // console.log('90 --- 150');
  }

  if( deg >= 150 && deg < 210 ){
    $targetsCurrent[1].classList.add('hidden');
    $targetsCurrent[2].classList.add('hidden');
    $targetsCurrent[3].classList.add('hidden');

    $targetsCurrent[4].classList.remove('hidden');
    $targetsCurrent[4].classList.remove('enable-focus');
    $targetsCurrent[5].classList.remove('hidden');
    $targetsCurrent[5].classList.add('enable-focus');
    $targetsCurrent[0].classList.remove('hidden');
    $targetsCurrent[0].classList.remove('enable-focus');
  
    return 5;
    // console.log('150 --- 210');
  }


  if( deg >= 210 && deg < 270 ){
    $targetsCurrent[2].classList.add('hidden');
    $targetsCurrent[3].classList.add('hidden');
    $targetsCurrent[4].classList.add('hidden');

    $targetsCurrent[5].classList.remove('hidden');
    $targetsCurrent[5].classList.remove('enable-focus');
    $targetsCurrent[0].classList.remove('hidden');
    $targetsCurrent[0].classList.add('enable-focus');
    $targetsCurrent[1].classList.remove('hidden');
    $targetsCurrent[1].classList.remove('enable-focus');
  
    return 0;
    // console.log('210 --- 270');
  }


  if( deg >= 270 && deg < 330 ){
    $targetsCurrent[3].classList.add('hidden');
    $targetsCurrent[4].classList.add('hidden');
    $targetsCurrent[5].classList.add('hidden');

    $targetsCurrent[0].classList.remove('hidden');
    $targetsCurrent[0].classList.remove('enable-focus');
    $targetsCurrent[1].classList.remove('hidden');
    $targetsCurrent[1].classList.add('enable-focus');
    $targetsCurrent[2].classList.remove('hidden');
    $targetsCurrent[2].classList.remove('enable-focus');
    
    return 1;
    // console.log('270 --- 330');
  }
}


var brakePoints = [60, 120, 180, 240, 300, 360];
var focusBool = null;
var xIndex = null;
var focusArray_img = {
  top: 21,
  bottom: -21,
  left: -27, 
  right: 27,
  isFocus: false
};

var limit_img = {
  top: 21,
  bottom: -21,
  left: -27, 
  right: 27 
};



function nullX( x ){
  brakePoints.forEach( function( value, i ){
    if( x > 60  ){
      x = x - 60;
    }
  });

  if( x > 30 ){
    x = x - 60;
  }
  return x;
}



function processFocus( focusArray, x, y ){
  var nulledX = nullX( x );
  focusArray.yAdjustment = ( nulledX < 0 ) ? nulledX * -1 / 10 : nulledX / 10; 

  if( 
    y <= ( focusArray.top - focusArray.yAdjustment ) && 
    y >= ( focusArray.bottom + focusArray.yAdjustment ) && 
    nulledX >= focusArray.left && 
    nulledX <= focusArray.right 
  ){
    focusArray.isFocus = true;
  }else{
    focusArray.isFocus = false;
  }

  return focusArray; 
}


function adjustY( nulledX ){
  var yAdjustment = ( nulledX < 0 ) ? nulledX * -1 / 10 : nulledX / 10; 
  return yAdjustment;
}



function focusImage( x, y ){
  var nulledX = nullX( x );
  var yAdjustment = adjustY(nulledX);  
  xIndex = focusX( x );
  

  if( 
    y <= ( limit_img.top - yAdjustment ) && 
    y >= ( limit_img.bottom + yAdjustment ) && 
    nulledX >= limit_img.left && 
    nulledX <= limit_img.right 
  ){
    document.body.classList.add('background-black');
    focusBool = true;
  }else{
    document.body.classList.remove('background-black');
    focusBool = false;
  }


  $rubs.forEach(function(rub, ribIndex){
    if(xIndex === ribIndex && focusBool === true ){
      rub.play();
    }else{
      rub.pause();
    }
  });
}



var currentTouchX = 0;
var currentTouchY = 0;

var $crossHair = document.querySelector('#cross-hair');
var $targets = document.querySelectorAll('.current-level .target');


function isOverlapping(){
  if( focusBool === true && !$targets[xIndex].classList.contains('focus') ){

    $targets[xIndex].classList.add('focus');
    $targets[xIndex].parentNode.parentNode.classList.add('focus');
    $crossHair.classList.add('over');
  }


  if(focusBool !== true){
    $targets[xIndex].classList.remove('focus');
    $targets[xIndex].parentNode.parentNode.classList.remove('focus');
    $crossHair.classList.remove('over');
  }
}




//************************************************** */
//**************       COMPASS       *************** */
//************************************************** */

var positivX;
var cuttedX;

function cutXto10(){
  if(positivX === roundedCoords.x ){
    return;
  }else if(roundedCoords.x < 0 ){
    positivX = roundedCoords.x * -1;
  }else{
    positivX = roundedCoords.x;
  }
  cuttedX = +positivX.toString().split('').pop();
}

var $compassX = document.querySelector('#compass-x');
var $compassViewportX = $compassX.querySelector('.viewport');
var $meterX = $compassViewportX.querySelector('.meter');

$compassViewportX.append( $meterX.cloneNode(true) );
$compassViewportX.append( $meterX.cloneNode(true) );
$compassViewportX.append( $meterX.cloneNode(true) );
$compassViewportX.append( $meterX.cloneNode(true) );
$compassViewportX.append( $meterX.cloneNode(true) );

function updateCompass(){
  cutXto10();
  $compassViewportX.style.transform = 'translateX('+( ( cuttedX ) * -2 )+'%)';
}






//************************************************** */
//**************     UPDATE VIEW     *************** */
//************************************************** */




function updateView( movementX, movementY, invert ){
  if( invert === true ){
    currentViewCoords.x = currentViewCoords.x + movementX / 10 * -1;
    currentViewCoords.y = currentViewCoords.y + movementY / 10 * 1;
  }else{
    currentViewCoords.x = currentViewCoords.x + movementX / 10 * 1;
    currentViewCoords.y = currentViewCoords.y + movementY / 10 * -1;
  }

  currentViewCoords.x = xLimit( currentViewCoords.x );
  currentViewCoords.y = yLimit( currentViewCoords.y );

  focusImage( currentViewCoords.x, currentViewCoords.y );
	updateAxis( currentViewCoords.x, currentViewCoords.y );
  roundCoords();
  updateInfo();
  updateCompass();
}


function rotateByScroll(input){
  var movementX = input.deltaX,
      movementY = input.deltaY;

  updateView(movementX, movementY);
}



function setTouchInput( e ){
  var input = e.changedTouches.item(0);

  currentTouchX = input.clientX;
  currentTouchY = input.clientY;
}



function rotateByTouch( e ){
  var input = e.changedTouches.item(0);

  var movementX = 0 - currentTouchX + input.clientX;
  var movementY = 0 - currentTouchY + input.clientY;
  
  currentTouchX = input.clientX;
  currentTouchY = input.clientY;

  updateView(movementX, movementY, true);
}



function rotateByMouse(input){
  var movementX = input.movementX || input.mozMovementX || input.webkitMovementX || 0,
      movementY = input.movementY || input.mozMovementY || input.webkitMovementY || 0;

  updateView(movementX, movementY);
}



function getSrollInput(e){
	rotateByScroll( e );
	event.preventDefault();
}

function getPointerInput(e){
  rotateByMouse(e);
	event.preventDefault();
}

function getTouchInput( e ){
  rotateByTouch( e );
	event.preventDefault();
}

var $floor = document.querySelector('.level');




/****************************************/
/**********   MOVE UP / DOWN   **********/
/****************************************/


var $level1 = document.querySelector('.level-1');
var $level2 = document.querySelector('.level-2');
var $level3 = document.querySelector('.level-3');


function focusY(){
  if( $canvas.classList.contains('first') ){
    if( currentViewCoords.y < 0 ){ // looking down
      $canvas.classList.remove('first');
      $canvas.classList.add('second');

      $level1.classList.remove('current-level');
      $level2.classList.add('current-level');
      $level3.classList.remove('current-level');
    }
  }

  else if( $canvas.classList.contains('second') ){
    
    if(  currentViewCoords.y >= 0 ){ // looking up
      $canvas.classList.add('first');
      $canvas.classList.remove('second');
  
      $level1.classList.add('current-level');
      $level2.classList.remove('current-level');
      $level3.classList.remove('current-level');
    }else{ // looking down
      $canvas.classList.add('third');
      $canvas.classList.remove('second');
        
      $level1.classList.remove('current-level');
      $level2.classList.remove('current-level');
      $level3.classList.add('current-level');
    }
  }

  else if( $canvas.classList.contains('third') ){
    if(  currentViewCoords.y >= 0 ){ // looking up
      $canvas.classList.remove('third');
      $canvas.classList.add('second');
        
      $level1.classList.remove('current-level');
      $level2.classList.add('current-level');
      $level3.classList.remove('current-level');
    }
  }

  $targets = document.querySelectorAll('.current-level .target');

  collectCurrentTargets();
  collectNotCurrentTargets();
}



function crosshairLocked(){
  $body.classList.add('cross-haired');
  focusY();
}



function crosshairUnlocked(){
  $body.classList.remove('cross-haired');
}




// pointer Lock
var havePointerLock = 'pointerLockElement' in document ||
  'mozPointerLockElement' in document ||
	'webkitPointerLockElement' in document;



if( isTouch !== true ){
  $body.addEventListener('click', function(){
    
    //works only on input gesture like click
    $crossHair.requestPointerLock = $crossHair.requestPointerLock || $crossHair.mozRequestPointerLock || $crossHair.webkitRequestPointerLock;
    
    // Ask the browser to lock the pointer
    $crossHair.requestPointerLock();
  });

  // Ask the browser to release the pointer
  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
  document.exitPointerLock();
}



var targetingThrottled;
targetingThrottled = throttle( isOverlapping, 100 ); // every 200ms


// mouse click and move
function lockView() {
  if(document.pointerLockElement === $crossHair ||
  document.mozPointerLockElement === $crossHair) {
    console.log('locked');
    document.addEventListener("mousemove", getPointerInput, false);
    document.addEventListener("mousemove",  targetingThrottled, false);
    
    crosshairLocked();
  } else {
    console.log('unlocked');
    document.removeEventListener("mousemove", getPointerInput, false);
    document.removeEventListener("mousemove", targetingThrottled, false);

    crosshairUnlocked();
  }
}



if ("onpointerlockchange" in document) {
  document.addEventListener('pointerlockchange', lockView, false);
} else if ("onmozpointerlockchange" in document) {
  document.addEventListener('mozpointerlockchange', lockView, false);
}


// for touch devices only
document.addEventListener('touchstart', setTouchInput);
document.addEventListener('touchmove', getTouchInput);
document.addEventListener('touchmove', targetingThrottled, false);
document.addEventListener('touchend', getTouchInput);

// on scroll
$canvas.addEventListener("wheel", getSrollInput, false);
$canvas.addEventListener("wheel", targetingThrottled, false);


