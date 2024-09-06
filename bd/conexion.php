<?php
$host = "localhost";
$usuario = "root";
$clave = "";
$bd = "votaciones";

$conexion = mysqli_connect($host, $usuario, $clave, $bd);
$conexion -> set_charset("utf8");
if (!$conexion) {
    die("La conexión ha fallado: " . mysqli_connect_error());
}

if (!$conexion->set_charset("utf8")) {
    printf("Error cargando el conjunto de caracteres utf8: %s\n", $conexion->error);
    exit();
}
?>
