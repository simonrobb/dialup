
;(function($, window, document, undefined) {
	var pluginName = 'DialWidget',
		defaults = {
			delay: 0,
			theme: 'ring',
			speed: 50,
			value: 0,
			size: 0.8,
			onComplete: function () {},
			color: '#333',
			labelPosition: 'bottom'
		};

	function DialWidget(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;
		this._progress = 0;
		this._devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

		this.init();
	}

	DialWidget.prototype = {
		init: function() {
			var $$ = $(this.element);
			var that = this;
			
			// Create the canvas
			this.canvas = $('<canvas />')
				.appendTo($(this.element))
				.get (0);
			
			// canvas not supported in IE8	
			if (!(this.canvas.getContext && this.canvas.getContext('2d'))) {
				
				return;
			}
				
			// Initialize dimensions
			this.initDimensions ();
	
			// Resize widgets on window resize
			$(window).resize (function () {
				that.initDimensions ();
				that.animate (true);
			});
			
			// Hide spans
			$$.find ('span').hide ();

			// Mark as initialised
			$$.addClass(this.options.theme);
			$$.addClass('initialised');

			// Start animation loop after the requested delay
			setTimeout (function () {
				that.animate ();
			}, this.options.delay);
		},
		
		/**
		 * requestAnimFrame shim with setTimeout fallback for older browsers
		 * as per http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
		 *
		 * @param callback function
		 * @return function
		 */
		requestAnimFrame: (function(callback) {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})(),
		
		/**
		 * Set widget dimensions based on the parent element
		 *
		 * @return null
		 */
		initDimensions: function () {
			this.width = $(this.element).width ();
			this.height = $(this.element).height ();
			
			$(this.canvas)
				.attr('width', this.width)
				.attr('height', this.height)
				.css('width', this.width)
				.css('height', this.height);
				
			this.context = this.canvas.getContext('2d');

			// Set up canvas for high-dpi screens
	         var width = this.canvas.width;
	         var height = this.canvas.height;
	         var cssWidth = width;
	         var cssHeight = height;
	         this.canvas.width = width * this._devicePixelRatio;
	         this.canvas.height = height * this._devicePixelRatio;
	         this.canvas.style.width = cssWidth + 'px';
	         this.canvas.style.height = cssHeight + 'px';
	         this.context.scale(this._devicePixelRatio, this._devicePixelRatio);
		},
		
		/**
		 * Easing function used by the bubble theme
		 *
		 * @param x float Animation progress
		 * @param t int Time elapsed since animation start in ms
		 * @param b float Initial value of animation
		 * @param c float Final value of animation
		 * @param d int Duration of animation in ms
		 * @return float
		 */
		easeOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		
		/**
		 * Draw a frame in the animation
		 *
		 * @param suppressNewFrame bool Repaint without advancing the animation progress
		 * @return null
		 */
		animate: function(suppressNewFrame) {
			var $$ = $(this.element);
			var that = this;

			// update
			if (!suppressNewFrame) {
				this._progress += 1 / this.options.speed;
			}

			// reset transforms and clear
			this.context.setTransform(this._devicePixelRatio, 0, 0, this._devicePixelRatio, 0, 0);
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			switch (this.options.theme) {
				case 'bubble':
					// options
					var radius = this.options.size*this.height/2;
					var labelPadding = $(window).width () < 680 ? 5 : 10;
					var labelRadius = 5;
					
					// measure widget label
					var fontSize = 14;
					this.context.font = 'Bold ' + fontSize + 'px Open Sans';
					this.context.textAlign = 'left';
					this.context.textBaseline = 'middle';
					var textMetrics = this.context.measureText(this.options.label.toUpperCase());
					var textWidth = textMetrics.width;
					
					// coords
					var scale = this.easeOutElastic(0, this._progress, 0, 1, 1);
					var widgetWidth = 0;
					var circleCenter = { x: 0, y: 0};
					
					// draw widget label
					if (this.options.labelPosition == 'right') {
						widgetWidth = 2*radius + 2*labelPadding + textWidth;
						circleCenter = {
							x: (this.width-widgetWidth)/2+radius,
							y: this.height/2
						}
						
						var label = {
							topleft: {
								x: circleCenter.x,
								y: circleCenter.y-fontSize/2-labelPadding
							},
							bottomleft: {
								x: circleCenter.x,
								y: circleCenter.y+fontSize/2+labelPadding
							},
							topright: {
								x: circleCenter.x+radius+textWidth+2*labelPadding,
								y: circleCenter.y-fontSize/2-labelPadding
							},
							bottomright: {
								x: circleCenter.x+radius+textWidth+2*labelPadding,
								y: circleCenter.y+fontSize/2+labelPadding
							}
						}
					
						var textLeft = circleCenter.x+radius+labelPadding;
						this.context.fillStyle = 'white';
						this.context.beginPath ();
						this.context.moveTo (label.topleft.x, label.topleft.y);
						this.context.lineTo (label.topright.x-labelRadius, label.topright.y);
						this.context.arcTo (label.topright.x, label.topright.y, label.topright.x, label.topright.y+labelRadius, labelRadius);
						this.context.lineTo (label.bottomright.x, label.bottomright.y-labelRadius);
						this.context.arcTo (label.bottomright.x, label.bottomright.y, label.bottomright.x-labelRadius, label.bottomright.y, labelRadius);
						this.context.lineTo (label.bottomleft.x, label.bottomleft.y);
						this.context.closePath ();
						this.context.fill();
						this.context.fillStyle = this.options.color;
						this.context.fillText(this.options.label.toUpperCase(), textLeft, circleCenter.y);
					}
					
					else {
						widgetWidth = 2*radius;
						circleCenter = {
							x: (this.width-widgetWidth)/2+radius,
							y: this.height/2
						}
						
						this.context.textAlign = 'center';
						this.context.textBaseline = 'bottom';
						this.context.fillStyle = '#333333';
						this.context.fillText(this.options.label.toUpperCase(), this.width/2, this.height);
						
						// scale down widget to fit remaining vertical space
						var labelHeight = fontSize + labelPadding;
						var widgetHeight = (this.height - labelHeight);
						circleCenter.y = widgetHeight/2;
					}

					// draw background
					this.context.translate(circleCenter.x, circleCenter.y);
					this.context.scale (scale, scale);
					this.context.beginPath();
					this.context.fillStyle = this.options.color;
					this.context.arc(0, 0, radius, 0, 2 * Math.PI);
					this.context.fill();
					this.context.closePath();
					
					// draw value label
					this.context.fillStyle = 'white';
					this.context.font = 'Lighter ' + 1.2*radius + 'px Open Sans';
					this.context.textAlign = 'center';
					this.context.textBaseline = 'middle';
					this.context.fillText(this.options.value, 0, 0);

					break;

				case 'ring':
					// options
					var radius = this.options.size*this.height/2 - 4;
					var ringWidth = 0.17*radius;
					var labelPadding = $(window).width () < 680 ? 0.75*ringWidth : 1.5*ringWidth;
					var labelRadius = 5;
					
					// measure widget label
					var fontSize = 14;
					this.context.font = 'Bold ' + fontSize + 'px Open Sans';
					this.context.textAlign = 'left';
					this.context.textBaseline = 'middle';
					var textMetrics = this.context.measureText(this.options.label.toUpperCase());
					var textWidth = textMetrics.width;
					
					// coords
					var widgetWidth = 0;
					var ringCenter = { x: 0, y: 0 };
					
					// draw widget label
					if (this.options.labelPosition == 'right') {
						widgetWidth = 2*(radius+ringWidth/2) + 2*labelPadding + textWidth;
						ringCenter = {
							x: (this.width-widgetWidth)/2+ringWidth/2+radius,
							y: this.height/2
						}
						
						var label = {
							topleft: {
								x: ringCenter.x,
								y: ringCenter.y-fontSize/2-labelPadding
							},
							bottomleft: {
								x: ringCenter.x,
								y: ringCenter.y+fontSize/2+labelPadding
							},
							topright: {
								x: ringCenter.x+radius+ringWidth/2+textWidth+2*labelPadding,
								y: ringCenter.y-fontSize/2-labelPadding
							},
							bottomright: {
								x: ringCenter.x+radius+ringWidth/2+textWidth+2*labelPadding,
								y: ringCenter.y+fontSize/2+labelPadding
							}
						}
					
						var textLeft = ringCenter.x+radius+ringWidth/2+labelPadding;
						this.context.fillStyle = 'white';
						this.context.beginPath ();
						this.context.moveTo (label.topleft.x, label.topleft.y);
						this.context.lineTo (label.topright.x-labelRadius, label.topright.y);
						this.context.arcTo (label.topright.x, label.topright.y, label.topright.x, label.topright.y+labelRadius, labelRadius);
						this.context.lineTo (label.bottomright.x, label.bottomright.y-labelRadius);
						this.context.arcTo (label.bottomright.x, label.bottomright.y, label.bottomright.x-labelRadius, label.bottomright.y, labelRadius);
						this.context.lineTo (label.bottomleft.x, label.bottomleft.y);
						this.context.closePath ();
						this.context.fill();
						this.context.fillStyle = this.options.color;
						this.context.fillText(this.options.label.toUpperCase(), textLeft, ringCenter.y);
					}
					
					else {
						widgetWidth = 2*radius;
						ringCenter = {
							x: (this.width-widgetWidth)/2+radius,
							y: this.height/2
						}
						
						this.context.textAlign = 'center';
						this.context.textBaseline = 'bottom';
						this.context.fillStyle = this.options.color;
						this.context.fillText(this.options.label.toUpperCase(), this.width/2, this.height);
						
						// scale down widget to fit remaining vertical space
						var labelHeight = fontSize + labelPadding;
						var widgetHeight = (this.height - labelHeight);
						radius = widgetHeight/2 - 4;
						ringWidth = 0.17*radius;
						ringCenter.y = widgetHeight/2;
					}
					
					// draw background
					this.context.beginPath();
					this.context.lineWidth = ringWidth;
					this.context.strokeStyle = '#ddd';
					this.context.fillStyle = 'white';
					this.context.arc(ringCenter.x, ringCenter.y, radius, 0, 2 * Math.PI);
					this.context.fill();
					this.context.stroke();
					this.context.closePath();

					// draw outline
					this.context.beginPath();
					this.context.strokeStyle = this.options.color;
					this.context.arc(ringCenter.x, ringCenter.y, radius, -0.5 * Math.PI, (-0.5 * Math.PI) + this._progress * 2 * Math.PI);
					this.context.stroke();
					this.context.closePath();
					
					// draw value label
					this.context.fillStyle = this.options.color;
					this.context.font = 'Lighter ' + 0.88*radius + 'px Open Sans';
					this.context.textAlign = 'center';
					this.context.textBaseline = 'middle';
					this.context.fillText((this._progress*this.options.value).toFixed(0), ringCenter.x, ringCenter.y);

					break;
			}

			// request new frame if animation not completed
			if (this._progress < 1) {
				this.requestAnimFrame.call(window, function() {
					that.animate();
				});
			}

			// callback if completed
			else {
				this.options.onComplete ();
			}
		}
	}

	/**
	 * Widget constructor
	 *
	 * @param options object Widget options
	 * @return jQuery Implements fluent interface
	 */
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new DialWidget(this, options));
			}
		});
	};

})(jQuery, window, document);
