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
		$siteNav = $('nav[role="sitenav"]'),
		$filterNav = $('nav[role="filters"]'),
		touched,
		imageBoxSrc,
		things,
		filter,
		filterTouched,
		filters = {};


	// Filter nav keep up top
	$(window).scroll(function(e){ 
		var windowScrollPos = $(this).scrollTop(),
			windowScroll = 47- windowScrollPos;
		$filterNav.css({'position': 'fixed', 'top': windowScroll + 'px'});
		if ( $(this).scrollTop() > 47 ){ 
			$filterNav.css({'top': '0'});

		}
		console.log(windowScroll);
	});


	// Small screen navigation
	$('.navi').bind('click', function() {
		$siteNav.toggleClass('show');
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
			//layoutMode : 'fitRows',
			masonry: {
				columnWidth: 75,
			}
		});
	}


	// Show more
	var start_page = 0,
		end_page = 10;
	console.log(start_page, end_page);
	$('.button[data-target="next"]').bind('click', function() {
		var loadMore = 'next';
		start_page = start_page += 10;
		end_page = end_page += 10;
		console.log(start_page, end_page);
		tileLoad(loadMore, start_page, end_page);
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

	function tileLoad (loadMore, start_page, end_page) {

		$.getJSON(source, function(data) {
			console.log(start_page,end_page);
			for (var i = data.tiles.length - 1; i >= 0; i--) {
				
				tileItemId = null;
				if ( !filter ) {

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
					console.log(tileItemId);
				}
			};
			
			function addTiles () {
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
	//var isoFilters = ['.mountain-biking, .downhill, .road, .track'];
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
			isoFilters.push( filters[ prop ] )
		};
		var selector = isoFilters.join(', ');
		$this.toggleClass('active');
		$container.isotope({ filter: selector });

		return false;
	});


	// Tile opens lightbox
	$(document).on("click", '.box.mediaTile', function() {
		var touchedId = $(this).attr('id');
			touchedId = touchedId.substring(1);
			touchedId = parseInt(touchedId);
		lightboxContent(touchedId);
		return false;
	})

	// Randomly tease tile content
	setInterval(function() {
		$('.collectionTile').removeClass('tease');
		var thingsHeight = $('.collectionTile > h2').height();
		console.log(thingsHeight);
		things = $('.collectionTile');

		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 3000);
	}, 6000);
	

	/*// Lightbox height
	$(window).resize(function() {
		setTimeout(function() {
			var containerHeight = $('#container').height();
			//$('.lightbox-content').height($('body').height());
			//$('.lightbox').height($('body').height());
			$('.lightbox').css('min-height', containerHeight);
			$('.lightbox-content').css('min-height', containerHeight);

		}, 900);
	});

	$(window).trigger('resize');*/

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

		touchedId = touchedId -= 1;

		$.getJSON( source, function( data ) {
			var tilesTitle = data.tiles[touchedId].title,
				tilesSefTitle = data.tiles[touchedId].sef_title,
				tilesContent = data.tiles[touchedId].content,
				tilesMediaType = data.tiles[touchedId].media,
				tilesMediaSrc = data.tiles[touchedId].media_src,
				tilesId = data.tiles[touchedId].id;
			
			window.location.hash = tilesSefTitle + '-' + tilesId;
			document.title = tilesTitle + ' - Zerg Prototype';

			var tcTitle = '<h1>' + tilesTitle + '</h1>',
				tcMeta = $('.lightbox > .meta').html(),
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
			var lightboxContent = tcTitle + '<div class="meta">' + tcMeta + '</div>' + tcMedia + tcContent;
			$('.lightbox-content > div').html(lightboxContent);
			$('#shell').addClass('show-lightbox');
		});
		$("html,body").animate({ scrollTop: 0 }, 300);
		$('.collectionTile').removeClass('hover');
		return false;
	}

	function lightboxClose () {
		$('#shell').removeClass('show-lightbox');
		/*$('.lightbox-content > div').html('');*/
		document.title = 'Zerg Prototype';
		window.location.hash = '';
		return false;
	}


	// Start Masonry
	tileLoad(start_page, end_page);

});