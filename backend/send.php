<?php

define('TO_EMAIL',       'anesbertami@gmail.com');
define('TO_NAME',        'Anasse Bertami');
define('FROM_EMAIL',     'noreply@yourdomain.com');  
define('ALLOWED_ORIGIN', 'https:

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN || strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php:
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$name    = trim(strip_tags($data['name']    ?? ''));
$email   = trim(strip_tags($data['email']   ?? ''));
$subject = trim(strip_tags($data['subject'] ?? 'Portfolio Contact Form'));
$message = trim(strip_tags($data['message'] ?? ''));

$errors = [];
if (empty($name))              $errors[] = 'Name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (empty($message))           $errors[] = 'Message is required';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => implode('. ', $errors)]);
    exit;
}

$rateFile = sys_get_temp_dir() . '/ab_contact_' . md5($_SERVER['REMOTE_ADDR']);
if (file_exists($rateFile) && (time() - filemtime($rateFile)) < 60) {
    http_response_code(429);
    echo json_encode(['error' => 'Please wait before sending another message']);
    exit;
}
touch($rateFile);

$emailSubject = '[Portfolio] ' . ($subject ?: 'New message from ' . $name);

$emailBody = "You have a new message from your portfolio contact form.\n";
$emailBody .= str_repeat('─', 50) . "\n\n";
$emailBody .= "Name:    {$name}\n";
$emailBody .= "Email:   {$email}\n";
$emailBody .= "Subject: {$subject}\n\n";
$emailBody .= "Message:\n{$message}\n\n";
$emailBody .= str_repeat('─', 50) . "\n";
$emailBody .= "Sent from: " . (ALLOWED_ORIGIN ?: 'localhost') . "\n";
$emailBody .= "Date: " . date('Y-m-d H:i:s') . " UTC\n";

$headers  = "From: \"{$name}\" <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: \"{$name}\" <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail(TO_EMAIL, $emailSubject, $emailBody, $headers);

if ($sent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    
    error_log("[Portfolio Contact] mail() failed for: {$email} at " . date('Y-m-d H:i:s'));
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Please try again or email directly.']);
}