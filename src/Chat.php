<?php

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

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
            'id' => $conn->resourceId
        ];

        $this->broadcast(json_encode($newConnMsg), $conn);
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
            'id' => $conn->resourceId
        ];

        $this->broadcast(json_encode($disconnectionMsg), $conn, $conn->resourceId);
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
