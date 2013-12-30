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
			?><li class="theme">
				<div class="dial" data-theme="<?php echo $themeName ?>" data-fore-color="white">
					<span class="label">Demo</span>
					<span class="value">32</span>
				</div>
				
				<div class="dial-caption">
					<span class="name"><?php echo ucwords($themeName) ?></span>
				</div>
			</li><?php } ?>
		</ul>
		
		<a href="https://github.com/simonrobb/dialup"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub"></a>
	</div>	
</body>
</html>