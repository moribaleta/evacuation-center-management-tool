<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';
 
$conn = OpenCon();

$limit = $_GET['limit'];
$offset = $_GET['offset'];

$sql = "SELECT * FROM reports";

if($limit && $offset){
    $sql = `SELECT * FROM reports limit $offset, $limit`;
}

$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
 
CloseCon($conn);


?>