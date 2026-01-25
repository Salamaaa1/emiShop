@echo off
echo Starting Separate Docker Build and Push Process...
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
echo 2. Building Backend Image (salamaaa11/emishop-backend:v1)...
docker build -f Dockerfile.backend -t salamaaa11/emishop-backend:v1 .
if %errorlevel% neq 0 (
    echo Backend Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Pushing Backend Image...
docker push salamaaa11/emishop-backend:v1
if %errorlevel% neq 0 (
    echo Backend Push failed.
    pause
    exit /b %errorlevel%
)

echo.
echo 4. Building Frontend Image (salamaaa11/emishop-frontend:v1)...
docker build -f Dockerfile.frontend -t salamaaa11/emishop-frontend:v1 .
if %errorlevel% neq 0 (
    echo Frontend Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo 5. Pushing Frontend Image...
docker push salamaaa11/emishop-frontend:v1
if %errorlevel% neq 0 (
    echo Frontend Push failed.
    pause
    exit /b %errorlevel%
)

echo.
echo SUCCESS! Images pushed:
echo - salamaaa11/emishop-backend:v1
echo - salamaaa11/emishop-frontend:v1
pause
