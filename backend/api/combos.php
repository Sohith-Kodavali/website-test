<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM combos ORDER BY id');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'save') {
    $data = getJsonBody();
    if (empty($data['id'])) {
        $stmt = $pdo->prepare('INSERT INTO combos (name, save_badge, description, price) VALUES (?,?,?,?)');
        $stmt->execute([$data['name'], $data['saveBadge'], $data['desc'], $data['price']]);
        jsonResponse(['id' => $pdo->lastInsertId()], 201);
    } else {
        $stmt = $pdo->prepare('UPDATE combos SET name=?, save_badge=?, description=?, price=? WHERE id=?');
        $stmt->execute([$data['name'], $data['saveBadge'], $data['desc'], $data['price'], $data['id']]);
        jsonResponse(['message' => 'Updated']);
    }
}

if ($action === 'delete') {
    $stmt = $pdo->prepare('DELETE FROM combos WHERE id=?');
    $stmt->execute([$_GET['id']]);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
