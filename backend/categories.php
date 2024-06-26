<?php
    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        echo json_encode(["status" => "error", "message" => "Only GET requests are allowed"]);
        exit();
    }

    $sql = "SELECT * FROM categories";

    $stmt = DatabaseConnection::getConnection()->prepare($sql);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $categories = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "categories" => $categories]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
        exit();
    }

    $stmt->close();
