<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function getImagesFromFolder($folder) {
    $images = [];
    if (is_dir($folder)) {
        $files = scandir($folder);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif'])) {
                $images[] = str_replace('\\', '/', $folder . '/' . $file);
            }
        }
    }
    return $images;
}

$folder = isset($_GET['folder']) ? $_GET['folder'] : '';
$basePath = 'src/images';

if ($folder) {
    $path = $basePath . '/' . $folder;
    $images = getImagesFromFolder($path);
    echo json_encode($images);
} else {
    echo json_encode([]);
}
?>