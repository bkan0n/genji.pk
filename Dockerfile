# Build public frontend assets. Only VITE_* values belong in build arguments.
FROM node:20-alpine AS node-build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_APP_ENV=production
ARG VITE_APP_RELEASE
ARG VITE_SENTRY_DSN
ENV NODE_ENV=production
RUN npm run build

FROM composer:2 AS composer-deps
WORKDIR /src
COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-ansi --no-interaction --no-progress \
    --prefer-dist --optimize-autoloader --no-scripts

# Classic mode: Caddy and PHP run together, without Octane or persistent workers.
FROM serversideup/php:8.3-frankenphp AS runtime
WORKDIR /var/www/html
USER root

# Refuse an image that predates CVE-2026-109618 / CVE-2026-109619 fixes.
# Check both the PHP CLI and the interpreter embedded in FrankenPHP.
COPY docker/check-php-version.php /usr/local/lib/check-php-version.php
RUN php /usr/local/lib/check-php-version.php \
    && frankenphp php-cli /usr/local/lib/check-php-version.php

ENV SSL_MODE=off \
    CADDY_AUTO_HTTPS=off \
    AUTORUN_ENABLED=false \
    HEALTHCHECK_PATH=/up \
    PHP_MEMORY_LIMIT=512M \
    PHP_UPLOAD_MAX_FILE_SIZE=20M \
    PHP_POST_MAX_SIZE=20M \
    PHP_OPCACHE_ENABLE=1 \
    PHP_OPCACHE_ENABLE_CLI=0 \
    PHP_OPCACHE_MEMORY_CONSUMPTION=256 \
    PHP_OPCACHE_INTERNED_STRINGS_BUFFER=16 \
    PHP_OPCACHE_MAX_ACCELERATED_FILES=20000 \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=0

COPY --chown=www-data:www-data . .
COPY --from=composer-deps --chown=www-data:www-data /src/vendor ./vendor
COPY --from=node-build --chown=www-data:www-data /src/public/build ./public/build
COPY docker/Caddyfile /etc/frankenphp/Caddyfile
COPY --chmod=755 docker/entrypoint.d/ /etc/entrypoint.d/

RUN mkdir -p storage/framework/cache/data storage/framework/sessions \
        storage/framework/testing storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R u+rwX,g+rwX storage bootstrap/cache

USER www-data
EXPOSE 8080
HEALTHCHECK --start-period=60s --interval=10s --timeout=3s --retries=3 \
    CMD curl --silent --show-error --fail http://127.0.0.1:8080/up || exit 1

# Inherit the image's entrypoint and FrankenPHP command.
