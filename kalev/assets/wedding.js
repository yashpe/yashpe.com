$(function(){
  // $('.frame ul.slidee li').on('load', 'img', function() {console.log(this)});

  var win = $(window);
  var frame = $('.frame');
  var slidee = $('.frame .slidee');
  var locations = $('.locations');
  var welcome_message = $('.welcome_message');
  var audio = $('#mplayer audio')[0];
  var arrows = $('.arrow');
  var body = $('body');
  var timeout;

  window.main_container = $('.main_container');

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
      audio.play();
    } else {
      localStorage.setItem('been_here', 'true');
      welcome_message.on('click', function() {
        main_container.show(function() {
          welcome_message.addClass('animated bounceOutRight');
        });
        audio.play();
      });
    }
  };

  welcome();

  // do_load = function() {
  //   var nop = $('.frame ul.slidee li.preloaded').first();
  //   // console.log('load');
  //   single_photo_lazy_loader(nop);
  // }
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
        // window.do_load();
      } else if (src) {
        var big_img = $('<img src="' + src + '" class="photo" />');
        big_img.on('load', function(){ 
          $img.replaceWith(big_img);
          e.removeClass('preloaded');
          // window.do_load();
        });
      }
      e.removeClass('preloaded');
    } else {
      // window.do_load();
    }
  }

  // do_load();
  var lazy_loader = function(e) {
    var $this = $(e);

    single_photo_lazy_loader($this);
    single_photo_lazy_loader($this.next());
    single_photo_lazy_loader($this.next().next());
    single_photo_lazy_loader($this.prev());
    single_photo_lazy_loader($this.prev().prev());

    $('.locations ul.slidee li[data-location=' + $this.attr('data-location') +']').addClass('selected').siblings().removeClass('selected');

  } 

  var jump_to = function(new_pos) {
    var $n = $(new_pos);

    lazy_loader($n);

    $n.addClass('selected').siblings().removeClass('selected');
    
    if (window.change_selected_callback) window.change_selected_callback();
    
    setTimeout(function() {
      $n.scrollToPos();
    }, 200);

  }

  body.on('mousedown', '.arrow', function() {
    var that = $(this),
        dir = that.hasClass('left_arrow') ? 'next' : 'prev',
        jumper = function() {
          console.log('jumper')
          jump_to($('.frame .slidee > div.selected')[dir]());
        };
    jumper();
    timeout = setInterval(jumper, 700);
  });

  body.on('mouseup', function() {
    clearInterval(timeout);
  })

  body.on('mouseout', function() {
    clearInterval(timeout);
  })


  if (top.location.href.indexOf('www.yashpe.com/kalev') > -1) { // production
    $('.frame .slidee img[title!=""]').attr('title','');
  }

  slidee.on('click', 'div', function(){
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
	  var new_pos = $('.frame [data-location=' + $(this).attr('data-location') + ']').first();
    jump_to(new_pos);
	});

  slidee.on('mouseenter touchmove', 'div', function(){ lazy_loader(this) });
  
  var keyCodeToDirection = {37: 'next', 38: 'next', 39: 'prev', 40: 'prev'};
  
  $(document).keydown(function(e) {
    if (dir = keyCodeToDirection[e.keyCode]) {
      e.preventDefault();
      jump_to($('.frame .slidee > div.selected')[dir]());
    }
  });

  var scrollPace = 40;
  if (navigator.appVersion.indexOf("Mac")!=-1) {
    scrollPace = 1;
  }
  
  var signToDir = {1: 'prev', '-1': 'next'};
  
  $(document).on('mousewheel', function(event) {
    event.preventDefault();

    var delta = event.deltaX - event.deltaY,
        sign = delta > 0 ? 1 : delta == 0 ? 0 : -1,
        dir = signToDir[sign],
        final_pos_by_scroll = frame.scrollLeft() + delta,
        selected = $('.frame .slidee > div.selected'),
        new_selected = selected,
        new_pos,
        final_pos;
    if (dir == undefined) return false;

    if (new_selected[dir]()) {
      do {
        new_selected = new_selected[dir]();
        new_pos = new_selected.position();
        final_pos = frame.scrollLeft() + new_pos.left;
      } while ((dir == 'next' && final_pos_by_scroll < final_pos) || (dir == 'prev' && final_pos_by_scroll > final_pos));
      

      frame.scrollLeft(final_pos_by_scroll);
      if (window.koko) clearTimeout(window.koko);
      window.koko = setTimeout(function(){
        jump_to(new_selected)
      }, 300);
    }
    // frame.scrollLeft(frame.scrollLeft() + (event.deltaX - event.deltaY));
    
  });


});

if (top.location.href.indexOf('www.yashpe.com/kalev') > -1) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-54999453-1', 'auto');
  ga('send', 'pageview');  
}


