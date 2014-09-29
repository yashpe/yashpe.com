$(function(){
  window.onbeforeunload = function() {
    return "לצאת?";
  };

  var single_photo_lazy_loader = function(e) {

    if (e[0] == undefined) { 
      return false;
    }
    var $this = e, 
        $img = $this.find('img.photo');

    if ($img[0]) {
      var video = $img.attr('data-video'),
          src   = $img.attr('data-src');
      if (video) {
        var sources = '<source src="' + video.replace('.mp4','.webm') + '" type="video/webm"><source src="' + video.replace('.mp4','.theora.ogv') + '" type="video/mp4">';

        if ($img.attr('data-video-click-to-play')) {
          var video_html = '<video data-video-click-to-play="TRUE" height="100%" poster="' + src + '">' + sources + '</video>';
        } else {
          var video_html = '<video height="100%" autoplay loop>' + sources +'</video>';
        }

        $this.append(video_html);
        $img.attr({'data-video': '', 'data-src': ''});
      } else if (src) {
        $img.attr({src: src});
      }

    }
    
  }
  var lazy_loader = function(e) {
    var $this = $(e);

    single_photo_lazy_loader($this);
    single_photo_lazy_loader($this.next());
    single_photo_lazy_loader($this.next().next());
    single_photo_lazy_loader($this.prev());
    single_photo_lazy_loader($this.prev().prev());

    $('.locations ul.slidee li[data-location=' + $this.attr('data-location') +']').addClass('selected').siblings().removeClass('selected');
    $this.addClass('selected').siblings().removeClass('selected');
  };


  var jump_to = function(new_pos) {
    lazy_loader(new_pos);
    $(new_pos).scrollToPos()
  }

  jump_to($('.frame li.selected'))

  var frame = $('.frame');
  var slidee = $('.frame .slidee');
  var subjects = $('.subjects .slidee');
  var locations = $('.locations');

  var production = top.location.href.indexOf('yashpe.com/kalev') > -1;

  if (production) {
    $('.frame .slidee li img[title!=""]').attr('title','');
  }
  slidee.on('click', 'video[data-video-click-to-play=TRUE]', function(){
    $(this).attr('controls', 'controls');
    $('#mplayer audio')[0].pause();
    this.onended = function(e) {
      $('#mplayer audio')[0].play();
    }
    this.play();
  });
    
	locations.on('click', 'li', function(e){
	  var new_pos = $('.frame li[data-location=' + $(this).attr('data-location') + ']').first();
    jump_to(new_pos);
	});

  slidee.on('mouseenter ontouchstart', 'li', function(){ lazy_loader(this) });

  $(document).keydown(function(e) {
    if (e.keyCode == 37 || e.keyCode == 38) { // left
      e.preventDefault();
      jump_to($('.frame ul.slidee li.selected').next());

    } else if(e.keyCode == 39 || e.keyCode == 40) { // right
      e.preventDefault();
      jump_to($('.frame ul.slidee li.selected').prev());
    }
  });

  var win = $(window);

  frame.on('mousewheel', function(event) {
    event.preventDefault();
    win.scrollLeft(win.scrollLeft() - event.deltaY + event.deltaX)
  });

});

// fix resizing
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

// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
// ga('create', 'UA-54999453-1', 'auto');
// ga('send', 'pageview');


