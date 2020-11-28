// --------------------------------------------------
// APP.JS
// --------------------------------------------------

(function($) {

  Drupal.behaviors.CUNYBehavior = {
    attach: function(context, settings) {

      /* Mobile Siebar Nav */
      $('.sidebar .left-navigation > ul.menu').tinyNav({
        header: 'More in this section'
      });

      /*** Wrapper ***/

      $("#main-menu .menu > li:has(ul) > a").addClass("has-children");

      $(".menu-toggle").click(function() {
        $(".navigation").slideToggle();
      });
      $(".search-toggle").click(function() {
        $(".google-cse").toggle();
      });



      enquire
        // Desktop
        .register("screen and (min-width:784px)", function() {
          $(".menu > li:has(ul) > a").unbind("click");
          $(".navbar-nav, .navbar-nav *").removeAttr("style").removeClass("has-children-active");

          var subMenu = $('.sub-menu-block');
          subMenu.prependTo('.header-top');

          var ctaBlock = $('.l-header__cta-block');
          ctaBlock.appendTo('.l-header__social-media');
          $('.block-search-form').appendTo('#main-menu .row');

          $(".navigation").show();


        })
        // Mobile & Tablet
        .register("screen and (max-width:783px)", function() {
          //mobileNavInit();

          $(".menu-name-main-menu > .menu > li:has(ul) > a").click(function(event) {
            event.preventDefault();
            $(this).toggleClass("has-children-active");
            $(this).siblings("ul").slideToggle();
          });

          var subMenu = $('.sub-menu-block');
          subMenu.appendTo('.navigation');

          var ctaBlock = $('.l-header__cta-block');
          ctaBlock.appendTo('.sub-menu-block .padded-row');
          $('.block-search-form').insertBefore('.l-header__mobile-menu');

        });



      $('.more-in-select').click(function() {
        $(this).toggleClass("more-in-select-active");
        $(this).siblings('ul').slideToggle();
      });

      /*** Home Page ***/

      $('.home-slider .field-items').once('cuny', function() {
        $(this).slick({
          dots: true,
          autoplay: true,
          pauseOnHover: false,
          autoplaySpeed: 10000,
        });

        $(this).append("<div class='slider-nav'></div>");
        $('.home-slider .slick-next, .home-slider .slick-prev').appendTo(".slider-nav");
        $('.home-slider .slick-dots').insertBefore(".home-slider .slick-next");

        $(this).find(".slider-nav").append("<div class='slider-pause'></div>");
        $(this).find('.slider-pause').on('click', function() {
          $('.home-slider .field-items').slick('slickPause');
          $(this).hide();
          $('.home-slider .field-items').find('.slider-play').show();
        });

        $(this).find(".slider-nav").append("<div class='slider-play'></div>");
        $(this).find('.slider-play').on('click', function() {
          $('.home-slider .field-items').slick('slickPlay');
          $(this).hide();
          $('.home-slider .field-items').find('.slider-pause').show();
        }).hide();
      });

    }
  };

})(jQuery);