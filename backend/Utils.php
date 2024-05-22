<?php
    class Utils {
        public static function isAltervista() {
            return isset($_SERVER['SERVER_ADMIN']) && strpos($_SERVER['SERVER_ADMIN'], 'altervista.org');
        }
    }
