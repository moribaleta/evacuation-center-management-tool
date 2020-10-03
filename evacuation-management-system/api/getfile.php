<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
error_reporting(1);

include 'access.php';

$path = $_GET['path'];

$string = file_get_contents($path);

if($string === FALSE) {
    echo "Could not read the file.";
} else {
    echo $string;
}
?>