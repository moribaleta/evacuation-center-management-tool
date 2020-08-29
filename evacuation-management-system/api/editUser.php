<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';
$id        = $_POST['id'];
$username  = $_POST['username'];
$firstname = $_POST['firstname'];
$lastname  = $_POST['lastname'];
$email     = $_POST['email'];
$type      = $_POST['type'];
$password  = $_POST['password'];
$conn = OpenCon();

$sql = "UPDATE user set username = '$username',firstname = '$firstname',lastname = '$lastname',email = '$email', type = '$type',password = '$password' WHERE id = $id" ;

$message;
if ($conn->query($sql) === TRUE) {
    $message->message = 'success';
} else {
    $message->error = 'error: ' . $sql . "<br>" . $conn->error;
    $message->params = $sql;
}
echo json_encode($message);
CloseCon($conn);


