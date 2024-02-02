<?php
include "cors.php";  // This should handle the CORS setup

$username = $_POST['username'];
$password = $_POST['password'];

function queryUserByUsername($username){
    /*  actual database query to retrieve user information */
    $query = "SELECT * FROM users WHERE username = :username";
    /* // Assuming $pdo is a valid PDO database connection  */
    $statement = $pdo->prepare($query);
    $statement->bindParam("username", $username, PDO::PARAM_STR);
    $statement->execute();

    $user = $statement->fetch(PDO::FETCH_ASSOC);

    return $user ? $user : false;
}

function isValidUser($username, $password) {
    $user = queryUserByUsername($username);

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

if (isValidUser($username, $password)) {
    $token = generateToken($username);
    echo json_encode(["token" => $token]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
}
?>