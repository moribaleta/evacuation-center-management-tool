<?php
header("Access-Control-Allow-Origin: *");
//error_reporting();
include 'access.php';
 
$conn = OpenCon();

$sql = "SELECT * FROM roadmap ORDER BY id DESC LIMIT 1;";

$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
print json_encode($rows);
 
CloseCon($conn);


?>

