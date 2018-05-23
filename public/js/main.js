$(document).ready(function() {
	//Realtime drag & drop functionality on the admin/page Dashboard
	$(".sorting > tbody").sortable({
		items: "tr:not('.home')",
		placeholder: "ui-state-hightlight",
		update: function() {
			var ids = $("tbody").sortable("serialize");
			var url = "/admin/pages/reorder-pages";

			$.post(url, ids);
		}
	});
	
	//Page deletion confirmation, when on the admin/page Dashboard
	$(".confirm-deletion").on("click", function() {
		console.log("confirm test");
		// if this confirm prompt is NOT confirmed, then the the function returns "false", and defualts to contining on to the backend/router (, and thus deleting the page).
		if(!confirm("Are you sure you wish to delete this?")) return false;
	});

	// //Cart Clearing /Deletion confirmation, when on the admin/page Dashboard
	// $(".cart-deletion").on("click", function() {
	// 	// if this confirm prompt is NOT confirmed, then the the function returns "false", and defualts to contining on to the backend/router (, and thus deleting the page).
	// 	if(!confirm("Are you sure you wish to clear your cart?")) return false;
	// });

	if ($("data.fancybox").length) {
		$("data-fancbox").fancybox();
	}

	//CkEditor enabler, for both the Edit-page and Add-page Text-Area enhancers
	if ($("textarea#text-area").length) {
		//replace the textarea elemnt with the CKEditor, by reference to ID (no need to include the "#" symbol).
		CKEDITOR.replace("text-area");
	}


//Logic for the Coverr Homepage Video (functionality):
//========================================================
	scaleVideoContainer();

	initBannerVideoSize('.video-container .poster img');
	initBannerVideoSize('.video-container .filter');
	initBannerVideoSize('.video-container video');

	$(window).on('resize', function() {
	    scaleVideoContainer();
	    scaleBannerVideoSize('.video-container .poster img');
	    scaleBannerVideoSize('.video-container .filter');
	    scaleBannerVideoSize('.video-container video');
	});


	function scaleVideoContainer() {

	    var height = $(window).height() + 5;
	    var unitHeight = parseInt(height) + 'px';
	    $('.homepage-hero-module').css('height',unitHeight);

	}

	function initBannerVideoSize(element){

	    $(element).each(function(){
	        $(this).data('height', $(this).height());
	        $(this).data('width', $(this).width());
	    });

	    scaleBannerVideoSize(element);

	}

	function scaleBannerVideoSize(element){

	    var windowWidth = $(window).width(),
	    windowHeight = $(window).height() + 5,
	    videoWidth,
	    videoHeight;

	    // console.log(windowHeight);

	    $(element).each(function(){
	        var videoAspectRatio = $(this).data('height')/$(this).data('width');

	        $(this).width(windowWidth);

	        if(windowWidth < 1000){
	            videoHeight = windowHeight;
	            videoWidth = videoHeight / videoAspectRatio;
	            $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});

	            $(this).width(videoWidth).height(videoHeight);
	        }

	        $('.homepage-hero-module .video-container video').addClass('fadeIn animated');

	    });
	}

});