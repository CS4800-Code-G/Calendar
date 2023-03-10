<?php
// Get the form data
$times = isset($_POST['times']) ? $_POST['times'] : array();

// Connect to MongoDB
$mongo = new MongoDB\Driver\Manager("mongodb://localhost:8080");

// Insert the data into a MongoDB collection
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert(['times' => $times]);
$mongo->executeBulkWrite('mydb.mycol', $bulk);

// Send a response back to the client
echo "Data saved successfully!";
?>