<?php
// Prevent any output before headers
ob_start();

// Enable error reporting for logging only
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Log function
=======
function logDebug($message, $data = null) {
    $logFile = 'debug.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}";
    if ($data) {
        $logMessage .= ': ' . print_r($data, true);
    }
    error_log($logMessage . "\n", 3, $logFile);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Length');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    logDebug('Received file upload request', $_FILES);

    if (!isset($_FILES['image']) || !isset($_POST['category'])) {
        logDebug('Missing required parameters');
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
        exit;
    }

    $image = $_FILES['image'];
    $category = $_POST['category'];

    // Validate image
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($image['type'], $allowed_types)) {
        logDebug('Invalid file type', $image['type']);
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF are allowed.']);
        exit;
    }

    // Determine upload directory based on category
    $base_path = 'src/images/';
    if (isset($_POST['type']) && $_POST['type'] === 'perfumes') {
        $base_path .= 'perfumes/';
        $allowed_categories = ['arabian_oud', 'french_perfumes', 'luxury_brands'];
    } else {
        $base_path .= 'traditional/';
        $allowed_categories = ['Qatari', 'Emarati', 'Omani', 'Somali'];
    }

    if (!in_array($category, $allowed_categories)) {
        logDebug('Invalid category', $category);
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid category']);
        exit;
    }

    // Create upload path
    $upload_dir = $base_path . $category . '/';
    if (!is_dir($upload_dir)) {
        logDebug('Creating directory', $upload_dir);
        if (!mkdir($upload_dir, 0777, true)) {
            logDebug('Failed to create directory', error_get_last());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
            exit;
        }
    }

    // Generate unique filename
    $extension = pathinfo($image['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $upload_path = $upload_dir . $filename;

    logDebug('Attempting to move uploaded file', [
        'from' => $image['tmp_name'],
        'to' => $upload_path
    ]);

    // Move uploaded file
    if (move_uploaded_file($image['tmp_name'], $upload_path)) {
        logDebug('File upload successful', $upload_path);
        echo json_encode([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'filename' => $filename,
            'path' => str_replace('\\', '/', $upload_path)
        ]);
    } else {
        logDebug('File upload failed', [
            'error' => error_get_last(),
            'permissions' => [
                'upload_dir' => is_writable($upload_dir),
                'tmp_file' => is_readable($image['tmp_name'])
            ]
        ]);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error uploading file']);
    }
} else {
    logDebug('Invalid request method', $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
=======