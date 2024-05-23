<?php
    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        echo json_encode(["status" => "error", "message" => "Only GET requests are allowed"]);
        exit();
    }

    $sql = "SELECT advertisements.*, users.first_name, users.last_name FROM advertisements JOIN users ON advertisements.user_id = users.id";

    $stmt = DatabaseConnection::getConnection()->prepare($sql);

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        exit();
    }

    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["status" => "success", "data" => $products]);
