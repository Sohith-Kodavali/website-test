<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    jsonResponse(csvRead('raw'));
}

if ($action === 'save') {
    $data = getJsonBody();
    $raw = csvRead('raw');
    if (empty($data['id'])) {
        $raw[] = ['id'=>time(),'name'=>$data['name'],'image'=>$data['image'],'price'=>$data['price'],'weight'=>$data['weight'],'tag'=>$data['tag']];
    } else {
        foreach ($raw as &$r) {
            if ($r['id'] == $data['id']) { $r['name']=$data['name'];$r['image']=$data['image'];$r['price']=$data['price'];$r['weight']=$data['weight'];$r['tag']=$data['tag'];break; }
        }
    }
    csvWrite('raw', $raw);
    jsonResponse(['message' => 'Saved']);
}

if ($action === 'delete') {
    $raw = csvRead('raw');
    $raw = array_values(array_filter($raw, fn($r) => $r['id'] != ($_GET['id'] ?? 0)));
    csvWrite('raw', $raw);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
