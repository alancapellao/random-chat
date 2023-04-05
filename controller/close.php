<?php

if (isset($_POST['id']) && !empty($_POST['id'])) {

    require '../config/connection.php';
    require '../models/Usuario.php';

    $user = new Usuario($_POST['id'], null);
    
    if ($user->close() == true) {
        echo json_encode(array("erro" => 0, "mensagem" => "Close!"));
    } else {
        echo json_encode(array("erro" => 1, "mensagem" => "Error."));
    }
}

?>