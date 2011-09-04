<?php

define("BASE_DBCONNECTERROR", "Ocorreu um erro na ligaчуo р base de dados. Tente mais tarde ou contacte o programador. Obrigado!");
define("BASE_DBSELECTERROR", "Ocorreu um erro na ligaчуo р tabela da base de dados. Tente mais tarde ou contacte contacte o programador. Obrigado!");

class database {

    var $dbconnect;
    var $stmt;
    var $row = array();

    function db_connect($dbhost, $dbname, $dbuser, $dbpasswd, $dbdriver) {
        $this->dbhost = $dbhost;
        $this->dbuser = $dbuser;
        $this->dbpasswd = $dbpasswd;
        $this->dbname = $dbname;
        $this->dbdriver = $dbdriver;
        $this->dbh = new PDO("{$this->dbdriver}:dbname={$this->dbname};host={$this->dbhost}", $this->dbuser, $this->dbpasswd) or die(BASE_DBCONNECTERROR); // Connect to the database
        return $this->dbh;
    }

    function db_query($sql) {
        $this->stmt = $this->dbh->query($sql);
        return $this->stmt;
    }

    function db_close() {
        if ($this->dbh) {
            if ($this->stmt) {
                $this->dbh = null;
            }
            return true;
        } else {
            return false;
        }
    }

    function db_fetcharray($result = false) {
        $result = (!$result) ? $this->stmt : false;

        if ($result) {
            $this->row[$result] = $result->fetch(PDO::FETCH_ASSOC);
            return $this->row[$result];
        }
    }

    function db_fetchrow($result = false) {
        $result = (!$result) ? $this->stmt : false;

        if ($result) {
            $this->row[$result] = $result->fetch(PDO::FETCH_ROW);

            return $this->row[$result];
        }
    }

    /**
     *
     * @param PDO Statement $result
     * @return array
     */
    function db_num_rows($result = false) {
        $result = (!$result) ? $this->stmt : false;

        if ($result) {
            $this->row[$result] = $result->fetch(PDO::FETCH_NUM);

            return $this->row[$result];
        }
    }

}

?>