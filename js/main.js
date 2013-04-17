$(function() {
	"use strict";
	/*jshint smarttabs:true */


	// Base URL
	var host = window.location.protocol + "//" + window.location.host,
    	baseUrl = '/git/zerg/';
    	baseUrl = host + baseUrl;


    // Global vars
	var $container = $('#container'),
		touched,
		imageBoxSrc,
		things,
		filter,
		filterTouched,
		itemMeta = $('.lightbox > .meta').html(),
		filters = {};


	// Small screen navigation
	$('.navi').bind('click', function() {
		$('nav[role="sitenav"]').toggleClass('show');
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
		tileItemTags,
		tileItemCols,
		tileMedia,
		tileItemMediaSrc,
		tileMediaAsset,
		tileItemTitle;

	function tileLoad (loadMore, start_page, end_page) {

		var source = baseUrl + 'content_test.json';

		$.getJSON(source, function(data) {
			console.log(start_page,end_page);
			for (var i = data.tiles.length - 1; i >= 0; i--) {
				
				tileItemId = null;
				if ( !filter ) {

					tileItemId = data.tiles[i].id;
					tileItemTags = data.tiles[i].tags;
					tileItemCols = data.tiles[i].cols;
					tileMedia = data.tiles[i].media;
					tileItemMediaSrc = data.tiles[i].media_src;
					tileMediaAsset = data.tiles[i].media_asset;
					tileItemTitle = data.tiles[i].title;
					addTiles();
					console.log(tileItemId);
				}
			};
			
			function addTiles () {
				if ( !tileMedia ) {
					$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' collectionTile"><div class="collectionContainer"><div class="tile">' + tileItemTitle + '</div><div class="collectionInfo">' + itemMeta + '</div></div></div>');
				} else {
					if ( tileMedia === 'image' ) {
						$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + tileItemMediaSrc + '" alt="" /></div></div></div>');
					}
					if ( tileMedia === 'youtube' ) {
						if ( !tileMediaAsset ) {
							$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile withText videoTile"><div class="collectionContainer"><div class="tile">' + tileItemTitle + '</div></div><i></i></div>');
						} else {
							$('#container').append('<div id="t' + tileItemId + '" class="box col' + tileItemCols + ' ' + tileItemTags + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + tileMediaAsset + '" alt="" /></div></div><i></i></div>');
						}
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


	// Tile interaction
	$(document).on("click", '.collectionTile', function() {
		touched = $(this);
		if ( !touched.hasClass('hover') ) {
			$('.collectionTile').removeClass('hover');
			touched.addClass('hover');
		}
		runMasonry();
		return false;
	})

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
		things = $('.collectionTile');
		$(things[Math.floor(Math.random()*things.length)]).addClass('tease');
		setTimeout(function() {
		$('.collectionTile').removeClass('tease');
		}, 1200);
	}, 6000);
	

	// Lightbox height
	$(window).resize(function() {
		setTimeout(function() {
			$('.lightbox-content').height($('body').height());
			$('.lightbox').height($('body').height());
		}, 900);
	});

	$(window).trigger('resize');

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

		var source = baseUrl + 'source.json';

		$.getJSON( source, function( data ) {
			var tilesTitle = data.tiles[touchedId].title,
				tilesMediaType = data.tiles[touchedId].media,
				tilesMediaSrc = data.tiles[touchedId].media_src,
				tilesId = data.tiles[touchedId].id,
				tilesUrl = data.tiles[touchedId].url;
			
			window.location.hash = tilesUrl + '-' + tilesId;
			document.title = tilesTitle + ' - Zerg Prototype';

			var tcTitle = '<h1>' + tilesTitle + '</h1>',
				tcMeta = $('.lightbox > .meta').html(),
				tcMediaType = tilesMediaType,
				tcMediaSrc = tilesMediaSrc,
				tcMedia = '';
				if ( tcMediaType === 'youtube' ) {
					tcMedia = '<div class="media"><iframe width="100%" height="315" style="max-width: 560px;" src="http://www.youtube.com/embed/' + tcMediaSrc + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';
				}
				if ( tcMediaType === 'image' ) {
					tcMedia = '<div class="media"><img src="' + tcMediaSrc + '" alt="" /></div>';
				}
			var lightboxContent = tcTitle + '<div class="meta">' + tcMeta + '</div>' + tcMedia;
			$('.lightbox-content > div').html(lightboxContent);
			$('.lightbox').addClass('show');
		});
		$("html,body").animate({ scrollTop: 0 }, 300);
		$('.collectionTile').removeClass('hover');
		return false;
	}

	function lightboxClose () {
		$('.lightbox').removeClass('show');
		$('.lightbox-content > div').html('');
		document.title = 'Zerg Prototype';
		window.location.hash = '';
		return false;
	}


	// Start Masonry
	tileLoad(start_page, end_page);

});