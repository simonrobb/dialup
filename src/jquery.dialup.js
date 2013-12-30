
;(function($, window, document, undefined) {
	var pluginName = 'DialWidget',
		defaults = {
			delay: 0,
			theme: 'ring',
			speed: 50,
			value: 0,
			size: 0.8,
			onComplete: function () {},
			backColor: undefined,
			foreColor: '#333',
			labelPosition: 'bottom',
			prefix: '',
			suffix: ''
		};

	window.DialWidget = function(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;
		this._progress = 0;
		this._devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

		this.init();
	};

	window.DialWidget.prototype = {
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

			// build animation function name from theme name (animate{this.options.theme}, camel-cased)
			// e.g.: animateRing
			var functionName = 'animate' + this.options.theme.charAt(0).toUpperCase() + this.options.theme.slice(1);
			
			// call the animation function if it exists
			if (!window.DialWidget.prototype.hasOwnProperty(functionName)) {
				
				throw "Dialup exception: There isn\'t an animation function named \"" + functionName + "\" registered";
			}
			
			else {
				
				this[functionName].call(window, this.context, this._progress, this.width, this.height, this.options);
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
