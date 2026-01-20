<?php
    header("Content-Type: application/json; charset=UTF-8");

    include('../variables/olibd.php'); // Base de datos de Olibest

    if(!isset($_GET['id']) || empty($_GET['id'])){
        die(json_encode(["error" => "ERROR: No se ha pasado el ID del marker."]));
    }

    $primario = (int) $_GET['id']; // ID del tipo primario, lo usaremos para identificar el marcador escaneado actualmente

    $sql = new mysqli($server, $user, $pass, $db); // Establecemos conexion a la BBDD de Olibest

    if($sql->connect_error){
        die(json_encode(["error" => "ERROR: Fallo al conectar con la BD en decanter3.php"]));
    }

    $consulta = "
    SELECT 
    IFNULL(sts.etiqueta, '') AS etiqueta, 
    IFNULL(sts.id, 0) AS id_sts, 
    IFNULL(sts.tipo, 0) AS tiposec, 
    IFNULL(sts.primario, 0) AS primario, 
    IFNULL(sts.medida, '') AS medida, 
    IFNULL(ts.nombre, '') AS nombre_ts, 
    IFNULL(s.valor, 0) AS valor FROM olibest.subtiposecundario sts 
    INNER JOIN olibest.tiposec ts ON ts.id = sts.tipo 
    INNER JOIN olibest.secundario s ON s.sts = sts.id 
    WHERE sts.primario LIKE '$primario' 
    GROUP BY s.sts 
    ORDER BY s.valor desc
    ";

    $res = $sql->query($consulta);

    if($res->num_rows > 0){
        $datos = [];

        while ($fila = $res->fetch_assoc()) {
            $datos[] = $fila;
        }

        echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["error" => "ERROR: El objeto indicado no existe."]);
    }

    mysqli_close($sql);
?>