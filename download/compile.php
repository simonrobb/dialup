<?php

// configuration
$test = false;
$src = 'js/jquery.dialup.js';
$themes = 'js/themes/';

// load the main source
if (!file_exists($src)) {
	
	throw new Exception ($src . ' source file does not exist.');
}

$js = file_get_contents ($src);

// load the themes
foreach (glob($themes . '*.js') as $filename) {
	
	$js .= file_get_contents($filename);
}

// set headers
if (!$test) {
	
	header('Content-Type: application/javascript');
	header('Content-Transfer-Encoding: Binary');
	header('Content-disposition: attachment; filename="jquery.dialup-min.js"');
}

// output the source
echo $js;