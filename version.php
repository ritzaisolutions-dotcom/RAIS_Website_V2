<?php
header('Content-Type: application/json');
echo json_encode([
    'version' => '3.0.0',
    'status' => 'DEPLOYED',
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => 'production',
    'repository' => 'TRW_22_02_2026'
]);
?>
