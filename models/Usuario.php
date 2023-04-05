<?php

class Usuario
{
    private $id;
    private $username;

    public function __construct($id, $username)
    {
        $this->id = $id;
        $this->username = $username;
    }

    public function insert()
    {
        global $conn;

        $query = $conn->prepare("SELECT id, username FROM usuarios WHERE id = ? or username = ?");
        $query->execute(array($this->id, $this->username));

        if ($query->rowCount()) {
            return false;
        } else {
            $query = $conn->prepare("INSERT INTO usuarios(id, username) values(?, ?)");
            $query->execute(array($this->id, $this->username));
            return true;
        }
    }

    public function close()
    {
        global $conn;

        $query = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
        $query->execute(array($this->id));
        return true;
    }
}

?>