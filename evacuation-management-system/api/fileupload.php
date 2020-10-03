<?php
header("Access-Control-Allow-Origin: *");
error_reporting(1);
include 'access.php';

/* if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['files'])) {
        $errors = [];
        $path = 'uploads/';
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        $all_files = count($_FILES['files']['tmp_name']);
        $files = array();
        
        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));

            $file = $path . $file_name;
            $temp = explode(".", $file_name);
            $file_tmp = $temp[0] . round(microtime(true)) . '.' . end($temp);
            
            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }
            
            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }
            
            if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);
                $files[] = $file_tmp;
            }
        }
        
        if ($errors) {
            //print_r($errors);
            $message->error = $errors;
            echo json_encode($message);
        }  else  {
            echo json_encode($files);
        }
    }
} */

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['files'])) {
        $errors = [];
        $path = 'uploads/';
        $extensions = ['jpg', 'jpeg', 'png', 'gif', 'html', 'txt', 'xml'];

        $all_files = count($_FILES['files']['tmp_name']);
        
        $files = array();

        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];

            $file_ext = trim(strtolower(end(explode('.', $_FILES['files']['name'][$i]))));

            $file = $path . $file_name;

            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_ext;
            }

            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }

            if (empty($errors)) {
                if (file_exists($path . $file_name)) {
                    unlink($path.$file_name);
                    move_uploaded_file($file_tmp, $path . $file_name);
                    $files[] = $path . $file_name;
                } else {
                    $temp = explode(".", $file_name);
                    $trim = trim($newfilename = $path . generateRandomString(5) . round(microtime(true)) . '.' . end($temp));
                //move_uploaded_file($_FILES["file"]["tmp_name"], "../img/imageDirectory/" . $newfilename);

                    move_uploaded_file($file_tmp, $newfilename);
                    $files[] = $newfilename;
                }
                
            }
        }

        if ($errors) {
            //print_r($errors);
            $message->error = $errors;
            echo json_encode($message);
        }  else  {
            echo json_encode($files);
        }
    }
}



?>