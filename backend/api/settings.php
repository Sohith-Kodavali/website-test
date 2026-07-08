<?php
require_once __DIR__ . '/../config.php';
$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $settings = csvRead('settings');
    $result = [];
    foreach ($settings as $s) { $result[$s['key']] = $s['value']; }
    jsonResponse($result);
}

if ($action === 'save') {
    $data = getJsonBody();
    if (!$data) jsonResponse(['error' => 'No data'], 400);
    $settings = csvRead('settings');
    foreach ($data as $key => $value) {
        $found = false;
        foreach ($settings as &$s) { if ($s['key'] === $key) { $s['value'] = $value; $found = true; break; } }
        if (!$found) { $settings[] = ['key' => $key, 'value' => $value]; }
    }
    csvWrite('settings', $settings);
    jsonResponse(['message' => 'Saved']);
}

jsonResponse(['error' => 'Invalid action'], 400);
