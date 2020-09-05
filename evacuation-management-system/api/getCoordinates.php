<?php

header("Access-Control-Allow-Origin: *");
include 'access.php';
 
$conn = OpenCon();

$conn = OpenCon();

$sql = "SELECT * FROM roadmap ORDER BY id DESC LIMIT 1;";

$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
//print json_encode($rows);
 
CloseCon($conn);

$first = reset($rows);
$filename = $first['road_map'];

$strJsonFileContents = file_get_contents("$filename");
//var_dump($strJsonFileContents);
print json_encode($strJsonFileContents)
?>