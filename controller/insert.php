<?php

if (isset($_POST['id']) && !empty($_POST['id']) && isset($_POST['username']) && !empty($_POST['username'])) {

    require '../config/connection.php';
    require '../models/Usuario.php';

    $user = new Usuario($_POST['id'], $_POST['username']);
    
    if ($user->insert() == true) {
        echo json_encode(array("erro" => 0, "mensagem" => "Successfully registered!"));
    } else {
        echo json_encode(array("erro" => 1, "mensagem" => "User already exists."));
    }
}

?>