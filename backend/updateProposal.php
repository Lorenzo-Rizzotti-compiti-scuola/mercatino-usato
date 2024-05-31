<?php
    session_start();

    require_once 'DatabaseConnection.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
        exit();
    }

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "You must be logged in to update a proposal"]);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['proposal_id']) || !isset($data['status'])) {
        echo json_encode(["status" => "error", "message" => "Proposal ID and status are required"]);
        exit();
    }

    $proposal_id = $data['proposal_id'];
    $status = $data['status'];

    $sql = "UPDATE proposals SET status = ? WHERE id = ?";
    $stmt = DatabaseConnection::getConnection()->prepare($sql);
    $stmt->bind_param('si', $status, $proposal_id);

    try {
        $stmt->execute();
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
        exit();
    }

    if ($status === 'accepted') {
        $sql = "UPDATE proposals SET status = 'rejected' WHERE id != ? AND ad_id = (SELECT ad_id FROM proposals WHERE id = ?)";
        $stmt = DatabaseConnection::getConnection()->prepare($sql);
        $stmt->bind_param('ii', $proposal_id, $proposal_id);

        try {
            $stmt->execute();
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Something went wrong: " . $e->getMessage()]);
            exit();
        }
    }

    echo json_encode(["status" => "success", "message" => "Proposal updated successfully"]);
?>
