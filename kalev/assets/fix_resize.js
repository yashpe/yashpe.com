$(function(){
  var el = $('.slidee ')[0];
  
  $(window).on('resize.repaint', _.throttle( doRepaint, 500));

  function doRepaint(){
    el.style.fontSize = '1px';
    document.documentElement.style.height = '0';
    setTimeout(function(){
      el.removeAttribute('style');
      document.documentElement.style.height = '100%';
    },50);
  }
  
  setTimeout(doRepaint,0);
});
