<?php 
header("Access-Control-Allow-Origin: *");
error_reporting(1);
include 'access.php';

$file   = $_GET['filename'];
$params = $_REQUEST;

if (!unlink($file)) {  
        $deletion[] = "fail to delete `$file`";
    }  else {  
        $deletion[] = "deleted `$file`";    
    }  


$message->deletion = $deletion;
$message->params   = $params;

echo json_encode($message);

?>