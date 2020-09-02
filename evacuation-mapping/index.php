<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

}
?>
<html>

    <head>
        <title>HOME</title>
        <link rel="stylesheet" href="resources/css/main.css">
        <script src="resources/js/jquery-3.0.0.min.js"></script><!--
<script src="resources/json/hospitals.json"></script>
<script src="resources/json/experiment_paper.json"></script>-->        
        <script src="resources/json/hospitals.js"></script>
        <script src="resources/json/experiment_paper.js"></script>
        <link rel="shortcut icon" href="resources/images/favicon.ico" type="image/x-icon">
    </head>

    <body>
        <div id="div-home">
            <button id='btn_start' onclick="onStart()">let's start</button>    
            <button id='btn_start' onclick="onReset()">reset data</button>    
        </div>


        <script>
            function onReset(){
                if(confirm("are you sure to delete saved data?")){
                    localStorage.clear();
                }
            }
            $('#btn_start').hide();
            function onStart(){
                window.open('map.php','_self');
            }

            function setup(){
                if(localStorage.getItem("hospital_list")==null){
                    var hospital = hospital_data;
                    localStorage.setItem("hospital_list",JSON.stringify(hospital));
                    console.log("saved hospital_data");
                }else{
                    var hospital = hospital_data;
                    var saved_hospital = JSON.parse(localStorage.getItem("hospital_list"));
                    var blChange = false;
                    for(var i=0; i<saved_hospital.length; i++){
                        if(saved_hospital[i].name!=hospital[i].name||
                           saved_hospital[i].location.lat!=hospital[i].location.lat||
                           saved_hospital[i].location.long!=hospital[i].location.long||
                           saved_hospital[i].contact!=hospital[i].contact
                          ){
                            blChange = true;
                            break;
                        }
                    }
                    if(blChange){
                        localStorage.setItem("hospital_list",JSON.stringify(hospital));
                    }
                }
                if(localStorage.getItem("experiment_paper")==null){
                    var experiment_paper = experiment_paper_structure;
                    localStorage.setItem("experiment_paper",JSON.stringify(experiment_paper));
                    console.log("saved hospital_data");
                }
                $('#btn_start').show();
            }                                                            
            setup();

        </script>        
    </body>

</html>