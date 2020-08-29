<?php
header("Access-Control-Allow-Origin: *");
error_reporting(0);
include 'access.php';

$AMMONIA_TOTAL_MGL_N  = $_POST['AMMONIA_TOTAL_MGL_N'];
$BOD                  = $_POST['BOD'];
$DATE_CREATED         = $_POST['DATE_CREATED'];
$DISSOLVED_OXYGEN_MGL = $_POST['DISSOLVED_OXYGEN_MGL'];
$FECAL_COLIFORMS      = $_POST['FECAL_COLIFORMS'];
$INORGANIC_PHOSPHATE  = $_POST['INORGANIC_PHOSPHATE'];
$NITRATE_TOTAL_MGLASN = $_POST['NITRATE_TOTAL_MGLASN'];
$PH                   = $_POST['PH'];
$STATION              = $_POST['STATION'];
$USERID               = $_POST['USERID'];
$WATER_QUALITY_INDEX  = $_POST['WATER_QUALITY_INDEX'];


$conn = OpenCon();

$sql = "INSERT INTO reports(AMMONIA_TOTAL_MGL_N,BOD,DATE_CREATED,DISSOLVED_OXYGEN_MGL,FECAL_COLIFORMS,INORGANIC_PHOSPHATE,NITRATE_TOTAL_MGLASN,PH,STATION,USERID,WATER_QUALITY_INDEX) values($AMMONIA_TOTAL_MGL_N,$BOD,'$DATE_CREATED',$DISSOLVED_OXYGEN_MGL, $FECAL_COLIFORMS,$INORGANIC_PHOSPHATE,$NITRATE_TOTAL_MGLASN,$PH,'$STATION',$USERID,'$WATER_QUALITY_INDEX')";

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
