<?php
include "cors.php";  // This should handle the CORS setup

$username = $_POST['username'];
$password = $_POST['password'];

function isValidUser($username, $password) {
    $user = queryUserByUsername($username);

    if ($user && $user['password'] === $password) {
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

if (isValidUser($username, $password)) {
    $token = generateToken($username);
    echo json_encode(["token" => $token]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
}
?>