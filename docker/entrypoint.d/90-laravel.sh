#!/bin/sh
set -eu

# CLI inspection commands must work without application secrets or cache writes.
[ "${SERVERSIDEUP_DEFAULT_COMMAND:-false}" = "true" ] || exit 0

: "${APP_KEY:?Set the existing application key through Doppler before starting the server}"
cd "${APP_BASE_DIR:-/var/www/html}"

# Mounted storage must be writable by the image's www-data user (UID/GID 33).
mkdir -p storage/framework/cache/data storage/framework/sessions \
    storage/framework/testing storage/framework/views storage/logs bootstrap/cache
if [ ! -w storage ] || [ ! -w bootstrap/cache ]; then
    echo 'Laravel storage and bootstrap/cache must be writable by www-data.' >&2
    exit 1
fi

php artisan package:discover --ansi
if [ "${WARM_CACHES:-1}" = "1" ]; then
    php artisan optimize --ansi
fi
