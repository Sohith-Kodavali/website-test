<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    jsonResponse(csvRead('customers'));
}

if ($action === 'register') {
    $data = getJsonBody();
    if (!$data || empty($data['name']) || empty($data['phone'])) {
        jsonResponse(['error' => 'Name and phone required'], 400);
    }
    $customers = csvRead('customers');
    $customers[] = [
        'id' => time(),
        'name' => $data['name'],
        'phone' => $data['phone'],
        'dob' => $data['dob'] ?? '',
        'created_at' => date('Y-m-d H:i:s')
    ];
    csvWrite('customers', $customers);
    jsonResponse(['message' => 'Registered'], 201);
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;
    $customers = csvRead('customers');
    $customers = array_filter($customers, fn($c) => $c['id'] != $id);
    csvWrite('customers', array_values($customers));
    jsonResponse(['message' => 'Deleted']);
}

if ($action === 'export-csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=customers.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID','Name','Phone','DOB','Registered']);
    foreach (csvRead('customers') as $c) {
        fputcsv($output, [$c['id'],$c['name'],$c['phone'],$c['dob'],$c['created_at']]);
    }
    fclose($output);
    exit;
}

if ($action === 'export-pdf') {
    $rows = csvRead('customers');
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>RRK Customers</title>
    <style>body{font-family:sans-serif;padding:20px}h1{color:#C1121F}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f5f5f5}</style></head>
    <body><h1>RRK Chicken - Customers</h1><p>Date: '.date('Y-m-d H:i').' | Total: '.count($rows).'</p>
    <table><tr><th>ID</th><th>Name</th><th>Phone</th><th>DOB</th><th>Registered</th></tr>';
    foreach ($rows as $r) {
        echo "<tr><td>{$r['id']}</td><td>{$r['name']}</td><td>{$r['phone']}</td><td>".($r['dob']?:'—')."</td><td>{$r['created_at']}</td></tr>";
    }
    echo '</table><p style="font-size:11px;color:#999;margin-top:20px">RRK Chicken · Admin Panel</p><script>window.print()</script></body></html>';
    exit;
}

jsonResponse(['error' => 'Invalid action'], 400);
