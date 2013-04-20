$(function() {
	"use strict";
	/*jshint smarttabs:true */


	// Base URL
	var host = window.location.protocol + "//" + window.location.host,
		baseUrl = '/git/zerg/';
		baseUrl = host + baseUrl;

	// Content source
	var source = baseUrl + 'content_test.json';

	// Global vars
	var $container = $('#container'),
		things,
		filters = {},
		loadMore = 'no',
		start = 0,
		$newItem;


	// Equal heights
	$(window).resize(function() {
		setTimeout(function() {
			var mainHeight = $('div[role="main"]').height();
			$('aside[role="sideNav"]').css('min-height', mainHeight);
		}, 300);
	});

	$(window).trigger('resize');


	// Scroll events
	$(window).scroll(function(e){ 
		var windowScrollPos = $(this).scrollTop(),
			windowScroll = 0- windowScrollPos;
		$('header[role="banner"]').css({'top': windowScroll + 'px'});
		if ( $(this).scrollTop() > 67 ){
			$('header[role="banner"]').css({'top': '-67px'});
		}

		if ( $(this).scrollTop() > 67 ){
			$('.small-filterNav').css({'position': 'relative', 'top': windowScrollPos-64  + 'px'});
			$('.small-siteNav').css({'position': 'relative', 'top': windowScrollPos-64  + 'px'});
		}

		if ( $(this).scrollTop() === 0 ){
			$('.small-filterNav').css({'position': 'relative', 'top': '0px'});
			$('.small-siteNav').css({'position': 'relative', 'top': '0px'});
		}
	});


	// Infinite load
	var _throttleTimer = null;
	var _throttleDelay = 900;

	$(window).off('scroll', ScrollHandler).on('scroll', ScrollHandler);

	function ScrollHandler(e) {
		//throttle event:
		clearTimeout(_throttleTimer);
		_throttleTimer = setTimeout(function () {
			console.log('scroll');

			//do work
			if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
				console.log('Load more');
				loadMore = 'yes',
				start = start +=10;
				tileLoad();
			}

		}, _throttleDelay);
	}


	// Small screen navigation
	$('#sitenav > ul').clone().appendTo('.small-siteNav');
	$('#filters > ul').clone().appendTo('.small-filterNav');
	$('.navi').bind('click', function() {
		
		var touched = $(this).attr('data-target');

		if ( $('body').hasClass(touched) ) {
			$('body').removeClass(touched);
			return false;
		}

		$('body').removeClass('sitenav');
		$('body').removeClass('filters');
		$('body').removeClass('sidenav');
		$('body').addClass(touched);
		
		return false;
	});


	// Deep linking
	if (window.location.hash) {
		console.log('have hash');
		var hash = window.location.hash.substring(1),
			hasharray = hash.split('-'),
			hashnumber = hasharray[hasharray.length - 1],
			touchedId = hashnumber;
		lightboxContent(touchedId);
	}


	// Masonry
	function runMasonry () {
		$container.isotope({
			itemSelector : '.box',
			rowHeight: 120,
			filter: '*',
			masonry: {
				columnWidth: 75
			}
		});
	}


	// Show more
	$('.button[data-target="next"]').bind('click', function() {
		console.log('Load more');
		loadMore = 'yes',
		start = start +=10;
		tileLoad();
		return false;
	});


	// Get the tiles
	var tileItemId,
		tileItemCols,
		tileItemTags,
		tileItemDate,
		tileItemSummary,
		tileItemTitle,
		tileMedia,
		tileItemMediaSrc,
		tileMediaThumb;

	function tileLoad () {

		/*	If required
			$.getJSON(source, params,function(data) {
			params: {'start':startNumber, 'length': lenNumber }
			*/

		$.getJSON(source, function(data) {
			
			//for (var i = data.tiles.length - 1; i >= 0; i--) {
			for (var i=start; i<start+10; i++) {
			//for (var i=start+10; i>=start; i--) {
				tileItemId = null;
				tileItemId = data.tiles[i].id;
				tileItemCols = data.tiles[i].cols;
				tileItemTags = data.tiles[i].tags;
				tileItemDate = data.tiles[i].date;
				tileItemSummary = data.tiles[i].summary;
				tileItemTitle = data.tiles[i].title;
				tileMedia = data.tiles[i].media;
				tileItemMediaSrc = data.tiles[i].media_thumbnail;
				tileMediaThumb = data.tiles[i].media_thumbnail;
				addTiles();
				console.log('ID: ' + tileItemId);
			}
			
			function addTiles () {
				if ( loadMore === 'yes' ) {
					console.log('ADD FUNCTION');
					if ( !tileMedia ) {
						$newItem = $('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile"><div class="collectionContainer"><div class="tile">' + tileItemSummary + '</div></div></div>');
					} else {
						if ( tileMedia === 'image' ) {
							$newItem = $('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile imgTile collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + tileItemMediaSrc + '" alt="" /></div><div class="collectionInfo"><h2>' + tileItemSummary + '</h2></div></div><i></i></div>');
						}
						if ( tileMedia === 'youtube' ) {
							$newItem = $('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile videoTile collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + tileMediaThumb + '" alt="" /></div><div class="collectionInfo"><h2>' + tileItemSummary + '</h2></div></div><i></i></div>');
						}
					}
					$container.append( $newItem ).isotope( 'appended', $newItem );
					//$container.isotope( 'appended', $newItem );
					return false;
				}
				if ( !tileMedia ) {
					$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile"><div class="collectionContainer"><div class="tile">' + tileItemSummary + '</div></div></div>');
				} else {
					if ( tileMedia === 'image' ) {
						$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile imgTile collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + tileItemMediaSrc + '" alt="" /></div><div class="collectionInfo"><h2>' + tileItemSummary + '</h2></div></div><i></i></div>');
					}
					if ( tileMedia === 'youtube' ) {
						$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile videoTile collectionTile"><div class="collectionContainer"><div class="tile"><img src="' + tileMediaThumb + '" alt="" /></div><div class="collectionInfo"><h2>' + tileItemSummary + '</h2></div></div><i></i></div>');
					}
				}
			}

			runMasonry();

		});

	}


	// Filters
	//var isoFilters = ['.mountain-biking', '.downhill', '.road', '.track'];
	$('.filterItem > a').bind('click', function() {
		var $this = $(this),
			$optionSet = $this.parents('.option-set');

		// store filter value in object
		var group = $optionSet.attr('data-filter-group');
		if ( $this.hasClass('active') ) {
			filters[ group ] = '.none';
		} else {
			filters[ group ] = $this.attr('data-filter-value');
		}
		// convert object into array
		var isoFilters = [];
		for ( var prop in filters ) {
			isoFilters.push( filters[ prop ] );
		}
		var selector = isoFilters.join(', ');
		$this.toggleClass('active');
		$container.isotope({ filter: selector });
		console.log(selector);

		return false;
	});


	// Tile opens lightbox
	$(document).on("click", '.box.mediaTile', function() {
		var touchedId = $(this).attr('id');
			touchedId = touchedId.substring(1);
			console.log(touchedId);
		lightboxContent(touchedId);
		return false;
	});

	// Randomly tease tile content
	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		//var thingsHeight = $('.collectionTile > h2').height();
		//console.log(thingsHeight);
		things = $('.collectionTile');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 3000);
	}, 6000);


	// Lightbox close
	$(document).on("click", '.lightbox-close', lightboxClose);
	$(document).keyup(function(e) {
		if (e.keyCode === 27) {
			lightboxClose();
		}
	});

	// Lightbox content
	function lightboxContent (touchedId) {
		
		$('.lightbox-content > div').html('');

		console.log(touchedId);

		$.getJSON( source, function( data ) {
			for (var i = data.tiles.length - 1; i >= 0; i--) {
				console.log('Lightbox ID: ' + data.tiles[i].id);
				if ( touchedId === data.tiles[i].id ) {
					var tilesId = data.tiles[i].id,
						tilesTitle = data.tiles[i].title,
						tilesSefTitle = data.tiles[i].sef_title,
						tilesContent = data.tiles[i].content,
						tilesMediaType = data.tiles[i].media,
						tilesMediaSrc = data.tiles[i].media_src;
				}
			}
			
			window.location.hash = tilesSefTitle + '-' + tilesId;
			document.title = tilesTitle + ' - Zerg Prototype';

			var tcTitle = '<h1>' + tilesTitle + '</h1>',
				MetaHTML = $('.lightbox > .meta').html(),
				tcMeta = '<div class="meta clearfix">' + MetaHTML + '</div>',
				tcContent = '<div class="entry">' + tilesContent + '</div>',
				tcMediaType = tilesMediaType,
				tcMediaSrc = tilesMediaSrc,
				tcMedia = '';
				if ( tcMediaType === 'youtube' ) {
					tcMedia = '<div class="media"><iframe width="100%" height="315" style="max-width: 560px;" src="http://www.youtube.com/embed/' + tcMediaSrc + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';
				}
				if ( tcMediaType === 'image' ) {
					tcMedia = '<div class="media"><img src="' + tcMediaSrc + '" alt="" /></div>';
				}
			var lightboxContent = tcTitle + tcMeta + tcMedia + tcContent;
			$('.lightbox-content > div').html(lightboxContent);
			$('#shell').addClass('show-lightbox');
		});
		$("html,body").animate({ scrollTop: 0 }, 300);
		$('.collectionTile').removeClass('hover');
		return false;
	}

	function lightboxClose () {
		$('#shell').removeClass('show-lightbox');
		document.title = 'Zerg Prototype';
		window.location.hash = '';
		return false;
	}


	// Start Masonry
	tileLoad();

});