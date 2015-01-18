var TB = (function ($) {
	 
	// privates
	var clientId = 'rqy445x0yuc3m8l6x62kt7nvm7u7dx',
		numChannels,
		randomStream,
		twitchStatus,
		hasFlash;
	
	function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function clearHtml(element) {
		$(element).html(' ');
	}

	function createSpinner(element) {
		$(element).html( '<div class="row fullWidth"> ' +
	    				 '<div class="large-12 columns" style="height: 586px;"> ' +
	    				 '<div class="bubblingG"> ' +
						 '<span id="bubblingG_1"> ' +
						 '</span> ' +
						 '<span id="bubblingG_2"> ' +
						 '</span> ' +
						 '<span id="bubblingG_3"> ' +
						 '</span> ' +
						 '</div> ' +
	    				 '</div> ' +
	    				 '</div> ' +
						 '');
	}

	function supportMobile() {
		var a = !1,
		    b = "";

		function c(d) {
		    d = d.match(/[\d]+/g);
		    d.length = 3;
		    return d.join(".")
		}
		if (navigator.plugins && navigator.plugins.length) {
		    var e = navigator.plugins["Shockwave Flash"];
		    e && (a = !0, e.description && (b = c(e.description)));
		    navigator.plugins["Shockwave Flash 2.0"] && (a = !0, b = "2.0.0.11")
		} else {
		    if (navigator.mimeTypes && navigator.mimeTypes.length) {
		        var f = navigator.mimeTypes["application/x-shockwave-flash"];
		        (a = f && f.enabledPlugin) && (b = c(f.enabledPlugin.description))
		    } else {
		        try {
		            var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"),
		                a = !0,
		                b = c(g.GetVariable("$version"))
		        } catch (h) {
		            try {
		                g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), a = !0, b = "6.0.21"
		            } catch (i) {
		                try {
		                    g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), a = !0, b = c(g.GetVariable("$version"))
		                } catch (j) {}
		            }
		        }
		    }
		}
		var k = b;
		return a ? true : false;
	}

	function followButton() {

		if (!twitchStatus){
			$('#followButton').addClass("disabled");
			$('#followButton').off('click');
			$('#followButton').on('click', function() {
			    $('#connectContainer').show();
			});
		} else {
			$('#followButton').removeClass("disabled");

			Twitch.api({method: 'user'}, function(error, channel) {
				var channelName = randomStream.channel.display_name,
					userName    = channel.display_name,
					isFollowing;

				Twitch.api({method: '/users/' + userName + '/follows/channels/' + channelName }, function(error, channel) {
					isFollowing = channel;
					if (!isFollowing) {
					  	$('#followButton').html("Follow");
					} else {
					  	$('#followButton').html("Unfollow");
					}
					$('#followButton').off('click');
					$('#followButton').on('click', function() {
						console.log("isFollowing = " + isFollowing);
					  if (!isFollowing) {
					    Twitch.api({method: '/users/' + userName + '/follows/channels/' + channelName, params: {'_method' : 'put'} }, function(error, channel) {
				  			$('#followButton').html("Unfollow");
				  			isFollowing = true;
				  			console.log("clicked to ;ollow")
				  		});
					  } else {
					    Twitch.api({method: '/users/' + userName + '/follows/channels/' + channelName, params: {'_method' : 'delete'} }, function(error, channel) {
				  		});
				  		isFollowing = false;
				  		$('#followButton').html("Follow");
					  }
					}); // onclick end 
				  }); // end twitch.api
				
			});

		}

	}

	function getRandomStream() {
		$.ajax({
	            url:         'https://api.twitch.tv/kraken/streams/summary',
	            headers:     { "Client-ID" : clientId },
	            type:        'GET',
	            contentType: 'application/json',
	            dataType:    'jsonp',

	            success: function(data) {
	            	numChannels = data.channels;
            	}

		}).done(function() {
		    $.ajax({
	            url:         'https://api.twitch.tv/kraken/streams?limit=100&offset=' + getRandomInt(0, numChannels - 100),
	            headers:     { "Client-ID" : clientId },
	            type:        'GET',
	            contentType: 'application/json',
	            dataType:    'jsonp',

	            success: function(data) {
	            	randomStream = data.streams[Math.floor(Math.random()*data.streams.length)];

	              	console.log(
	              		randomStream
	              	);

	              	clearHtml('#streamContainer');

	            	$( "#streamContainer" ).append(
	            		'<div class="row fullWidth"> ' +
						'<div class="large-12 columns"> ' +
						'<h4>' + (randomStream.channel.status || ' ') + '' +
						'<small style="font-size:70%;margin-left: 20px;">' +
						'	<span class=""><a href="' + randomStream.channel.url + '">' + randomStream.channel.display_name + '</a></span>' +
						'	<span class="middle">playing </span>' +
						'	<span class="">' + (randomStream.channel.game || 'unknown') + '</span>' +
						'</small></h4>' +
						'</div> ' +
						'</div> ' +
	            		'<div class="row fullWidth" style="margin-bottom:32px"> ' +
						'<div class="large-9 columns"> ' +
	            		'<object type="' + ( hasFlash ? "application/x-shockwave-flash" : "" ) + '" ' +
						'        height="440" ' +
						'        width="100%" ' +
						'        id="live_embed_player_flash" ' +
						'        data="' + ( hasFlash ? ( "http://www.twitch.tv/widgets/live_embed_player.swf?channel=" + randomStream.channel.name ) : ( "http://www.twitch.tv/" + randomStream.channel.name + "/hls" ) ) + '" ' +
						'        bgcolor="#000000"> ' +
						'  <param  name="allowFullScreen" ' +
						'          value="true" /> ' +
						'  <param  name="allowScriptAccess" ' +
						'          value="always" /> ' +
						'  <param  name="allowNetworking" ' +
						'          value="all" /> ' +
						'  <param  name="movie" ' +
						'          value="http://www.twitch.tv/widgets/live_embed_player.swf" /> ' +
						'  <param  name="flashvars" ' +
						'          value="hostname=www.twitch.tv&channel=' + randomStream.channel.name + '&auto_play=true&start_volume=100" /> ' +
						'</object> ' +
						'</div> ' +
						'<div class="large-3 columns"> ' +
						( hasFlash ? 
						'<iframe frameborder="0" ' +
						'        scrolling="no" ' +
						'        id="chat_embed" ' +
						'        src="http://twitch.tv/chat/embed?channel=' + randomStream.channel.name + '&amp;popout_chat=true" ' +
						'        height="440" ' +
						'        width="100%"> ' +
						'</iframe> '
						: "" ) +
						'</div> ' +
						'</div> ' +
						' ' +
						'<div class="row fullWidth"> ' +
						'	<div class="small-5 small-centered columns"> ' +
						'		<div class="button-bar"> '+
						'		  <ul class="button-group round"> '+
						'		    <li><a href="#!" id="followButton" class="large button purple">Follow</a></li> ' +
						'		    <li><a href="#!" id="nextButton" class="large button purple">Next Stream</a></li> ' +
						'		  </ul> ' +
						'		</div> ' +
						'	</div> ' +
						'</div> '

					); // End append html

					$('#nextButton').on('click', function(e) {
						//e.preventDefault();
					    clearHtml('#streamContainer');
					    createSpinner('#streamContainer');
					    getRandomStream();
					});

					followButton();

            	} // End success clause
			})
		}); // end .ajax hell

	} // end getRandomStream()
	 
	return {

		init: function () {
			hasFlash = supportMobile();

			Twitch.init({clientId: clientId}, function(error, status) {
			    // the sdk is now loaded

			    twitchStatus = status.authenticated;

			    if (status.authenticated) {
					// Already logged in, hide button
					$('#connectContainer').hide();
				}
			});

			$('.close-connectContainer').on('click', function() {
			    $('#connectContainer').hide();
			});

			$('.twitch-connect').click(function() {
				Twitch.login({
					scope: ['user_read', 'user_follows_edit']
				});
			});

			getRandomStream();

			console.log("Twich status: " + twitchStatus);
			
		},

	};
})($);
