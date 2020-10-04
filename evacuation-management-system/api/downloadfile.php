<?php
header("Access-Control-Allow-Origin: *");
/* error_reporting(1); */
$file = $_GET['file'];

if(!file_exists($file)){ // file does not exist
    die(`file not found $file`);
} else {
    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename=$file");
    header("Content-Type: application/zip");
    header("Content-Transfer-Encoding: binary");

    // read the file from disk
    readfile($file);
}
