#!/usr/bin/env sh
set -eu

# Load *_FILE secrets if you use Docker secrets
# for VAR in APP_KEY DB_PASSWORD REDIS_PASSWORD MAIL_PASSWORD; do
#   FILE_VAR="${VAR}_FILE"
#   if [ "${!FILE_VAR:-}" ]; then
#     export "$VAR"="$(cat "${!FILE_VAR}")"
#   fi
# done

# perms
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

# Start Unit ONCE (foreground), but background it during setup
unitd --no-daemon --control unix:/var/run/unit/control.unit.sock &
UNIT_PID=$!

# Wait for control socket
for i in $(seq 1 40); do
  [ -S /var/run/unit/control.unit.sock ] && break
  sleep 0.25
done

# Load Unit configuration
curl -sS --unix-socket /var/run/unit/control.unit.sock \
  -X PUT -H "Content-Type: application/json" \
  -d @/docker/unit.json http://localhost/config

# Optional: warm caches (now that env is present)
if [ "${WARM_CACHES:-1}" = "1" ]; then
  # php -r '
  #   $h=getenv("DB_HOST") ?: "127.0.0.1";
  #   $p=(int)(getenv("DB_PORT") ?: 3306);
  #   for($i=0;$i<60;$i++){ $c=@fsockopen($h,$p); if($c){ fclose($c); exit(0);} sleep(1);} exit(1);
  # ' || echo "DB not reachable; skipping warm caches."

  su -s /bin/sh -c "
    cd /var/www/html || exit 1
    php artisan package:discover --ansi || true
    php artisan optimize || true
    php artisan event:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
  " www-data
fi

# Hand off to the single Unit process we started above
wait "$UNIT_PID"
