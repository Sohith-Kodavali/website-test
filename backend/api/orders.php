<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'save') {
    $data = getJsonBody();
    $stmt = $pdo->prepare('INSERT INTO orders (items, total, mode) VALUES (?, ?, ?)');
    $stmt->execute([$data['items'], $data['total'], $data['mode'] ?? 'Takeaway']);
    jsonResponse(['id' => $pdo->lastInsertId()], 201);
}

jsonResponse(['error' => 'Invalid action'], 400);
