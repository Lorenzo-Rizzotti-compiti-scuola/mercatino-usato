<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        echo json_encode(["status" => "error", "message" => "Only GET requests are allowed"]);
        exit();
    }

    if (!isset($_GET['ad_id'])) {
        echo json_encode(["status" => "error", "message" => "Product ID is required"]);
        exit();
    }

    $ad_id = $_GET['ad_id'];

    $sql = "SELECT proposals.*, users.first_name, users.last_name, proposals.status FROM proposals JOIN users ON proposals.user_id = users.id WHERE proposals.ad_id = ?";
    $stmt = DatabaseConnection::getConnection()->prepare($sql);
    $stmt->bind_param('i', $ad_id);

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
        exit();
    }

    $result = $stmt->get_result();
    $proposals = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["status" => "success", "data" => $proposals]);
?>
