$(function(){
  window.addEventListener('load', function(){
   
   var box1 = $('.main_container')[0]
   var statusdiv = document.getElementById('statusdiv')
   var startx = 0
   var dist = 0
   var scrollingStartsAt;
   
   box1.addEventListener('touchstart', function(e){
    scrollingStartsAt = $('.frame').scrollLeft();
    var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
    startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
    // statusdiv.innerHTML = 'Status: touchstart<br /> ClientX: ' + startx + 'px'
    e.preventDefault()
   }, false)
   
   box1.addEventListener('touchmove', function(e){
    var touchobj = e.changedTouches[0] // reference first touch point for this event
    var dist = parseInt(touchobj.clientX) - startx
    // statusdiv.innerHTML = 'Status: touchmove<br /> Horizontal distance traveled: ' + dist + 'px'
    $('.frame').scrollLeft(scrollingStartsAt - dist * 3);
    e.preventDefault()
   }, false)
   
   // box1.addEventListener('touchend', function(e){
   //  var touchobj = e.changedTouches[0] // reference first touch point for this event
   //  // statusdiv.innerHTML = 'Status: touchend<br /> Resting x coordinate: ' + touchobj.clientX + 'px'
   //  e.preventDefault()
   // }, false)
   
  }, false)
  
});
