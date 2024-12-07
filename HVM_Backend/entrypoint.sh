#!/bin/bash
# HVM_Backend/entrypoint.sh

set -e

# Function to wait for database setup
wait_for_db() {
    echo "Setting up database connection..."
    if [ ! -f /app/db/db.sqlite3 ]; then
        touch /app/db/db.sqlite3
    fi
    
    if [ ! -L /app/db.sqlite3 ]; then
        ln -sf /app/db.db.sqlite3 /app/db.sqlite3
    fi
}

# Initialize database
wait_for_db

# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py makemigrations hvm
python manage.py migrate

# Create superuser
echo "Creating superuser..."
python manage.py createsuperuser --noinput || true

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Start Gunicorn server
echo "Starting Gunicorn server..."
gunicorn --bind 0.0.0.0:8000 --keyfile=amrita.edu.key --certfile=amrita.edu.cer --log-level debug backend.wsgi:application

