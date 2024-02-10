<?php
include "cors.php"; // Include CORS configuration

// Database configuration
$host = 'your_host';
$db   = 'your_db';
$user = 'your_user';
$pass = 'your_pass';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Establishing a database connection
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Handling login requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Username and password are required"]);
        exit;
    }

    // Function to validate user credentials
    function isValidUser($pdo, $username, $password) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user && password_verify($password, $user['password']);
    }

    // Attempt to authenticate the user
    if (isValidUser($pdo, $username, $password)) {
        // Token generation (replace this with your actual token generation logic)
        $token = bin2hex(random_bytes(32));
        http_response_code(200);
        echo json_encode(["status" => "success", "token" => $token]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
