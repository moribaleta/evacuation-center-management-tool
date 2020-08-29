<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';

$id                 = $_POST['id'];
$conn = OpenCon();

$sql = "delete from `user` where id = $id";

$message;

if ($conn->query($sql) === TRUE) {
    $message->message = "success";
} else {
    $message->error = "error";
    $message->params = $sql;
}

echo json_encode($message);

CloseCon($conn);
?>