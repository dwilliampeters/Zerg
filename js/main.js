$(function() {
	"use strict";
	/*jshint smarttabs:true */

	// Base URL
	var host = window.location.protocol + "//" + window.location.host;
    var baseUrl = '/git/zerg/';
    var baseUrl = host + baseUrl;

	var $container = $('#container'),
		box = $('.box'),
		touched,
		imageBoxSrc,
		things,
		filter,
		filterTouched,
		filterAry = [],
		itemMeta = $('.lightbox > .meta').html(),
		tileMedia,
		paginate,
		filters = {};

	// Small screen navigation
	$('.navi').bind('click', function() {
		$('nav[role="sitenav"]').toggleClass('show');
		return false;
	})

	// Start Masonry
	tileLoad();

	// Deep linking
	if (window.location.hash) {
		console.log('have hash');
		var hash = window.location.hash.substring(1);
		var hasharray = hash.split('-');
		var hashnumber = hasharray[hasharray.length - 1];
		console.log(hashnumber);
		var touchedId = hashnumber;
		lightboxContent(touchedId);
	}

	function runMasonry () {
		// Run masonry now it's in the dom

		// masonry image loader is breaking windows phone 8
		//$container.imagesLoaded(function(){
			/*$container.masonry({
				itemSelector : '.box',
				columnWidth: 75,
				isAnimated: !Modernizr.csstransitions,
				isFitWidth: true
			});*/
		//});
		$container.isotope({
			itemSelector : '.box',
			layoutMode : 'fitRows',
			masonry: {
				columnWidth: 75,
			}
		});
	}

	var tileItemId,
		tileItemTags,
		tileItemCols,
		tileMedia,
		tileItemMediaSrc,
		tileMediaAsset,
		tileItemTitle;

	function tileLoad (filter) {

		if ( filter ) {
			// Reset the content
			//$('#container').html('');
		}

		// Get the tiles
		var source = baseUrl + 'source.json';
		var params = 5;

		// Load into the container
		$.getJSON(source, params, function(data) {

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

			function hasContent () {
				console.log(tileItemId);
				/*if ( !tileItemId ) {
					console.log('Nothing to show');
					$('#container').append('<div class="box col3"><div class="tile">No content found...</div></div>');
				}*/
			}

			hasContent();

			if ( filter ) {
				$container.masonry('reload');
				console.log('reload');
			} else {
				runMasonry();
			}

		});

	}

	// Show more
	$('.button[data-target="next"]').bind('click', function() {
		paginate = 'next';
		tileLoad(paginate);
		return false;
	})

	// Filters
	//$('.filterItem > a').addClass('active');
	//var isoFilters = ['.mountain-biking, .downhill, .road, .track'];
	$('.filterItem > a').bind('click', function() {
		var $this = $(this);

		var $optionSet = $this.parents('.option-set');

		// store filter value in object
		var group = $optionSet.attr('data-filter-group');
		if ( $this.hasClass('active') ) {
			filters[ group ] = '.none';
		} else {
			filters[ group ] = $this.attr('data-filter-value');
		}
		console.log(group);
		// convert object into array
		var isoFilters = [];
		for ( var prop in filters ) {
			isoFilters.push( filters[ prop ] )
		}
		var selector = isoFilters.join(', ');
		console.log(selector);
		$this.toggleClass('active');
		$container.isotope({ filter: selector });

		return false;
	})

	// Tile interaction
	$(document).on("click", '.collectionTile', function() {
		touched = $(this);
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

	// Lightbox content
	$(document).on("click", '.box.mediaTile', function() {
		var touchedId = $(this).attr('id');
		touchedId = touchedId.substring(1);
		touchedId = parseInt(touchedId);
		lightboxContent(touchedId);
		return false;
	})
	
	$(window).resize(function() {
		setTimeout(function() {
			$('.lightbox-content').height($('body').height());
			$('.lightbox').height($('body').height());
		}, 900);
	});

	$(window).trigger('resize');

	function lightboxContent (touchedId) {
		
		$('.lightbox-content > div').html('');

		touchedId = touchedId -= 1;

		var source = baseUrl + 'source.json';

		$.getJSON( source, function( data ) {
			var tilesTitle = data.tiles[touchedId].title;
			var tilesMediaType = data.tiles[touchedId].media;
			var tilesMediaSrc = data.tiles[touchedId].media_src;
			var tilesId = data.tiles[touchedId].id;
			var tilesUrl = data.tiles[touchedId].url;
			
			window.location.hash = tilesUrl + '-' + tilesId;
			document.title = tilesTitle + ' - Zerg Prototype';
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
			var lightboxContent = tcTitle + '<div class="meta">' + tcMeta + '</div>' + tcMedia;
			$('.lightbox-content > div').html(lightboxContent);
			$('.lightbox').addClass('show');
		});
		$("html,body").animate({ scrollTop: 0 }, 300);
		$('.collectionTile').removeClass('hover');
		return false;
	}

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