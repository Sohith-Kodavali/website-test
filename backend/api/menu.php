<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM menu ORDER BY id');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'get') {
    $stmt = $pdo->prepare('SELECT * FROM menu WHERE id = ?');
    $stmt->execute([$_GET['id']]);
    jsonResponse($stmt->fetch());
}

if ($action === 'save') {
    $data = getJsonBody();
    if (empty($data['id'])) {
        $stmt = $pdo->prepare('INSERT INTO menu (name, category, diet, description, price, image, special, special_tag) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([$data['name'], $data['category'], $data['diet'], $data['desc'], $data['price'], $data['image'], $data['special'] ? 1 : 0, $data['specialTag'] ?? null]);
        jsonResponse(['id' => $pdo->lastInsertId()], 201);
    } else {
        $stmt = $pdo->prepare('UPDATE menu SET name=?, category=?, diet=?, description=?, price=?, image=?, special=?, special_tag=? WHERE id=?');
        $stmt->execute([$data['name'], $data['category'], $data['diet'], $data['desc'], $data['price'], $data['image'], $data['special'] ? 1 : 0, $data['specialTag'] ?? null, $data['id']]);
        jsonResponse(['message' => 'Updated']);
    }
}

if ($action === 'delete') {
    $stmt = $pdo->prepare('DELETE FROM menu WHERE id=?');
    $stmt->execute([$_GET['id']]);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
