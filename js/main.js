$(function() {
	"use strict";
	/*jshint smarttabs:true */

	var imageBoxSrc;

	$('.imageBox').bind("click", function(event) {
		imageBoxSrc = $(this).attr('href');
		$('.lightbox-content > div').html('<img src="' + imageBoxSrc + '" />');
		$('.lightbox').addClass('show');
		return false;
	});

	$('.textBox').bind("click", function(event) {
		$('.lightbox-content > div').html('Lightbox content, share, off site link etc.');
		$('.lightbox').addClass('show');
		return false;
	});

	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('.lightbox').removeClass('show');
		}   // esc
	});

});