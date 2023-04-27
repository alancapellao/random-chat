<?php

require_once '../config/connection.php';

if (isset($_POST['id']) && !empty($_POST['id']) && isset($_POST['username']) && !empty($_POST['username'])) {

    require_once '../models/Usuario.php';

    $user = new Usuario($_POST['id'], $_POST['username']);

    if ($user->insert() == true) {
        echo json_encode(array("erro" => 0, "mensagem" => "Error."));
    } else {
        echo json_encode(array("erro" => 1, "mensagem" => "User already exists."));
    }
}
