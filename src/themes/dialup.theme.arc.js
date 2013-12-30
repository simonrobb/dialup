(function($) {

	window.DialWidget.prototype.animateArc = function (options) {
		// options
		var radius = options.size*this.height/2 - 4;
		var ringWidth = 0.17*radius;
		var labelPadding = $(window).width () < 680 ? 0.75*ringWidth : 1.5*ringWidth;
		var labelRadius = 5;
	
		// measure widget label
		var fontSize = 14;
		this.context.font = 'Bold ' + fontSize + 'px Open Sans';
		this.context.textAlign = 'left';
		this.context.textBaseline = 'middle';
		var textMetrics = this.context.measureText(options.label.toUpperCase());
		var textWidth = textMetrics.width;
	
		// coords
		var widgetWidth = 0;
		var ringCenter = { x: 0, y: 0 };
	
		// draw widget label
		if (options.labelPosition == 'right') {
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
			this.context.fillStyle = options.foreColor;
			this.context.fillText(options.label.toUpperCase(), textLeft, ringCenter.y);
		}
	
		else {
			widgetWidth = 2*radius;
			ringCenter = {
				x: (this.width-widgetWidth)/2+radius,
				y: this.height/2
			}
		
			this.context.textAlign = 'center';
			this.context.textBaseline = 'bottom';
			this.context.fillStyle = options.foreColor;
			this.context.fillText(options.label.toUpperCase(), this.width/2, this.height);
		
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
		this.context.strokeStyle = '#aaa';
		this.context.arc(ringCenter.x, ringCenter.y, radius, 0.8 * Math.PI, (0.8 * Math.PI) + 1.4 * Math.PI);
		
		if (options.backColor) {
			
			this.context.fillStyle = options.backColor;
			this.context.fill();
		}
		
		this.context.stroke();
		this.context.closePath();

		// draw outline
		this.context.beginPath();
		this.context.strokeStyle = options.foreColor;
		this.context.arc(ringCenter.x, ringCenter.y, radius, 0.8 * Math.PI, (0.8 * Math.PI) + this._progress * 1.4 * Math.PI);
		this.context.stroke();
		this.context.closePath();
	
		// draw value label
		this.context.fillStyle = options.foreColor;
		this.context.font = 'Lighter ' + 0.88*radius + 'px Open Sans';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText((this._progress*options.value).toFixed(0), ringCenter.x, ringCenter.y);
	};
})(jQuery);