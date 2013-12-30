(function($) {

	window.DialWidget.prototype.animateRing = function (context, width, height, from, to, progress, label, options) {
		// options
		var radius = options.size*height/2 - 4;
		var ringWidth = 0.17*radius;
		var labelPadding = $(window).width () < 680 ? 0.75*ringWidth : 1.5*ringWidth;
		var labelRadius = 5;
	
		// measure widget label
		var fontSize = 14;
		context.font = 'Bold ' + fontSize + 'px Open Sans';
		context.textAlign = 'left';
		context.textBaseline = 'middle';
		var textMetrics = context.measureText(options.label.toUpperCase());
		var textWidth = textMetrics.width;
	
		// coords
		var widgetWidth = 0;
		var ringCenter = { x: 0, y: 0 };
	
		// draw widget label
		if (options.labelPosition == 'right') {
			widgetWidth = 2*(radius+ringWidth/2) + 2*labelPadding + textWidth;
			ringCenter = {
				x: (width-widgetWidth)/2+ringWidth/2+radius,
				y: height/2
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
			context.fillText(options.label.toUpperCase(), textLeft, ringCenter.y);
		}
	
		else {
			widgetWidth = 2*radius;
			ringCenter = {
				x: (width-widgetWidth)/2+radius,
				y: height/2
			}
		
			context.textAlign = 'center';
			context.textBaseline = 'bottom';
			context.fillStyle = options.foreColor;
			context.fillText(options.label.toUpperCase(), width/2, height);
		
			// scale down widget to fit remaining vertical space
			var labelHeight = fontSize + labelPadding;
			var widgetHeight = (height - labelHeight);
			radius = widgetHeight/2 - 4;
			ringWidth = 0.17*radius;
			ringCenter.y = widgetHeight/2;
		}
	
		// draw background
		context.beginPath();
		context.lineWidth = ringWidth;
		context.strokeStyle = '#aaa';
		context.arc(ringCenter.x, ringCenter.y, radius, 0, 2 * Math.PI);
		
		if (options.backColor) {
			
			context.fillStyle = options.backColor;
			context.fill();
		}
		
		context.stroke();
		context.closePath();

		// draw outline
		context.beginPath();
		context.strokeStyle = options.foreColor;
		context.arc(ringCenter.x, ringCenter.y, radius, -0.5 * Math.PI, (-0.5 * Math.PI) + progress * 2 * Math.PI);
		context.stroke();
		context.closePath();
	
		// draw value label
		context.fillStyle = options.foreColor;
		context.font = 'Lighter ' + 0.88*radius + 'px Open Sans';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(label, ringCenter.x, ringCenter.y);
	};
})(jQuery);