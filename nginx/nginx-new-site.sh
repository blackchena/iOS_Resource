#!/usr/bin/env bash
set -euo pipefail

# nginx-new-site.sh
# 用法:
#   sudo ./nginx-new-site.sh <domain> [--with-certbot] [--no-www]
#
# 示例:
#   sudo ./nginx-new-site.sh example.com
#   sudo ./nginx-new-site.sh example.com --with-certbot
#   sudo ./nginx-new-site.sh example.com --with-certbot --no-www

usage() {
  cat <<USAGE
Usage: $0 <domain> [--with-certbot] [--no-www]

Arguments:
  <domain>         主域名，例如 example.com

Options:
  --with-certbot   自动执行 certbot --nginx 申请证书
  --no-www         不配置 www.<domain>
  -h, --help       显示帮助
USAGE
}

if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

DOMAIN=""
WITH_CERTBOT=0
INCLUDE_WWW=1

for arg in "$@"; do
  case "$arg" in
    --with-certbot)
      WITH_CERTBOT=1
      ;;
    --no-www)
      INCLUDE_WWW=0
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --*)
      echo "Unknown option: $arg"
      usage
      exit 1
      ;;
    *)
      if [ -n "$DOMAIN" ]; then
        echo "Only one domain is allowed. Got extra argument: $arg"
        usage
        exit 1
      fi
      DOMAIN="$arg"
      ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Domain is required."
  usage
  exit 1
fi

DOMAIN="${DOMAIN,,}"

if ! [[ "$DOMAIN" =~ ^([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$ ]]; then
  echo "Invalid domain: $DOMAIN"
  exit 2
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root (sudo)."
  exit 3
fi

NGINX_DIR_AVAILABLE="/etc/nginx/sites-available"
NGINX_DIR_ENABLED="/etc/nginx/sites-enabled"
SITE_ROOT="/var/www/$DOMAIN"
SITE_CONF="$NGINX_DIR_AVAILABLE/$DOMAIN"
SITE_LINK="$NGINX_DIR_ENABLED/$DOMAIN"
TS="$(date +%Y%m%d%H%M%S)"

if [ "$INCLUDE_WWW" -eq 1 ]; then
  SERVER_NAMES="$DOMAIN www.$DOMAIN"
else
  SERVER_NAMES="$DOMAIN"
fi

echo "[1/6] Creating web root: $SITE_ROOT"
mkdir -p "$SITE_ROOT"

if [ ! -f "$SITE_ROOT/index.html" ]; then
  cat > "$SITE_ROOT/index.html" <<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$DOMAIN</title>
</head>
<body>
  <h1>$DOMAIN is ready.</h1>
</body>
</html>
HTML
fi

if id -u ubuntu >/dev/null 2>&1; then
  chown -R ubuntu:ubuntu "$SITE_ROOT"
fi

if [ -f "$SITE_CONF" ]; then
  echo "[2/6] Backing up existing config: $SITE_CONF.bak.$TS"
  cp -a "$SITE_CONF" "$SITE_CONF.bak.$TS"
else
  echo "[2/6] No existing config found, creating new one."
fi

echo "[3/6] Writing nginx config: $SITE_CONF"
cat > "$SITE_CONF" <<EOF_CONF
server {
    listen 80;
    listen [::]:80;

    server_name $SERVER_NAMES;
    root $SITE_ROOT;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF_CONF

chmod 644 "$SITE_CONF"

if [ ! -L "$SITE_LINK" ]; then
  echo "[4/6] Enabling site: $SITE_LINK -> $SITE_CONF"
  ln -s "$SITE_CONF" "$SITE_LINK"
else
  echo "[4/6] Site link already exists: $SITE_LINK"
fi

if command -v nginx >/dev/null 2>&1; then
  echo "[5/6] Testing nginx configuration"
  nginx -t

  echo "[6/6] Reloading nginx"
  systemctl reload nginx
else
  echo "nginx command not found. Install nginx first."
  exit 4
fi

if [ "$WITH_CERTBOT" -eq 1 ]; then
  if ! command -v certbot >/dev/null 2>&1; then
    echo "certbot not found. Skip SSL setup."
    exit 5
  fi

  echo "Running certbot..."
  if [ "$INCLUDE_WWW" -eq 1 ]; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --no-redirect
  else
    certbot --nginx -d "$DOMAIN" --no-redirect
  fi

  echo "SSL setup finished."
fi

echo "Done: $DOMAIN"
