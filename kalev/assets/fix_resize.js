$(function(){
  var el = $('.slidee ')[0];
  
  $(window).on('resize.repaint', _.throttle( doRepaint, 500));

  function doRepaint(){
    el.style.fontSize = '1px';
    document.documentElement.style.height = '0';
    setTimeout(function(){
      el.removeAttribute('style');
      document.documentElement.style.height = '100%';
      setTimeout(function(){
        $('.frame').scrollLeft($('.frame').scrollLeft() + $('.frame div.selected').position().left);
      }, 250);
      if (window.repaint_callback) window.repaint_callback();
    },50);
  }
  
  setTimeout(doRepaint,0);
});
