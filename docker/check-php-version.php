<?php

// Newer PHP branches have different minimum patched versions.
if (PHP_VERSION_ID < 80336 || PHP_VERSION_ID >= 80400) {
    fwrite(STDERR, 'Expected patched PHP 8.3.36 or later on the 8.3 branch; found '.PHP_VERSION.PHP_EOL);
    exit(1);
}

echo 'Patched PHP runtime: '.PHP_VERSION.PHP_EOL;
