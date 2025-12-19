<?php
    header("Content-Type: application/json; charset=UTF-8");

    include('../variables/olibd.php');

    $con = new mysqli($server, $user, $pass, $db);

    if($con->connect_error){
        die(json_encode(["error" => "ERROR: Fallo de conexión con la BD en getId.php: " . $con->connect_error]));
    }

    $sql = "SELECT id FROM subtipoprimario";
    $res = $con->query($sql);

    $ids = [];

    while ($fila = $res->fetch_assoc()){
        $ids[] = $fila['id'];
    }

    $con-> close();
    echo json_encode($ids);
?>