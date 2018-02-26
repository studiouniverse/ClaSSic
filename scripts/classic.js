
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
  var $fadeEls = $(["[data-fade]"]);

  function checkFaders() {
    $fadeEls.forEach(function($fader) {
      var bounds = $fader.getBounds();

      if (bounds.top < 0) {
        $fader.classList.add("fading");
        $fader.classList.add("faded");
      } else if (bounds.top >= 0 && bounds.top + (bounds.height / 2) <= $.screenHeight) {
        $fader.classList.add("fading");
      }
    });

    $fadeEls = $(["[data-fade]:not(.fading)"]);
  }

  checkFaders();

  $.addUpdate({
    updateOnScroll: true,
    draw: function() {
      checkFaders();
    }
  });
})();

// -- Group carousels

(function() {
  $([".group.carousel"]).forEach(function($el) {

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