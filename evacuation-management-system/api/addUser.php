<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';
$username  = $_POST['username'];
$firstname = $_POST['firstname'];
$lastname  = $_POST['lastname'];
$email     = $_POST['email'];
$type      = $_POST['type'];
$password  = $_POST['password'];
$conn = OpenCon();
//$date = date("Y/m/d");
//$sql = "SELECT * FROM classifier";

$sql = "INSERT INTO user(username,firstname,lastname,email,type,password) VALUES ('$username','$firstname','$lastname','$email','$type','$password')";
$message;
if ($conn->query($sql) === TRUE) {
    $message->message = 'success';
} else {
    $message->error = 'error: ' . $sql . "<br>" . $conn->error;
    $message->params = $sql;
}

echo json_encode($message);
CloseCon($conn);
?>