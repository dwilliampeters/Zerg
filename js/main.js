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
		things,
		filter,
		filterTouched,
		filterAry = [];

	tileLoad();

	// URL Vars
	$.extend({
		getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
		},
		getUrlVar: function(name){
			return $.getUrlVars()[name];
		}
	});

	function tileLoad (filter) {

		// Reset the content
		$('#container').html('');

		// Get the tiles
		var source = baseUrl + 'source.json';

		// Load into the container
		$.getJSON(source, function(data) {

			var ob = data.tiles;
			$.each(ob, function(i, item) {
				if ( filter ) {
					if (item.tags.indexOf(filter) >= 0) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
						}
						if ( item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
						}
					}
				} else if ( deepLink ) {
				 	if ( item.id === deepLink) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
						}
						if ( item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
						}
					}
				} else {
					if ( !item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
					}
					if ( item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><p>Other goodies can be added here</p></div></div></div>');
					}
				}
			});

			// Run masonry now it's in the dom
			$('#container').masonry({
				itemSelector: '.box',
				isFitWidth: true
			}).imagesLoaded(function() {
				$('#container').masonry('reload');
			});

		});

	}

	if ($.getUrlVar('id')) {
		var deepLink = $.getUrlVar('id');
		$('#msg').html('');
		$('#msg').append('<a class="action" data-target="reset" href="#">View All...</a>');
	}

	$('nav[role="sitenav"] h2 a').bind('click', function() {
		$('nav[role="sitenav"] ul').toggleClass('show');
		return false;
	})

	$('.filters li > a').addClass('active');
	$('.filters li > a').bind('click', function() {
		filterTouched = $(this).attr('data-target');
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
			filterAry = jQuery.grep(filterAry, function(value) {
				return value != filterTouched;
			});
			//tileLoad();
			//return false;
		} else {
			$(this).addClass('active');
			filterAry.push(filterTouched);
		}
		//filter = filterAry + "";
		filter = filterAry;
		console.log(filter);
		tileLoad(filter);
		return false;
	})

	// Reset
	$(document).on('click', '.action', function() {
		var action = $(this).attr('data-target');
		if ( action === 'reset' ) { tileLoad(); $('#msg').html(''); $('.filters a').removeClass('active'); }
		return false;
	})

	// Tile interaction
	$(document).on('click', '.collectionTile', function() {
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