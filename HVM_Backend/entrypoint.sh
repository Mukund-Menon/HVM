#!/bin/bash
# HVM_Backend/entrypoint.sh

set -e

# Function to wait for database setup
wait_for_db() {
    echo "Waiting for PostgreSQL..."  
    until python -c "import socket; socket.create_connection(('db', 5432), timeout=1)" 2>/dev/null; do  
        sleep 0.1  
    done   
    echo "PostgreSQL started"  
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
python manage.py collectstatic --noinput # Start Gunicorn server


echo "Starting Gunicorn server..."
gunicorn --bind 0.0.0.0:8000 --keyfile=amrita.edu.key --certfile=amrita.edu.cer backend.wsgi:application

