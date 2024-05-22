<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
        exit();
    }

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "You must be logged in to create a new product"]);
        exit();
    }

    if (!isset($_FILES['image']) || !isset($_POST['category_id']) || !isset($_POST['description'])) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }

    $category_id = $_POST['category_id'];
    $description = $_POST['description'];
    $title = $_POST['title'];
    $user_id = $_SESSION['user_id'];

    // Validate and move the uploaded file
    $image = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($image['type'], $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Invalid image format, only JPG, PNG and WEBP files are allowed, you uploaded a file of type: " . $image['type']]);
        exit();
    }

    $uploadDir = __DIR__ . '/images/';
    $imageName = uniqid('img_', true) . '.' . pathinfo($image['name'], PATHINFO_EXTENSION);
    $imagePath = $uploadDir . $imageName;

    if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
        echo json_encode(["status" => "error", "message" => "Failed to upload image"]);
        exit();
    }

    $sql = "INSERT INTO advertisements (user_id, category_id, title, description, image_url) VALUES (?, ?, ?, ?, ?)";
    $stmt = DatabaseConnection::getConnection()->prepare($sql);

    $stmt->bind_param("iisss", $user_id, $category_id, $title, $description, $imageName);

    try {
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Product created successfully"]);
    } catch (Exception $e) {
        // Attempt to delete the uploaded file if database operation fails
        unlink($imagePath);
        echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
        exit();
    }
