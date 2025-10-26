@echo off
echo 🌐 Travel Agency - External Access Setup
echo ======================================

echo.
echo Starting Django server on 0.0.0.0:8000...
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 0.0.0.0:8000

pause 