$(function() {
	"use strict";
	/*jshint smarttabs:true */

	var imageBoxSrc,
		things;

	/*$('.flip-container').bind('mouseover', flipper);
	$('.flip-container').bind('mouseout', flipper);*/
	$('.collectionTile').bind('click', flipper);

	function flipper () {
		if ( !$(this).hasClass('hover') ) {
			$('.collectionTile').removeClass('hover');
			$(this).addClass('hover');
		} else {
			$('.collectionTile').removeClass('hover');
		}
		return false;
	}

	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		things = $('.collectionTile');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 900);
	}, 3900);

	/*$('.imageBox').bind("click", function(event) {
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
	});*/

});