<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';

$sql = "SELECT id,username,lastname,firstname,email,type,date FROM user ORDER BY id DESC";

$conn = OpenCon();

$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
 
CloseCon($conn);
