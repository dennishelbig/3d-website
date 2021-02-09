/* jshint devel: true */
/* jshint undef: true, unused: false */
/*globals TimelineMax, gsap, _, Linear, Sine, SuperGif, Freezeframe */
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
  var $mediaContainer = document.createElement('div');
  var $fullscreen = document.createElement('div');
  var $rect = document.createElement('div');
  
  var $video = document.createElement('video');
  var $source = document.createElement('source');

  $target.classList.add('target');
  $mediaContainer.classList.add('media-container');
  $rect.classList.add('rect');
  $fullscreen.classList.add('fullscreen');


  /*************************************************** */
  /******************  ADD VIDEOS  ******************* */
  /*************************************************** */

  if( i < 6){
    $source.setAttribute('src', 'img/mp4/1/'+ ( i + 1 ) +'.mp4');
    $video.setAttribute('video-number', i);
    $video.setAttribute('loop', '1');
    $video.setAttribute('muted', '1');
  }
  if( i >= 6 && i < 12 ){
    $source.setAttribute('src', 'img/mp4/2/'+ ( i - 5 ) +'.mp4');
    $video.setAttribute('video-number', i);
    $video.setAttribute('loop', '1');
    $video.setAttribute('muted', '1');
  }

  $element.append($target);
  $element.append($mediaContainer);
  $element.append($rect);
  $element.append($fullscreen);

  $mediaContainer.append($video);
  $video.append($source);
});


/****************************************************** */
/***************  ADD UP DOWN BUTTONS  **************** */
/****************************************************** */

document.querySelectorAll('.wall').forEach(function( $element, i ){
  var $elevatorControls = document.createElement('div');

  var $elevatorUp = document.createElement('div');
  var $elevatorUpTop = document.createElement('div');

  var $elevatorDown = document.createElement('div');
  var $elevatorDownBottom = document.createElement('div');

  var $elevatorBackground = document.createElement('div');

  var $span = document.createElement('span');

  $elevatorBackground.classList.add('background');
  $elevatorControls.setAttribute('class', 'elevator-controls');
  $elevatorUp.setAttribute('class', 'elevator-up');
  $elevatorUpTop.setAttribute('class', 'elevator-up-top');
  $elevatorDown.setAttribute('class', 'elevator-down');
  $elevatorDownBottom.setAttribute('class', 'elevator-down-bottom');


  $elevatorControls.append($elevatorUp);
  $elevatorControls.append($elevatorDown);

  $elevatorUpTop.append( $elevatorBackground );
  $elevatorDownBottom.append( $elevatorBackground.cloneNode() );
  
  $element.append($elevatorControls);
  $element.append($elevatorUpTop);
  $element.append($elevatorDownBottom);

  function cloneSpan( string ){
    var $clone = $span.cloneNode();
    $clone.innerHTML = string;
    return $clone;
  }

  if( i < 6){
    $elevatorDownBottom.append( cloneSpan('websites') );
  }
  if( i >= 6 && i < 12 ){
    $elevatorUpTop.append( cloneSpan('animation') );
    $elevatorDownBottom.append( cloneSpan('illustration') );
  }else{
    $elevatorUpTop.append( cloneSpan('websites') );

  }

  $elevatorUpTop.append( $elevatorBackground.cloneNode() );
  $elevatorDownBottom.append($elevatorBackground.cloneNode() );


  var buttonSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="495.5px" height="425.8px" viewBox="0 0 495.5 425.8" style="enable-background:new 0 0 495.5 425.8;" xml:space="preserve"><polygon class="st0" points="0,425.8 247.7,0 495.5,425.8"/></svg>';
  $elevatorUp.innerHTML = buttonSVG;
  $elevatorDown.innerHTML = buttonSVG;
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



var currentViewCoords = {
  x: 0,
  y: 0,
  xNulled: 0,
  yAdjusted: 0,
  yAdjustedCenter: 0,
  yAdjustedSide: 0
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


var roundedCoords = {
  x: 0,
  y: 0
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
var elevatorUpBool = null;
var elevatorDownBool = null;
var currentIndex = null;
var currentFloor = 1;
var focusArray_img = {
  top: 21,
  bottom: -21,
  left: -27, 
  right: 27,
  isFocus: false
};

/**********    LIMITS    ************/ 
var limit_img = {
  top: 21,
  bottom: -21,
  left: -25, 
  right: 25 
};

var elevator_up_limit = {
  top: 7,
  bottom: 1,
  left: 26, 
  right: -26 
};

var elevator_down_limit = {
  top: -1,
  bottom: -7,
  left: 26, 
  right: -26 
};

var elevator_up_top_limit = {
  // topMin:25,
  // topMax: 29,
  top: 27,
  bottom: 22, 
  // bottomMin: 19,
  // bottomMax: 22,
  // left: -30, 
  // right: 30 
};

var elevator_down_bottom_limit = {
  top: -22,
  bottom: -27,
  // left: -30, 
  // right: 30 
};
/**********    LIMITS END   ************/ 







function nullX(){
  var x = currentViewCoords.x;
  brakePoints.forEach( function(){
    if( x > 60  ){
      x = x - 60;
    }
  });

  if( x > 30 ){
    x = x - 60;
  }
  currentViewCoords.xNulled = x;

  if( x < 0 ){
    currentViewCoords.xNulledpositiv = x * -1;
  }else{
    currentViewCoords.xNulledpositiv = x;
  }
  return x;
}



function processFocus( focusArray, x, y ){
  var nulledX = nullX( x );
  focusArray.yAdjusted = ( nulledX < 0 ) ? nulledX * -1 / 10 : nulledX / 10; 

  if( 
    y <= ( focusArray.top - focusArray.yAdjusted ) && 
    y >= ( focusArray.bottom + focusArray.yAdjusted ) && 
    nulledX >= focusArray.left && 
    nulledX <= focusArray.right 
  ){
    focusArray.isFocus = true;
  }else{
    focusArray.isFocus = false;
  }

  return focusArray; 
}


function addCurrentXtoBody(){
  if( !$body.classList.contains( 'current-index-' + currentIndex ) ){
    for ( var walls = 0; walls < 6; walls++ ) {
      $body.classList.remove( 'current-index-' + walls );
    }
    $body.classList.add( 'current-index-' + currentIndex );
  }

}



function adjustY(){
  currentViewCoords.yAdjusted = ( currentViewCoords.xNulled < 0 ) ? currentViewCoords.xNulled * -1 / 10 : currentViewCoords.xNulled / 10; 

  var ypc = (currentViewCoords.y > 0) ? 
    100 / 90 * ( 90 - currentViewCoords.y ) : 
    100 / 90 * ( 90 + currentViewCoords.y );

  var yAdjusted = currentViewCoords.y / 10;
  var maxX = 30;
  var xpcToCenter = 100 / 30 * ( maxX - currentViewCoords.xNulledpositiv );
  var xpcToSide = 100 / 30 * currentViewCoords.xNulledpositiv;

  var yOffsetCenter = (9 - ( 9 / 100 * ypc)) / 100 * xpcToCenter; // 9 === max y Adjust


  // currentViewCoords.yAdjustedCenter = currentViewCoords.y - (yAdjusted / 100 * xpcToCenter);
  currentViewCoords.yAdjustedCenter = currentViewCoords.y - (yAdjusted / 100 * xpcToCenter);
  currentViewCoords.yAdjustedSide = currentViewCoords.y + ( yAdjusted / 100 * ( xpcToSide / 100 * ypc));
  // elevator_up_top_limit.top 

  // console.log(currentViewCoords.yAdjustedCenter);
  // console.log(yOffsetCenter);

  // console.log( currentViewCoords.yAdjusted );
  // console.log( currentViewCoords.yAdjusted );
}




var $videos = document.querySelectorAll('video');

function playPauseVideo(){
  $videos.forEach(function($video, i){
    if( i === currentIndex && currentFloor === 1 && focusBool === true ){
      if( $video.paused ) {
        $video.play();
        // console.log(currentIndex);
        // console.log(currentFloor);
      }
    }
    else if( ( i - 6)  === currentIndex && currentFloor === 2 && focusBool === true ){
      if( $video.paused ) {
        $video.play();
        // console.log(currentIndex);
        // console.log(currentFloor);
      }
    }else{
      if( !$video.paused ) {
        $video.pause();
      }
    }
  });
}

function highlightElevatorButtons(){
  $body.classList.toggle('elevator-up-active', elevatorUpBool === true );
  $body.classList.toggle('elevator-down-active', elevatorDownBool === true );
}


function focusElevatorButtons(){
  if(  
    currentViewCoords.y <= ( elevator_up_limit.top ) && 
    currentViewCoords.y >= ( elevator_up_limit.bottom ) && 
    (
      ( currentViewCoords.xNulled ) >= elevator_up_limit.left || 
      ( currentViewCoords.xNulled ) <= elevator_up_limit.right
    ) 
  ){
    // console.log('up');
    elevatorUpBool = true;
  }else{
    elevatorUpBool = false;
  }



  if(  
    currentViewCoords.y <= ( elevator_down_limit.top ) && 
    currentViewCoords.y >= ( elevator_down_limit.bottom ) && 
    (
      ( currentViewCoords.xNulled ) >= elevator_down_limit.left || 
      ( currentViewCoords.xNulled ) <= elevator_down_limit.right
    )
  ){
    elevatorDownBool = true;
    // console.log('down');
  }else{
    elevatorDownBool = false;
  }



  if( 
    currentViewCoords.yAdjustedCenter <= ( elevator_up_top_limit.top ) && 
    currentViewCoords.yAdjustedCenter >= ( elevator_up_top_limit.bottom )
  ){
    elevatorUpBool = true;
    $body.classList.add('elevator-top-active');
  }else{
    elevatorUpBool = false;
    $body.classList.remove('elevator-top-active');
  }



  if(
    currentViewCoords.yAdjustedCenter <= ( elevator_down_bottom_limit.top ) && 
    currentViewCoords.yAdjustedCenter >= ( elevator_down_bottom_limit.bottom )
  ){
    elevatorDownBool = true;
    $body.classList.add('elevator-bottom-active');
  }else{
    elevatorDownBool = false;
    $body.classList.remove('elevator-bottom-active');
  }

  
}



var waiting = false;     

function focusImage( x, y ){
  nullX();
  adjustY();  

  currentIndex = focusX( x );
  
  if( 
    currentViewCoords.y <= ( limit_img.top - currentViewCoords.yAdjusted ) && 
    currentViewCoords.y >= ( limit_img.bottom + currentViewCoords.yAdjusted ) && 
    currentViewCoords.xNulled >= limit_img.left && 
    currentViewCoords.xNulled <= limit_img.right 
  ){
    document.body.classList.add('background-black');
    focusBool = true;
  }else{
    document.body.classList.remove('background-black');
    focusBool = false;
  }

  

  // console.log(currentIndex);


  if (!waiting) {    
    playPauseVideo(); 
    focusElevatorButtons(); 
    highlightElevatorButtons();  
    addCurrentXtoBody();               // If we're not waiting
    // playPauseGifs()                 ;  // Execute users function
    waiting = true;                   // Prevent future invocations
    setTimeout(function () {          // After a period of time
        waiting = false;              // And allow future invocations
    }, 100);
  }
}


var currentTouchX = 0;
var currentTouchY = 0;

var $crossHair = document.querySelector('#cross-hair');
var $targets = document.querySelectorAll('.current-level .target');


function isOverlapping(){
  if( focusBool === true && !$targets[currentIndex].classList.contains('focus') ){

    $targets[currentIndex].classList.add('focus');
    $targets[currentIndex].parentNode.parentNode.classList.add('focus');
    $crossHair.classList.add('over');
  }


  if(focusBool !== true){
    $targets[currentIndex].classList.remove('focus');
    $targets[currentIndex].parentNode.parentNode.classList.remove('focus');
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


function elevator_1_to_2(){
  $canvas.classList.remove('first');
  $canvas.classList.add('second');

  $level1.classList.remove('current-level');
  $level2.classList.add('current-level');
  $level3.classList.remove('current-level');
  currentFloor++;
}

function elevator_2_to_1(){
  $canvas.classList.add('first');
  $canvas.classList.remove('second');

  $level1.classList.add('current-level');
  $level2.classList.remove('current-level');
  $level3.classList.remove('current-level');
  currentFloor--;
}

function elevator_2_to_3(){
  $canvas.classList.add('third');
  $canvas.classList.remove('second');
    
  $level1.classList.remove('current-level');
  $level2.classList.remove('current-level');
  $level3.classList.add('current-level');
  currentFloor++;
}

function elevator_3_to_2(){
  $canvas.classList.remove('third');
  $canvas.classList.add('second');
  currentFloor--;
  $level1.classList.remove('current-level');
  $level2.classList.add('current-level');
  $level3.classList.remove('current-level');
}



function moveElevator(){

  console.log(elevatorUpBool);

  if( elevatorUpBool === true ){
    console.log('up button');
  }
  if( elevatorDownBool === true ){
    console.log('down button');
  }



  if( $canvas.classList.contains('first') ){
    if( elevatorDownBool === true ){ // looking down
      elevator_1_to_2();
    }
  }

  else if( $canvas.classList.contains('second') ){
    
    if(  elevatorUpBool === true ){ // looking up
      elevator_2_to_1();

    }else if(elevatorDownBool === true){ // looking down
      elevator_2_to_3();
    }
  }

  else if( $canvas.classList.contains('third') ){
    if(  elevatorUpBool === true ){ // looking up
      elevator_3_to_2();
    }
  }

  $targets = document.querySelectorAll('.current-level .target');

  collectCurrentTargets();
  collectNotCurrentTargets();
}



function crosshairLocked(){
  $body.classList.add('cross-haired');
  moveElevator();
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
    // console.log('locked');
    document.addEventListener("mousemove", getPointerInput, false);
    document.addEventListener("mousemove",  targetingThrottled, false);
    
    crosshairLocked();
  } else {
    // console.log('unlocked');
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


