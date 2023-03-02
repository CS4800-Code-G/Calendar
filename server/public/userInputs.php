<?php
require 'vendor/autoload.php';//importing mongodb php library

$client = new MongoDB\Client("mongodb://localhost:8080");
$db = $client->selectDatabase('my_database');
$collection = $db->selectCollection('my_collection');

$result = $collection->find();

foreach ($result as $document) {
    var_dump($document);
}



?>





<?php
require 'vendor/autoload.php';

$client = new MongoDB\Client("mongodb://localhost:27017");
$db = $client->selectDatabase('my_database');
$collection = $db->selectCollection('my_collection');

$result = $collection->find();

foreach ($result as $document) {
    var_dump($document);
}
?>
