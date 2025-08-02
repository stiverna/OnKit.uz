<?php
$title = $_POST['title'];
$author = $_POST['author'];
$file = $_FILES['file'];

if ($file['type'] !== 'application/pdf') {
  die('Faqat PDF fayllar qabul qilinadi.');
}

$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir);

$filename = time() . "_" . basename($file['name']);
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
  $dataFile = 'data.json';
  $books = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

  $books[] = [
    'title' => $title,
    'author' => $author,
    'file' => $targetPath,
    'uploaded_at' => date('Y-m-d H:i:s')
  ];

  file_put_contents($dataFile, json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  echo "✅ Yuklandi! <a href='kutubxona.html'>Kutubxonani ko‘rish</a>";
} else {
  echo "❌ Yuklashda xatolik yuz berdi.";
}
?>
