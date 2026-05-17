# Stage 1: Build frontend assets (React + Vite)
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Explicitly copy package.json first to prevent caching glitches
COPY rigmanager/package.json ./
# The asterisk (*) ensures this won't crash the build if package-lock.json doesn't exist
COPY rigmanager/package-lock.json* ./

# Download frontend dependencies and compile asset configurations
WORKDIR /app/rigmanager
RUN npm install --legacy-peer-deps
COPY ./rigmanager .
RUN npm run build

# Stage 2: Build the production PHP + Nginx environment
FROM php:8.2-fpm-alpine

# Install native system bundles required for SQLite databases and Laravel image rendering
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    sqlite-dev

# Compile and enable optimized PHP framework extensions
RUN docker-php-ext-install pdo pdo_sqlite bcmath gd

# Pull the official high-performance Composer binary straight into our build
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy backend source architecture files
COPY ./rigmanager .

# Grab the production compiled CSS/JS bundles generated from Stage 1
COPY --from=frontend-builder /app/rigmanager/public/build ./public/build

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy Supervisor configuration
COPY docker/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Install backend dependencies securely (skipping developer utilities for smaller images)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Initialize a fresh local SQLite target file if missing
RUN mkdir -p database && touch database/database.sqlite

# Run migrations (This assumes the .env is correctly set up for SQLite)
# Note: In production, you might want to do this outside the Dockerfile or via a script.
# RUN php artisan migrate --force
# Open access permissions so the internal Linux web servers can read/write logs and records
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database

EXPOSE 80

# Launch Supervisor to keep both the PHP controller engine and Nginx router alive simultaneously
# Start the application using a shell to allow multiple commands
CMD sh -c "php artisan migrate --force && /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisor.conf"
