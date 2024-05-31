<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        echo json_encode(["status" => "error", "message" => "Only GET requests are allowed"]);
        exit();
    }

    $self = isset($_GET['self']) && $_GET['self'] === 'true';
    $category = isset($_GET['category']) ? $_GET['category'] : false;

    $sql = "SELECT advertisements.*, users.first_name, users.last_name FROM advertisements JOIN users ON advertisements.user_id = users.id";

    $conditions = [];
    $params = [];
    $types = '';

    if ($self && isset($_SESSION['user_id'])) {
        $conditions[] = "advertisements.user_id = ?";
        $params[] = $_SESSION['user_id'];
        $types .= 'i';
    }

    if ($category) {
        $conditions[] = "advertisements.category_id = ?";
        $params[] = $category;
        $types .= 'i';
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $stmt = DatabaseConnection::getConnection()->prepare($sql);

    if (!empty($conditions)) {
        $stmt->bind_param($types, ...$params);
    }

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        exit();
    }

    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["status" => "success", "data" => $products]);
?>
