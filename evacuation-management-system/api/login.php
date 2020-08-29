<?php
    header("Access-Control-Allow-Origin: *");
    error_reporting(0);
include 'access.php';
$conn = OpenCon();
$username = $_POST['username'];
$password = $_POST['password'];


$sql = "Select id,type from user where username = '$username' and password = '$password'";
$conn = OpenCon();

$result = $conn->query($sql);

$rows = mysqli_fetch_assoc($result);

if ($rows['id']){
   echo json_encode($rows);
} else {
    $error->error = "error".mysqli_error($conn);
    $error->params = $_POST;
   echo json_encode($error);
}
CloseCon();
