<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$dbgo = new DBGoeland();
$dbgo->queryRetJson2('cn_thistreet_liste_pour_choix_autocomplete');
echo $dbgo->resString;
unset($dbgo);
