# Deploy to the VPS with Doppler (no GitHub Actions)

The application now uses `serversideup/php:8.3-frankenphp` in **classic mode**.
The VPS Caddy remains responsible for public domains and HTTPS. It forwards HTTP
to `genjishimada-web:8080` on the existing `genji-network`, as before. The internal
Caddy does not request certificates or expose an admin API. No Octane is installed.

The Docker build refuses PHP older than **8.3.36** and checks both PHP CLI and
FrankenPHP's embedded interpreter. If Server Side Up has not published its patched
image yet, the build fails while the original application keeps running. Do not
remove that check or delete the running container to work around it.

## Numbered deployment checklist

1. **Merge the migration PR when ready.** The following steps run on your VPS and
   do not use GitHub Actions, image registries of your own, or GitHub build minutes.
   The existing GitHub deployment workflow is not required for these steps.

2. **SSH into the VPS.** Use the account that can run Docker. Confirm Docker Compose
   supports `up --wait --wait-timeout` and that the Doppler CLI is installed:

   ```sh
   docker compose version
   doppler --version
   docker ps --filter name=genjishimada-web
   ```

   Leave the current website running. Do not run `docker compose down`, prune its
   images/volumes, or remove the existing container.

3. **Get a clean checkout on the VPS.** For a new deployment directory:

   ```sh
   git clone https://github.com/bkan0n/genji.pk.git genji-deploy
   cd genji-deploy
   git switch main
   ```

   For an existing clean checkout on `main`, use `git pull --ff-only` instead.
   Check `git status --short` before deploying. The helper builds this checkout;
   it does not fetch code or select a branch for you. To test before merging,
   check out the migration PR's branch instead.

4. **Connect Doppler to the production configuration.** On your first deployment:

   ```sh
   doppler login
   doppler setup
   ```

   Choose the same project/config that supplies your production GitHub secrets.
   Alternatively, use a production-scoped Doppler service token configured on the
   VPS. Do not commit the token, write it into the Dockerfile, or paste it in chat.
   `doppler run` injects values into Compose without generating a `.env` file.

5. **Confirm production settings in Doppler.** Keep the current `APP_KEY` exactly
   as it is. Use `APP_ENV=production`, `APP_DEBUG=false`, your HTTPS `APP_URL`,
   and the same API/OAuth credentials. The helper checks the key against the
   running container and refuses an accidental key change. Compose passes only
   its explicitly listed variables; add new variable names there when needed.

   `VITE_APP_ENV`, `VITE_APP_RELEASE`, and `VITE_SENTRY_DSN` are public browser
   settings supplied at build time. Never put private secrets in `VITE_*` values.

   The default trusted proxy list covers loopback and private Docker addresses.
   You can set `TRUSTED_PROXIES` to a comma-separated list of the exact VPS Caddy
   IPs/subnets. Keep the app private on `genji-network`; this Compose file does not
   publish an application port to the internet. Keep your external Caddy's current
   routing and forwarded-header handling.

6. **Run the deployment:**

   ```sh
   doppler run -- sh scripts/deploy-vps.sh production
   ```

   The helper automatically:
   - Reuses the Compose project name of the existing container.
   - Pulls current base images and builds the application on the VPS.
   - Checks both PHP versions and validates the internal Caddy configuration.
   - Starts a temporary container and waits for Laravel's `/up` health check.
   - Tags the old image for rollback and prints a rollback command.
   - Briefly stops the old container, copies its `storage` directory into a
     private backup, and imports it into a persistent volume on the first migration.
   - Recreates the application and waits for it to become healthy.

   The website stays running during the build and preflight. Expect a brief outage
   during the storage backup/import and container replacement. Ensure the VPS has
   disk space for the build, a storage backup, and the old image, plus enough memory
   for the temporary container. If a preflight fails, fix it and retry; do not remove
   the running site.

   Backups are saved outside the checkout in `$HOME/genji-deploy-backups`, with
   private permissions. Override this location with `DEPLOY_BACKUP_ROOT` if needed.
   Backups may contain private application files; protect them accordingly. The
   helper does not create or migrate databases, rotate secrets, or change VPS Caddy.

7. **Check the deployed website.** Open `https://genji.pk` and check a map/search
   page, styles/scripts, Discord login, and any upload flow you use. Also check:

   ```sh
   docker exec genjishimada-web php -v
   docker exec genjishimada-web frankenphp php-cli /usr/local/lib/check-php-version.php
   docker inspect --format '{{.State.Health.Status}}' genjishimada-web
   ```

   Both interpreters must be on PHP 8.3.36 or later in the 8.3 branch, and health
   must be `healthy`. Internal health checks cannot verify your external Caddy
   routing or production OAuth credentials; the browser checks are still needed.

8. **Keep the rollback image and backup until checks pass.** The helper prints a
   command using its generated `rollback.yml`. Run that exact command from the
   same checkout with the production Doppler config if you need to return to the
   previous image. This restores the previous application image and uses the
   preserved storage volume. The old Unit image remains vulnerable, so rollback
   is a temporary recovery measure, not a security fix.

   If storage backup/import fails before replacement, the helper attempts to
   restart the original container. If replacement itself fails, run the printed
   rollback command. Do not delete the named storage volume. The backup directory
   also contains the captured Compose project name; storage can be recovered from
   its `storage` subdirectory if needed. Restoring a backup over live storage is
   a separate operation and should be done while the app is stopped.

## Development deployment

Select the **development** Doppler configuration, then run:

```sh
doppler run -- sh scripts/deploy-vps.sh development
```

This targets `genjishimada-web-dev` and its separate storage volume. It does not
replace production. Testing here first is useful when the VPS has enough capacity.

## References

- [PHP security release](https://www.php.net/index.php)
- [Server Side Up Unit deprecation](https://serversideup.net/open-source/docker-php/docs/image-variations/unit)
- [FrankenPHP classic mode](https://frankenphp.dev/docs/classic/)
- [Doppler with Docker Compose](https://docs.doppler.com/docs/docker-compose)
