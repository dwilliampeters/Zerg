$(function() {
	"use strict";
	/*jshint smarttabs:true */

	// Base URL
	var host = window.location.protocol + "//" + window.location.host;
    var baseUrl = '/git/zerg/';
    var baseUrl = host + baseUrl;

	var box = $('.box'),
		touched,
		imageBoxSrc,
		things;

	// Get the tiles
	var source = baseUrl + 'source.json';

	// Load into the container
	$.getJSON(source, function(data) {
		$.each(data.tiles, function(i, item) {
			//console.log(item.title);
			if ( !item.media ) {
				$('#container').append('<div id="box1" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
			}
			if ( item.media ) {
				$('#container').append('<div id="box1" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
			}
		});

		$('#container').masonry({
			itemSelector: '.box',
			isFitWidth: true
		}).imagesLoaded(function() {
			$('#container').masonry('reload');
		});
	});

	// Tile interaction
	$(document).on('click', '.collectionTile', function(){
		touched = $(this);
		flipper(touched);
	})

	function flipper (touched) {
		if ( !touched.hasClass('hover') ) {
			$('.collectionTile').removeClass('hover');
			touched.addClass('hover');
		} else {
			$('.collectionTile').removeClass('hover');
		}
		return false;
	}

	// Randomly tease the tile content
	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		things = $('.collectionTile');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 900);
	}, 3900);

	// Singular tiles
	if(window.location.hash) {
	  var hash = window.location.hash;
	  box.addClass('hide');
	  $(hash).removeClass('hide');
	}

	// Lightbox work - OLD - keeping incase
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