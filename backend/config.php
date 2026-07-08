<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

define('DATA_DIR', __DIR__ . '/data');

if (!is_dir(DATA_DIR)) { mkdir(DATA_DIR, 0777, true); }

function csvRead($file) {
    $path = DATA_DIR . '/' . $file . '.csv';
    if (!file_exists($path)) return [];
    $rows = array_map('str_getcsv', file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
    if (empty($rows)) return [];
    $headers = $rows[0];
    $data = [];
    for ($i = 1; $i < count($rows); $i++) {
        $row = [];
        foreach ($headers as $j => $h) { $row[$h] = $rows[$i][$j] ?? ''; }
        $data[] = $row;
    }
    return $data;
}

function csvWrite($file, $data) {
    $path = DATA_DIR . '/' . $file . '.csv';
    if (empty($data)) { file_put_contents($path, ''); return; }
    $headers = array_keys($data[0]);
    $temp = tempnam(DATA_DIR, 'tmp_');
    $fp = fopen($temp, 'w');
    fputcsv($fp, $headers);
    foreach ($data as $row) { fputcsv($fp, array_values($row)); }
    fclose($fp);
    rename($temp, $path);
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody() {
    return json_decode(file_get_contents('php://input'), true);
}

// Seed default data if files don't exist
if (!file_exists(DATA_DIR . '/menu.csv')) {
    csvWrite('menu', [
        ['id','name','category','diet','description','price','image','special','special_tag'],
        ['1','Signature Grilled Chicken','chicken','nonveg','Flame-grilled with house spices.','249','2.jpeg','1','15% OFF'],
        ['2','Hyderabadi Biryani','biryani','nonveg','Slow-dum with basmati & saffron.','199','3.jpeg','1','Bestseller'],
        ['3','Crispy Chicken 65','starters','nonveg','Spicy, crunchy, addictive.','179','4.jpeg','1','Hot'],
        ['4','Chicken Lollipop','starters','nonveg','6 pcs, tangy glaze.','189','16.jpeg','0',''],
        ['5','Chicken Combo Meal','meals','nonveg','Rice, curry, starter & drink.','279','17.jpeg','0',''],
        ['6','Family Feast Pack','family','nonveg','Serves 4 · biryani + starters.','699','5.jpeg','1','Combo'],
        ['7','Fresh Lime Soda','beverages','veg','Chilled & refreshing.','59','18.jpeg','0',''],
        ['8','Gulab Jamun (2 pcs)','desserts','veg','Warm, syrup-soaked.','69','19.jpeg','0','']
    ]);
}

if (!file_exists(DATA_DIR . '/raw.csv')) {
    csvWrite('raw', [
        ['id','name','image','price','weight','tag'],
        ['1','Boneless','7.jpeg','320','1 kg','Fresh Today'],
        ['2','Curry Cut','8.jpeg','240','1 kg','Fresh Today'],
        ['3','Whole Chicken','9.jpeg','210','1.2 – 1.5 kg','Fresh Today'],
        ['4','Lollipop','20.jpeg','280','500 g','Fresh Today'],
        ['5','Wings','21.jpeg','260','500 g','Fresh Today'],
        ['6','Leg Piece','22.jpeg','290','1 kg','Fresh Today'],
        ['7','Breast','23.jpeg','330','1 kg','Fresh Today']
    ]);
}

if (!file_exists(DATA_DIR . '/combos.csv')) {
    csvWrite('combos', [
        ['id','name','save_badge','description','price'],
        ['1','Party Starter Combo','Save ₹180','Biryani x2 + Chicken 65 + Lollipop + 4 drinks.','1299'],
        ['2','Family Feast','Save ₹250','Family pack + grilled chicken + desserts + drinks.','1599'],
        ['3','Grand Celebration','Save ₹320','Serves 10 · biryani, starters, mains & sweets.','2499']
    ]);
}

if (!file_exists(DATA_DIR . '/occasions.csv')) {
    csvWrite('occasions', [
        ['id','emoji','label'],
        ['1','🎂','Birthday'],
        ['2','💼','Office'],
        ['3','💍','Wedding'],
        ['4','👪','Family'],
        ['5','🎊','Festival']
    ]);
}

if (!file_exists(DATA_DIR . '/customers.csv')) {
    csvWrite('customers', [['id','name','phone','dob','created_at']]);
}

if (!file_exists(DATA_DIR . '/orders.csv')) {
    csvWrite('orders', [['id','items','total','mode','created_at']]);
}

if (!file_exists(DATA_DIR . '/settings.csv')) {
    csvWrite('settings', [
        ['key','value'],
        ['admin_user','rrk'],
        ['admin_pass','admin1234'],
        ['whatsapp','919999999999'],
        ['brand_name','RRK Chicken'],
        ['brand_tagline','Premium chicken restaurant in Eluru.'],
        ['footer_copyright','© 2026 RRK Chicken. All rights reserved.'],
        ['contact_phone','+91 99999 99999'],
        ['contact_phone_raw','919999999999'],
        ['contact_whatsapp','+91 99999 99999'],
        ['contact_address','Main Road, Eluru, AP'],
        ['contact_hours','11:00 AM – 11:00 PM'],
        ['contact_maps','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.8001938655!2d81.104!3d16.711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEluru%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v99999999999'],
        ['social_instagram','#'],
        ['social_facebook','#'],
        ['social_youtube','#']
    ]);
}
