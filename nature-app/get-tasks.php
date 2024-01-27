<?php
// Ensure the script only accepts POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    exit(json_encode(["error" => "Invalid request method"]));
}

// Collect input data
$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? null; // Using null coalescing operator to avoid undefined index notice

if (!$token) {
    http_response_code(400); // Bad Request
    exit(json_encode(["error" => "Token is required"]));
}

// Validate the token
if (!isValidToken($token)) {
    http_response_code(403); // Forbidden
    exit(json_encode(["error" => "Invalid or expired token"]));
}

try {
    // Fetch tasks from Firestore
    $tasks = fetchTasksFromFirestore();
    
    // Set response code to 200 OK and echo the tasks in JSON format
    http_response_code(200);
    header('Access-Control-Allow-Origin: http://localhost:5173'); // Set Access-Control-Allow-Origin header
    echo json_encode($tasks);
} catch (Exception $e) {
    // If something goes wrong, send a 500 Internal Server Error
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>