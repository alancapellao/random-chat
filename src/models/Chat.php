<?php

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Usuario;

require_once __DIR__ . "/../config/connection.php";

class Chat implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";

        $newConnMsg = [
            'type' => 'newConnection',
            'id' => $conn->resourceId,
            'username' => ''
        ];

        $this->broadcast(json_encode($newConnMsg), $conn);

        $ownIdMsg = [
            'type' => 'ownId',
            'id' => $conn->resourceId
        ];

        $conn->send(json_encode($ownIdMsg));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";

        $disconnectionMsg = [
            'type' => 'disconnection',
            'id' => $conn->resourceId,
            'username' => ''
        ];

        $this->broadcast(json_encode($disconnectionMsg), $conn, $conn->resourceId);

        if (isset($conn->resourceId) && $conn->resourceId != null) {
            $user = new Usuario($conn->resourceId, null);
            $user->delete();
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    protected function broadcast($msg, $from, $disconnectedUserId = null)
    {
        foreach ($this->clients as $client) {
            if ($from !== $client && $client->resourceId !== $disconnectedUserId) {
                $client->send($msg);
            }
        }
    }
}
?>