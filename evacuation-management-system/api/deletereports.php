<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';
$conn = OpenCon();
$id = $_POST['ID'];
$sql = "delete from reports where ID=$id";

$message;
if ($conn->query($sql) === TRUE) {
    $message->message = "success";
} else {
    $message->error = "error" .$conn->error;
    $message->params = $sql;
}

echo json_encode($message);
CloseCon();
