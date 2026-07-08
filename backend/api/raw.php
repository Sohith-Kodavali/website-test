<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM raw ORDER BY id');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'save') {
    $data = getJsonBody();
    if (empty($data['id'])) {
        $stmt = $pdo->prepare('INSERT INTO raw (name, image, price, weight, tag) VALUES (?,?,?,?,?)');
        $stmt->execute([$data['name'], $data['image'], $data['price'], $data['weight'], $data['tag']]);
        jsonResponse(['id' => $pdo->lastInsertId()], 201);
    } else {
        $stmt = $pdo->prepare('UPDATE raw SET name=?, image=?, price=?, weight=?, tag=? WHERE id=?');
        $stmt->execute([$data['name'], $data['image'], $data['price'], $data['weight'], $data['tag'], $data['id']]);
        jsonResponse(['message' => 'Updated']);
    }
}

if ($action === 'delete') {
    $stmt = $pdo->prepare('DELETE FROM raw WHERE id=?');
    $stmt->execute([$_GET['id']]);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
