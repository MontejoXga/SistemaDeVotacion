<?php
    

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CONSULTA DE CANDIDATOS////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

    function obtenerCandidato(){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion, "SELECT * FROM candidatos");
        $result = array();

        while($candidato = mysqli_fetch_array($consulta)){
            $result[] = array( 
                'idCandidato' => $candidato['id_candidato'],
                'nomCandidato' => $candidato['nom_candidato'],
                'apeCandidato' => $candidato['ape_candidato'],
                'nomPartido' => $candidato['nom_partido'],
            );
        }
        echo json_encode($result);
    }

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CONSULTA DEPARTAMENTO/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
    function obtenerDepartamentos(){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion, "SELECT * FROM ubigeo_peru_departments");
        $result = array();

        while($departamento = mysqli_fetch_array($consulta)){
            $result[] = array( 
                'idDepartamento' => $departamento['id'],
                'nomDepartamento' => $departamento['name'],
            );
        }
        echo json_encode($result);
    }

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CONSULTA PROVINCIA////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

    function obtenerProvincias($idDepartamento){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion,"SELECT * FROM ubigeo_peru_provinces WHERE department_id = $idDepartamento");
        while ($provincia = mysqli_fetch_array($consulta)) {
            $result[]=array(
                'idProvincia' => $provincia['id'],
                'nomProvincia' => $provincia['name'],
            );
        }
        echo json_encode($result);
    }

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CONSULTA DISTRITO/////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

    function obtenerDistrito($idProvincia){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion,"SELECT * FROM ubigeo_peru_districts WHERE province_id = $idProvincia");
        while ($provincia = mysqli_fetch_array($consulta)) {
            $result[]=array(
                'idDistrito' => $provincia['id'],
                'nomDistrito' => $provincia['name'],
            );
        }
        echo json_encode($result);
    }

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////GUARDAR VOTO///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
function guardar($datosCombinados){
    include '../bd/conexion.php';

    date_default_timezone_set('America/Lima');
    $fecha = date("Y-m-d H:i:s");
    $respuesta = array(
        'status' => 1, 
        'message' => '',
    );
    parse_str($datosCombinados, $datos);

    $VotoNomApe = $datos['nombre'];
    $votoAlias = $datos['alias'];
    $VotoDni = $datos['dni'];
    $VotoEmail = $datos['email'];
    $VotoDepartamento = $datos['departamento'];
    $VotoProvincia = $datos['provincia'];
    $VotoDistrito = $datos['distrito'];
    $VotoCandidato = $datos['candidato'];

    $checkbox1 = $datos['checkbox1'];

    $consulta = "SELECT dni FROM votos WHERE dni = '$VotoDni'";
    $peticion = mysqli_query($conexion, $consulta);


    if (mysqli_num_rows($peticion)>0) {
        $respuesta['status'] = 0; 
        $respuesta['message'] = 'Usted ya realizo su voto con anterioridad';

    }else{

        if (isset($datos['checkbox2'])) {
        $checkbox2 = $datos['checkbox2'];

        $consulta = "INSERT INTO votos(id_candidato, nombre, dni, fecha, difusion1, difusion2, alias, email, departamento, provincia, distrito) 
                    VALUES ('$VotoCandidato', '$VotoNomApe','$VotoDni','$fecha','$checkbox1', '$checkbox2', '$votoAlias','$VotoEmail','$VotoDepartamento', '$VotoProvincia','$VotoDistrito')";
        $insertar = mysqli_query($conexion,$consulta);

        }else{
            $consulta = "INSERT INTO votos(id_candidato, nombre, dni, fecha, difusion1, alias, email, departamento, provincia, distrito) 
                        VALUES ('$VotoCandidato', '$VotoNomApe','$VotoDni','$fecha','$checkbox1', '$votoAlias','$VotoEmail','$VotoDepartamento', '$VotoProvincia','$VotoDistrito')";
            $insertar = mysqli_query($conexion,$consulta);
        }
        
        if (!$insertar) {
            $respuesta['status'] = 0; 
            $respuesta['message'] = 'Su voto no pudo ser procesado';
        } else {
            $respuesta['status'] = 1; 
            $respuesta['message'] = 'Su voto se realizo exitosamente';
        }
    }

    
    echo json_encode($respuesta);
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

    if( isset($_POST['idDepartamento']) ) {
        $idDepartamento = $_POST['idDepartamento'];
        obtenerProvincias($idDepartamento);

    } else if( isset($_POST['idProvincia']) ) {
        $idProvincia = $_POST['idProvincia'];
        obtenerDistrito($idProvincia);

    }else if( isset($_POST['obtenerCandidato'])){
        obtenerCandidato();
    }else if(isset($_POST['datosCombinados'])) {
        guardar($_POST['datosCombinados']);
    }else{
        obtenerDepartamentos();
    }

?>