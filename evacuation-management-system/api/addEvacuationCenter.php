<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';

$NAME                   = $_POST['name'];
$LOCATION               = $_POST['location'];
$POPULATION_CAPACITY    = $_POST['population_capacity'];
$FLOOR_SPACE            = $_POST['floor_space'];
$CREATED_BY             = $_POST['created_by'];
$EXACT_ADDRESS          = $_POST['exact_address'];
$MUNICIPALITY           = $_POST['municipality'];
$CONTACT_NUMBERS        = $_POST['contact_numbers'];

$conn = OpenCon();

$sql = "INSERT INTO evacuation_center(name,location,population_capacity,floor_space,created_by,exact_address,municipality, contact_numbers) values('$NAME','$LOCATION',$POPULATION_CAPACITY,$FLOOR_SPACE,$CREATED_BY,'$EXACT_ADDRESS','$MUNICIPALITY','$CONTACT_NUMBERS')";

$message;

if ($conn->query($sql) === TRUE) {
   $message->message = "success";
   $message->params = $sql;
} else {
    $message->error =  "error: " . mysqli_error($conn);
    $message->params = $sql;
}
echo json_encode($message);
CloseCon($conn);
?>
