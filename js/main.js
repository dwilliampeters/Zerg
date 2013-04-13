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
		filterAry = [],
		itemMeta;

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

		/*// Masonry corner stamp modifications
		$.Mason.prototype.resize = function() {
			this._getColumns();
			this._reLayout();
		};

		$.Mason.prototype._reLayout = function( callback ) {
			var freeCols = this.cols;
			if ( this.options.cornerStampSelector ) {
				var $cornerStamp = this.element.find( this.options.cornerStampSelector ),
					cornerStampX = $cornerStamp.offset().left - 
						( this.element.offset().left + this.offset.x + parseInt($cornerStamp.css('marginLeft')) );
				freeCols = Math.floor( cornerStampX / this.columnWidth );
			}
			// reset columns
			var i = this.cols;
			this.colYs = [];
			while (i--) {
				this.colYs.push( this.offset.y );
			}

			for ( i = freeCols; i < this.cols; i++ ) {
				this.colYs[i] = this.offset.y + $cornerStamp.outerHeight(true);
			}

			// apply layout logic to all bricks
			this.layout( this.$bricks, callback );
		};*/

		$('#container').masonry({
			itemSelector: '.box',
			columnWidth: 75,
			isAnimated: !Modernizr.csstransitions,
			isFitWidth: true,
			//cornerStampSelector: '.corner-stamp'
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
				itemMeta = $('.lightbox > .meta').html();
				if ( filter ) {
					if ( $.inArray(item.tags, filter) > -1 ) {
						if ( !item.media ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + itemMeta + '</div></div></div>');
						}
						if ( item.media ) {
							if ( item.media === 'stamp' ) {
								$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' corner-stamp mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
							}
							if ( item.media === 'image' ) {
								$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
							}
							if ( item.media === 'youtube' ) {
								if ( !item.media_asset ) {
									$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile withText videoTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div></div><i></i></div>');
								} else {
									$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div></div><i></i></div>');
								}
							}
						}
					}
				} else {
					if ( !item.media ) {
						$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' collectionTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div><div class="collectionInfo">' + itemMeta + '</div></div></div>');
					}
					if ( item.media ) {
						if ( item.media === 'stamp' ) {
							$('#container').append('<div id="t' + item.id + '" class="' + item.cols + ' corner-stamp mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
						}
						if ( item.media === 'image' ) {
							$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile imgTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_src + '" alt="" /></div></div></div>');
						}
						if ( item.media === 'youtube' ) {
							if ( !item.media_asset ) {
								$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile withText videoTile"><div class="collectionContainer"><div class="tile">' + item.title + '</div></div><i></i></div>');
							} else {
								$('#container').append('<div id="t' + item.id + '" class="box col' + item.cols + ' mediaTile videoTile"><div class="collectionContainer"><div class="tile"><img src="' + item.media_asset + '" alt="" /></div></div><i></i></div>');
							}
						}
					}
				}
			});

			runMasonry();

		});

	}

	// Small screen navigation
	$('.navi').bind('click', function() {
		$('nav[role="sitenav"]').toggleClass('show');
		return false;
	})

	// Filters
	$('.filterItem > a').addClass('active');
	filterAry = ["Mountain Biking", "Downhill", "Road", "Track"];
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
	
	function lightboxContent (touchedId) {
		
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