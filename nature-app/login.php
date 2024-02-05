<?php
include "cors.php";  // This should handle the CORS setup

// Database connection setup
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
try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Function definitions
function queryUserByUsername($pdo, $username) {
    $query = "SELECT * FROM users WHERE username = :username";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":username", $username, PDO::PARAM_STR);
    $statement->execute();
    $user = $statement->fetch(PDO::FETCH_ASSOC);
    return $user ? $user : false;
}

function isValidUser($pdo, $username, $password) {
    $user = queryUserByUsername($pdo, $username);
    if ($user && password_verify($password, $user['password'])) {
        return true;
    }
    return false;
}

function generateToken($username) {
    $randomBytes = random_bytes(32);
    $token = base64_encode($randomBytes);
    $token .= '_' . $username;
    return $token;
}

// Request handling
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Login or token generation request
    $username = $_POST['username'];
    $password = $_POST['password'];
    if (isValidUser($pdo, $username, $password)) {
        $token = generateToken($username);
        echo json_encode(["token" => $token]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
}
?>
