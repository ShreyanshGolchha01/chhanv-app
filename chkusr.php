<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db.php';

// Function to send JSON response
function sendResponse($data) {
    echo json_encode($data);
    exit();
}

// Function to send error response
function sendError($message) {
    echo json_encode("0");
    exit();
}

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    if (!$data || !isset($data['t1']) || !isset($data['t2'])) {
        sendError("Missing required fields");
    }
    
    $phoneNumber = trim($data['t1']);
    $password = trim($data['t2']);
    
    // Validate phone number format (10 digits)
    if (!preg_match('/^[6-9]\d{9}$/', $phoneNumber)) {
        sendError("Invalid phone number format");
    }
    
    // Validate password
    if (strlen($password) < 6) {
        sendError("Password too short");
    }
    
    // Prepare SQL query to check user credentials
    $sql = "SELECT id, firstName, lastName, phoneNumber FROM users WHERE phoneNumber = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        error_log("Database prepare failed: " . $conn->error);
        sendError("Database error");
    }
    
    // Bind parameters
    $stmt->bind_param("ss", $phoneNumber, $password);
    
    // Execute query
    if (!$stmt->execute()) {
        error_log("Database execute failed: " . $stmt->error);
        sendError("Database error");
    }
    
    // Get result
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User found - Login successful
        $user = $result->fetch_assoc();
        
        // Prepare response in format: "id,name"
        $userId = $user['id'];
        $userName = trim($user['firstName'] . ' ' . $user['lastName']);
        
        // If name is empty, use phone number
        if (empty($userName)) {
            $userName = $user['phoneNumber'];
        }
        
        $response = $userId . ',' . $userName;
        
        // Log successful login
        error_log("Login successful for user: " . $phoneNumber);
        
        sendResponse($response);
    } else {
        // User not found or wrong credentials
        error_log("Login failed for user: " . $phoneNumber);
        sendError("Invalid credentials");
    }
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendError("Server error");
} finally {
    // Close statement and connection
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
