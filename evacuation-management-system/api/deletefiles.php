<?php 
header("Access-Control-Allow-Origin: *");
error_reporting(1);
include 'access.php';

$files = $_POST['filenames'];
$deletion = array();
$params = $_REQUEST;

foreach($files as $file) {
    if (!unlink($file)) {  
        $deletion[] = "fail to delete `$file`";
    }  else {  
        $deletion[] = "deleted `$file`";
    }  
}

$message->deletion = $deletion;
$message->params   = $params;

echo json_encode($message);

?>