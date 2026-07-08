<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') { jsonResponse(csvRead('combos')); }

if ($action === 'save') {
    $data = getJsonBody();
    $combos = csvRead('combos');
    if (empty($data['id'])) {
        $combos[] = ['id'=>time(),'name'=>$data['name'],'save_badge'=>$data['saveBadge'],'description'=>$data['desc'],'price'=>$data['price']];
    } else {
        foreach ($combos as &$c) { if ($c['id'] == $data['id']) { $c['name']=$data['name'];$c['save_badge']=$data['saveBadge'];$c['description']=$data['desc'];$c['price']=$data['price'];break; } }
    }
    csvWrite('combos', $combos);
    jsonResponse(['message' => 'Saved']);
}

if ($action === 'delete') {
    $combos = array_values(array_filter(csvRead('combos'), fn($c) => $c['id'] != ($_GET['id'] ?? 0)));
    csvWrite('combos', $combos);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
