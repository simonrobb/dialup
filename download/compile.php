<?php

// configuration
$test = true;
$src = 'js/src/jquery.dialup.js';
$themeDirectory = 'js/src/themes/';

// request params
$minify = isset($_GET['minify']) ? (bool)$_GET['minify'] : false;
$themes = isset($_GET['themes']) ? explode(',', $_GET['themes']) : null;

// load the main source
if (!file_exists($src)) {
	
	throw new Exception ($src . ' source file does not exist.');
}

$js = file_get_contents ($src);

// load the themes
foreach (glob($themeDirectory . '*.js') as $filename) {
	
	$include = false;
	
	// include all themes if no themes param provided
	if (!$themes) {
		
		$include = true;
	} else {
		
		$filenameParts = explode('.', $filename);
		$themeName = $filenameParts[count($filenameParts) - 2];
		
		if (in_array($themeName, $themes)) {
			
			$include = true;
		}
	}
	
	if ($include) {
		
		$js .= file_get_contents($filename);
	}
}

// minify
if ($minify) {
	
	include_once ('lib/JSMinPlus.php');
	$js = JSMinPlus::minify($js);
}

// set headers
if (!$test) {
	
	header('Content-Type: application/javascript');
	header('Content-Transfer-Encoding: Binary');
	header('Content-disposition: attachment; filename="jquery.dialup-min.js"');
}

// output the source
echo $js;