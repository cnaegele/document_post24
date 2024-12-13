<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bPrmSHA256 = false;
if (isset($_GET['sha256'])) {
    $strSHA256 = $_GET['sha256'];
    if (strlen($strSHA256) == 64) {
        $pattern = '/^\w+$/';
        if (preg_match($pattern, $strSHA256)) {
            $bPrmSHA256 = true;
        }
    }
}
if ($bPrmSHA256) {
    $sSql = "cn_document_liste_parsha256 '$strSHA256'";
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2($sSql);
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '{"message":"ERREUR SHA256 invalide"}';
}