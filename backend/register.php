<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password']) || !isset($data['firstname']) || !isset($data['lastname']) || !isset($data['age']) || !isset($data['class'])) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }

    $email = $data['email'];
    $password = $data['password'];
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];
    $age = $data['age'];
    $class = $data['class'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit();
    }

    $password = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (email, password_hash, first_name, last_name, age, class) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = DatabaseConnection::getConnection()->prepare($sql);
    $stmt->bind_param("ssssis", $email, $password, $firstname, $lastname, $age, $class);

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        exit();
    }

    $_SESSION['user_id'] = $stmt->insert_id;
    echo json_encode(["status" => "success"]);
