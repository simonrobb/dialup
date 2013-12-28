(function($) {

	window.DialWidget.prototype.animateBubble = function (options) {
	
		// options
		var radius = options.size*this.height/2;
		var labelPadding = $(window).width () < 680 ? 5 : 10;
		var labelRadius = 5;
	
		// measure widget label
		var fontSize = 14;
		this.context.font = 'Bold ' + fontSize + 'px Open Sans';
		this.context.textAlign = 'left';
		this.context.textBaseline = 'middle';
		var textMetrics = this.context.measureText(options.label.toUpperCase());
		var textWidth = textMetrics.width;
	
		// coords
		var scale = this.easeOutElastic(0, this._progress, 0, 1, 1);
		var widgetWidth = 0;
		var circleCenter = { x: 0, y: 0};
	
		// draw widget label
		if (options.labelPosition == 'right') {
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
			this.context.fillStyle = options.color;
			this.context.fillText(options.label.toUpperCase(), textLeft, circleCenter.y);
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
			this.context.fillText(options.label.toUpperCase(), this.width/2, this.height);
		
			// scale down widget to fit remaining vertical space
			var labelHeight = fontSize + labelPadding;
			var widgetHeight = (this.height - labelHeight);
			circleCenter.y = widgetHeight/2;
		}

		// draw background
		this.context.translate(circleCenter.x, circleCenter.y);
		this.context.scale (scale, scale);
		this.context.beginPath();
		this.context.fillStyle = options.color;
		this.context.arc(0, 0, radius, 0, 2 * Math.PI);
		this.context.fill();
		this.context.closePath();
	
		// draw value label
		this.context.fillStyle = 'white';
		this.context.font = 'Lighter ' + 1.2*radius + 'px Open Sans';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText(options.value, 0, 0);
	};
})(jQuery);