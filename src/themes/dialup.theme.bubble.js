(function($) {
	
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
	var easeOutElastic = function(x, t, b, c, d) {
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
	};

	window.DialWidget.prototype.animateBubble = function (context, width, height, from, to, progress, label, options) {
	
		// options
		var radius = options.size*height/2;
		var labelPadding = $(window).width () < 680 ? 5 : 10;
		var labelRadius = 5;
	
		// measure widget label
		var fontSize = 14;
		context.font = 'Bold ' + fontSize + 'px Open Sans';
		context.textAlign = 'left';
		context.textBaseline = 'middle';
		var textMetrics = context.measureText(options.label.toUpperCase());
		var textWidth = textMetrics.width;
	
		// coords
		var scale = easeOutElastic(0, progress, 0, 1, 1);
		var widgetWidth = 0;
		var circleCenter = { x: 0, y: 0};
	
		// draw widget label
		if (options.labelPosition == 'right') {
			widgetWidth = 2*radius + 2*labelPadding + textWidth;
			circleCenter = {
				x: (width-widgetWidth)/2+radius,
				y: height/2
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
			context.fillStyle = 'white';
			context.beginPath ();
			context.moveTo (label.topleft.x, label.topleft.y);
			context.lineTo (label.topright.x-labelRadius, label.topright.y);
			context.arcTo (label.topright.x, label.topright.y, label.topright.x, label.topright.y+labelRadius, labelRadius);
			context.lineTo (label.bottomright.x, label.bottomright.y-labelRadius);
			context.arcTo (label.bottomright.x, label.bottomright.y, label.bottomright.x-labelRadius, label.bottomright.y, labelRadius);
			context.lineTo (label.bottomleft.x, label.bottomleft.y);
			context.closePath ();
			context.fill();
			context.fillStyle = options.foreColor;
			context.fillText(options.label.toUpperCase(), textLeft, circleCenter.y);
		}
	
		else {
			widgetWidth = 2*radius;
			circleCenter = {
				x: (width-widgetWidth)/2+radius,
				y: height/2
			}
		
			context.textAlign = 'center';
			context.textBaseline = 'bottom';
			context.fillStyle = options.backColor;
			context.fillText(options.label.toUpperCase(), width/2, height);
		
			// scale down widget to fit remaining vertical space
			var labelHeight = fontSize + labelPadding;
			var widgetHeight = (height - labelHeight);
			circleCenter.y = widgetHeight/2;
		}

		// draw background
		context.translate(circleCenter.x, circleCenter.y);
		context.scale (scale, scale);
		context.beginPath();
		context.fillStyle = options.backColor;
		context.arc(0, 0, radius, 0, 2 * Math.PI);
		context.fill();
		context.closePath();
	
		// draw value label
		context.fillStyle = options.foreColor;
		context.font = 'Lighter ' + 1.2*radius + 'px Open Sans';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(to, 0, 0);
	};
})(jQuery);