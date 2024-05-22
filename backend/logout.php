<?php
    session_start();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
        exit();
    }

    session_destroy();
    echo json_encode(["status" => "success"]);
