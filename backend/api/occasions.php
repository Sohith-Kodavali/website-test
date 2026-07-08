<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM occasions ORDER BY id');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'save') {
    $data = getJsonBody();
    if (empty($data['id'])) {
        $stmt = $pdo->prepare('INSERT INTO occasions (emoji, label) VALUES (?,?)');
        $stmt->execute([$data['emoji'], $data['label']]);
        jsonResponse(['id' => $pdo->lastInsertId()], 201);
    } else {
        $stmt = $pdo->prepare('UPDATE occasions SET emoji=?, label=? WHERE id=?');
        $stmt->execute([$data['emoji'], $data['label'], $data['id']]);
        jsonResponse(['message' => 'Updated']);
    }
}

if ($action === 'delete') {
    $stmt = $pdo->prepare('DELETE FROM occasions WHERE id=?');
    $stmt->execute([$_GET['id']]);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
