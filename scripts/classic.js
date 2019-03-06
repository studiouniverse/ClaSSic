
// -- Click toggles

(function() {

  var $ = window.___$hermes;

  $(["[data-toggle]"]).forEach(function($el) {
    var toggleSelector = $el.attr("data-toggle");
    var $toggleEl = $([toggleSelector]);
    var toggleType = $el.attr("data-toggle-class") ? "class" : "none";
    var toggleData = $el.attr("data-toggle-class");

    $el.on("click", function() {
      if (toggleType === "class") {
        if ($el.hasClass("toggled")) {
          $toggleEl.addClass(toggleData);
          $el.removeClass("toggled");
        } else {
          $toggleEl.removeClass(toggleData);
          $el.addClass("toggled");
        }
      }
    });
  });
})();

// -- Horizontal layout click & drag

(function() {

  var $ = window.___$hermes;

  $([".layout-horizontal .group"]).forEach(function($el) {

    var $horizontalMouseDown = false,
    $horizontalMouseStart = false,
    $horizontalMouseStartX = false,
    $horizontalMouseStartScrollX = false,
    $horizontalMouseInterval = false;

    $el.on("scroll", function() {
      if (!$el.hasClass("scrolled")) {
        if ($el.scrollLeft > $.screenWidth * 0.15) {
          $el.addClass("scrolled");
        }
      }
    }).on("mousedown", function(e) {
      clearInterval($horizontalMouseInterval);

      $el.addClass("scrolling");

      $horizontalMouseDown = true;
      $horizontalMouseStartScrollX = $el.scrollLeft;
      $horizontalMouseStartX = $horizontalMouseStartScrollX + e.clientX;
    }).on("mousemove", function(e) {
      if ($horizontalMouseDown && $horizontalMouseStartX) {
        $el.scrollLeft = $horizontalMouseStartX - e.clientX;

        if (!$horizontalMouseStart) {
          $horizontalMouseStart = Date.now();
        }
      }
    }).on("mouseup mouseleave", function() {
      if ($horizontalMouseDown) {
        if ($horizontalMouseStartX) {
          var $horizontalMouseTime = Date.now() - $horizontalMouseStart;
          var $horizontalMouseDistance = $el.scrollLeft - $horizontalMouseStartScrollX;
          var $horizonalMouseDirection = $horizontalMouseDistance < 0 ? -1 : 1;
          var $horizontalMouseVelocity = Math.min(2.5, Math.abs($horizontalMouseDistance) / $horizontalMouseTime);


          if ($horizontalMouseVelocity > 0.7 && Math.abs($horizontalMouseDistance) > 55) {
            clearInterval($horizontalMouseInterval);

            $horizontalMouseVelocity *= $horizontalMouseVelocity;
            $horizontalMouseVelocity *= $horizontalMouseVelocity;
            var goalVelocity = 8, shift = 0.6;
            $horizontalMouseVelocity = $horizontalMouseVelocity - (($horizontalMouseVelocity - goalVelocity) * shift);

            $horizontalMouseInterval = setInterval(function() {
              $el.scrollLeft = $el.scrollLeft + ($horizontalMouseVelocity * $horizonalMouseDirection);
              $horizontalMouseVelocity -= 0.25;
              if ($horizontalMouseVelocity <= 0) {
                clearInterval($horizontalMouseInterval);
              }
            }, $.interval);
          }
        }

        $horizontalMouseStartX = false;
        $horizontalMouseDown = false;
        $horizontalMouseStart = false;
      }

      $el.removeClass("scrolling");
    });

  });
})();

// -- Scroll fade in

(function() {

  var $ = window.___$hermes;

  function checkFaders() {
    var $fadeEls = $(["[data-fade-in]:not(.fading)"]);

    $fadeEls.forEach(function($fader) {
      var bounds = $fader.getBounds();
      var delay = parseInt($fader.attr("data-fade-delay") || 0);

      if (bounds.top < 0) {
        $fader.classList.add("fading");
        $fader.classList.add("faded");
      } else if (bounds.top >= 0 && bounds.top + (bounds.height / 2) <= $.screenHeight) {
        if (delay > 0) {
          setTimeout(function() {
            $fader.classList.add("fading");
          }, delay);
        } else {
          $fader.classList.add("fading");
        }
      }
    });
  }

  // checkFaders();

  $.addUpdate({
    updateOnScroll: true,
    interval: 100,
    draw: function() {
      checkFaders();
    }
  });
})();

// -- Google analytics scroll-in-view

(function() {

  var $ = window.___$hermes;

  function checkTrackers() {
    var $trackEls = $(["[data-track-scroll]"]);

    $trackEls.forEach(function($tracker) {
      var bounds = $tracker.getBounds();
      var id = $tracker.attr("data-track-scroll");

      if (bounds.top < 0) {
        window.ga('set', id, 'above-view');
      } else if (bounds.top >= 0 && bounds.top + (bounds.height / 2) <= $.screenHeight) {
        window.ga('set', id, 'in-view');
      }

      $tracker.attr("!data-track-scroll");
    });
  }

  if (window.ga) {
    checkTrackers();

    $.addUpdate({
      updateOnScroll: true,
      interval: 100,
      draw: function() {
        checkTrackers();
      }
    });
  }
})();

// -- Group carousels

(function() {

  var $ = window.___$hermes;

  $([".carousel"]).forEach(function($el) {

    var autoplay = $el.attr("data-autoplay") === "true";
    var delay = parseInt($el.attr("data-play-interval") || 5000);

    var $dots = $el.find([".carousel-controls-dots li"]);

    var $slidesLeft = $el.find([".slides-left .slide"]);
    var $slidesRight = $el.find([".slides-right .slide"]);

    if (!$slidesLeft || $slidesLeft.length == 0) {
      $slidesLeft = $el.find([".slides .slide"]);
    }

    var currentSlide = 0;
    var numSlides = $dots.length || $slidesLeft.length;

    $dots.forEach(function($dot, i) {
      $dot.on("click", function() {
        autoplay = false;
        goToSlide(i);
      });
    });

    $el.find([".carousel-arrow-left"]).on("click", function() {
      autoplay = false;
      prevSlide();
    });

    $el.find([".carousel-arrow-right"]).on("click", function() {
      autoplay = false;
      nextSlide();
    });

    function nextSlide() {
      var newSlide = currentSlide + 1;
      goToSlide(newSlide);
    }

    function prevSlide() {
      var newSlide = currentSlide - 1;
      goToSlide(newSlide);
    }

    function goToSlide(i) {
      if (i >= numSlides) {
        i = 0;
      }

      if (i < 0) {
        i = numSlides - 1;
      }

      currentSlide = i;

      $el.find([".slide.active", "li.active"]).removeClass("active");

      if ($slidesLeft[i]) $slidesLeft[i].addClass("active");
      if ($slidesRight[i]) $slidesRight[i].addClass("active");
      if ($dots[i]) $dots[i].addClass("active");
    }

    if (autoplay) {
      $.addUpdate({
        interval: delay,
        draw: function() {
          if (autoplay) {
            nextSlide();
          }
        }
      });
    }

  });
})();

// -- Carousel slide resizing

(function() {

  var $ = window.___$hermes;

  var $carousels = $([".carousel[data-resize='true']"]);

  function resizeSlides() {
    $carousels.forEach(function($holder) {
      var minHeight = 0;

      $holder.find([".slide > div"]).forEach(function($el) {
        var height = $el.getBounds().height;
        if (height > minHeight) {
          minHeight = height;
        }
      });

      if (minHeight) {
        $holder.find(".slides").style.height = (minHeight * 1.4) + "px";
      }
    });
  }

  resizeSlides();

  $.addUpdate({
    interval: 250,
    updateOnResize: true,
    draw: function() {
      resizeSlides();
    }
  });

})();

// -- Lazy loading

(function() {

  var $ = window.___$hermes;

  var $imgs = $(["[data-src]"]);
  if (!$imgs || $imgs.length === 0) {
    return;
  }

  var loadQueue = [];

  function loadPlaceholders() {
    var $tempImgs = $(["[data-src]"]);

    $tempImgs.forEach(function($img) {
      if (!$img.src || $img.src == "") {
        if ($img.nodeName.toLowerCase() === "img") {
          $img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
      }
    });
  }

  function checkQueue() {
    if (loadQueue && loadQueue.length > 0) {
      var $img = loadQueue.pop();
      var src = $img.attr("data-src");

      if (src && src !== "") {
        applySrc($img, src);
      } else {
        checkQueue();
      }
    }
  }

  function checkFigures() {
    $imgs = $(["[data-src]"]);

    $imgs.forEach(function($img) {
      var bounds = $img.getBounds();
      var src = $img.attr("data-src");

      if (bounds.top < 0 && bounds.top >= -($.screenHeight * 3)) {
        loadQueue.push($img);
      } else if (bounds.top >= 0 && bounds.top <= $.screenHeight) {
        applySrc($img, src);
      } else if (bounds.top >= 0 && bounds.top + (bounds.height / 2) <= $.screenHeight) {
        loadQueue.push($img);
      }
    });
  }

  function applySrc($img, src) {
    if (!$img.attr("data-src") || $img.attr("data-loading") == "true") {
      return;
    }

    if ($img.nodeName.toLowerCase() === "video") {
      $img.attr("data-loading", "true");
      setTimeout(function() {
        var $source = document.createElement("source");
        $source.type = $img.attr("data-type");
        $source.src = src;
        $img.attr("!data-src");
        $img.attr("!data-type");
        $img.attr("!data-loading");

        $img.append($source);
      }, 1000);
    } else {
      $img.attr("data-loading", "true");
      $img.src = src;
      $img.onload = function() {
        $img.attr("!data-src");
        $img.attr("!data-loading");
      }
    }
  }

  loadPlaceholders();

  $.addUpdate({
    interval: 250,
    draw: function() {
      checkFigures();
    }
  });

  $.addUpdate({
    interval: 200,
    draw: function() {
      checkQueue();
    }
  });
})();

// -- Stop video autoplay

(function() {

  var $ = window.___$hermes;

  var $videoEls = $(["video[autoplay]"]);

  function checkVideos() {
    $videoEls.forEach(function($video) {
      var bounds = $video.getBounds();

      if (bounds.bottom >= 0 && bounds.top <= $.screenHeight) {
        if (!$video.hasClass("playing")) {
          playVideo($video);
        }
      } else if (!$video.paused) {
        $video.pause();
        $video.removeClass("playing");
      }
    });
  }

  function playVideo($video) {
    try {
      $video.addClass("playing");
      var p = $video.play();

      if (p !== undefined) {
          p.catch(function() {
            $video.removeClass("playing");
          }).then(function() {
            // Auto-play started
          });
      }
    } catch(err) {
      $video.removeClass("playing");
    }
  }

  checkVideos();

  $.addUpdate({
    updateOnScroll: true,
    interval: 100,
    draw: function() {
      checkVideos();
    }
  });
})();
