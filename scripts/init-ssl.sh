#!/bin/bash
# SSL Certificate Setup Script for IIFF
# Usage: ./scripts/init-ssl.sh yourdomain.com admin@yourdomain.com

set -e

DOMAIN=${1:?"Usage: $0 <domain> <email>"}
EMAIL=${2:?"Usage: $0 <domain> <email>"}

echo "=== IIFF SSL Setup ==="
echo "Domain: $DOMAIN"
echo "Email:  $EMAIL"
echo ""

# Step 1: Create required directories
echo "[1/4] Creating directories..."
mkdir -p certbot/conf certbot/www

# Step 2: Generate nginx config with domain
echo "[2/4] Generating Nginx SSL config..."
sed "s/\${DOMAIN}/$DOMAIN/g" nginx/nginx-ssl.conf > nginx/nginx-active.conf

# Step 3: First, start with HTTP-only for ACME challenge
echo "[3/4] Starting services for certificate request..."
cat > nginx/nginx-init.conf << 'INITEOF'
server {
    listen 80;
    server_name _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'IIFF SSL setup in progress...';
        add_header Content-Type text/plain;
    }
}
INITEOF

# Start nginx with init config for ACME challenge
docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d nginx

# Step 4: Request certificate
echo "[4/4] Requesting Let's Encrypt certificate..."
docker compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Switch to SSL config and restart
echo ""
echo "=== Certificate obtained! Switching to HTTPS config ==="
cp nginx/nginx-active.conf nginx/nginx.conf
docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d --force-recreate nginx

echo ""
echo "=== SSL Setup Complete ==="
echo "Site: https://$DOMAIN"
echo ""
echo "Auto-renewal is configured via certbot container."
echo "To manually renew: docker compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot renew"
