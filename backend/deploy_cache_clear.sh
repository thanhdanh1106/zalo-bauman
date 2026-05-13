#!/bin/bash
# Chạy script này trên server production sau khi upload api.php
# Đường dẫn: /home/tcsshop/domains/miniapp.nhansambaumann.com/public_html/backend

cd /home/tcsshop/domains/miniapp.nhansambaumann.com/public_html/backend

echo "=== Clearing Laravel caches ==="
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear

echo "=== Route list check ==="
php artisan route:list --path=api/orders --method=post
php artisan route:list --path=api/products --method=post

echo "=== Done ==="
