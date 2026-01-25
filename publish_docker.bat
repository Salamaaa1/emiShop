@echo off
echo Starting Docker Build and Push Process...
echo.

echo 1. Logging into Docker Hub...
REM Use environment variable or interactive login
docker login -u salamaaa11
if %errorlevel% neq 0 (
    echo Login failed. Please check if Docker Desktop is running.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Building Image (salamaaa11/emishop:v1)...
docker build -t salamaaa11/emishop:v1 .
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Pushing Image to Docker Hub...
docker push salamaaa11/emishop:v1
if %errorlevel% neq 0 (
    echo Push failed.
    pause
    exit /b %errorlevel%
)

echo.
echo SUCCESS! Image pushed to salamaaa11/emishop:v1
pause
