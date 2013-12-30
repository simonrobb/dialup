
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
		this._from = 0;
		this._to = 0;
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
				that.animateTo ({ value: that.options.value });
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

			// Set up canvas for HiDPI screens
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

				this[functionName].call(window, 
					this.context,
					this.width, 
					this.height, 
					this._from,
					this._to,
					this._progress,
					this.options.prefix + (this._from + this._progress*(this._to-this._from)).toFixed(0) + this.options.suffix, 
					this.options
				);
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
		},
		
		/**
		 * Animate the dial from the current value to a new value
		 *
		 * @param value float The new value to animate to
		 * @return null
		 */
		animateTo: function (params) {
			
			if (!params.value) {
				
				throw "Dialup exception: the .animateTo(params) function requires a parameters object containing a value key";
			}
			
			this._from = this.getCurrentValue ();	// animate from current position
			this._to = params.value;				// to the new value
			this._progress = 0;						// start a new animation
			this.animate ();
		},
		
		/**
		 * Get the current value displayed on the dial, allowing for 
		 * animations currently running.
		 *
		 * @return null
		 */
		getCurrentValue: function () {
			
			return this._from + this._progress*(this._to-this._from);
		}
	}

	/**
	 * Widget constructor
	 *
	 * @param options object Widget options
	 * @return jQuery Implements fluent interface
	 */
	$.fn[pluginName] = function(command, params) {
		
		// initialise if options is an object
		if (typeof command == 'object') {
			
			return this.each(function() {
				
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new DialWidget(this, command));
				}
			});
		}
		
		// otherwise an command
		else if (typeof command == 'string') {
			
			return this.each(function() {
				
				// make sure the widget has been initialised
				if (!$.data(this, "plugin_" + pluginName)) {
					
					throw "Dialup exception: Dial must be initialised before sending a command";
				}
				
				// execute the instruction
				var dial = $.data(this, "plugin_" + pluginName);
				dial[command](params);
			});
		}
		
		// who knows
		else {
			
			throw "Dialup exception: .dialup(command) expects an object or an command string for the command parameter.";
		}
	};

})(jQuery, window, document);
