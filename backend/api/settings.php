<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query("SELECT * FROM settings ORDER BY `key`");
    $result = [];
    while ($row = $stmt->fetch()) {
        $result[$row['key']] = $row['value'];
    }
    jsonResponse($result);
}

if ($action === 'save') {
    $data = getJsonBody();
    if (!$data) jsonResponse(['error' => 'No data'], 400);
    $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
    foreach ($data as $key => $value) {
        $stmt->execute([$key, $value]);
    }
    jsonResponse(['message' => 'Settings saved']);
}

jsonResponse(['error' => 'Invalid action'], 400);
