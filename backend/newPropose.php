<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
        exit();
    }

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "You must be logged in to create a new proposal"]);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['ad_id']) || !isset($data['price'])) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }

    $ad_id = $data['ad_id'];
    $price = $data['price'];
    $user_id = $_SESSION['user_id'];

    $sql = "INSERT INTO proposals (ad_id, user_id, price, date_time) VALUES (?, ?, ?, NOW())";
    $stmt = DatabaseConnection::getConnection()->prepare($sql);
    $stmt->bind_param("iids", $ad_id, $user_id, $price);

    try {
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Proposal created successfully"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
        exit();
    }
?>
