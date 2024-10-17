<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = true;
if (isset($_GET['jsoncriteres'])) {
    $jsonCriteres = $_GET['jsoncriteres'];
    $oCriteres = json_decode($jsonCriteres, false);
    if (isset($oCriteres->critere)) {
        $critere = $oCriteres->critere;
        $critere = str_replace("'", "''", $critere);
    } else {
        $bParamsOk = false;
    }
    if (isset($oCriteres->crtype)) {
        $crtype = $oCriteres->crtype;
        if ($crtype != 'nom' && $crtype != 'nomdebut' && $crtype != 'idgo' && $crtype != 'idche') {
            $bParamsOk = false;
        }
    } else {
        $bParamsOk = false;
    }
    if (isset($oCriteres->bacteurmoral)) {
        $bacteurmoral = $oCriteres->bacteurmoral;
    } else {
        $bacteurmoral = '1';
    }
    if (isset($oCriteres->bacteurphysique)) {
        $bacteurphysique = $oCriteres->bacteurphysique;
    } else {
        $bacteurphysique = '1';
    }
    if (isset($oCriteres->bacteurdesactive)) {
        $bacteurdesactive = $oCriteres->bacteurdesactive;
    } else {
        $bacteurdesactive = '0';
    }
    $nombreMaximumRetour = '';
    if (isset($oCriteres->nombremaximumretour)) {
        $nombreMaximumRetour = $oCriteres->nombremaximumretour;
    }
} else {
    $bParamsOk = false;
}
if ($bParamsOk) {
    if ($crtype == 'nom' || $crtype == 'nomdebut') {
        $bnomdebut = '0';
        if ($crtype == 'nomdebut') {
            $bnomdebut = '1';
        }
        $sSql = "cn_acteur_liste '$critere', $bnomdebut, $bacteurmoral, $bacteurphysique, $bacteurdesactive";
        if ($nombreMaximumRetour != '') {
            $sSql .= ", $nombreMaximumRetour";
        }
    } elseif ($crtype == 'idgo') {
        $sSql = "cn_acteur_liste_parid $critere";
    } elseif ($crtype == 'idche') {
        $sSql = "cn_acteur_liste_paridche '$critere'";
    }
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "acteur_liste:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "acteur_liste:param&egraves invalides"}';;
}
