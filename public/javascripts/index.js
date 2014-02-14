  jQuery(document).ready(function(){
    // Target your .container, .wrapper, .post, etc.
    jQuery(".video-container").fitVids();

	jQuery(".fancybox").fancybox();

	jQuery("#toTop").scrollToTop(1000);

	jQuery(".testimonials").owlCarousel({

    // Most important owl features
    items : 1,
    itemsCustom : false,
    itemsDesktop : [1199,1],
    itemsDesktopSmall : [980,1],
    itemsTablet: [768,1],
    itemsTabletSmall: false,
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,

    //Basic Speeds
    slideSpeed : 200,
    paginationSpeed : 800,
    rewindSpeed : 1000,

    //Autoplay
    autoPlay : true,
    stopOnHover : true

})

	jQuery(".owl-example").owlCarousel({

    // Most important owl features
    items : 2,
    itemsCustom : false,
    itemsDesktop : [1199,2],
    itemsDesktopSmall : [980,1],
    itemsTablet: [768,1],
    itemsTabletSmall: false,
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,

    //Basic Speeds
    slideSpeed : 200,
    paginationSpeed : 800,
    rewindSpeed : 1000,

    //Autoplay
    autoPlay : false,
    stopOnHover : false,

    // Navigation
    navigation : false,
    navigationText : ["prev","next"],
    rewindNav : true,
    scrollPerPage : false,

    //Pagination
    pagination : true,
    paginationNumbers: false,

    // Responsive 
    responsive: true,
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,

    // CSS Styles
    baseClass : "owl-carousel",
    theme : "owl-theme",

    //Lazy load
    lazyLoad : false,
    lazyFollow : true,
    lazyEffect : "fade",

    //Auto height
    autoHeight : true,

    //JSON 
    jsonPath : false, 
    jsonSuccess : false,

    //Mouse Events
    dragBeforeAnimFinish : true,
    mouseDrag : true,
    touchDrag : true,

    //Transitions
    transitionStyle : false,

    // Other
    addClassActive : false,

    //Callbacks
    beforeUpdate : false,
    afterUpdate : false,
    beforeInit: false, 
    afterInit: false, 
    beforeMove: false, 
    afterMove: false,
    afterAction: false,
    startDragging : false,
    afterLazyLoad : false

})

	jQuery(".navbar-fixed-top").headroom({
  "tolerance": 15,
  "offset": 100
});

	if(jQuery(window).width() >= 1025)
	jQuery(window).bind('scroll',function(e){
   		parallaxScroll();
   	});

   	function parallaxScroll(){
   		var scrolledY = jQuery(window).scrollTop();
		jQuery('.huge-title').css('bottom','-'+((scrolledY*0.55))+'px');
		jQuery('.container').css('top','-'+((scrolledY*0.50))+'px');
   	}	

	jQuery(window).scroll(function() {
        if(jQuery(window).width() >= 1024)
		jQuery('#phone').each(function(){
		var imagePos = jQuery(this).offset().top;

		var topOfWindow = jQuery(window).scrollTop();
			if (imagePos < topOfWindow+600) {
				jQuery(this).addClass("hatch");
			}
		});
	});

	jQuery(document).ready(function(){
  var didScroll = false;
  var icon = $(".huge-title, #godown");
  var $window = $(window);

  jQuery(window).scroll(function(){
      didScroll = true;
  });

  window.setInterval(function () {
    if (didScroll) {
      if (1-$window.scrollTop()/200 > -20) {
          icon.css({opacity: 1-$window.scrollTop()/500});
      }
      didScroll = false;
    }
  }, 50);
});


  });
