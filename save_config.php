<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['file']) && isset($input['content'])) {
        $file = $input['file'];
        $content = $input['content'];

        // Validate file path to prevent directory traversal
        $allowedPaths = [
            'src/images/traditional/config.js',
            'src/images/perfumes/config.js'
        ];

        if (in_array($file, $allowedPaths)) {
            if (file_put_contents($file, $content)) {
                echo json_encode(['success' => true, 'message' => 'Configuration saved successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error saving configuration']);
            }
        } else {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Invalid file path']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>