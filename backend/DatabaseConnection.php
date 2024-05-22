<?php
    require_once 'Utils.php';

    class DatabaseConnection {
        private static $instance = null;
        private $conn;

        private function __construct() {
            $servername = Utils::isAltervista() ? 'localhost' : 'db';
            $username = Utils::isAltervista() ? 'rizzotti' : 'root';
            $password = "";
            $dbname = "my_rizzotti";

            $this->conn = new mysqli($servername, $username, $password, $dbname);

            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
        }

        public static function getInstance() {
            if (!self::$instance) {
                self::$instance = new DatabaseConnection();
            }
            return self::$instance;
        }

        public static function getConnection() {
            return self::getInstance()->conn;
        }

        // Prevent cloning and unserialization, which are ways to create new instances
        private function __clone() {
        }

        public function __wakeup() {
        }
    }

?>
