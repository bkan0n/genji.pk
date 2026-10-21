#!/bin/sh
# Run on the VPS, from a Doppler-injected shell. Never print secret values.
set -eu
umask 077

case "${1:-}" in
    production) service=genjishimada-web; compose_file=docker-compose.prod.yml; storage_volume=genji-storage ;;
    development) service=genjishimada-web-dev; compose_file=docker-compose.dev.yml; storage_volume=genji-storage-dev ;;
    *) echo 'Usage: doppler run -- sh scripts/deploy-vps.sh production|development' >&2; exit 1 ;;
esac

cd "$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
container=$service
: "${APP_KEY:?Use doppler run with the existing APP_KEY for this environment}"
: "${APP_ENV:?APP_ENV is missing from the Doppler config}"
: "${APP_URL:?APP_URL is missing from the Doppler config}"
: "${X_API_ROOT:?X_API_ROOT is missing from the Doppler config}"
: "${X_API_KEY:?X_API_KEY is missing from the Doppler config}"

if [ "$1" = production ]; then
    [ "$APP_ENV" = production ] || { echo 'Select the production Doppler config.' >&2; exit 1; }
    case "${APP_DEBUG:-false}" in
        false|FALSE|0|'') ;;
        *) echo 'APP_DEBUG must be false for production.' >&2; exit 1 ;;
    esac
fi

docker network inspect genji-network >/dev/null
[ "$(docker inspect --format '{{.State.Running}}' "$container")" = true ] || {
    echo 'The existing application container must be running before deployment.' >&2
    exit 1
}
project=$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }}' "$container")
[ -n "$project" ] && [ "$project" != '<no value>' ] || {
    echo 'Cannot determine the existing Compose project name.' >&2
    exit 1
}
compose() { docker compose -p "$project" -f "$compose_file" "$@"; }

# Recreating a container does not inherit its old environment. Refuse key rotation.
if ! DEPLOY_APP_KEY="$APP_KEY" docker exec --env DEPLOY_APP_KEY "$container" php -r \
    'exit(hash_equals((string) getenv("APP_KEY"), (string) getenv("DEPLOY_APP_KEY")) ? 0 : 1);'; then
    echo 'Doppler APP_KEY differs from the running container. Restore the existing key first.' >&2
    exit 1
fi
compose config --quiet

echo '1/5 Building with fresh base images; the existing application stays running.'
compose build --pull "$service"
compose run --rm --no-deps --entrypoint sh "$service" -ec \
    'php /usr/local/lib/check-php-version.php; frankenphp php-cli /usr/local/lib/check-php-version.php; frankenphp validate --config /etc/frankenphp/Caddyfile --adapter caddyfile'

echo '2/5 Checking a temporary application container before switching traffic.'
preview="${container}-preflight-$$"
cleanup() { docker rm -f "$preview" >/dev/null 2>&1 || true; }
trap cleanup EXIT
trap 'exit 1' HUP INT TERM
compose run -d --no-deps --name "$preview" "$service" >/dev/null
attempt=0
while [ "$(docker inspect --format '{{.State.Health.Status}}' "$preview")" != healthy ]; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ] || [ "$(docker inspect --format '{{.State.Running}}' "$preview")" != true ]; then
        echo "Preflight failed. Inspect: docker logs $preview. The existing application was not stopped." >&2
        docker logs --tail 50 "$preview" >&2
        exit 1
    fi
    sleep 2
done
cleanup
trap - EXIT HUP INT TERM

echo '3/5 Saving a rollback image and preparing a storage backup.'
backup_root=${DEPLOY_BACKUP_ROOT:-"$HOME/genji-deploy-backups"}
mkdir -p "$backup_root"
backup_dir=$(mktemp -d "$backup_root/$1-$(date +%Y%m%d-%H%M%S)-XXXXXX")
rollback_image="genji-web-rollback:$(date +%Y%m%d-%H%M%S)-$$"
docker tag "$(docker inspect --format '{{.Image}}' "$container")" "$rollback_image"
cat > "$backup_dir/rollback.yml" <<EOF
services:
  $service:
    image: $rollback_image
    pull_policy: never
EOF
printf '%s\n' "$project" > "$backup_dir/compose-project"
printf 'Backup directory: %s\n' "$backup_dir"
printf 'Rollback: doppler run -- docker compose -p "%s" -f "%s" -f "%s/rollback.yml" up -d --no-build --no-deps --force-recreate %s\n' \
    "$project" "$compose_file" "$backup_dir" "$service"

# Stop writes only after the new application has passed its health check.
old_volume=$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/www/html/storage"}}{{.Name}}{{end}}{{end}}' "$container")
echo '4/5 Briefly stopping the application to preserve its storage.'
docker stop "$container" >/dev/null
if ! docker cp "$container:/var/www/html/storage/." "$backup_dir/storage"; then
    docker start "$container" >/dev/null
    echo 'Storage backup failed; the original container was restarted.' >&2
    exit 1
fi
if [ "$old_volume" != "${project}_${storage_volume}" ]; then
    if ! compose run --rm --no-deps --user root --entrypoint sh \
        -v "$backup_dir/storage:/backup:ro" "$service" -ec \
        'cp -a /backup/. /var/www/html/storage/; chown -R www-data:www-data /var/www/html/storage'; then
        docker start "$container" >/dev/null
        echo 'Storage import failed; the original container was restarted.' >&2
        exit 1
    fi
fi

echo '5/5 Recreating the application and waiting for Laravel to become healthy.'
if ! compose up -d --no-build --no-deps --force-recreate --wait --wait-timeout 120 "$service"; then
    echo "Deployment failed. Use the rollback command printed above. Backup: $backup_dir" >&2
    exit 1
fi
docker exec "$container" php /usr/local/lib/check-php-version.php
docker exec "$container" frankenphp php-cli /usr/local/lib/check-php-version.php
echo 'Deployment is healthy. Check the public website, login, uploads, and browser assets.'
printf 'Keep the rollback image and storage backup until you finish checking: %s\n' "$backup_dir"
