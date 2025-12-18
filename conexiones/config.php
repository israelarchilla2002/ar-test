<?php
    header("Content-Type: application/json; charset=UTF-8");

    include('../variables/connection.php');

    if(!isset($_GET['id']) || empty($_GET['id'])){
        die(json_encode(["error" => "ERROR: No se ha pasado el ID del marker."]));
    }

    $model_id = (int) $_GET['id'];

    $con = new mysqli($server, $user, $pass, $db);

    if($con->connect_error){
        die(json_encode(["error" => "ERROR: Fallo al conectar con la BD en config.php: " . $con->connect_error]));
    }

    //selecciono el modelo 1 para probar
    $consulta = "SELECT * FROM modelos WHERE id_model='$model_id'";
    $resultado = $con->query($consulta);

    //Mappeo de datos al modelo
    if($resultado->num_rows > 0){
        $col = $resultado->fetch_assoc();

        $res = array(
            'color' => $col['clr_model'],
            'size' => $col['sz_model'],
            'x' => $col['x'],
            'y' => $col['y'],
            'z' => $col['z'],
            'valor' => $col['valor']
        );
        
        echo json_encode($res);
    } else {
        echo json_encode(["mensaje" => "El objeto indicado no existe"]);
    }

    mysqli_close($con);

?>
