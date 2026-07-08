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
    require_once __DIR__ . '/../libs/tcpdf.php';
    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    $pdf->SetCreator('RRK Chicken');
    $pdf->SetTitle('Customers Export');
    $pdf->AddPage();
    $html = '<h1>RRK Chicken - Customers</h1><table border="1" cellpadding="5"><tr><th>ID</th><th>Name</th><th>Phone</th><th>DOB</th><th>Registered</th></tr>';
    $stmt = $pdo->query('SELECT * FROM customers ORDER BY created_at DESC');
    while ($row = $stmt->fetch()) {
        $html .= "<tr><td>{$row['id']}</td><td>{$row['name']}</td><td>{$row['phone']}</td><td>{$row['dob']}</td><td>{$row['created_at']}</td></tr>";
    }
    $html .= '</table>';
    $pdf->writeHTML($html, true, false, true, false, '');
    $pdf->Output('customers.pdf', 'D');
    exit;
}

jsonResponse(['error' => 'Invalid action'], 400);
