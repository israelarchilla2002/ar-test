<?php
    //Cabeceras
    header("Content-Type: application/json; chartset=UTF-8");

    //Datos de la conexión
    include_once("variables/connection.php");

    $con = new mysqli($server, $user, $pass, $db);

    if($con->connect_error){
        die(json_encode(["error" => "ERROR: Fallo al conectar con la BD: " . $con->connect_error]));
    }

    //selecciono el modelo test1 para probar
    $consulta = "SELECT sz_model, clr_model FROM modelos WHERE id='test1' LIMIT 1";
    $resultado = $con->query($consulta);

    //Mappeo de datos al modelo
    if($resultado->num_rows > 0){
        $col = $resultado->fetch_assoc();

        $res = array(
            "color" => $col['clr_model'],
            "size" => $col['sz_model']
        );
        
        echo json_encode($res);
    } else {
        echo json_encode(["mensaje" => "El objeto indicado no existe"]);
    }
?>