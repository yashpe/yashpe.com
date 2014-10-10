$(function(){
  // $('.frame ul.slidee li').on('load', 'img', function() {console.log(this)});

  var win = $(window);
  var frame = $('.frame');
  var slidee = $('.frame .slidee');
  var locations = $('.locations');
  var main_container = $('.main_container');
  var welcome_message = $('.welcome_message');
  var audio = $('#mplayer audio')[0];
  var arrows = $('.arrow');
  var body = $('body');
  var timeout;

  window.onbeforeunload = function() {
    return "לצאת?";
  };

  // jump_to_loc_by_hash = function() {
  //   if (window.location.hash != '') {
  //     var np = frame.find('li[data-location="' + window.location.hash.replace("#","") + '"]').first();
  //     if (np[0]) {
  //       setTimeout(function() { jump_to(np) }, 3000);
  //     }

  //   }
  // }
  welcome = function() {
    if (localStorage.getItem('been_here') == 'true' && window.location.hash != '#d') {
      main_container.show();
      welcome_message.hide();
      arrows.show();
      audio.play();
    } else {
      localStorage.setItem('been_here', 'true');
      welcome_message.on('click', function() {
        main_container.show();
        arrows.show();
        welcome_message.addClass('animated bounceOutRight');
        audio.play();
      });
    }
  };

  do_load = function() {
    var nop = $('.frame ul.slidee li.preloaded').first();
    // console.log('load');
    single_photo_lazy_loader(nop);
  }
  var single_photo_lazy_loader = function(e) {

    if (e[0] == undefined || !e.hasClass('preloaded')) {
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
        e.removeClass('preloaded');
        window.do_load();
      } else if (src) {
        var big_img = $('<img src="' + src + '" class="photo" />');
        big_img.on('load', function(){ 
          $img.replaceWith(big_img);
          e.removeClass('preloaded');
          window.do_load();
        });
      }
      e.removeClass('preloaded');
    } else {
      window.do_load();
    }
  }

  do_load();

  var lazy_loader = function(e) {
    var $this = $(e);

    single_photo_lazy_loader($this);
    single_photo_lazy_loader($this.next());
    single_photo_lazy_loader($this.next().next());
    single_photo_lazy_loader($this.prev());
    single_photo_lazy_loader($this.prev().prev());

    $('.locations ul.slidee li[data-location=' + $this.attr('data-location') +']').addClass('selected').siblings().removeClass('selected');

    // window.location.hash = $this.attr('data-location');
    console.log($this[0]);
    $this.addClass('selected').siblings().removeClass('selected');
  };


  var jump_to = function(new_pos) {
    lazy_loader(new_pos);
    $(new_pos).scrollToPos()
  }

  body.on('mousedown', '.arrow', function() {
    var that = $(this),
        dir = that.hasClass('left_arrow') ? 'next' : 'prev',
        jumper = function() {
          jump_to($('.frame ul.slidee li.selected')[dir]());
        };
    jumper();
    timeout = setInterval(jumper, 900);
  });

  body.on('mouseup', function() {
    clearInterval(timeout);
  })

  body.on('mouseout', function() {
    clearInterval(timeout);
  })


  if (top.location.href.indexOf('www.yashpe.com/kalev') > -1) { // production
    $('.frame .slidee li img[title!=""]').attr('title','');
  }

  slidee.on('click', 'li', function(){
    var video = $(this).find('video[data-video-click-to-play=TRUE]')
    if (video[0]) {
      video.attr('controls', 'controls');
      audio.pause();
      video[0].onended = function(e) {
        audio.play();
      }
      video[0].play();
    }
    jump_to($(this));
  })
    
	locations.on('click', 'li[data-location]', function(e){
	  var new_pos = $('.frame li[data-location=' + $(this).attr('data-location') + ']').first();
    jump_to(new_pos);
	});

  slidee.on('mouseenter touchmove', 'li', function(){ lazy_loader(this) });

  $(document).keydown(function(e) {
    if (e.keyCode == 37 || e.keyCode == 38) { // left
      e.preventDefault();
      jump_to($('.frame ul.slidee li.selected').next());

    } else if(e.keyCode == 39 || e.keyCode == 40) { // right
      e.preventDefault();
      jump_to($('.frame ul.slidee li.selected').prev());
    }
  });

  var scrollPace = 40;
  if (navigator.appVersion.indexOf("Mac")!=-1) {
    scrollPace = 1;
  }
  frame.on('mousewheel', function(event) {
    event.preventDefault();
    win.scrollLeft(win.scrollLeft() + (event.deltaX - event.deltaY) * scrollPace);
  });

  welcome();

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

if (top.location.href.indexOf('www.yashpe.com/kalev') > -1) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-54999453-1', 'auto');
  ga('send', 'pageview');  
}


