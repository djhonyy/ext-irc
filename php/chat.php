<?php

include('../config/config.php');
include('classes/mysql.php');
include('classes/core.php');

$db = new database();
$db->db_connect($dbhost, $dbname, $dbuser, $dbpasswd, $dbdriver);

$cmd = $_POST['cmd'];

if ($cmd == 'GridChat') {

    $time = $_POST['time'];
    $uid = $_POST['uid'];

    $sql = "SELECT user, message, time FROM chat WHERE time > '$time' ORDER BY id";
    $result = $db->db_query($sql);

    $jsonResult = new stdClass();
    $jsonResult->success = true;
    $jsonResult->rows = array();

    while ($row = $db->db_fetcharray($result))
    {

        $jsonLine = new stdClass();

        $data = date("h:i:s", prepareOutput($row['time']));

        $jsonLine->id = $row['id'];
        $jsonLine->user = prepareOutput($row['user']);
        $jsonLine->message = prepareOutput($row['message']);
        $jsonLine->time = $data;
        $jsonResult->rows[] = $jsonLine;
    }

    $sql_delete = "DELETE FROM chat WHERE time < (" . (time() - 6000) . ")";
    $result_delete = $db->db_query($sql_delete) or die('{success:false, sql:"' . $sql_delete . '", error:"' . mysql_error($result_delete) . '"}');

    $sql_lastcheck = "UPDATE chat_sessions SET lastcheck = '" . $time . "' WHERE uid = '$uid'";
    $result_lastcheck = $db->db_query($sql_lastcheck) or die('{success:false, sql:"' . $sql_lastcheck . '", error:"' . mysql_error($result_lastcheck) . '"}');

    $sql_delete_sessions = "DELETE FROM chat_sessions WHERE lastcheck < '" . ($time - 6000) . "'";
    $result_delete_sessions = $db->db_query($sql_delete_sessions) or die('{success:false, sql:"' . $sql_delete_sessions . '", error:"' . mysql_error($result_delete_sessions) . '"}');

    header("Content-type: text/json; charset=ISO-8859-1");

    echo json_encode($jsonResult);
} elseif ($cmd == 'GridChatUsers') {

    $sql = "SELECT DISTINCT(user) FROM chat_sessions WHERE 1 ORDER BY user";
    $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');

    $jsonResult = new stdClass();
    $jsonResult->success = true;
    $jsonResult->time = time();
    $jsonResult->rows = array();

    while ($row = $db->db_fetcharray($result)) {
        $jsonLine = new stdClass();
        $jsonLine->user = prepareOutput($row['user']);
        $jsonResult->rows[] = $jsonLine;
    }

    header("Content-type: text/json; charset=ISO-8859-1");
    echo json_encode($jsonResult);
} elseif ($cmd == 'saveForm') {

    $mensagem = prepareImput($_POST['mensagem']);
    $uid = prepareImput($_POST['uid']);

    $msgsplit = explode(" ", str_ireplace("<br>", "", $mensagem));

    $ip = isset($_SERVER['X_FORWARDED_FOR']) ? $_SERVER['X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];

    $sql_user = "SELECT user FROM chat_sessions WHERE uid = '$uid'";
    $result_user = $db->db_query($sql_user) or die('{success:false, sql:"' . $sql_user . '", error:"' . mysql_error($result_user) . '"}');

    while ($row_user = $db->db_fetcharray($result_user)) {
        $user = $row_user['user'];
    }

    if ($msgsplit[0] == "/help") {

    } elseif ($msgsplit[0] == "/nick") {

        if ($msgsplit[1] != "") {

            $msgsplit[1] = str_ireplace("<br>", "", $msgsplit[1]);

            $sql_delete = "DELETE FROM chat_sessions WHERE user = '$user'";
            $result_delete = $db->db_query($sql_delete) or die('{success:false, sql:"' . $sql_delete . '", error:"' . mysql_error($result_delete) . '"}');

            $sql = "INSERT INTO chat_sessions (ip, user) VALUES ('$ip','$msgsplit[1]')";
            $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');
        }

        die();
    } elseif ($msgsplit[0] == "/login") {

        if ($msgsplit[1] != "") {

            $msgsplit[1] = str_ireplace("<br>", "", $msgsplit[1]);

            $sql = "SELECT * FROM chat_sessions WHERE uid = '$uid'";
            $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');
            $count = $db->db_num_rows($result);

            if ($count == 0) {

                $sql = "INSERT INTO chat_sessions (ip, user, uid) VALUES ('$ip','$msgsplit[1]', '$uid')";
                $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');
            }
        }

        die();
    } elseif ($msgsplit[0] == "/logout") {

        $sql = "DELETE FROM chat_sessions WHERE uid = '$uid'";
        $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');

        die();
    } else {

        if (isset($user) && ($user != "")) {

            $time = time();

            $sql = "INSERT INTO chat (user, message, time) VALUES ('$user','$mensagem', " . $time . ")";
            $result = $db->db_query($sql) or die('{success:false, sql:"' . $sql . '", error:"' . mysql_error($result) . '"}');

            $sql_lastcheck = "UPDATE chat_sessions SET lasttalk = '" . $time . "' WHERE uid = '$uid'";
            $result_lastcheck = $db->db_query($sql_lastcheck) or die('{success:false, sql:"' . $sql_lastcheck . '", error:"' . mysql_error($result_lastcheck) . '"}');
        }
    }

    echo ('{success:true}');
}
?>