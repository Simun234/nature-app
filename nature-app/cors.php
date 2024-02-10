<?php
// Function to set CORS headers
function setCorsHeaders() {
    $allowedOrigins = ['http://localhost:5173', 'https://yourproductiondomain.com'];
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
    }
}

// Handling the pre-flight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    setCorsHeaders();
    // No Content response
    http_response_code(204);
    exit;
}

// Set CORS headers for all other requests
setCorsHeaders();
?>
