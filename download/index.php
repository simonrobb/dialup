<!DOCTYPE html>
<html>

<head>
	
	<!-- Scripts -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="/js/src/jquery.dialup.js" type="text/javascript" charset="utf-8"></script>
	<?php
		// loop through the themes
		foreach (glob('js/src/themes/*.js') as $filename) {
			echo '<script src="' . $filename . '" type="text/javascript" charset="utf-8"></script>';
		}		
	?>
	
	<script type="text/javascript" charset="utf-8">
	
		(function($) {

			// Initialise
			$(document).ready(function() {
				
				// initialise demo dials
				$('.dial').each(function() {
					var $$ = $(this);
					
					// options
					var options = {
						ring: {
							theme: 'ring',
							foreColor: 'white'
						},
						
						bubble: {
							theme: 'bubble',
							foreColor: '#080b0a',
							backColor: 'white'
						},
						
						arc: {
							theme: 'arc',
							foreColor: 'white',
							minimum: 0,
							maximum: 100
						}
					};
			
					// Extract options
					var themeOptions = options[$$.attr('data-theme')];
					themeOptions = $.extend(themeOptions, {
						label: $$.find('.label').text(),
						value: $$.find('.value').text(),
						width: $$.width (),
						height: $$.height ()
					});

					// Create the widget
					$(this).DialWidget(themeOptions);
					
					// Animate when clicked
					$(this).on ('click', function () {
						$(this).DialWidget('animateTo', { value: (Math.random()*100).toFixed(0) });
					});
				});
				
				// choose themes for download
				window.minify = false;
				
				$('#themes .theme input[type="checkbox"]').on ('change', function () {
					
					// get checked themes
					var themes = [];
					var packageSize = 0;
					var checked = $('#themes .theme input[type="checkbox"]:checked').each (function () {
						
						themes.push($(this).attr ('data-theme'));
						packageSize += parseFloat($(this).attr ('data-filesize'));
					});
					
					// form the compile url
					var url = '/compile.php?'
						+ 'minify=' + (+window.minify) + '&'
						+ 'themes=' + themes.join(',');
						
					// set the url on the download button
					$('#downloadCustomButton').attr ('href', url);
					
					// update package details
					$('#custom-theme-count').text (checked.length);
					$('#custom-package-size').text (packageSize.toFixed(1));
				});
			});
		})(jQuery);
	
	</script>
	
	<!-- Style sheets -->
	<link href="/css/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
	<link href="/css/print.css" media="print" rel="stylesheet" type="text/css" />
	<!--[if IE]>
	    <link href="/css/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
	<![endif]-->
	
	<!-- Fonts -->
	<link href='http://fonts.googleapis.com/css?family=Ubuntu:300,400,500' rel='stylesheet' type='text/css'>
</head>

<body>
	
	<div class="wrapper">
		
		<h1>Dialup</h1>
		<span id="headingTag">Data widgets for jQuery</span>
		
		<a href="/compile.php" id="downloadButton" class="btn has-image">
			
			<span class="icons-download"></span>
			<span class="line-one">Download full package</span>
			<span class="line-two">32kB (minified)</span>
		</a>
		
		<p class="large">Dialup is a jQuery widget to quickly add beautiful animated dials to your website.</p>
		<p>Display key metrics in a web application or render statistics in your body copy. </p>
		<p><a href="#themes">Choose from the available themes below</a> or create your own &ndash; Dialup is released under the MIT license, so use it or tweak it however you like.</p>
		
		<ul id="themes">
			
			<?php
			
				// loop through the themes
				foreach (glob('js/src/themes/*.js') as $filename) {

					// extract the theme name
					$filenameParts = explode('.', $filename);
					$themeName = $filenameParts[count($filenameParts) - 2];
					
					// get file size
					$filesize = filesize($filename)/1000;
					
			?><li class="theme">
				<div class="dial" data-theme="<?php echo $themeName ?>" data-fore-color="white">
					<span class="label">Demo</span>
					<span class="value">32</span>
				</div>
				
				<div class="dial-caption">
					<div class="check-area">
						<input type="checkbox" name="<?php echo $themeName ?>" id="checkbox-<?php echo $themeName ?>" data-theme="<?php echo $themeName ?>" data-filesize="<?php echo $filesize ?>" value="" />
						<label for="checkbox-<?php echo $themeName ?>"></label>
						<span class="size"><?php echo (round($filesize, 1) . 'kB') ?></span>
					</div>
					<span class="name"><?php echo ucwords($themeName) ?></span>
				</div>
			</li><?php } ?>
		</ul>
		
		<div id="custom">
			
			<h2>Choose your dials</h2>
			<p>The full package contains all the available themes. Select just the themes you want above to keep your filesize small. Small scripts mean happy users!</p>
			
			<a href="/compile.php" id="downloadCustomButton" class="btn has-image">

				<span class="icons-download"></span>
				<span class="line-one">Download custom package</span>
				<span class="line-two"><span id="custom-theme-count">0</span> themes, <span id="custom-package-size">10</span>kB (minified)</span>
			</a>
		</div>
		
		<a href="https://github.com/simonrobb/dialup"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub"></a>
	</div>	
</body>
</html>