<?php
//save.php
/*****************************************************
Saves the base 64 encoded strings for the thumbnail and full sized image

Requires
$_REQUEST['dev'] - device unique id
$_REQUEST['img'] - base64 encoded string representing the full size image
$_REQUEST['thumb'] - base64 encoded string representing the thumbnail version of the image

Returns JSON
code should be zero if there is no error
The id parameter will be the unique image id from the database
{"code":0, "message": "Feedback message", "id":123}

if code is something else then there is an error and no id for the image
{"code":423, "message":"error message for you" }
*****************************************************/

require_once("db.inc.php");
header("Content-Type: application/json");

if( isset( $_GET['dev'] ) && isset($_GET['img']) && isset($_GET['thumb']) ){
    //we have the device id
    //save the thumbnail and image in the database
    $dev_id = trim($_GET['dev']);
    $full_img = trim($_GET['img']);
    $thumb = trim($_GET['thumb']);

    $sql = "INSERT INTO w15_final(device_id, thumbnail, full_img) VALUES(?, ?, ?)";
    $rs = $pdo->prepare($sql);
    $ret = $rs->execute( array($dev_id, $thumb, $full_img) );
    if($ret){
        //return the success message and the image id
        echo '{"code":0, "message":"Success", "id":';
        echo $pdo->lastInsertId();
        echo '}';
    }else{
        //failed to run query.... error
        $errorArray = $rs->errorInfo( );
        echo '{"code":543, "message":"Unable to save the image in the database at this time. SQL Error Code: ' . $errorArray[0] . '"}';
    }
}else{
    //no device id provided
    echo '{"code":423, "message":"Missing required parameter(s)"}';
}
exit();
$pdo = null;
?>
