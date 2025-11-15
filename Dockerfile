# 1) Node build
FROM node:20-alpine AS node-build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 2) Composer (no scripts)
FROM composer:2 AS composer-deps
WORKDIR /src
COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-ansi --no-interaction --no-progress \
    --prefer-dist --optimize-autoloader --no-scripts

# 3) Runtime
FROM serversideup/php:8.4-unit AS runtime
WORKDIR /var/www/html
USER root

# make sure we’re root before touching system paths
RUN mkdir -p /usr/local/etc/php/conf.d && \
    printf '%s\n' \
    'opcache.enable=1' \
    'opcache.enable_cli=0' \
    'opcache.memory_consumption=256' \
    'opcache.interned_strings_buffer=16' \
    'opcache.max_accelerated_files=20000' \
    'opcache.validate_timestamps=0' \
    | tee /usr/local/etc/php/conf.d/zz-opcache.ini >/dev/null
RUN printf "memory_limit=512M\n" > /usr/local/etc/php/conf.d/zz-memory.ini
# if available in this image tag
# RUN if command -v install-php-extensions >/dev/null 2>&1; then \
#       install-php-extensions pdo_mysql bcmath intl zip gd ; \
#     fi

# app code
COPY . .

# ✅ copy from /src (not /app)
COPY --from=composer-deps /src/vendor ./vendor
COPY --from=node-build     /src/public/build ./public/build

# Ensure all runtime-write dirs exist
RUN mkdir -p /var/www/html/storage/framework/{cache,data,sessions,testing,views} \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache

# Belt-and-suspenders permissions for containers:
# - a+rwX gives read/write to everyone and execute on directories (needed to create files)
# - set gid bit keeps group on newly created files (helps with shared access)
RUN chmod -R a+rwX /var/www/html/storage /var/www/html/bootstrap/cache \
    && find /var/www/html/storage -type d -exec chmod g+s {} + \
    && find /var/www/html/bootstrap/cache -type d -exec chmod g+s {} +



# runtime user + perms
# runtime perms using www-data user that ships with the image
RUN chown -R www-data:www-data storage bootstrap/cache


RUN mkdir -p /var/www/html/storage/framework/sessions \
    && chmod -R a+rwX /var/www/html/storage/framework/sessions


# Unit config + entrypoint
COPY docker/unit.json /docker/unit.json
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["unitd","--no-daemon"]
