<?php
require_once "vendor/autoload.php";// to install use cmd: pecl install mongodb
                                    // then look for the installation in your file   extension=mongodb.so


$mongo_uri = "mongodb+srv://achan:achan@calendar.1lb7whx.mongodb.net/Calendar?retryWrites=true&w=majority";

// Replace mongodb+srv://<username>:<password>@<clustername>.<clusterlocation>.mongodb.net/<dbname>?retryWrites=true&w=majority";

$mongo = new MongoDB\Client($mongo_uri);



// connect to MongoDB
$mongo = new MongoDB\Driver\Manager("mongodb://localhost:8080");




// check if form is submitted
if(isset($_POST['submit'])){
  // get values of selected checkboxes
  if(!empty($_POST['times'])) {
    foreach($_POST['times'] as $selected) {
      // save the selected checkbox values to MongoDB
      $bulk = new MongoDB\Driver\BulkWrite;
      $doc = ['times' => $selected];
      $bulk->insert($doc);
      $mongo->executeBulkWrite('db.collection', $bulk);
    }
  }
}
?>
