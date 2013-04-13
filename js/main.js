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
							if ( item.media === 'image' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><img src="' + item.media_src + '" alt="" /><i>Close</i></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
						}
						if ( item.media === 'youtube' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div><div class="collectionInfo"><iframe width="100%" height="100%" src="http://www.youtube.com/embed/' + item.media_src + '?rel=0" frameborder="0" allowfullscreen></iframe></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div></div><i></i></div>');
						}
						}
					}
				} else if ( deepLink ) {
				 	if ( item.id === deepLink) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + item.info + '</div></div></div>');
						}
						if ( item.media ) {
							if ( item.media === 'image' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><img src="' + item.media_src + '" alt="" /><i>Close</i></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
						}
						if ( item.media === 'youtube' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div><div class="collectionInfo"><iframe width="100%" height="100%" src="http://www.youtube.com/embed/' + item.media_src + '?rel=0" frameborder="0" allowfullscreen></iframe></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div></div><i></i></div>');
						}
						}
					}
				} else {
					if ( !item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + item.info + '</div></div></div>');
					}
					if ( item.media ) {
						//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><p><a rel="lightbox" href="' + item.media + '">See the bigger picture</a></p><i>Close</i></div></div></div>');
						if ( item.media === 'image' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div><div class="collectionInfo"><h2>' + item.title + '</h2><img src="' + item.media_src + '" alt="" /><i>Close</i></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
						}
						if ( item.media === 'youtube' ) {
							//$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' img"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div><div class="collectionInfo"><iframe width="100%" height="100%" src="http://www.youtube.com/embed/' + item.media_src + '?rel=0" frameborder="0" allowfullscreen></iframe></div></div></div>');
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div></div><i></i></div>');
						}
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
	$('.navi').bind('click', function() {
		$('nav[role="sitenav"]').toggleClass('show');
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
		/*$('.collectionTile.img').removeClass('col4').addClass('col2');
		if ( touched.hasClass('img') ) {
			$('.collectionTile.col4').removeClass('col4').addClass('col2');
			$(this).closest('.collectionTile').removeClass('col2').addClass('col4');
		}*/
		if ( !touched.hasClass('img') ) {
			if ( !touched.hasClass('hover') ) {
				$('.collectionTile').removeClass('hover');
				touched.addClass('hover');
			}
			runMasonry();
		}
		return false;
	})

	$(document).on("click", '.collectionInfo > i', function() {
		//$(this).closest('.collectionTile').removeClass('col4').removeClass('hover').addClass('col2');
		runMasonry();
		return false;
	})

	// Randomly tease tile content
	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		things = $('.collectionTile');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 1200);
	}, 6000);

	// Lightbox - This really is going to be unused...
	//$(document).on("click", 'a[rel="lightbox"]', function() {
	$(document).on("click", '.box.mediaTile', function() {
		var touchedId = $(this).attr('id');
			touchedId = touchedId.substring(1);
			touchedId = parseInt(touchedId);
			touchedId = touchedId -= 1;
			console.log(touchedId);

		var source = baseUrl + 'source.json';

		$.getJSON( source, function( data ) {
			var tilesTitle = data.tiles[touchedId].title;
			var tilesMediaType = data.tiles[touchedId].media;
			var tilesMediaSrc = data.tiles[touchedId].media_src;
			var tilesId = data.tiles[touchedId].id;
			var tilesUrl = data.tiles[touchedId].url;
			
			window.location.hash = tilesUrl + '-' + tilesId;
			document.title = tilesTitle + ' - Zerg Prototype';
			var tcShare = '<div class="meta"><span class="st_facebook_hcount" displayText="Facebook"></span><span class="st_twitter_hcount" displayText="Tweet"></span><span class="st_googleplus_hcount" displayText="Google +"></span></div>';
			var tcTitle = '<h1>' + tilesTitle + '</h1>';
			var tcMediaType = tilesMediaType;
			var tcMediaSrc = tilesMediaSrc;
			var tcMedia = '';
			if ( tcMediaType === 'youtube' ) {
				tcMedia = '<div class="media"><iframe width="100%" height="315" style="max-width: 560px;" src="http://www.youtube.com/embed/' + tcMediaSrc + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';
			}
			if ( tcMediaType === 'image' ) {
				tcMedia = '<div class="media"><img src="' + tcMediaSrc + '" alt="" /></div>';
			}
			var tcMeta = $('.lightbox > .meta').html();
			var lightboxContent = tcTitle + tcMeta + tcShare + tcMedia;
			$('.lightbox-content > div').html(lightboxContent);
			$('.lightbox').addClass('show');
		});
		$("html,body").animate({ scrollTop: 0 }, 300);
		return false;
	})

	$(document).on("click", '.lightbox-close', function() {
		$('.lightbox').removeClass('show');
		$('.lightbox-content > div').html('');
		document.title = 'Zerg Prototype';
		window.location.hash = '';
		return false;
	})

	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('.lightbox').removeClass('show');
			$('.lightbox-content > div').html('');
			document.title = 'Zerg Prototype';
			window.location.hash = '';
		}
	});

});