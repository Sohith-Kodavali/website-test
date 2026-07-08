<?php
require_once __DIR__ . '/../config.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM customers ORDER BY created_at DESC');
    jsonResponse($stmt->fetchAll());
}

if ($action === 'register') {
    $data = getJsonBody();
    if (!$data || empty($data['name']) || empty($data['phone'])) {
        jsonResponse(['error' => 'Name and phone required'], 400);
    }
    $stmt = $pdo->prepare('INSERT INTO customers (name, phone, dob) VALUES (?, ?, ?)');
    $stmt->execute([$data['name'], $data['phone'], $data['dob'] ?? null]);
    jsonResponse(['id' => $pdo->lastInsertId(), 'message' => 'Registered'], 201);
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare('DELETE FROM customers WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['message' => 'Deleted']);
}

if ($action === 'export-csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=customers.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Name', 'Phone', 'DOB', 'Registered']);
    $stmt = $pdo->query('SELECT id, name, phone, dob, created_at FROM customers ORDER BY created_at DESC');
    while ($row = $stmt->fetch()) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}

if ($action === 'export-pdf') {
    $stmt = $pdo->query('SELECT * FROM customers ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>RRK Customers</title>
    <style>body{font-family:sans-serif;padding:20px}h1{color:#C1121F}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f5f5f5}@media print{body{print-color-adjust:exact}}</style></head>
    <body><h1>RRK Chicken - Customers</h1>
    <p>Export date: ' . date('Y-m-d H:i') . ' | Total: ' . count($rows) . '</p>
    <table><tr><th>ID</th><th>Name</th><th>Phone</th><th>DOB</th><th>Registered</th></tr>';
    foreach ($rows as $row) {
        echo "<tr><td>{$row['id']}</td><td>{$row['name']}</td><td>{$row['phone']}</td><td>" . ($row['dob'] ?: '—') . "</td><td>{$row['created_at']}</td></tr>";
    }
    echo '</table><p style="margin-top:20px;font-size:11px;color:#999">RRK Chicken · Printed from Admin Panel</p>
    <script>window.print();</script></body></html>';
    exit;
}

jsonResponse(['error' => 'Invalid action'], 400);
