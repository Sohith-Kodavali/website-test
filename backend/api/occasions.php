<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') { jsonResponse(csvRead('occasions')); }

if ($action === 'save') {
    $data = getJsonBody();
    $occasions = csvRead('occasions');
    if (empty($data['id'])) {
        $occasions[] = ['id'=>time(),'emoji'=>$data['emoji'],'label'=>$data['label']];
    } else {
        foreach ($occasions as &$o) { if ($o['id'] == $data['id']) { $o['emoji']=$data['emoji'];$o['label']=$data['label'];break; } }
    }
    csvWrite('occasions', $occasions);
    jsonResponse(['message' => 'Saved']);
}

if ($action === 'delete') {
    $occasions = array_values(array_filter(csvRead('occasions'), fn($o) => $o['id'] != ($_GET['id'] ?? 0)));
    csvWrite('occasions', $occasions);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
