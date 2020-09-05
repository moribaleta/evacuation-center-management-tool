<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';

$params     = json_encode($_POST);

$ROAD_MAP   = $_POST['roadmap'];


$conn = OpenCon();

$sql = "INSERT INTO roadmap(road_map) values('$ROAD_MAP')";

$message;

if ($conn->query($sql) === TRUE) {
   $message->message = "success";
   $message->params = $sql;//json_encode($_POST);
} else {
    $message->error =  "error: " . mysqli_error($conn);
    $message->params = $sql;
}

$message->post = $params;

echo json_encode($message);
CloseCon($conn);
?>
