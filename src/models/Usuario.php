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
        global $pdo;

        $query = $pdo->prepare("SELECT id, username FROM usuarios WHERE id = ? or username = ?");
        $query->execute(array($this->id, $this->username));

        if ($query->rowCount()) {
            return false;
        } else {
            $query = $pdo->prepare("INSERT INTO usuarios(id, username) values(?, ?)");
            $query->execute(array($this->id, $this->username));
            return true;
        }
    }

    public function delete()
    {
        global $pdo;

        $query = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        $query->execute(array($this->id));
        return true;
    }
}
?>