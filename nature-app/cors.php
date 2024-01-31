<?php
// Function to set CORS headers
function setCorsHeaders() {
    $allowedOrigins = ['http://localhost:5173', 'https://yourproductiondomain.com'];
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
    }
}

// Handling the pre-flight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    setCorsHeaders();
    http_response_code(204); // No Content
    exit;
}

// Set CORS headers for all requests
setCorsHeaders();

// Include external files for additional functions (if you have them)
include_once 'user_validation.php';
include_once 'token_management.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify content type is JSON
    if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
        http_response_code(415); // Unsupported Media Type
        echo json_encode(["status" => "error", "message" => "Invalid content type"]);
        exit;
    }

    // Reading input
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        exit;
    }

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // Validate user credentials
    if (isValidUser($username, $password)) {
        try {
            $token = generateToken($username);
            echo json_encode(["status" => "success", "token" => $token]);
        } catch (Exception $e) {
            // Log the exception
            error_log($e->getMessage());
            http_response_code(500); // Internal Server Error
            echo json_encode(["status" => "error", "message" => "Failed to generate token"]);
        }
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
}

// Dummy implementation for user validation
// Replace with actual validation logic
function isValidUser($username, $password) {
    // TODO: Implement user validation, e.g., against a database
    // Ensure password checks are securely hashed
    return true;
}

// Dummy implementation for token generation
// Replace with actual token management logic
function generateToken($username) {
    // TODO: Implement token generation and handling
    return bin2hex(random_bytes(32));
}
?>