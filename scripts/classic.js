
// -- Click toggles

(function() {
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
    });

  });
})();

// -- Scrolling sub-nav

(function() {

})();

// -- Scroll fade in

(function() {
  function checkFaders() {
    var $fadeEls = $(["[data-fade-in]:not(.fading)"]);

    $fadeEls.forEach(function($fader) {
      var bounds = $fader.getBounds();
      var delay = parseInt($fader.attr("data-fade-delay") || 0);

      if (bounds.top < 0) {
        if (delay > 0) {
          setTimeout(function() {
            $fader.classList.add("fading");
            $fader.classList.add("faded");
          }, delay);
        } else {
          $fader.classList.add("fading");
          $fader.classList.add("faded");
        }
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
    draw: function() {
      checkFaders();
    }
  });
})();

// -- Google analytics scroll-in-view

(function() {
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
      draw: function() {
        checkTrackers();
      }
    });
  }
})();

// -- Group carousels

(function() {
  $([".carousel"]).forEach(function($el) {

    var $dots = $el.find([".carousel-controls-dots li"]);
    var $slidesLeft = $el.find([".carousel-details .slide"]);
    var $slidesRight = $el.find([".carousel-images .slide"]);

    var currentSlide = 0;
    var numSlides = $dots.length;

    $dots.forEach(function($dot, i) {
      $dot.on("click", function() {
        goToSlide(i);
      });
    });

    $el.find([".carousel-arrow-left"]).on("click", function() {
      prevSlide();
    });

    $el.find([".carousel-arrow-right"]).on("click", function() {
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

      $slidesLeft[i].addClass("active");
      $slidesRight[i].addClass("active");
      $dots[i].addClass("active");
    }

  });
})();
