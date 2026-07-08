<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    jsonResponse(csvRead('menu'));
}

if ($action === 'save') {
    $data = getJsonBody();
    $menu = csvRead('menu');
    if (empty($data['id'])) {
        $data['id'] = time();
        $menu[] = [
            'id' => $data['id'], 'name' => $data['name'], 'category' => $data['category'],
            'diet' => $data['diet'], 'description' => $data['desc'], 'price' => $data['price'],
            'image' => $data['image'], 'special' => !empty($data['special']) ? '1' : '0', 'special_tag' => $data['specialTag'] ?? ''
        ];
    } else {
        foreach ($menu as &$m) {
            if ($m['id'] == $data['id']) {
                $m['name'] = $data['name']; $m['category'] = $data['category']; $m['diet'] = $data['diet'];
                $m['description'] = $data['desc']; $m['price'] = $data['price']; $m['image'] = $data['image'];
                $m['special'] = !empty($data['special']) ? '1' : '0'; $m['special_tag'] = $data['specialTag'] ?? '';
                break;
            }
        }
    }
    csvWrite('menu', $menu);
    jsonResponse(['message' => 'Saved']);
}

if ($action === 'delete') {
    $menu = csvRead('menu');
    $menu = array_values(array_filter($menu, fn($m) => $m['id'] != ($_GET['id'] ?? 0)));
    csvWrite('menu', $menu);
    jsonResponse(['message' => 'Deleted']);
}

jsonResponse(['error' => 'Invalid action'], 400);
