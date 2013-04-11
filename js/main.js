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

	// Check URL
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

	function runMasonry () {
		// Run masonry now it's in the dom
		$('#container').masonry({
			itemSelector: '.box',
			isFitWidth: true
		}).imagesLoaded(function() {
			$('#container').masonry('reload');
		});
	}

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
					//if (item.tags.indexOf(filter) >= 0) {
					//console.log(item.tags);
					if ( $.inArray(item.tags, filter) > -1 ) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + item.info + '</div></div></div>');
						}
						if ( item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><p><a rel="lightbox" href="' + item.media + '">See the bigger picture</a></p></div></div></div>');
						}
					}
				} else if ( deepLink ) {
				 	if ( item.id === deepLink) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + item.info + '</div></div></div>');
						}
						if ( item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><p><a rel="lightbox" href="' + item.media + '">See the bigger picture</a></p></div></div></div>');
						}
					}
				} else {
					if ( !item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + item.info + '</div></div></div>');
					}
					if ( item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><p><a rel="lightbox" href="' + item.media + '">See the bigger picture</a></p><i>Close</i></div></div></div>');
					}
				}
			});

			runMasonry();

		});

	}

	// Deep linking
	if ($.getUrlVar('id')) {
		var deepLink = $.getUrlVar('id');
		$('#msg').html('');
		//$('#msg').append('<a class="action" data-target="reset" href="#">View All...</a>');
		$('#msg').append('<a href="' + baseUrl + '">View All...</a>');
	}

	// Small screen navigation
	$('nav[role="sitenav"] h2 a').bind('click', function() {
		$('nav[role="sitenav"] ul').toggleClass('show');
		return false;
	})

	// Filters
	$('.filterItem > a').addClass('active');
	filterAry = ["Mountain Biking", "Downhill", "Road Cycling", "Track"];
	console.log(filterAry);
	$('.filterItem > a').bind('click', function() {
		filterTouched = $(this).attr('data-target');
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
			filterAry = jQuery.grep(filterAry, function(value) {
				return value != filterTouched;
			});
		} else {
			$(this).addClass('active');
			filterAry.push(filterTouched);
		}
		filter = filterAry;
		console.log(filter);
		if ( filter.length === 0 ) {
			console.log('No Content');
			$('#container').html('');
			$('#container').append('<div class="box col3"><div class="tile"><h2>Nothing to show</h2><h3>Select at least 1 category</h3></div></div>');
			runMasonry();
			return false;
		}
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
	$(document).on("click", '.collectionTile', function() {
		touched = $(this);
		flipper(touched);
	})

	function flipper (touched) {
		if ( !touched.hasClass('hover') ) {
			$('.collectionTile').removeClass('hover');
			touched.addClass('hover');
		//} else {
		//	$('.collectionTile').removeClass('hover');
		}
		return false;
	}

	$(document).on("click", '.collectionInfo > i', function() {
		$(this).closest('.collectionTile').removeClass('hover');
		return false;
	})

	// Randomly tease tile content
	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		things = $('.collectionTile.img');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 1200);
	}, 6000);

	// Lightbox
	$(document).on("click", 'a[rel="lightbox"]', function() {
		imageBoxSrc = $(this).attr('href');
		$('.lightbox-content > div').html('<img src="' + imageBoxSrc + '" />');
		$('.lightbox').addClass('show');
		return false;
	})

	$(document).on("click", '.lightbox-close', function() {
		$('.lightbox').removeClass('show');
		return false;
	})

	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('.lightbox').removeClass('show');
		}   // esc
	});

});