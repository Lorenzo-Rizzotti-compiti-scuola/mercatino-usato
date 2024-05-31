<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        echo json_encode(["status" => "error", "message" => "Only GET requests are allowed"]);
        exit();
    }

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "You are not logged in"]);
        exit();
    }

    $sql = "SELECT email, first_name, last_name, age, class, id FROM users WHERE id = ?";

    $stmt = DatabaseConnection::getConnection()->prepare($sql);
    $stmt->bind_param("i", $_SESSION['user_id']);

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        exit();
    }

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    echo json_encode(["status" => "success", "user" => $user]);
