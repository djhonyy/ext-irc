<?

header("Content-type: text/json; charset=ISO-8859-1");

function prepareImput ($string){

	$chars = array("", "\n", "\r","\n\r", "chr(13)", "chr(10)", "\t", "\0", "\x0B");
	$string = str_replace($chars, "<br>", $string);
	$string = str_ireplace($chars, "<br>", $string);
	
	$chars = array("\xE2\x82\xAC", "\u20AC");
	$string = str_replace($chars, "€", $string);
	$string = str_ireplace($chars, "€", $string);
	
	//$string = str_replace('€', "&euro", $string);
	$string = addslashes($string);
	$string = utf8_decode($string);
	$string = nl2br($string);
	
	//$string = mysql_real_escape_string($string);
	
	return $string;
	
}

function prepareOutput ($string){

	$string = addslashes($string);
	//$string = utf8_encode($string);
	$string = nl2br($string);
	$chars = array("", "\n", "\r","\n\r", "chr(13)", "chr(10)", "\t", "\0", "\x0B");
	$string = str_replace($chars, " ", $string);
	$string = str_ireplace($chars, " ", $string);
	
	return $string;
	
}
?>